using System;
using System.Linq;
using System.Collections.Generic;
using backend.Models;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.IO;
using backend.DTOs;

namespace backend.Data
{
    public static class DbInitializer
    {
        public static async Task InitializeAsync(ApplicationDbContext context, ILogger<ApplicationDbContext> logger)
        {
            await context.Database.MigrateAsync();

            // Clear existing data
            context.Recipes.RemoveRange(context.Recipes);
            context.Cuisines.RemoveRange(context.Cuisines);
            context.Categories.RemoveRange(context.Categories);
            await context.SaveChangesAsync();

            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                Converters = { new QuantityConverter() }
            };

            string recipeDirectory = Path.Combine("Data", "SeedData", "recipes");
            string[] recipeFiles = Directory.GetFiles(recipeDirectory, "*.json");

            var cuisines = new Dictionary<string, Cuisine>();
            var categories = new Dictionary<string, Category>();

            // Create dictionary to track ingredients
            var ingredients = new Dictionary<string, Ingredient>();

            foreach (string recipeFile in recipeFiles)
            {
                try
                {
                    string recipeJson = await File.ReadAllTextAsync(recipeFile);
                    var recipeDto = JsonSerializer.Deserialize<RecipeDto>(recipeJson, options);

                    if (recipeDto != null)
                    {
                        // Create or get existing Cuisine
                        if (!cuisines.ContainsKey(recipeDto.Cuisine))
                        {
                            var cuisine = new Cuisine { Name = recipeDto.Cuisine, Description = $"{recipeDto.Cuisine} cuisine" };
                            context.Cuisines.Add(cuisine);
                            cuisines[recipeDto.Cuisine] = cuisine;
                        }

                        // Create or get existing Category
                        if (!categories.ContainsKey(recipeDto.Category))
                        {
                            var category = new Category
                            {
                                Name = recipeDto.Category,
                                Description = $"{recipeDto.Category} category",
                                Recipes = new List<Recipe>()
                            };
                            context.Categories.Add(category);
                            categories[recipeDto.Category] = category;
                        }

                        var recipe = new Recipe
                        {
                            Name = recipeDto.Name,
                            Description = recipeDto.Description,
                            Img = recipeDto.Img,
                            Category = categories[recipeDto.Category],
                            Cuisine = cuisines[recipeDto.Cuisine],
                            RecipeIngredients = new List<RecipeIngredient>()
                        };

                        foreach (var ingredientDto in recipeDto.Ingredients)
                        {
                            // Get or create ingredient
                            if (!ingredients.ContainsKey(ingredientDto.Name.ToLower()))
                            {
                                var ingredient = new Ingredient
                                {
                                    Name = ingredientDto.Name,
                                    Category = "Uncategorized" // You might want to set this differently
                                };
                                context.Ingredients.Add(ingredient);
                                ingredients[ingredientDto.Name.ToLower()] = ingredient;
                            }

                            var recipeIngredient = new RecipeIngredient
                            {
                                Recipe = recipe,
                                Ingredient = ingredients[ingredientDto.Name.ToLower()],
                                Quantity = ingredientDto.Quantity,
                                Measurement = ingredientDto.Measurement
                            };
                            recipe.RecipeIngredients.Add(recipeIngredient);
                        }

                        foreach (var instructionDto in recipeDto.Instructions)
                        {
                            var instruction = new Instruction
                            {
                                InstructionText = instructionDto.InstructionText,
                                Recipe = recipe
                            };
                            recipe.Instructions.Add(instruction);

                            foreach (var ingredientDto in instructionDto.Ingredients)
                            {
                                // Find the matching RecipeIngredient instead of Ingredient
                                var recipeIngredient = recipe.RecipeIngredients
                                    .FirstOrDefault(ri => ri.Ingredient.Name.ToLower() == ingredientDto.Name.ToLower());
                                
                                if (recipeIngredient != null)
                                {
                                    instruction.RecipeIngredients.Add(recipeIngredient);
                                    recipeIngredient.Instructions.Add(instruction);
                                }
                            }
                        }

                        context.Recipes.Add(recipe);
                        await context.SaveChangesAsync();
                        logger.LogInformation($"Recipe '{recipe.Name}' seeded successfully.");
                    }
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, $"An error occurred while seeding recipe from file {recipeFile}.");
                }
            }

            logger.LogInformation($"Database seeding completed. {cuisines.Count} cuisines, {categories.Count} categories, and {context.Recipes.Count()} recipes added.");
        }
    }

    public class RecipesWrapper
    {
        public List<Recipe> Recipes { get; set; }
    }

    public class QuantityConverter : JsonConverter<string>
    {
        public override string Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            if (reader.TokenType == JsonTokenType.Number)
            {
                return reader.GetInt32().ToString();
            }
            else if (reader.TokenType == JsonTokenType.String)
            {
                return reader.GetString();
            }
            throw new JsonException();
        }

        public override void Write(Utf8JsonWriter writer, string value, JsonSerializerOptions options)
        {
            writer.WriteStringValue(value);
        }
    }
}

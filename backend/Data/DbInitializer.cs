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
            await context.SaveChangesAsync();

            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                Converters = { new QuantityConverter() }
            };

            string recipeDirectory = Path.Combine("Data", "SeedData", "recipes");
            string[] recipeFiles = Directory.GetFiles(recipeDirectory, "*.json");

            foreach (string recipeFile in recipeFiles)
            {
                try
                {
                    string recipeJson = await File.ReadAllTextAsync(recipeFile);
                    var recipeDto = JsonSerializer.Deserialize<RecipeDto>(recipeJson, options);

                    if (recipeDto != null)
                    {
                        var recipe = new Recipe
                        {
                            Name = recipeDto.Name,
                            Description = recipeDto.Description,
                            Img = recipeDto.Img,
                            Category = recipeDto.Category,
                            Cuisine = recipeDto.Cuisine,
                            Ingredients = new List<Ingredient>(),
                            Instructions = new List<Instruction>()
                        };

                        foreach (var ingredientDto in recipeDto.Ingredients)
                        {
                            var ingredient = new Ingredient
                            {
                                Name = ingredientDto.Name,
                                Quantity = ingredientDto.Quantity,
                                Measurement = ingredientDto.Measurement,
                                Recipe = recipe
                            };
                            recipe.Ingredients.Add(ingredient);
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
                                var ingredient = recipe.Ingredients.FirstOrDefault(i => i.Name == ingredientDto.Name);
                                if (ingredient != null)
                                {
                                    instruction.Ingredients.Add(ingredient);
                                    ingredient.Instructions.Add(instruction);
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

            logger.LogInformation("Database seeding completed.");
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

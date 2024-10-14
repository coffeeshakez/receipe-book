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
        public static void Initialize(ApplicationDbContext context, ILogger<ApplicationDbContext> logger)
        {
            context.Database.Migrate();

            // Remove or comment out this check to always seed the data
            // if (context.Recipes.Any())
            // {
            //     return;   // DB has been seeded
            // }

            // Clear existing data
            context.Recipes.RemoveRange(context.Recipes);
            context.SaveChanges();

            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                Converters = { new QuantityConverter() }
            };

            string recipeFolder = Path.Combine("Data", "SeedData", "recipes");
            string[] recipeFiles = Directory.GetFiles(recipeFolder, "*.json");

            foreach (string recipeFile in recipeFiles)
            {
                string json = File.ReadAllText(recipeFile);
                var recipeDto = JsonSerializer.Deserialize<RecipeDto>(json, options);

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
                }
            }

            try
            {
                context.SaveChanges();
                logger.LogInformation("Database seeded successfully.");
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "An error occurred while seeding the database.");
                throw;
            }
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

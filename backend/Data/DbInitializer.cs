using System;
using System.Linq;
using System.Collections.Generic;
using backend.Models;
using System.Text.Json;
using System.Text.Json.Serialization;
using backend.Data.SeedData;
using Microsoft.EntityFrameworkCore; // Add this line
using Microsoft.Extensions.Logging; // Add this line
using System.IO;
using backend.DTOs; // Add this line

namespace backend.Data
{
    public static class DbInitializer
    {
        public static void Initialize(ApplicationDbContext context, ILogger<ApplicationDbContext> logger)
        {
            context.Database.Migrate();

            if (context.Recipes.Any())
            {
                return;   // DB has been seeded
            }

            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                Converters = { new QuantityConverter() }
            };

            var json = File.ReadAllText("Data/SeedData/recipes.json");
            var recipeDto = JsonSerializer.Deserialize<List<RecipeDto>>(json, options);

            if (recipeDto != null)
            {
                foreach (var recipeDtoItem in recipeDto)
                {
                    var recipe = new Recipe
                    {
                        Name = recipeDtoItem.Name,
                        Description = recipeDtoItem.Description,
                        Img = recipeDtoItem.Img,
                        Ingredients = new List<Ingredient>(),
                        Instructions = new List<Instruction>()
                    };

                    foreach (var ingredientDto in recipeDtoItem.Ingredients)
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

                    foreach (var instructionDto in recipeDtoItem.Instructions)
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
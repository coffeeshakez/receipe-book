using System;
using System.Linq;
using System.Collections.Generic;
using backend.Models;
using System.Text.Json;
using System.Text.Json.Serialization;
using backend.Data.SeedData;

namespace backend.Data
{
    public static class DbInitializer
    {
        public static void Initialize(ApplicationDbContext context)
        {
            context.Database.EnsureCreated();
            RecipeSeeder.SeedRecipes(context);
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
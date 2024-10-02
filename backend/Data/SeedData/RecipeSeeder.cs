using System.Text.Json;
using backend.Models;

namespace backend.Data.SeedData
{
    public static class RecipeSeeder
    {
        public static void SeedRecipes(ApplicationDbContext context)
        {
            if (!context.Recipes.Any())
            {
                var recipesJson = File.ReadAllText("Data/SeedData/recipes.json");
                var recipes = JsonSerializer.Deserialize<List<Recipe>>(recipesJson, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                context.Recipes.AddRange(recipes);
                context.SaveChanges();
            }
        }
    }
}
using System.Text.Json;
using backend.Models;

namespace backend.Data.SeedData
{
    public static class RecipeSeeder
    {
        public static void SeedRecipes(ApplicationDbContext context)
        {
            var jsonString = File.ReadAllText("Data/SeedData/recipes.json");
            var recipes = JsonSerializer.Deserialize<List<Recipe>>(jsonString, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (recipes != null)
            {
                context.Recipes.AddRange(recipes);
                context.SaveChanges();
            }
        }
    }
}
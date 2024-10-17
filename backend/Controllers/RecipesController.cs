using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using backend.Models;
using backend.DTOs;
using backend.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using System.Text.Json;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RecipesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<RecipesController> _logger;

        public RecipesController(ApplicationDbContext context, ILogger<RecipesController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RecipeDto>>> GetRecipes()
        {
            _logger.LogInformation("GetRecipes method called");
            var recipes = await _context.Recipes
                .Include(r => r.Ingredients)
                .Include(r => r.Instructions)
                    .ThenInclude(i => i.Ingredients)
                .Include(r => r.Cuisine)
                .Include(r => r.Category)
                .ToListAsync();

            return recipes.Select(r => new RecipeDto
            {
                Id = r.Id,
                Name = r.Name,
                Img = r.Img,
                Description = r.Description,
                Category = r.Category.Name,
                Cuisine = r.Cuisine.Name,
                Ingredients = r.Ingredients.Select(i => new IngredientDTO
                {
                    Name = i.Name,
                    Quantity = i.Quantity,
                    Measurement = i.Measurement
                }).ToList(),
                Instructions = r.Instructions.Select(i => new InstructionDTO
                {
                    InstructionText = i.InstructionText,
                    Ingredients = i.Ingredients.Select(ing => new IngredientDTO
                    {
                        Name = ing.Name,
                        Quantity = ing.Quantity,
                        Measurement = ing.Measurement
                    }).ToList()
                }).ToList()
            }).ToList();
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<RecipeDto>> GetRecipe(int id)
        {
            _logger.LogInformation($"GetRecipe method called with id: {id}");

            try
            {
                var recipe = await _context.Recipes
                    .Include(r => r.Ingredients)
                    .Include(r => r.Instructions)
                        .ThenInclude(i => i.Ingredients)
                    .Include(r => r.Category)
                    .Include(r => r.Cuisine)
                    .AsNoTracking() // Add this line to prevent tracking
                    .FirstOrDefaultAsync(r => r.Id == id);

                if (recipe == null)
                {
                    _logger.LogWarning($"Recipe with id {id} not found");
                    return NotFound($"Recipe with id {id} not found");
                }

                var recipeDto = new RecipeDto
                {
                    Id = recipe.Id,
                    Name = recipe.Name ?? "Unknown Name",
                    Img = recipe.Img ?? "No Image",
                    Description = recipe.Description ?? "No Description",
                    Category = recipe.Category?.Name ?? "Unknown Category",
                    Cuisine = recipe.Cuisine?.Name ?? "Unknown Cuisine",
                    Ingredients = recipe.Ingredients?.Select(i => new IngredientDTO
                    {
                        Name = i.Name ?? "Unknown Ingredient",
                        Quantity = i.Quantity ?? "Unknown Quantity",
                        Measurement = i.Measurement ?? "Unknown Measurement"
                    }).ToList() ?? new List<IngredientDTO>(),
                    Instructions = recipe.Instructions?.Select(i => new InstructionDTO
                    {
                        InstructionText = i.InstructionText ?? "No instruction text",
                        Ingredients = i.Ingredients?.Select(ing => new IngredientDTO
                        {
                            Name = ing.Name ?? "Unknown Ingredient",
                            Quantity = ing.Quantity ?? "Unknown Quantity",
                            Measurement = ing.Measurement ?? "Unknown Measurement"
                        }).ToList() ?? new List<IngredientDTO>()
                    }).ToList() ?? new List<InstructionDTO>()
                };

                return Ok(recipeDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while fetching recipe with id {id}");
                return StatusCode(500, $"An error occurred while fetching the recipe: {ex.Message}");
            }
        }

        [HttpGet("menu/{cuisine}")]
        public async Task<ActionResult<IEnumerable<RecipeDto>>> GetMenuByCuisine(string cuisine)
        {
            _logger.LogInformation($"Fetching menu for cuisine: {cuisine}");

            var recipes = await _context.Recipes
                .Where(r => r.Cuisine.Name.ToLower() == cuisine.ToLower())
                .Include(r => r.Ingredients)
                .Include(r => r.Instructions)
                    .ThenInclude(i => i.Ingredients)
                .Include(r => r.Category)
                .ToListAsync();

            _logger.LogInformation($"Found {recipes.Count} recipes for cuisine: {cuisine}");

            if (!recipes.Any())
            {
                _logger.LogWarning($"No recipes found for cuisine: {cuisine}");
                return NotFound($"No recipes found for cuisine: {cuisine}");
            }

            // Select multiple starters, main courses, and desserts
            var starters = recipes.Where(r => r.Category.Name == "Starter").Take(2).ToList();
            var mainCourses = recipes.Where(r => r.Category.Name == "MainCourse").Take(3).ToList();
            var desserts = recipes.Where(r => r.Category.Name == "Dessert").Take(2).ToList();

            _logger.LogInformation($"Selected menu items - Starters: {starters.Count}, Main Courses: {mainCourses.Count}, Desserts: {desserts.Count}");

            var menu = new List<Recipe>();
            menu.AddRange(starters);
            menu.AddRange(mainCourses);
            menu.AddRange(desserts);

            var menuDtos = menu.Select(r => new RecipeDto
            {
                Id = r.Id,
                Name = r.Name,
                Img = r.Img,
                Description = r.Description,
                Category = r.Category.Name,
                Cuisine = r.Cuisine.Name,
                Ingredients = r.Ingredients.Select(i => new IngredientDTO
                {
                    Name = i.Name,
                    Quantity = i.Quantity,
                    Measurement = i.Measurement
                }).ToList(),
                Instructions = r.Instructions.Select(i => new InstructionDTO
                {
                    InstructionText = i.InstructionText,
                    Ingredients = i.Ingredients.Select(ing => new IngredientDTO
                    {
                        Name = ing.Name,
                        Quantity = ing.Quantity,
                        Measurement = ing.Measurement
                    }).ToList()
                }).ToList()
            }).ToList();

            _logger.LogInformation($"Returning menu with {menuDtos.Count} items for cuisine: {cuisine}");

            return Ok(menuDtos);
        }
    }
}

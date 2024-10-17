using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using backend.Models;
using backend.DTOs;
using backend.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

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
            var recipes = await _context.Recipes
                .Include(r => r.Ingredients)
                .Include(r => r.Instructions)
                    .ThenInclude(i => i.Ingredients)
                .ToListAsync();

            var recipeDtos = recipes.Select(r => new RecipeDto
            {
                Id = r.Id,
                Name = r.Name,
                Img = r.Img,
                Description = r.Description,
                Category = r.Category,
                Cuisine = r.Cuisine,
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

            return Ok(recipeDtos);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<RecipeDto>> GetRecipe(int id)
        {
            _logger.LogInformation($"Fetching recipe with id: {id}");

            var recipe = await _context.Recipes
                .Include(r => r.Ingredients)
                .Include(r => r.Instructions)
                    .ThenInclude(i => i.Ingredients)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (recipe == null)
            {
                _logger.LogWarning($"Recipe with id {id} not found");
                return NotFound($"Recipe with id {id} not found");
            }

            var recipeDto = new RecipeDto
            {
                Id = recipe.Id,
                Name = recipe.Name,
                Img = recipe.Img,
                Description = recipe.Description,
                Category = recipe.Category,
                Cuisine = recipe.Cuisine,
                Ingredients = recipe.Ingredients.Select(i => new IngredientDTO
                {
                    Name = i.Name,
                    Quantity = i.Quantity,
                    Measurement = i.Measurement
                }).ToList(),
                Instructions = recipe.Instructions.Select(i => new InstructionDTO
                {
                    InstructionText = i.InstructionText,
                    Ingredients = i.Ingredients.Select(ing => new IngredientDTO
                    {
                        Name = ing.Name,
                        Quantity = ing.Quantity,
                        Measurement = ing.Measurement
                    }).ToList()
                }).ToList()
            };

            _logger.LogInformation($"Successfully fetched recipe with id: {id}");
            return Ok(recipeDto);
        }

        [HttpGet("menu/{cuisine}")]
        public async Task<ActionResult<IEnumerable<RecipeDto>>> GetMenuByCuisine(string cuisine)
        {
            _logger.LogInformation($"Fetching menu for cuisine: {cuisine}");

            var recipes = await _context.Recipes
                .Where(r => r.Cuisine.ToLower() == cuisine.ToLower())
                .Include(r => r.Ingredients)
                .Include(r => r.Instructions)
                    .ThenInclude(i => i.Ingredients)
                .ToListAsync();

            _logger.LogInformation($"Found {recipes.Count} recipes for cuisine: {cuisine}");

            if (!recipes.Any())
            {
                _logger.LogWarning($"No recipes found for cuisine: {cuisine}");
                return NotFound($"No recipes found for cuisine: {cuisine}");
            }

            // Select multiple starters, main courses, and desserts
            var starters = recipes.Where(r => r.Category == "Starter").Take(2).ToList();
            var mainCourses = recipes.Where(r => r.Category == "MainCourse").Take(3).ToList();
            var desserts = recipes.Where(r => r.Category == "Dessert").Take(2).ToList();

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
                Category = r.Category,
                Cuisine = r.Cuisine,
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

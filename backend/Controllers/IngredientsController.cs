using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.Data;
using backend.DTOs;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class IngredientsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<IngredientsController> _logger;

        public IngredientsController(ApplicationDbContext context, ILogger<IngredientsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Ingredient>>> GetIngredients()
        {
            return await _context.Ingredients.ToListAsync();
        }

        [HttpGet("categories")]
        public async Task<ActionResult<IEnumerable<string>>> GetCategories()
        {
            return await _context.Ingredients
                .Select(i => i.Category)
                .Distinct()
                .ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Ingredient>> CreateIngredient(CreateIngredientDTO dto)
        {
            var existingIngredient = await _context.Ingredients
                .FirstOrDefaultAsync(i => i.Name.ToLower() == dto.Name.ToLower());

            if (existingIngredient != null)
            {
                return Conflict("An ingredient with this name already exists");
            }

            var ingredient = new Ingredient
            {
                Name = dto.Name,
                Category = dto.Category,
                Description = dto.Description,
                NutritionalInfo = dto.NutritionalInfo,
                IsAllergenic = dto.IsAllergenic,
                AllergenType = dto.AllergenType,
                CommonUnit = dto.CommonUnit
            };

            _context.Ingredients.Add(ingredient);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetIngredient), new { id = ingredient.Id }, ingredient);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Ingredient>> GetIngredient(int id)
        {
            var ingredient = await _context.Ingredients.FindAsync(id);

            if (ingredient == null)
            {
                return NotFound();
            }

            return ingredient;
        }
    }
} 
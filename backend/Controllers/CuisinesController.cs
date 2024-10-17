using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using backend.Data;
using backend.Models;
using backend.DTOs;
using Microsoft.Extensions.Logging;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CuisinesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<CuisinesController> _logger;

        public CuisinesController(ApplicationDbContext context, ILogger<CuisinesController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cuisine>>> GetCuisines()
        {
            return await _context.Cuisines.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CuisineWithRecipesDto>> GetCuisineWithRecipes(
            int id, 
            [FromQuery] int page = 1, 
            [FromQuery] int pageSize = 10,
            [FromQuery] string category = "All")
        {
            try
            {
                var cuisine = await _context.Cuisines
                    .Include(c => c.Recipes)
                        .ThenInclude(r => r.Category)
                    .FirstOrDefaultAsync(c => c.Id == id);

                if (cuisine == null)
                {
                    return NotFound($"Cuisine with ID {id} not found.");
                }

                var filteredRecipes = cuisine.Recipes.AsQueryable();

                if (category != "All")
                {
                    filteredRecipes = filteredRecipes.Where(r => r.Category.Name == category);
                }

                var totalRecipes = filteredRecipes.Count();
                var totalPages = (int)Math.Ceiling(totalRecipes / (double)pageSize);

                var paginatedRecipes = filteredRecipes
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(r => new RecipeSummaryDto
                    {
                        Id = r.Id,
                        Name = r.Name,
                        Description = r.Description,
                        Img = r.Img,
                        Category = r.Category.Name
                    })
                    .ToList(); // Change this to ToList() instead of ToListAsync()

                var result = new CuisineWithRecipesDto
                {
                    Id = cuisine.Id,
                    Name = cuisine.Name,
                    Description = cuisine.Description,
                    Recipes = paginatedRecipes,
                    TotalRecipes = totalRecipes,
                    CurrentPage = page,
                    TotalPages = totalPages
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while fetching cuisine with ID {id}");
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }
    }
}

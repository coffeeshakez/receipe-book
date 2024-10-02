using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Data;
using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GroceryListController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<GroceryListController> _logger;

        public GroceryListController(ApplicationDbContext context, ILogger<GroceryListController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // POST: api/grocerylist/create/{recipeId}
        [HttpPost("create/{recipeId}")]
        public IActionResult CreateGroceryList(int recipeId)
        {
            var recipe = _context.Recipes
                .Include(r => r.Ingredients)
                .FirstOrDefault(r => r.Id == recipeId);

            if (recipe == null)
            {
                return NotFound($"Recipe with id {recipeId} not found");
            }

            var groceryList = new GroceryList
            {
                CreatedAt = DateTime.UtcNow,
                Items = new List<GroceryItem>()
            };

            foreach (var ingredient in recipe.Ingredients)
            {
                var groceryItem = new GroceryItem
                {
                    Name = ingredient.Name,
                    Quantity = ingredient.Quantity,
                    Unit = ingredient.Measurement,
                    Checked = false,
                    GroceryList = groceryList
                };
                groceryList.Items.Add(groceryItem);
            }

            _context.GroceryLists.Add(groceryList);
            _context.SaveChanges();

            // Create a DTO to return
            var groceryListDTO = new GroceryListDTO
            {
                Id = groceryList.Id,
                CreatedAt = groceryList.CreatedAt,
                Items = groceryList.Items.Select(item => new GroceryItemDTO
                {
                    Id = item.Id,
                    Name = item.Name,
                    Quantity = item.Quantity,
                    Unit = item.Unit,
                    Checked = item.Checked
                }).ToList()
            };

            return Ok(groceryListDTO);
        }

        // GET: api/grocerylist/{id}
        [HttpGet("{id}")]
        public ActionResult<GroceryList> GetGroceryList(int id)
        {
            var groceryList = _context.GroceryLists
                .Include(gl => gl.Items)
                .FirstOrDefault(gl => gl.Id == id);

            if (groceryList == null)
            {
                return NotFound();
            }

            return groceryList;
        }

        // PUT: api/grocerylist/{id}/item/{itemId}
        [HttpPut("{id}/item/{itemId}")]
        public IActionResult UpdateGroceryItem(int id, int itemId, GroceryItem item)
        {
            var groceryList = _context.GroceryLists
                .Include(gl => gl.Items)
                .FirstOrDefault(gl => gl.Id == id);

            if (groceryList == null)
            {
                return NotFound();
            }

            var groceryItem = groceryList.Items.FirstOrDefault(i => i.Id == itemId);

            if (groceryItem == null)
            {
                return NotFound();
            }

            groceryItem.Checked = item.Checked;
            _context.SaveChanges();

            return NoContent();
        }
    }
}
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
        public IActionResult UpdateGroceryItem(int id, int itemId, [FromBody] GroceryItemDTO itemDTO)
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

            groceryItem.Checked = itemDTO.Checked;
            groceryItem.Quantity = itemDTO.Quantity;
            groceryItem.Unit = itemDTO.Unit;
            groceryItem.Name = itemDTO.Name;

            _context.SaveChanges();

            return Ok(new GroceryItemDTO
            {
                Id = groceryItem.Id,
                Name = groceryItem.Name,
                Quantity = groceryItem.Quantity,
                Unit = groceryItem.Unit,
                Checked = groceryItem.Checked
            });
        }

        // POST: api/grocerylist/{id}/item
        [HttpPost("{id}/item")]
        public IActionResult AddGroceryItem(int id, [FromBody] GroceryItemDTO itemDTO)
        {
            var groceryList = _context.GroceryLists
                .Include(gl => gl.Items)
                .FirstOrDefault(gl => gl.Id == id);

            if (groceryList == null)
            {
                return NotFound();
            }

            var newItem = new GroceryItem
            {
                Name = itemDTO.Name,
                Quantity = itemDTO.Quantity,
                Unit = itemDTO.Unit,
                Checked = false,
                GroceryList = groceryList
            };

            groceryList.Items.Add(newItem);
            _context.SaveChanges();

            return Ok(new GroceryItemDTO
            {
                Id = newItem.Id,
                Name = newItem.Name,
                Quantity = newItem.Quantity,
                Unit = newItem.Unit,
                Checked = newItem.Checked
            });
        }

        // DELETE: api/grocerylist/{id}/item/{itemId}
        [HttpDelete("{id}/item/{itemId}")]
        public IActionResult RemoveGroceryItem(int id, int itemId)
        {
            var groceryList = _context.GroceryLists
                .Include(gl => gl.Items)
                .FirstOrDefault(gl => gl.Id == id);

            if (groceryList == null)
            {
                return NotFound();
            }

            var item = groceryList.Items.FirstOrDefault(i => i.Id == itemId);

            if (item == null)
            {
                return NotFound();
            }

            groceryList.Items.Remove(item);
            _context.SaveChanges();

            return NoContent();
        }
    }
}
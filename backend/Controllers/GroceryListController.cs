using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Data;
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using backend.DTOs;  // Add this line at the top of the file
using System.Text.Json;

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
        [HttpPut("{listId}/item/{itemId}")]
        public async Task<ActionResult<GroceryItemDTO>> UpdateGroceryItem(int listId, int itemId, [FromBody] GroceryItemDTO itemDTO)
        {
            var groceryList = await _context.GroceryLists
                .Include(gl => gl.Items)
                .FirstOrDefaultAsync(gl => gl.Id == listId);

            if (groceryList == null)
            {
                return NotFound($"Grocery list with id {listId} not found");
            }

            var groceryItem = groceryList.Items.FirstOrDefault(i => i.Id == itemId);

            if (groceryItem == null)
            {
                return NotFound($"Grocery item with id {itemId} not found in list {listId}");
            }

            groceryItem.Name = itemDTO.Name;
            groceryItem.Quantity = itemDTO.Quantity;
            groceryItem.Unit = itemDTO.Unit;
            groceryItem.Checked = itemDTO.Checked;

            await _context.SaveChangesAsync();

            var updatedItemDTO = new GroceryItemDTO
            {
                Id = groceryItem.Id,
                Name = groceryItem.Name,
                Quantity = groceryItem.Quantity,
                Unit = groceryItem.Unit,
                Checked = groceryItem.Checked
            };

            return Ok(updatedItemDTO);
        }

        // POST: api/grocerylist/{id}/item
        [HttpPost("{id}/item")]
        public async Task<ActionResult<GroceryItemDTO>> AddGroceryItem(int id, [FromBody] GroceryItemDTO itemDTO)
        {
            _logger.LogInformation($"Received request to add item to grocery list {id}. Item: {JsonSerializer.Serialize(itemDTO)}");

            var groceryList = await _context.GroceryLists
                .Include(gl => gl.Items)
                .FirstOrDefaultAsync(gl => gl.Id == id);

            if (groceryList == null)
            {
                _logger.LogWarning($"Grocery list with id {id} not found");
                return NotFound($"Grocery list with id {id} not found");
            }

            var newItem = new GroceryItem
            {
                Name = itemDTO.Name,
                Quantity = string.IsNullOrEmpty(itemDTO.Quantity) ? "1" : itemDTO.Quantity,
                Unit = itemDTO.Unit ?? string.Empty,
                Checked = itemDTO.Checked,
                GroceryList = groceryList
            };

            groceryList.Items.Add(newItem);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Successfully added item to grocery list {id}. New item id: {newItem.Id}");

            var createdItemDTO = new GroceryItemDTO
            {
                Id = newItem.Id,
                Name = newItem.Name,
                Quantity = newItem.Quantity,
                Unit = newItem.Unit,
                Checked = newItem.Checked
            };

            return CreatedAtAction(nameof(GetGroceryList), new { id = groceryList.Id }, createdItemDTO);
        }

        // DELETE: api/grocerylist/{id}/item/{itemId}
        [HttpDelete("{id}/item/{itemId}")]
        public async Task<IActionResult> RemoveGroceryItem(int id, int itemId)
        {
            var groceryList = await _context.GroceryLists
                .Include(gl => gl.Items)
                .FirstOrDefaultAsync(gl => gl.Id == id);

            if (groceryList == null)
            {
                return NotFound($"Grocery list with id {id} not found");
            }

            var item = groceryList.Items.FirstOrDefault(i => i.Id == itemId);

            if (item == null)
            {
                return NotFound($"Grocery item with id {itemId} not found in list {id}");
            }

            groceryList.Items.Remove(item);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Add this new method at the end of the GroceryListController class

        // POST: api/grocerylist/{id}/items
        [HttpPost("{id}/items")]
        public async Task<ActionResult<IEnumerable<GroceryItemDTO>>> AddGroceryItems(int id, [FromBody] JsonElement payload)
        {
            _logger.LogInformation($"Received request to add items to grocery list {id}. Payload: {payload}");

            List<GroceryItemDTO> itemDTOs;

            try
            {
                if (payload.ValueKind == JsonValueKind.Array)
                {
                    itemDTOs = JsonSerializer.Deserialize<List<GroceryItemDTO>>(payload.GetRawText(), new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                }
                else if (payload.ValueKind == JsonValueKind.Object)
                {
                    var singleItem = JsonSerializer.Deserialize<GroceryItemDTO>(payload.GetRawText(), new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                    itemDTOs = new List<GroceryItemDTO> { singleItem };
                }
                else
                {
                    _logger.LogWarning("Invalid payload format");
                    return BadRequest("Invalid payload format");
                }

                if (itemDTOs == null || !itemDTOs.Any())
                {
                    _logger.LogWarning("No valid items provided in the request body");
                    return BadRequest("No valid items provided");
                }

                var groceryList = await _context.GroceryLists
                    .Include(gl => gl.Items)
                    .FirstOrDefaultAsync(gl => gl.Id == id);

                if (groceryList == null)
                {
                    _logger.LogWarning($"Grocery list with id {id} not found");
                    return NotFound($"Grocery list with id {id} not found");
                }

                var newItems = new List<GroceryItem>();

                foreach (var itemDTO in itemDTOs)
                {
                    var newItem = new GroceryItem
                    {
                        Name = itemDTO.Name,
                        Quantity = string.IsNullOrEmpty(itemDTO.Quantity) ? "1" : itemDTO.Quantity,
                        Unit = itemDTO.Unit ?? string.Empty,
                        Checked = itemDTO.Checked,
                        GroceryList = groceryList
                    };

                    newItems.Add(newItem);
                    groceryList.Items.Add(newItem);
                }

                await _context.SaveChangesAsync();
                _logger.LogInformation($"Successfully added {newItems.Count} items to grocery list {id}");

                var createdItemDTOs = newItems.Select(item => new GroceryItemDTO
                {
                    Id = item.Id,
                    Name = item.Name,
                    Quantity = item.Quantity,
                    Unit = item.Unit,
                    Checked = item.Checked
                }).ToList();

                return CreatedAtAction(nameof(GetGroceryList), new { id = groceryList.Id }, createdItemDTOs);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error adding items to grocery list {id}");
                return StatusCode(500, $"An error occurred while adding items: {ex.Message}");
            }
        }
    }
}

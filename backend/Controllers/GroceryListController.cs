using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Data;
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using backend.DTOs;
using System.Text.Json;
using backend.Services;
using System.Collections.Generic;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GroceryListController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<GroceryListController> _logger;
        private readonly IGroceryListService _groceryListService;

        public GroceryListController(
            ApplicationDbContext context, 
            ILogger<GroceryListController> logger,
            IGroceryListService groceryListService)
        {
            _context = context;
            _logger = logger;
            _groceryListService = groceryListService;
        }

        [HttpPost("create/{recipeId}")]
        public async Task<ActionResult<GroceryListDTO>> CreateGroceryList(int recipeId)
        {
            var recipe = await _context.Recipes
                .Include(r => r.RecipeIngredients)
                    .ThenInclude(ri => ri.Ingredient)
                .FirstOrDefaultAsync(r => r.Id == recipeId);

            if (recipe == null)
            {
                return NotFound($"Recipe with id {recipeId} not found");
            }

            var groceryList = new GroceryList
            {
                CreatedAt = DateTime.UtcNow,
                Items = new List<GroceryItem>()
            };

            foreach (var ri in recipe.RecipeIngredients)
            {
                groceryList.Items.Add(new GroceryItem
                {
                    Name = ri.Ingredient.Name,
                    Quantity = ri.Quantity,
                    Unit = ri.Measurement,
                    Checked = false,
                    GroceryList = groceryList
                });
            }

            _context.GroceryLists.Add(groceryList);
            await _context.SaveChangesAsync();

            var groceryListDTO = new GroceryListDTO
            {
                Id = groceryList.Id,
                CreatedAt = groceryList.CreatedAt,
                Items = groceryList.Items.Select(item => new backend.DTOs.GroceryItemDTO
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

        [HttpGet("{id}")]
        public async Task<ActionResult<GroceryListDTO>> GetGroceryList(int id)
        {
            var groceryList = await _context.GroceryLists
                .Include(gl => gl.Items)
                .FirstOrDefaultAsync(gl => gl.Id == id);

            if (groceryList == null)
            {
                return NotFound();
            }

            var groceryListDTO = new GroceryListDTO
            {
                Id = groceryList.Id,
                CreatedAt = groceryList.CreatedAt,
                Items = groceryList.Items.Select(item => new backend.DTOs.GroceryItemDTO
                {
                    Id = item.Id,
                    Name = item.Name,
                    Quantity = item.Quantity,
                    Unit = item.Unit,
                    Checked = item.Checked
                }).ToList()
            };

            return groceryListDTO;
        }

        [HttpPut("{listId}/item/{itemId}")]
        public async Task<ActionResult<backend.DTOs.GroceryItemDTO>> UpdateGroceryItem(int listId, int itemId, [FromBody] backend.DTOs.GroceryItemDTO itemDTO)
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

            var updatedItemDTO = new backend.DTOs.GroceryItemDTO
            {
                Id = groceryItem.Id,
                Name = groceryItem.Name,
                Quantity = groceryItem.Quantity,
                Unit = groceryItem.Unit,
                Checked = groceryItem.Checked
            };

            return Ok(updatedItemDTO);
        }

        [HttpPost("{listId}/addrecipe/{recipeId}")]
        public async Task<ActionResult<IEnumerable<backend.DTOs.GroceryItemDTO>>> AddRecipeToGroceryList(int listId, int recipeId)
        {
            try
            {
                var result = await _groceryListService.AddRecipeToGroceryListAsync(listId, recipeId);
                return result.Match<ActionResult<IEnumerable<backend.DTOs.GroceryItemDTO>>>(
                    addedItems => Ok(addedItems),
                    error => NotFound(error)
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error adding recipe {recipeId} to grocery list {listId}");
                return StatusCode(500, "An error occurred while adding the recipe to the grocery list");
            }
        }
    }
}

using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Data;
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using backend.Services;
using System.Collections.Generic;
using backend.Exceptions;
using backend.DTOs;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GroceryListController : ControllerBase
    {
        private readonly IGroceryListService _groceryListService;
        private readonly ILogger<GroceryListController> _logger;

        public GroceryListController(
            IGroceryListService groceryListService,
            ILogger<GroceryListController> logger)
        {
            _groceryListService = groceryListService;
            _logger = logger;
        }

        // GET api/grocerylist
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GroceryListDTO>>> GetAllGroceryLists()
        {
            try
            {
                var lists = await _groceryListService.GetAllAsync();
                return Ok(lists);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all grocery lists");
                return StatusCode(500, new { message = "An error occurred while retrieving grocery lists" });
            }
        }

        // GET api/grocerylist/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<GroceryListDTO>> GetGroceryList(int id)
        {
            try
            {
                var groceryList = await _groceryListService.GetByIdAsync(id);
                return Ok(groceryList);
            }
            catch (NotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to retrieve grocery list {ListId}", id);
                return StatusCode(500, new { message = "An error occurred while retrieving the grocery list" });
            }
        }

        // POST api/grocerylist
        [HttpPost]
        public async Task<ActionResult<GroceryListDTO>> CreateGroceryList([FromQuery] int? recipeId)
        {
            try
            {
                var groceryList = recipeId.HasValue 
                    ? await _groceryListService.CreateFromRecipeAsync(recipeId.Value)
                    : await _groceryListService.CreateAsync();  // Create empty list

                return CreatedAtAction(
                    nameof(GetGroceryList), 
                    new { id = groceryList.Id }, 
                    groceryList
                );
            }
            catch (NotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating grocery list {RecipeId}", recipeId);
                return StatusCode(500, new { message = "An error occurred while creating the grocery list" });
            }
        }

        // POST api/grocerylist/{listId}/items
        [HttpPost("{listId}/items")]
        public async Task<ActionResult<GroceryItemDTO>> AddGroceryItem(
            int listId, 
            [FromBody] GroceryItemDTO itemDTO)
        {
            try
            {
                var newItem = await _groceryListService.AddItemAsync(listId, itemDTO);
                return CreatedAtAction(nameof(GetGroceryList), new { id = listId }, newItem);
            }
            catch (NotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding grocery item to list {ListId}", listId);
                return StatusCode(500, new { message = "An error occurred while adding the grocery item" });
            }
        }

        // PATCH api/grocerylist/{listId}/items/{itemId}
        [HttpPatch("{listId}/items/{itemId}")]
        public async Task<ActionResult<GroceryItemDTO>> UpdateGroceryItem(
            int listId, 
            int itemId, 
            [FromBody] GroceryItemPatchDTO patchDTO)
        {
            try
            {
                patchDTO.Id = itemId;
                var updatedItem = await _groceryListService.PatchItemAsync(listId, patchDTO);
                return Ok(updatedItem);
            }
            catch (NotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating grocery item {ItemId} in list {ListId}", itemId, listId);
                return StatusCode(500, new { message = "An error occurred while updating the grocery item" });
            }
        }

        // DELETE api/grocerylist/{listId}/items/{itemId}
        [HttpDelete("{listId}/items/{itemId}")]
        public async Task<ActionResult> RemoveGroceryItem(int listId, int itemId)
        {
            try
            {
                var result = await _groceryListService.RemoveItemAsync(listId, itemId);
                if (!result)
                    return NotFound();
                
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing grocery item {ItemId} from list {ListId}", itemId, listId);
                return StatusCode(500, new { message = "An error occurred while removing the grocery item" });
            }
        }

        // POST api/grocerylist/{listId}/recipes/{recipeId}
        [HttpPost("{listId}/recipes/{recipeId}")]
        public async Task<ActionResult<IEnumerable<GroceryItemDTO>>> AddRecipeToGroceryList(
            int listId, 
            int recipeId)
        {
            try
            {
                var items = await _groceryListService.AddRecipeToListAsync(listId, recipeId);
                return Ok(items);
            }
            catch (NotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding recipe {RecipeId} to grocery list {ListId}", recipeId, listId);
                return StatusCode(500, new { message = "An error occurred while adding the recipe to the grocery list" });
            }
        }
    }
}

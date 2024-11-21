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

        [HttpPost("create/{recipeId}")]
        public async Task<ActionResult<GroceryListDTO>> CreateGroceryList(int recipeId)
        {
            try
            {
                var groceryList = await _groceryListService.CreateFromRecipeAsync(recipeId);
                return Ok(groceryList);
            }
            catch (NotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating grocery list from recipe {RecipeId}", recipeId);
                return StatusCode(500, "An error occurred while creating the grocery list");
            }
        }

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
                _logger.LogError(ex, "Error retrieving grocery list {Id}", id);
                return StatusCode(500, new { message = "An error occurred while retrieving the grocery list", error = ex.Message });
            }
        }

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
                return StatusCode(500, new { message = "An error occurred while retrieving grocery lists", error = ex.Message });
            }
        }

        [HttpPatch("{listId}/items/{itemId}")]
        public async Task<ActionResult<GroceryItemDTO>> UpdateGroceryItem(
            int listId, 
            int itemId, 
            [FromBody] GroceryItemPatchDTO patchDTO)
        {
            try
            {
                patchDTO.Id = itemId; // Set the ID from the route
                var updatedItem = await _groceryListService.PatchItemAsync(listId, patchDTO);
                return Ok(updatedItem);
            }
            catch (NotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating grocery item {ItemId} in list {ListId}", itemId, listId);
                return StatusCode(500, "An error occurred while updating the grocery item");
            }
        }

        [HttpPost("{listId}/items")]
        public async Task<ActionResult<GroceryItemDTO>> AddGroceryItem(
            int listId, 
            [FromBody] GroceryItemDTO itemDTO)
        {
            try
            {
                var newItem = await _groceryListService.AddItemAsync(listId, itemDTO);
                return Ok(newItem);
            }
            catch (NotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding grocery item to list {ListId}", listId);
                return StatusCode(500, "An error occurred while adding the grocery item");
            }
        }

        [HttpDelete("{listId}/items/{itemId}")]
        public async Task<ActionResult> RemoveGroceryItem(int listId, int itemId)
        {
            try
            {
                var result = await _groceryListService.RemoveItemAsync(listId, itemId);
                if (!result)
                    return NotFound();
                
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing grocery item {ItemId} from list {ListId}", itemId, listId);
                return StatusCode(500, "An error occurred while removing the grocery item");
            }
        }

        [HttpPost("{listId}/addrecipe/{recipeId}")]
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
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding recipe {RecipeId} to grocery list {ListId}", recipeId, listId);
                return StatusCode(500, "An error occurred while adding the recipe to the grocery list");
            }
        }
    }
}

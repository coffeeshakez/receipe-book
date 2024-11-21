using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using backend.Data;
using backend.Models;
using backend.DTOs;
using backend.Exceptions;

namespace backend.Services
{
    public class GroceryListService : IGroceryListService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<GroceryListService> _logger;

        public GroceryListService(ApplicationDbContext context, ILogger<GroceryListService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<GroceryListDTO> CreateFromRecipeAsync(int recipeId)
        {
            var recipe = await _context.Recipes
                .Include(r => r.RecipeIngredients)
                    .ThenInclude(ri => ri.Ingredient)
                .FirstOrDefaultAsync(r => r.Id == recipeId);

            if (recipe == null)
            {
                throw new NotFoundException($"Recipe with id {recipeId} not found");
            }

            var groceryList = new GroceryList
            {
                CreatedAt = DateTime.UtcNow,
                Items = recipe.RecipeIngredients.Select(ri => new GroceryItem
                {
                    Name = ri.Ingredient.Name,
                    Quantity = ri.Quantity,
                    Unit = ri.Measurement,
                    Checked = false
                }).ToList()
            };

            _context.GroceryLists.Add(groceryList);
            await _context.SaveChangesAsync();

            return MapToGroceryListDTO(groceryList);
        }

        public async Task<GroceryListDTO?> GetByIdAsync(int id)
        {
            try
            {
                var groceryList = await _context.GroceryLists
                    .Include(gl => gl.Items)
                    .FirstOrDefaultAsync(gl => gl.Id == id);

                if (groceryList == null)
                {
                    throw new NotFoundException($"Grocery list with id {id} not found");
                }

                return MapToGroceryListDTO(groceryList);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving grocery list {Id}", id);
                throw;
            }
        }

        public async Task<IEnumerable<GroceryListDTO>> GetAllAsync()
        {
            try
            {
                var groceryLists = await _context.GroceryLists
                    .Include(gl => gl.Items)
                    .OrderByDescending(gl => gl.CreatedAt)
                    .ToListAsync();

                return groceryLists.Select(MapToGroceryListDTO);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all grocery lists");
                throw;
            }
        }

        public async Task<GroceryItemDTO> UpdateItemAsync(int listId, int itemId, GroceryItemDTO itemDTO)
        {
            var groceryList = await _context.GroceryLists
                .Include(gl => gl.Items)
                .FirstOrDefaultAsync(gl => gl.Id == listId);

            if (groceryList == null)
            {
                throw new NotFoundException($"Grocery list with id {listId} not found");
            }

            var groceryItem = groceryList.Items.FirstOrDefault(i => i.Id == itemId);
            if (groceryItem == null)
            {
                throw new NotFoundException($"Grocery item with id {itemId} not found in list {listId}");
            }

            groceryItem.Name = itemDTO.Name;
            groceryItem.Quantity = itemDTO.Quantity;
            groceryItem.Unit = itemDTO.Unit;
            groceryItem.Checked = itemDTO.Checked;

            await _context.SaveChangesAsync();

            return MapToGroceryItemDTO(groceryItem);
        }

        public async Task<GroceryItemDTO> AddItemAsync(int listId, GroceryItemDTO itemDTO)
        {
            try
            {
                var groceryList = await _context.GroceryLists
                    .Include(gl => gl.Items)
                    .FirstOrDefaultAsync(gl => gl.Id == listId);

                if (groceryList == null)
                {
                    throw new NotFoundException($"Grocery list with id {listId} not found");
                }

                var newItem = new GroceryItem
                {
                    Name = itemDTO.Name ?? throw new ArgumentNullException(nameof(itemDTO.Name)),
                    Quantity = itemDTO.Quantity ?? throw new ArgumentNullException(nameof(itemDTO.Quantity)),
                    Unit = itemDTO.Unit ?? throw new ArgumentNullException(nameof(itemDTO.Unit)),
                    Checked = itemDTO.Checked,
                    GroceryList = groceryList
                };

                groceryList.Items.Add(newItem);
                await _context.SaveChangesAsync();

                return MapToGroceryItemDTO(newItem);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding item to grocery list {ListId}", listId);
                throw;
            }
        }

        public async Task<bool> RemoveItemAsync(int listId, int itemId)
        {
            var groceryList = await _context.GroceryLists
                .Include(gl => gl.Items)
                .FirstOrDefaultAsync(gl => gl.Id == listId);

            if (groceryList == null)
            {
                return false;
            }

            var item = groceryList.Items.FirstOrDefault(i => i.Id == itemId);
            if (item == null)
            {
                return false;
            }

            groceryList.Items.Remove(item);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<IEnumerable<GroceryItemDTO>> AddRecipeToListAsync(int listId, int recipeId)
        {
            var groceryList = await _context.GroceryLists
                .Include(gl => gl.Items)
                .FirstOrDefaultAsync(gl => gl.Id == listId);

            if (groceryList == null)
            {
                throw new NotFoundException($"Grocery list with id {listId} not found");
            }

            var recipe = await _context.Recipes
                .Include(r => r.RecipeIngredients)
                    .ThenInclude(ri => ri.Ingredient)
                .FirstOrDefaultAsync(r => r.Id == recipeId);

            if (recipe == null)
            {
                throw new NotFoundException($"Recipe with id {recipeId} not found");
            }

            var newItems = recipe.RecipeIngredients.Select(ri => new GroceryItem
            {
                Name = ri.Ingredient.Name,
                Quantity = ri.Quantity,
                Unit = ri.Measurement,
                Checked = false,
                GroceryList = groceryList
            }).ToList();

            groceryList.Items.AddRange(newItems);
            await _context.SaveChangesAsync();

            return newItems.Select(MapToGroceryItemDTO);
        }

        public async Task<GroceryItemDTO> PatchItemAsync(int listId, GroceryItemPatchDTO patchDTO)
        {
            var groceryList = await _context.GroceryLists
                .Include(gl => gl.Items)
                .FirstOrDefaultAsync(gl => gl.Id == listId);

            if (groceryList == null)
            {
                throw new NotFoundException($"Grocery list with id {listId} not found");
            }

            var groceryItem = groceryList.Items.FirstOrDefault(i => i.Id == patchDTO.Id);
            if (groceryItem == null)
            {
                throw new NotFoundException($"Grocery item with id {patchDTO.Id} not found in list {listId}");
            }

            if (patchDTO.Name != null)
                groceryItem.Name = patchDTO.Name;
            
            if (patchDTO.Quantity != null)
                groceryItem.Quantity = patchDTO.Quantity;
            
            if (patchDTO.Unit != null)
                groceryItem.Unit = patchDTO.Unit;
            
            if (patchDTO.Checked.HasValue)
                groceryItem.Checked = patchDTO.Checked.Value;

            await _context.SaveChangesAsync();

            return MapToGroceryItemDTO(groceryItem);
        }

        private static GroceryListDTO MapToGroceryListDTO(GroceryList groceryList)
        {
            if (groceryList == null)
            {
                throw new ArgumentNullException(nameof(groceryList));
            }

            return new GroceryListDTO
            {
                Id = groceryList.Id,
                CreatedAt = groceryList.CreatedAt,
                Items = groceryList.Items.Select(MapToGroceryItemDTO).ToList()
            };
        }

        private static GroceryItemDTO MapToGroceryItemDTO(GroceryItem item)
        {
            if (item == null)
            {
                throw new ArgumentNullException(nameof(item));
            }

            return new GroceryItemDTO
            {
                Id = item.Id,
                Name = item.Name,
                Quantity = item.Quantity,
                Unit = item.Unit,
                Checked = item.Checked
            };
        }
    }
}

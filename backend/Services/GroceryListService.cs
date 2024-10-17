using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using OneOf;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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

        public async Task<OneOf<IEnumerable<GroceryItemDTO>, string>> AddRecipeToGroceryListAsync(int listId, int recipeId)
        {
            var groceryList = await _context.GroceryLists
                .Include(gl => gl.Items)
                .FirstOrDefaultAsync(gl => gl.Id == listId);

            if (groceryList == null)
            {
                return $"Grocery list with id {listId} not found";
            }

            var recipe = await _context.Recipes
                .Include(r => r.Ingredients)
                .FirstOrDefaultAsync(r => r.Id == recipeId);

            if (recipe == null)
            {
                return $"Recipe with id {recipeId} not found";
            }

            var newItems = new List<GroceryItem>();

            foreach (var ingredient in recipe.Ingredients)
            {
                var existingItem = groceryList.Items.FirstOrDefault(i => i.Name.ToLower() == ingredient.Name.ToLower());

                if (existingItem != null)
                {
                    // If the item already exists, update the quantity
                    existingItem.Quantity = (Convert.ToDouble(existingItem.Quantity) + Convert.ToDouble(ingredient.Quantity)).ToString();
                }
                else
                {
                    // If the item doesn't exist, add a new one
                    var newItem = new GroceryItem
                    {
                        Name = ingredient.Name,
                        Quantity = ingredient.Quantity,
                        Unit = ingredient.Measurement,
                        Checked = false,
                        GroceryList = groceryList
                    };
                    newItems.Add(newItem);
                    groceryList.Items.Add(newItem);
                }
            }

            await _context.SaveChangesAsync();

            var addedItemDTOs = newItems.Select(item => new GroceryItemDTO
            {
                Id = item.Id,
                Name = item.Name,
                Quantity = item.Quantity,
                Unit = item.Unit,
                Checked = item.Checked
            });

            return OneOf<IEnumerable<GroceryItemDTO>, string>.FromT0(addedItemDTOs);
        }
    }
}

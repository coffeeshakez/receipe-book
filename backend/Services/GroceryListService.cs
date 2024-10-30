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

        private double ParseQuantity(string quantity)
        {
            if (string.IsNullOrWhiteSpace(quantity)) return 0;

            // Handle fractions like "1/2"
            if (quantity.Contains('/'))
            {
                var parts = quantity.Split('/');
                if (parts.Length == 2 && double.TryParse(parts[0], out double numerator) && double.TryParse(parts[1], out double denominator))
                {
                    return numerator / denominator;
                }
            }

            // Handle regular numbers
            if (double.TryParse(quantity, out double result))
            {
                return result;
            }

            return 0;
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
                .Include(r => r.RecipeIngredients)
                    .ThenInclude(ri => ri.Ingredient)
                .FirstOrDefaultAsync(r => r.Id == recipeId);

            if (recipe == null)
            {
                return $"Recipe with id {recipeId} not found";
            }

            var newItems = new List<GroceryItem>();

            foreach (var recipeIngredient in recipe.RecipeIngredients)
            {
                var existingItem = groceryList.Items
                    .FirstOrDefault(i => i.Name.ToLower() == recipeIngredient.Ingredient.Name.ToLower());

                if (existingItem != null)
                {
                    // Parse both quantities and add them
                    var existingQuantity = ParseQuantity(existingItem.Quantity);
                    var newQuantity = ParseQuantity(recipeIngredient.Quantity);
                    var totalQuantity = existingQuantity + newQuantity;

                    // If it's a whole number, remove the decimal point
                    existingItem.Quantity = totalQuantity % 1 == 0 
                        ? ((int)totalQuantity).ToString() 
                        : totalQuantity.ToString();
                }
                else
                {
                    var newItem = new GroceryItem
                    {
                        Name = recipeIngredient.Ingredient.Name,
                        Quantity = recipeIngredient.Quantity,
                        Unit = recipeIngredient.Measurement,
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

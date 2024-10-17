using backend.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;
using OneOf;

namespace backend.Services
{
    public interface IGroceryListService
    {
        Task<OneOf<IEnumerable<GroceryItemDTO>, string>> AddRecipeToGroceryListAsync(int listId, int recipeId);
    }
}

using System.Collections.Generic;
using System.Threading.Tasks;
using backend.DTOs;
namespace backend.Services
{
    public interface IGroceryListService
    {
        Task<GroceryListDTO> CreateFromRecipeAsync(int recipeId);
        Task<GroceryListDTO?> GetByIdAsync(int id);
        Task<IEnumerable<GroceryListDTO>> GetAllAsync();
        Task<GroceryItemDTO> UpdateItemAsync(int listId, int itemId, GroceryItemDTO itemDTO);
        Task<GroceryItemDTO> AddItemAsync(int listId, GroceryItemDTO itemDTO);
        Task<bool> RemoveItemAsync(int listId, int itemId);
        Task<IEnumerable<GroceryItemDTO>> AddRecipeToListAsync(int listId, int recipeId);
        Task<GroceryItemDTO> PatchItemAsync(int listId, GroceryItemPatchDTO patchDTO);
    }
}

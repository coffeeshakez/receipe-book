using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Services
{
    public interface IGroceryListService
    {
        Task<backend.DTOs.GroceryListDTO> CreateFromRecipeAsync(int recipeId);
        Task<backend.DTOs.GroceryListDTO?> GetByIdAsync(int id);
        Task<IEnumerable<backend.DTOs.GroceryListDTO>> GetAllAsync();
        Task<backend.DTOs.GroceryItemDTO> UpdateItemAsync(int listId, int itemId, backend.DTOs.GroceryItemDTO itemDTO);
        Task<backend.DTOs.GroceryItemDTO> AddItemAsync(int listId, backend.DTOs.GroceryItemDTO itemDTO);
        Task<bool> RemoveItemAsync(int listId, int itemId);
        Task<IEnumerable<backend.DTOs.GroceryItemDTO>> AddRecipeToListAsync(int listId, int recipeId);
        Task<backend.DTOs.GroceryItemDTO> PatchItemAsync(int listId, backend.DTOs.GroceryItemPatchDTO patchDTO);
    }
}

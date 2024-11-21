using System.Collections.Generic;
using System.Threading.Tasks;
using backend.DTOs;
namespace backend.Services
{
    public interface IGroceryListService
    {
        Task<GroceryListDTO> CreateAsync();
        Task<GroceryListDTO> CreateFromRecipeAsync(int recipeId);
        Task<GroceryListDTO> GetByIdAsync(int id);
        Task<IEnumerable<GroceryListDTO>> GetAllAsync();
        Task<GroceryItemDTO> AddItemAsync(int listId, GroceryItemDTO item);
        Task<GroceryItemDTO> PatchItemAsync(int listId, GroceryItemPatchDTO patchDTO);
        Task<bool> RemoveItemAsync(int listId, int itemId);
        Task<IEnumerable<GroceryItemDTO>> AddRecipeToListAsync(int listId, int recipeId);
    }
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiHandler } from '@/services/apiHandler';
import type { IGroceryItem, IGroceryList } from '@/services/apiHandler';

export const useGroceryList = (listId: number) => {
  const queryClient = useQueryClient();

  const { data: groceryList, isLoading, error } = useQuery({
    queryKey: ['groceryList', listId],
    queryFn: () => apiHandler.getGroceryList(listId)
  });

  const toggleItemMutation = useMutation({
    mutationFn: ({ itemId, checked }: { itemId: number; checked: boolean }) => 
      apiHandler.patchGroceryItem(listId, itemId, { checked }),
    onSuccess: () => {
      queryClient.invalidateQueries(['groceryList', listId]);
    }
  });

  const removeItemMutation = useMutation({
    mutationFn: (itemId: number) => 
      apiHandler.removeGroceryItem(listId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries(['groceryList', listId]);
    }
  });

  const addItemMutation = useMutation({
    mutationFn: (name: string) => 
      apiHandler.addGroceryItem(listId, {
        name,
        quantity: '',
        unit: '',
        checked: false
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['groceryList', listId]);
    }
  });

  const addRecipeMutation = useMutation({
    mutationFn: (recipeId: number) => 
      apiHandler.addRecipeToGroceryList(listId, recipeId),
    onSuccess: () => {
      queryClient.invalidateQueries(['groceryList', listId]);
    }
  });

  const refreshList = () => {
    queryClient.invalidateQueries(['groceryList', listId]);
  };

  return {
    groceryList,
    isLoading,
    error,
    toggleItem: toggleItemMutation.mutate,
    removeItem: removeItemMutation.mutate,
    addItem: addItemMutation.mutate,
    addRecipe: addRecipeMutation.mutate,
    refreshList,
    isAddingItem: addItemMutation.isPending,
    isRemovingItem: removeItemMutation.isPending,
    isTogglingItem: toggleItemMutation.isPending,
    isAddingRecipe: addRecipeMutation.isPending
  };
}; 
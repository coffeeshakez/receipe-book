import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiHandler } from '@/services/apiHandler';

export const useGroceryList = (listId: number) => {
  const queryClient = useQueryClient();

  const { data: groceryList, isLoading, error } = useQuery({
    queryKey: ['groceryList', listId],
    queryFn: () => apiHandler.getGroceryList(listId),
    staleTime: 1000 * 60 * 5,
    refetchOnMount: 'always',
  });

  const toggleItemMutation = useMutation({
    mutationFn: ({ itemId, checked }: { itemId: number; checked: boolean }) =>
      apiHandler.patchGroceryItem(listId, itemId, { checked }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groceryList', listId] });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: (itemId: number) => apiHandler.removeGroceryItem(listId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groceryList', listId] });
    },
  });

  const addItemMutation = useMutation({
    mutationFn: (name: string) =>
      apiHandler.addGroceryItem(listId, {
        name,
        quantity: '',
        unit: '',
        checked: false,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groceryList', listId] });
    },
  });

  return {
    groceryList,
    isLoading,
    error,
    toggleItem: (itemId: number, checked: boolean) =>
      toggleItemMutation.mutate({ itemId, checked }),
    removeItem: (itemId: number) => removeItemMutation.mutate(itemId),
    addItem: (name: string) => addItemMutation.mutate(name),
    isAddingItem: addItemMutation.status === 'pending',
    isRemovingItem: removeItemMutation.status === 'pending',
    isTogglingItem: toggleItemMutation.status === 'pending',
  };
}; 
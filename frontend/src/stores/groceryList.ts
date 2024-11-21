import create from 'zustand';
import { apiHandler } from '@/services/apiHandler';

interface GroceryListStore {
  groceryList: GroceryList | null;
  isLoading: boolean;
  error: string | null;
  fetchGroceryList: (id: number) => Promise<void>;
  toggleItem: (listId: number, itemId: number, checked: boolean) => Promise<void>;
}

export const useGroceryListStore = create<GroceryListStore>((set) => ({
  groceryList: null,
  isLoading: false,
  error: null,
  
  fetchGroceryList: async (id) => {
    set({ isLoading: true });
    try {
      const list = await apiHandler.getGroceryList(id);
      set({ groceryList: list, error: null });
    } catch (error) {
      set({ error: 'Failed to fetch grocery list' });
    } finally {
      set({ isLoading: false });
    }
  },

  toggleItem: async (listId, itemId, checked) => {
    try {
      await apiHandler.updateGroceryItem(listId, itemId, { checked });
      // Update local state
      set((state) => ({
        groceryList: state.groceryList ? {
          ...state.groceryList,
          items: state.groceryList.items.map(item =>
            item.id === itemId ? { ...item, checked } : item
          )
        } : null
      }));
    } catch (error) {
      set({ error: 'Failed to update item' });
    }
  }
})); 
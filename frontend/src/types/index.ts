export interface GroceryItem {
  id: number;
  name: string;
  quantity: string;
  unit: string;
  checked: boolean;
}

export interface GroceryItemPatch {
  name?: string;
  quantity?: string;
  unit?: string;
  checked?: boolean;
}

export interface GroceryList {
  id: number;
  createdAt: string;
  items: GroceryItem[];
}

export interface LoadingStates {
  isAddingItem: boolean;
  isRemovingItem: boolean;
  isTogglingItem: boolean;
  isAddingRecipe: boolean;
} 
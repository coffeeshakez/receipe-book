const API_BASE_URL = 'http://localhost:5176/api';

export interface Recipe {
  id: number;
  name: string;
  img: string;
  description: string;
  category: string; // Add this line
  ingredients: Ingredient[];
  instructions: Instruction[];
}

export interface Ingredient {
  name: string;
  quantity: string;
  measurement: string;
}

export interface Instruction {
  instructionText: string;
  ingredients: Ingredient[];
}

export interface GroceryItem {
  id: number;
  name: string;
  quantity: string;
  unit: string;
  checked: boolean;
}

export interface GroceryList {
  id: number;
  createdAt: string;
  items: GroceryItem[];
}

export interface Menu {
  id: number;
  name: string;
  recipeIds: number[];
}

export interface CreateMenuDto {
  name: string;
}

export interface UpdateMenuDto {
  name: string;
  recipeIds: number[];
}

export const apiHandler = {
  async getRecipes(): Promise<Recipe[]> {
    const response = await fetch(`${API_BASE_URL}/recipes`);
    if (!response.ok) {
      throw new Error('Failed to fetch recipes');
    }
    return response.json();
  },

  async getRecipe(id: number): Promise<Recipe> {
    const response = await fetch(`${API_BASE_URL}/recipes/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch recipe');
    }
    return response.json();
  },

  async getGroceryList(recipeId: number): Promise<GroceryItem[]> {
    const response = await fetch(`${API_BASE_URL}/grocerylist/${recipeId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch grocery list');
    }
    return response.json();
  },

  async addGroceryItem(listId: number, item: Omit<GroceryItem, 'id'>): Promise<GroceryItem> {
    const response = await fetch(`${API_BASE_URL}/grocerylist/${listId}/item`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to add grocery item:', errorText);
      throw new Error(`Failed to add grocery item: ${response.status} ${response.statusText}`);
    }
    return response.json();
  },

  async updateGroceryItem(listId: number, itemId: number, item: Omit<GroceryItem, 'id'>): Promise<GroceryItem> {
    const response = await fetch(`${API_BASE_URL}/grocerylist/${listId}/item/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to update grocery item:', errorText);
      throw new Error(`Failed to update grocery item: ${response.status} ${response.statusText}`);
    }
    return response.json();
  },

  async createGroceryList(recipeId: number): Promise<GroceryList> {
    const response = await fetch(`${API_BASE_URL}/grocerylist/create/${recipeId}`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to create grocery list');
    }
    return response.json();
  },


  async removeGroceryItem(listId: number, itemId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/grocerylist/${listId}/item/${itemId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to remove grocery item');
    }
  },

  async getMenuByCuisine(cuisine: string): Promise<Recipe[]> {
    const response = await fetch(`${API_BASE_URL}/recipes/menu/${cuisine}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch menu for cuisine: ${cuisine}`);
    }
    return response.json();
  },

  async getMenus(): Promise<Menu[]> {
    const response = await fetch(`${API_BASE_URL}/menus`);
    if (!response.ok) {
      throw new Error('Failed to fetch menus');
    }
    return response.json();
  },

  async createMenu(createMenuDto: CreateMenuDto): Promise<Menu> {
    const response = await fetch(`${API_BASE_URL}/menus`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(createMenuDto),
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to create menu:', errorText);
      throw new Error(`Failed to create menu: ${response.status} ${response.statusText}`);
    }
    return response.json();
  },

  async updateMenu(id: number, updateMenuDto: UpdateMenuDto): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/menus/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateMenuDto),
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to update menu:', errorText);
      throw new Error(`Failed to update menu: ${response.status} ${response.statusText}`);
    }
  },

  async getMenu(id: number): Promise<Menu> {
    const response = await fetch(`${API_BASE_URL}/menus/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch menu');
    }
    return response.json();
  },
};

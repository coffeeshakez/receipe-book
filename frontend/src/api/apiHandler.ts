const API_BASE_URL = 'http://localhost:5176/api';

export interface Recipe {
  id: number;
  name: string;
  img: string;
  description: string;
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
  name: string;
  quantity: number;
  unit: string;
  checked: boolean;
}

export interface GroceryList {
  id: number;
  createdAt: string;
  items: GroceryItem[];
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

  async addGroceryItem(item: GroceryItem): Promise<GroceryItem> {
    const response = await fetch(`${API_BASE_URL}/grocerylist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });
    if (!response.ok) {
      throw new Error('Failed to add grocery item');
    }
    return response.json();
  },

  async updateGroceryItem(id: number, item: GroceryItem): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/grocerylist/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });
    if (!response.ok) {
      throw new Error('Failed to update grocery item');
    }
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

  async getGroceryList(id: number): Promise<GroceryList> {
    const response = await fetch(`${API_BASE_URL}/grocerylist/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch grocery list');
    }
    return response.json();
  },

  async updateGroceryItem(listId: number, itemId: number, item: GroceryItem): Promise<GroceryItem> {
    const response = await fetch(`${API_BASE_URL}/grocerylist/${listId}/item/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });
    if (!response.ok) {
      throw new Error('Failed to update grocery item');
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
      throw new Error('Failed to add grocery item');
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
};
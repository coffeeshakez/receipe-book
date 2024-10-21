const API_BASE_URL = 'http://localhost:5176/api';

export interface Recipe {
  id: number;
  name: string;
  img: string;
  description: string;
  category: string;
  cuisine: string;
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

export interface Cuisine {
  id: number;
  name: string;
  description: string;
}

export interface CuisineWithRecipes {
  id: number;
  name: string;
  description: string;
  recipes: Recipe[];
  totalRecipes: number;
  currentPage: number;
  totalPages: number;
}

export interface Category {
  id: number;
  name: string;
}

export const apiHandler = {
  async getRecipes(categoryIds: number[] = [], cuisineIds: number[] = []): Promise<Recipe[]> {
    const params = new URLSearchParams();
    categoryIds.forEach(id => params.append('categoryId', id.toString()));
    cuisineIds.forEach(id => params.append('cuisineId', id.toString()));
    
    const response = await fetch(`${API_BASE_URL}/recipes?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch recipes');
    }
    return await response.json();
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

  async addRecipeToGroceryList(listId: number, recipeId: number): Promise<GroceryItem[]> {
    const response = await fetch(`${API_BASE_URL}/grocerylist/${listId}/addrecipe/${recipeId}`, {
      method: 'POST',
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to add recipe items to grocery list:', errorText);
      throw new Error(`Failed to add recipe items to grocery list: ${response.status} ${response.statusText}`);
    }
    return response.json();
  },

  // Remove or comment out the getPopularMenus method if it exists
  // async getPopularMenus(): Promise<Menu[]> {
  //   ...
  // },

  async getCuisines(): Promise<Cuisine[]> {
    const response = await fetch(`${API_BASE_URL}/cuisines`);
    if (!response.ok) {
      throw new Error('Failed to fetch cuisines');
    }
    return response.json();
  },

  getCuisineWithRecipes: async (id: number, page: number = 1, pageSize: number = 10, category: string = 'All'): Promise<CuisineWithRecipes> => {
    const response = await fetch(`${API_BASE_URL}/cuisines/${id}?page=${page}&pageSize=${pageSize}&category=${category}`);
    if (!response.ok) {
      throw new Error('Failed to fetch cuisine with recipes');
    }
    return response.json();
  },

  searchRecipes: async (query: string): Promise<Recipe[]> => {
    const response = await fetch(`${API_BASE_URL}/recipes/search?query=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Failed to search recipes');
    }
    return response.json();
  },

  // Add this method to the existing apiHandler object
  getRandomRecipe: async (categoryIds: number[] = [], cuisineIds: number[] = []): Promise<Recipe> => {
    const params = new URLSearchParams();
    categoryIds.forEach(id => params.append('categoryId', id.toString()));
    cuisineIds.forEach(id => params.append('cuisineId', id.toString()));
    
    const response = await fetch(`${API_BASE_URL}/api/recipes/random?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch random recipe');
    }
    return await response.json();
  },

  getCategories: async (): Promise<Category[]> => {
    const response = await fetch(`${API_BASE_URL}/categories`);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    return await response.json();
  },

  async addRecipe(recipe: Recipe): Promise<Recipe> {
    const response = await fetch(`${API_BASE_URL}/recipes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recipe),
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to add recipe:', errorText);
      throw new Error(`Failed to add recipe: ${response.status} ${response.statusText}`);
    }
    return response.json();
  },
};

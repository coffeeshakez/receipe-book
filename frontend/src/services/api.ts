import { Recipe } from '@/types/Recipe';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

export const getMenuByCuisine = async (cuisine: string): Promise<Recipe[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/recipes/menu/${cuisine}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching menu:', error);
        throw new Error(`Failed to fetch menu: ${error.message}`);
    }
};

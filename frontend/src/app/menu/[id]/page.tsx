'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Menu } from '@/components/Menu/Menu';
import { apiHandler, Recipe, Menu as MenuType } from '@/services/apiHandler';
import styles from './page.module.scss';

export default function MenuPage() {
  const [menu, setMenu] = useState<MenuType | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    const fetchMenuAndRecipes = async () => {
      try {
        const fetchedMenu = await apiHandler.getMenu(parseInt(id));
        setMenu(fetchedMenu);

        const fetchedRecipes = await Promise.all(
          fetchedMenu.recipeIds.map(recipeId => apiHandler.getRecipe(recipeId))
        );
        setRecipes(fetchedRecipes);
      } catch (error) {
        console.error('Error fetching menu and recipes:', error);
      }
    };

    fetchMenuAndRecipes();
  }, [id]);

  // Group recipes by category
  const recipesByCategory = recipes.reduce((acc, recipe) => {
    const category = recipe.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(recipe);
    return acc;
  }, {} as Record<string, Recipe[]>);

  // Create menu sections for each category
  const menuSections = Object.entries(recipesByCategory).map(([category, categoryRecipes]) => ({
    heading: category,
    img: './burger.jpg', // You might want to use different images for each category
    menuItems: categoryRecipes.map((recipe) => ({
      link: `/receipe/${recipe.id}`,
      name: recipe.name,
      description: recipe.description,
    })),
  }));

  if (!menu) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.menuTitle}>{menu.name}</h1>
      <Menu menuSections={menuSections} />
    </div>
  );
}

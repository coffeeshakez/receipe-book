'use client';

import Link from 'next/link';
import styles from './page.module.css';
import { Menu } from '@/components/Menu/Menu';
import { CuisineMenu } from '@/components/CuisineMenu';
import { apiHandler, Recipe } from '@/services/apiHandler';
import { useEffect, useState } from 'react';

export default function Page() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const fetchedRecipes = await apiHandler.getRecipes();
        setRecipes(fetchedRecipes);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    fetchRecipes();
  }, []);

  const handleMenuSelect = (selectedRecipes: Recipe[]) => {
    setRecipes(selectedRecipes);
  };

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

  return (
    <div className={styles.pageContainer}>
      <Link href="/receipe">Recipes</Link>
      <Menu menuSections={menuSections} />
      <CuisineMenu onMenuSelect={handleMenuSelect} />
    </div>
  );
}

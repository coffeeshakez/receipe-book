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

  return (
    <div className={styles.pageContainer}>
      <Link href="/receipe">Recipes</Link>
      <Menu
        menuSections={[
          {
            heading: 'Recipes',
            img: './burger.jpg',
            menuItems: recipes.map((recipe) => ({
              link: `/receipe/${recipe.id}`,
              name: recipe.name,
              description: recipe.description,
            })),
          },
        ]}
      />
      <CuisineMenu onMenuSelect={handleMenuSelect} />
    </div>
  );
}

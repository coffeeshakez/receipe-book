'use client';

import Link from 'next/link';
import styles from './page.module.css';
import { Menu } from '@/components/Menu/Menu';
import { CuisineMenu } from '@/components/CuisineMenu';
import { apiHandler, Recipe } from '@/api/apiHandler';
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

  return (
    <div className={styles.pageContainer}>
      <Link href="/receipe">Receipes</Link>
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
      <CuisineMenu />
    </div>
  );
}

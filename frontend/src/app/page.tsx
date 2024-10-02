'use client';

import Link from 'next/link';
import styles from './page.module.css';
import {Menu} from '@/components/Menu/Menu';
import { apiHandler, Recipe } from '@/api/apiHandler';
import { useEffect, useState } from 'react';

export default function Page() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const fetchedRecipes = await apiHandler.getRecipes();
        setRecipes(fetchedRecipes);
        console.log(fetchedRecipes);
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
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.scss';
import { HighlightedDishes } from '@/components/HighlightedDishes/HighlightedDishes';
import { PopularMenus } from '@/components/PopularMenus/PopularMenus';
import { SearchBar } from '@/components/SearchBar/SearchBar';
import { CuisineCarousel } from '@/components/CuisineCarousel/CuisineCarousel';
import { apiHandler, Recipe, Menu } from '@/services/apiHandler';

export default function HomePage() {
  const [highlightedDishes, setHighlightedDishes] = useState<Recipe[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch highlighted dishes
        const dishes = await apiHandler.getRecipes();
        // For now, let's just use the first 4 recipes as highlighted dishes
        setHighlightedDishes(dishes.slice(0, 4));

        // Fetch all menus instead of popular menus
        const fetchedMenus = await apiHandler.getMenus();
        setMenus(fetchedMenus);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles.homePage}>
      <section className={styles.hero}>
        <h1>Recipe Book</h1>
        <p>Discover, cook, and enjoy delicious meals</p>
        <SearchBar />
      </section>

      <section className={styles.highlightedDishes}>
        <HighlightedDishes dishes={highlightedDishes} />
      </section>

      <section className={styles.popularMenus}>
        <h2>Our Menus</h2>
        <PopularMenus menus={menus} />
      </section>

      <section className={styles.cuisineExplorer}>
        <h2>Explore Cuisines</h2>
        <CuisineCarousel />
      </section>

      <section className={styles.callToAction}>
        <h2>Create Your Own Menu</h2>
        <p>Mix and match your favorite recipes to create a personalized menu.</p>
        <Link href="/create-menu" className={styles.ctaButton}>
          Create Menu
        </Link>
      </section>
    </div>
  );
}

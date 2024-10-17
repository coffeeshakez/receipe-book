import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './CuisineCarousel.module.scss';
import { apiHandler, Cuisine } from '@/services/apiHandler';

export const CuisineCarousel: React.FC = () => {
  const [cuisines, setCuisines] = useState<Cuisine[]>([]);

  useEffect(() => {
    const fetchCuisines = async () => {
      try {
        const fetchedCuisines = await apiHandler.getCuisines();
        setCuisines(fetchedCuisines);
      } catch (error) {
        console.error('Error fetching cuisines:', error);
      }
    };

    fetchCuisines();
  }, []);

  return (
    <div className={styles.cuisineCarousel}>
      {cuisines.map((cuisine) => (
        <Link href={`/cuisine/${cuisine.id}`} key={cuisine.id}>
          <div className={styles.cuisineCard}>
            <h3 className={styles.cuisineName}>{cuisine.name}</h3>
            <p className={styles.cuisineDescription}>{cuisine.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

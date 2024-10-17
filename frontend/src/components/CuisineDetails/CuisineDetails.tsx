import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { apiHandler, CuisineWithRecipes, Recipe } from '@/services/apiHandler';
import styles from './CuisineDetails.module.scss';

export const CuisineDetails: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [cuisineData, setCuisineData] = useState<CuisineWithRecipes | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState('All');
  const pageSize = 10;

  useEffect(() => {
    if (id) {
      fetchCuisineData(Number(id), currentPage, category);
    }
  }, [id, currentPage, category]);

  const fetchCuisineData = async (cuisineId: number, page: number, category: string) => {
    try {
      const data = await apiHandler.getCuisineWithRecipes(cuisineId, page, pageSize, category);
      setCuisineData(data);
    } catch (error) {
      console.error('Error fetching cuisine data:', error);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setCurrentPage(1); // Reset to first page when changing category
  };

  if (!cuisineData) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.cuisineDetails}>
      <h1>{cuisineData.name}</h1>
      <p>{cuisineData.description}</p>
      <div className={styles.categoryFilter}>
        <button onClick={() => handleCategoryChange('All')} className={category === 'All' ? styles.active : ''}>All</button>
        <button onClick={() => handleCategoryChange('Starter')} className={category === 'Starter' ? styles.active : ''}>Starters</button>
        <button onClick={() => handleCategoryChange('MainCourse')} className={category === 'MainCourse' ? styles.active : ''}>Main Courses</button>
        <button onClick={() => handleCategoryChange('Dessert')} className={category === 'Dessert' ? styles.active : ''}>Desserts</button>
      </div>
      <div className={styles.recipeGrid}>
        {cuisineData.recipes.map((recipe: Recipe) => (
          <div key={recipe.id} className={styles.recipeCard}>
            <img src={recipe.img} alt={recipe.name} />
            <h3>{recipe.name}</h3>
            <p>{recipe.description}</p>
            <span>{recipe.category}</span>
          </div>
        ))}
      </div>
      <div className={styles.pagination}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {cuisineData.totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === cuisineData.totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { apiHandler, Recipe, Category, Cuisine } from '@/services/apiHandler';
import styles from './page.module.scss';
import { FaUndo, FaHeart, FaTimes } from 'react-icons/fa';

export default function ExplorePage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cuisines, setCuisines] = useState<Cuisine[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Set<number>>(new Set());
  const [selectedCuisines, setSelectedCuisines] = useState<Set<number>>(new Set());
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number | null>(null);

  useEffect(() => {
    fetchCategories();
    fetchCuisines();
  }, []);

  useEffect(() => {
    fetchRecipes();
  }, [selectedCategories, selectedCuisines]);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const categoryIds = Array.from(selectedCategories);
      const cuisineIds = Array.from(selectedCuisines);
      const fetchedRecipes = await apiHandler.getRecipes(categoryIds, cuisineIds);
      setRecipes(fetchedRecipes);
      setCurrentIndex(0);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const fetchedCategories = await apiHandler.getCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchCuisines = async () => {
    try {
      const cuisines = await apiHandler.getCuisines();
      setCuisines(cuisines);
    } catch (error) {
      console.error('Error fetching cuisines:', error);
    }
  };

  const toggleCategory = (categoryId: number) => {
    setSelectedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const toggleCuisine = (cuisineId: number) => {
    setSelectedCuisines(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cuisineId)) {
        newSet.delete(cuisineId);
      } else {
        newSet.add(cuisineId);
      }
      return newSet;
    });
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    setSwipeDirection(direction);
    setTimeout(() => {
      if (direction === 'right' && recipes[currentIndex]) {
        router.push(`/recipe/${recipes[currentIndex].id}`);
      } else {
        setCurrentIndex(prevIndex => prevIndex + 1);
      }
      setSwipeDirection(null);
    }, 300);
  };

  const handleRewind = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prevIndex => prevIndex - 1);
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    startXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!startXRef.current || !cardRef.current) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startXRef.current;
    cardRef.current.style.transform = `translateX(${diff}px) rotate(${diff * 0.1}deg)`;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!startXRef.current || !cardRef.current) return;
    const endX = e.changedTouches[0].clientX;
    const diff = endX - startXRef.current;
    if (Math.abs(diff) > 100) {
      handleSwipe(diff > 0 ? 'right' : 'left');
    } else {
      cardRef.current.style.transform = '';
    }
    startXRef.current = null;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    startXRef.current = e.clientX;
  };

  const currentRecipe = recipes[currentIndex];

  return (
    <div className={styles.explorePage}>
      <div className={styles.filters}>
        <div className={styles.pills}>
          <h3>Categories</h3>
          {categories.map(category => (
            <button
              key={category.id}
              className={selectedCategories.has(category.id) ? styles.active : ''}
              onClick={() => toggleCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
        <div className={styles.pills}>
          <h3>Cuisines</h3>
          {cuisines.map(cuisine => (
            <button
              key={cuisine.id}
              className={selectedCuisines.has(cuisine.id) ? styles.active : ''}
              onClick={() => toggleCuisine(cuisine.id)}
            >
              {cuisine.name}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.recipeCard} ref={cardRef}>
        {loading ? (
          <div>Loading...</div>
        ) : currentRecipe ? (
          <>
            <img src={currentRecipe.img} alt={currentRecipe.name} />
            <h2>{currentRecipe.name}</h2>
            <p>{currentRecipe.description}</p>
          </>
        ) : (
          <div>No more recipes to explore. Try changing your filters!</div>
        )}
      </div>
      <div className={styles.swipeButtons}>
        <button onClick={() => handleSwipe('left')} className={styles.nopeButton} disabled={!currentRecipe}>
          <FaTimes /> Nope
        </button>
        <button onClick={handleRewind} disabled={currentIndex === 0} className={styles.rewindButton}>
          <FaUndo /> Rewind
        </button>
        <button onClick={() => handleSwipe('right')} className={styles.likeButton} disabled={!currentRecipe}>
          <FaHeart /> Like
        </button>
      </div>
    </div>
  );
}

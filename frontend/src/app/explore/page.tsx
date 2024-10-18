'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { apiHandler, Recipe } from '@/services/apiHandler';
import styles from './page.module.scss';
import { FaUndo, FaHeart, FaTimes } from 'react-icons/fa';

export default function ExplorePage() {
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const [previousRecipe, setPreviousRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number | null>(null);

  useEffect(() => {
    fetchRandomRecipe();
  }, []);

  const fetchRandomRecipe = async () => {
    setLoading(true);
    try {
      const randomRecipe = await apiHandler.getRandomRecipe();
      setPreviousRecipe(currentRecipe);
      setCurrentRecipe(randomRecipe);
    } catch (error) {
      console.error('Error fetching random recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    setSwipeDirection(direction);
    setTimeout(() => {
      if (direction === 'right' && currentRecipe) {
        router.push(`/receipe/${currentRecipe.id}`);
      } else {
        fetchRandomRecipe();
      }
      setSwipeDirection(null);
    }, 300);
  };

  const handleRewind = () => {
    if (previousRecipe) {
      setCurrentRecipe(previousRecipe);
      setPreviousRecipe(null);
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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!startXRef.current || !cardRef.current) return;
    const currentX = e.clientX;
    const diff = currentX - startXRef.current;
    cardRef.current.style.transform = `translateX(${diff}px) rotate(${diff * 0.1}deg)`;
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!startXRef.current || !cardRef.current) return;
    const endX = e.clientX;
    const diff = endX - startXRef.current;
    if (Math.abs(diff) > 100) {
      handleSwipe(diff > 0 ? 'right' : 'left');
    } else {
      cardRef.current.style.transform = '';
    }
    startXRef.current = null;
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.explorePage}>
      <h1>Explore Recipes</h1>
      {currentRecipe && (
        <div
          ref={cardRef}
          className={`${styles.recipeCard} ${swipeDirection ? styles[swipeDirection] : ''}`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <img src={currentRecipe.img} alt={currentRecipe.name} />
          <h2>{currentRecipe.name}</h2>
          <p>{currentRecipe.description}</p>
        </div>
      )}
      <div className={styles.swipeButtons}>
        <button onClick={() => handleSwipe('left')} className={styles.nopeButton}>
          <FaTimes /> Nope
        </button>
        <button onClick={handleRewind} disabled={!previousRecipe} className={styles.rewindButton}>
          <FaUndo /> Rewind
        </button>
        <button onClick={() => handleSwipe('right')} className={styles.likeButton}>
          <FaHeart /> Like
        </button>
      </div>
    </div>
  );
}

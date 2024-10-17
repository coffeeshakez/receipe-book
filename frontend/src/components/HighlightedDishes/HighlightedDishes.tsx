import React from 'react';
import styles from './HighlightedDishes.module.scss';
import { Recipe } from '@/services/apiHandler';
import { BookCarousel } from '@/components/BookCarousel/BookCarousel';

type HighlightedDishesProps = {
  dishes: Recipe[];
};

export const HighlightedDishes: React.FC<HighlightedDishesProps> = ({ dishes }) => {
  return (
    <div className={styles.highlightedDishes}>
      <h2 className={styles.sectionTitle}>Today's Highlighted Dishes</h2>
      <div className={styles.carouselWrapper}>
        <BookCarousel dishes={dishes} />
      </div>
    </div>
  );
};

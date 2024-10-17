import React from 'react';
import Link from 'next/link';
import styles from './HighlightedDishes.module.scss';
import { Recipe } from '@/services/apiHandler';

type HighlightedDishesProps = {
  dishes: Recipe[];
};

export const HighlightedDishes: React.FC<HighlightedDishesProps> = ({ dishes }) => {
  return (
    <div className={styles.highlightedDishes}>
      {dishes.map((dish) => (
        <Link href={`/receipe/${dish.id}`} key={dish.id} className={styles.dishCard}>
          <img src={dish.image} alt={dish.name} className={styles.dishImage} />
          <h3 className={styles.dishName}>{dish.name}</h3>
          <p className={styles.dishDescription}>{dish.description}</p>
        </Link>
      ))}
    </div>
  );
};

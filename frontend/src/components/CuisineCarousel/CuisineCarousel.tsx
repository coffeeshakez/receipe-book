import React from 'react';
import Link from 'next/link';
import styles from './CuisineCarousel.module.scss';

const cuisines = [
  { name: 'Italian', image: '/images/italian.jpg' },
  { name: 'Japanese', image: '/images/japanese.jpg' },
  { name: 'Mexican', image: '/images/mexican.jpg' },
  { name: 'Indian', image: '/images/indian.jpg' },
  { name: 'French', image: '/images/french.jpg' },
];

export const CuisineCarousel: React.FC = () => {
  return (
    <div className={styles.cuisineCarousel}>
      {cuisines.map((cuisine) => (
        <Link href={`/cuisine/${cuisine.name.toLowerCase()}`} key={cuisine.name} className={styles.cuisineCard}>
          <img src={cuisine.image} alt={cuisine.name} className={styles.cuisineImage} />
          <h3 className={styles.cuisineName}>{cuisine.name}</h3>
        </Link>
      ))}
    </div>
  );
};

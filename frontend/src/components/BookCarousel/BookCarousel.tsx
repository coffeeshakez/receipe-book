import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import styles from './BookCarousel.module.scss';
import { Recipe } from '@/services/apiHandler';

type BookCarouselProps = {
  dishes: Recipe[];
};

export const BookCarousel: React.FC<BookCarouselProps> = ({ dishes }) => {
  if (!dishes || dishes.length === 0) {
    return <div>No dishes available</div>;
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const getVisibleItems = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth <= 480) return 1.1;
      if (window.innerWidth <= 768) return 1.5;
      if (window.innerWidth <= 1024) return 2.5;
      return 3.5;
    }
    return 3.5; // Default for server-side rendering
  };

  const [visibleItems, setVisibleItems] = useState(getVisibleItems());

  useEffect(() => {
    const handleResize = () => {
      setVisibleItems(getVisibleItems());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollToIndex = (index: number) => {
    if (carouselRef.current) {
      const slideWidth = carouselRef.current.offsetWidth / visibleItems;
      carouselRef.current.scrollTo({
        left: index * slideWidth,
        behavior: 'smooth'
      });
      setCurrentIndex(index);
    }
  };

  const nextSlide = () => {
    const nextIndex = (currentIndex + 1) % dishes.length;
    scrollToIndex(nextIndex);
  };

  const prevSlide = () => {
    const prevIndex = (currentIndex - 1 + dishes.length) % dishes.length;
    scrollToIndex(prevIndex);
  };

  const handleScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
      
      const slideWidth = clientWidth / visibleItems;
      const newIndex = Math.round(scrollLeft / slideWidth);
      setCurrentIndex(newIndex);
    }
  };

  useEffect(() => {
    const currentCarousel = carouselRef.current;
    if (currentCarousel) {
      currentCarousel.addEventListener('scroll', handleScroll);
      return () => currentCarousel.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <div className={styles.carousel}>
      <button className={`${styles.arrow} ${styles.leftArrow}`} onClick={prevSlide}>
        &#8249;
      </button>
      <div className={styles.slideContainer} ref={carouselRef}>
        {dishes.map((dish, index) => (
          <Link href={`/recipe/${dish.id}`} key={dish.id} className={styles.slide}>
            <div className={styles.card}>
              <div className={styles.dishImageContainer}>
                <img src={'burger.jpg'} alt={dish.name} className={styles.dishImage} />
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.dishName}>{dish.name}</h3>
                <p className={styles.dishDescription}>{dish.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <button className={`${styles.arrow} ${styles.rightArrow}`} onClick={nextSlide}>
        &#8250;
      </button>
      <div className={styles.dots}>
        {dishes.map((_, index) => (
          <span
            key={index}
            className={`${styles.dot} ${index === currentIndex ? styles.activeDot : ''}`}
            onClick={() => scrollToIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

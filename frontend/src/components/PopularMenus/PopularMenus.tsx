import React from 'react';
import Link from 'next/link';
import styles from './PopularMenus.module.scss';
import { Menu } from '@/services/apiHandler';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils, faList, faClock } from '@fortawesome/free-solid-svg-icons';

type MenusProps = {
  menus: Menu[];
};

const colorSchemes = [
  'blue',
  'green',
  'purple',
  'orange',
  'pink',
  'teal',
];

export const PopularMenus: React.FC<MenusProps> = ({ menus }) => {
  return (
    <div className={styles.menuList}>
      {menus.map((menu) => {
        const randomColorScheme = colorSchemes[Math.floor(Math.random() * colorSchemes.length)];
        const recipeCount = menu.recipeIds.length;
        return (
          <Link href={`/menu/${menu.id}`} key={menu.id} className={`${styles.menuCard} ${styles[randomColorScheme]}`}>
            <div className={styles.menuHeader}>
              <FontAwesomeIcon icon={faUtensils} className={styles.menuIcon} />
              <h3 className={styles.menuName}>{menu.name}</h3>
            </div>
            <div className={styles.menuContent}>
              <p className={styles.menuDescription}>
                {menu.description || "A delightful collection of recipes"}
              </p>
              <div className={styles.menuInfo}>
                <span className={styles.recipeCount}>
                  <FontAwesomeIcon icon={faList} className={styles.infoIcon} />
                  {recipeCount} {recipeCount === 1 ? 'recipe' : 'recipes'}
                </span>
                <span className={styles.estimatedTime}>
                  <FontAwesomeIcon icon={faClock} className={styles.infoIcon} />
                  {recipeCount * 30} mins
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

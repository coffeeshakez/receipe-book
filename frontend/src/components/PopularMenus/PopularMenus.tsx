import React from 'react';
import Link from 'next/link';
import styles from './PopularMenus.module.scss';
import { Menu } from '@/services/apiHandler';

type PopularMenusProps = {
  menus: Menu[];
};

export const PopularMenus: React.FC<PopularMenusProps> = ({ menus }) => {
  return (
    <div className={styles.popularMenus}>
      {menus.map((menu) => (
        <Link href={`/menu/${menu.id}`} key={menu.id} className={styles.menuCard}>
          <h3 className={styles.menuName}>{menu.name}</h3>
          <p className={styles.menuDescription}>{menu.description}</p>
          <span className={styles.recipeCount}>{menu.recipeIds.length} recipes</span>
        </Link>
      ))}
    </div>
  );
};

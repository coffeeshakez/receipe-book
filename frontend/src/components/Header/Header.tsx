'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from './Header.module.scss';
import { apiHandler, Menu, GroceryList } from '@/services/apiHandler';
import { FaHome, FaBars, FaTimes } from 'react-icons/fa';

const Header: React.FC = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [groceryLists, setGroceryLists] = useState<GroceryList[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedMenus, fetchedLists] = await Promise.all([
          apiHandler.getMenus(),
          apiHandler.getGroceryLists()
        ]);
        setMenus(fetchedMenus);
        setGroceryLists(fetchedLists);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleGroceryListSelect = (listId: number) => {
    router.push(`/grocery-list/${listId}`);
  };

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>
          <FaHome size={24} />
        </Link>
        <button className={styles.menuToggle} onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
        <ul className={`${styles.navLinks} ${isMenuOpen ? styles.open : ''}`}>
          <li className={styles.dropdown}>
            <span className={styles.dropdownToggle}>Shopping Lists</span>
            <ul className={styles.dropdownMenu}>
              {groceryLists.length === 0 ? (
                <li className={styles.dropdownItem}>No lists yet</li>
              ) : (
                groceryLists.map(list => (
                  <li key={list.id} className={styles.dropdownItem}>
                    <button onClick={() => handleGroceryListSelect(list.id)}>
                      List {list.id} ({list.items.length} items)
                      <span className={styles.listDate}>
                        {new Date(list.createdAt).toLocaleDateString()}
                      </span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </li>
          <li>
            <Link href="/recipes">All Food</Link>
          </li>
          <li className={styles.dropdown}>
            <span className={styles.dropdownToggle}>Menus</span>
            <ul className={styles.dropdownMenu}>
              {menus.map(menu => (
                <li key={menu.id}>
                  <Link href={`/menu/${menu.id}`}>{menu.name}</Link>
                </li>
              ))}
            </ul>
          </li>
          <li>
            <Link href="/explore">Explore</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;

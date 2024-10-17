'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Header.module.scss';
import { apiHandler, Menu } from '@/services/apiHandler';
import { FaHome, FaBars, FaTimes } from 'react-icons/fa';

const Header: React.FC = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const fetchedMenus = await apiHandler.getMenus();
        setMenus(fetchedMenus);
      } catch (error) {
        console.error('Error fetching menus:', error);
      }
    };

    fetchMenus();
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const pathSegments = pathname?.split('/').filter(segment => segment !== '') || [];

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
          <li>
            <Link href="/grocery-list">Shopping List</Link>
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
        </ul>
      </nav>
      <div className={styles.breadcrumbs}>
        <Link href="/">Home</Link>
        {pathSegments.map((segment, index) => (
          <React.Fragment key={index}>
            <span> / </span>
            <Link href={`/${pathSegments.slice(0, index + 1).join('/')}`}>
              {segment}
            </Link>
          </React.Fragment>
        ))}
      </div>
    </header>
  );
};

export default Header;

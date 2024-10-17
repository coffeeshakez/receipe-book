'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Header.module.scss';  // Changed back to .scss
import { apiHandler, Menu } from '@/services/apiHandler';

const Header: React.FC = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const pathSegments = pathname?.split('/').filter(segment => segment !== '') || [];

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>
          Recipe App
        </Link>
        <ul className={styles.navLinks}>
          <li>
            <Link href="/grocery-list">Shopping List</Link>
          </li>
          <li>
            <Link href="/recipes">All Food</Link>
          </li>
          <li className={styles.dropdown}>
            <button onClick={toggleDropdown} className={styles.dropdownToggle}>
              Menus
            </button>
            {isDropdownOpen && (
              <ul className={styles.dropdownMenu}>
                {menus.map(menu => (
                  <li key={menu.id}>
                    <Link href={`/menu/${menu.id}`}>{menu.name}</Link>
                  </li>
                ))}
              </ul>
            )}
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

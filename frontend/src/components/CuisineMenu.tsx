import React, { useState, useEffect } from 'react';
import { Recipe, Menu } from '@/types/Recipe';
import { apiHandler } from '@/services/apiHandler';
import styles from '@/styles/CuisineMenu.module.css';

interface CuisineMenuProps {
    onMenuSelect: (recipes: Recipe[]) => void;
}

export const CuisineMenu: React.FC<CuisineMenuProps> = ({ onMenuSelect }) => {
    const [menus, setMenus] = useState<Menu[]>([]);
    const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchMenus();
    }, []);

    const fetchMenus = async () => {
        const fetchedMenus = await apiHandler.getMenus();
        setMenus(fetchedMenus);
    };

    const handleMenuSelect = async (menu: Menu) => {
        setSelectedMenu(menu);
        setIsLoading(true);
        try {
            const menuDetails = await apiHandler.getMenu(menu.id);
            const recipes = await Promise.all(menuDetails.recipeIds.map(id => apiHandler.getRecipe(id)));
            onMenuSelect(recipes);
        } catch (err) {
            console.error('Error fetching menu:', err);
            onMenuSelect([]);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <>
            <div className={`${styles.cuisineMenuContainer} ${isMenuOpen ? styles.open : ''}`}>
                <div className={styles.sideMenu}>
                    <h2>Menus</h2>
                    <ul>
                        {menus.map((menu) => (
                            <li
                                key={menu.id}
                                onClick={() => handleMenuSelect(menu)}
                                className={selectedMenu?.id === menu.id ? styles.selected : ''}
                            >
                                {menu.name}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <button className={styles.floatingButton} onClick={toggleMenu}>
                {isMenuOpen ? 'Close' : 'Menus'}
            </button>
        </>
    );
};

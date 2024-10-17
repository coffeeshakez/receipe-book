import React, { useState } from 'react';
import { Menu } from '@/components/Menu/Menu';
import { Recipe } from '@/types/Recipe';
import { getMenuByCuisine } from '@/services/api';
import styles from '@/styles/CuisineMenu.module.css';

const cuisines = ['Italian', 'Indian', 'Chinese', 'Japanese', 'Greek', 'Russian', 'French'];

export const CuisineMenu: React.FC = () => {
    const [selectedCuisine, setSelectedCuisine] = useState<string>('');
    const [menu, setMenu] = useState<Recipe[]>([]);
    const [error, setError] = useState<string>('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleCuisineSelect = async (cuisine: string) => {
        setSelectedCuisine(cuisine);
        setIsLoading(true);
        setError('');
        try {
            const data = await getMenuByCuisine(cuisine);
            setMenu(data);
        } catch (err) {
            console.error('Error fetching menu:', err);
            setError(`Failed to fetch menu: ${err.message}`);
            setMenu([]);
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
                    <h2>Cuisines</h2>
                    <ul>
                        {cuisines.map((cuisine) => (
                            <li
                                key={cuisine}
                                onClick={() => handleCuisineSelect(cuisine)}
                                className={selectedCuisine === cuisine ? styles.selected : ''}
                            >
                                {cuisine}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className={styles.mainContent}>
                    {isLoading && <p>Loading...</p>}
                    {error && <p className={styles.error}>{error}</p>}
                    {!isLoading && menu.length > 0 && (
                        <div>
                            <h2>Suggested Menu for {selectedCuisine} Cuisine</h2>
                            <Menu
                                menuSections={[
                                    {
                                        heading: 'Menu',
                                        menuItems: menu.map((recipe) => ({
                                            link: `/receipe/${recipe.id}`,
                                            name: recipe.name,
                                            description: recipe.description,
                                        })),
                                    },
                                ]}
                            />
                        </div>
                    )}
                    {!isLoading && menu.length === 0 && !error && (
                        <p>No menu items found for this cuisine.</p>
                    )}
                </div>
            </div>
            <button className={styles.floatingButton} onClick={toggleMenu}>
                {isMenuOpen ? 'Close' : 'Cuisines'}
            </button>
        </>
    );
};

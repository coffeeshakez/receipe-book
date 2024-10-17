import React, { useState, useEffect } from 'react';
import { Recipe } from '@/types/Recipe';
import { apiHandler } from '@/services/apiHandler';
import styles from './CreateMenu.module.css';

const CreateMenu: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipes, setSelectedRecipes] = useState<number[]>([]);
  const [menuName, setMenuName] = useState('');

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const fetchedRecipes = await apiHandler.getRecipes();
        setRecipes(fetchedRecipes);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    fetchRecipes();
  }, []);

  const handleRecipeToggle = (recipeId: number) => {
    setSelectedRecipes(prevSelected =>
      prevSelected.includes(recipeId)
        ? prevSelected.filter(id => id !== recipeId)
        : [...prevSelected, recipeId]
    );
  };

  const handleCreateMenu = async () => {
    if (menuName.trim() === '') {
      alert('Please enter a menu name.');
      return;
    }

    if (selectedRecipes.length === 0) {
      alert('Please select at least one recipe for the menu.');
      return;
    }

    try {
      await apiHandler.createMenu({ name: menuName, recipeIds: selectedRecipes });
      alert('Menu created successfully!');
      setMenuName('');
      setSelectedRecipes([]);
    } catch (error) {
      console.error('Error creating menu:', error);
      alert('Failed to create menu. Please try again.');
    }
  };

  const groupedRecipes = recipes.reduce((acc, recipe) => {
    if (!acc[recipe.category]) {
      acc[recipe.category] = [];
    }
    acc[recipe.category].push(recipe);
    return acc;
  }, {} as Record<string, Recipe[]>);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create a New Menu</h1>
      <div className={styles.inputGroup}>
        <label htmlFor="menuName">Menu Name:</label>
        <input
          type="text"
          id="menuName"
          value={menuName}
          onChange={(e) => setMenuName(e.target.value)}
          className={styles.input}
        />
      </div>
      <div className={styles.recipeList}>
        {Object.entries(groupedRecipes).map(([category, categoryRecipes]) => (
          <div key={category} className={styles.categoryGroup}>
            <h2 className={styles.categoryTitle}>{category}</h2>
            {categoryRecipes.map(recipe => (
              <div key={recipe.id} className={styles.recipeItem}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={selectedRecipes.includes(recipe.id)}
                    onChange={() => handleRecipeToggle(recipe.id)}
                    className={styles.checkbox}
                  />
                  <span className={styles.recipeName}>{recipe.name}</span>
                  <span className={styles.cuisineLabel}>{recipe.cuisine}</span>
                </label>
              </div>
            ))}
          </div>
        ))}
      </div>
      <button onClick={handleCreateMenu} className={styles.createButton}>Create Menu</button>
    </div>
  );
};

export default CreateMenu;

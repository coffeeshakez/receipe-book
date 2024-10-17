import React, { useState, useEffect } from 'react';
import { apiHandler, Recipe } from '@/services/apiHandler';
import styles from './CreateMenu.module.css';

export const CreateMenu: React.FC = () => {
  const [menuName, setMenuName] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipes, setSelectedRecipes] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const fetchedRecipes = await apiHandler.getRecipes();
        setRecipes(fetchedRecipes);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        setError('Failed to fetch recipes. Please try again.');
      }
    };
    fetchRecipes();
  }, []);

  const handleCreateMenu = async () => {
    try {
      setError(null);
      setSuccess(null);
      if (!menuName.trim()) {
        setError('Please enter a menu name.');
        return;
      }
      if (selectedRecipes.length === 0) {
        setError('Please select at least one recipe.');
        return;
      }
      console.log('Creating menu:', menuName);
      const createdMenu = await apiHandler.createMenu({ name: menuName });
      console.log('Menu created:', createdMenu);
      
      await apiHandler.updateMenu(createdMenu.id, { name: menuName, recipeIds: selectedRecipes });
      console.log('Menu updated with recipes');
      
      setSuccess('Menu created successfully!');
      setMenuName('');
      setSelectedRecipes([]);
    } catch (error) {
      console.error('Error creating menu:', error);
      setError('Failed to create menu. Please try again.');
    }
  };

  const handleRecipeToggle = (recipeId: number) => {
    setSelectedRecipes(prev => 
      prev.includes(recipeId) 
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId]
    );
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
      <h2 className={styles.title}>Create New Menu</h2>
      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}
      <div className={styles.inputGroup}>
        <label htmlFor="menuName">Menu Name:</label>
        <input
          id="menuName"
          type="text"
          value={menuName}
          onChange={(e) => setMenuName(e.target.value)}
          placeholder="Enter menu name"
          className={styles.input}
        />
      </div>
      <h3 className={styles.subtitle}>Select Recipes:</h3>
      <div className={styles.recipeList}>
        {Object.entries(groupedRecipes).map(([category, categoryRecipes]) => (
          <div key={category} className={styles.categoryGroup}>
            <h4 className={styles.categoryTitle}>{category}</h4>
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
                </label>
              </div>
            ))}
          </div>
        ))}
      </div>
      <button onClick={handleCreateMenu} className={styles.button}>Create Menu</button>
    </div>
  );
};

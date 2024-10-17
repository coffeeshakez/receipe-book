import React, { useState, useEffect } from 'react';
import styles from './RecipeModal.module.scss';
import { Recipe, apiHandler } from '@/services/apiHandler';
import Link from 'next/link';

interface RecipeModalProps {
  recipe: Recipe;
  onClose: () => void;
}

const RecipeModal: React.FC<RecipeModalProps> = ({ recipe, onClose }) => {
  const [existingListId, setExistingListId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedListId = localStorage.getItem('currentGroceryListId');
    if (storedListId) {
      setExistingListId(parseInt(storedListId));
    }
  }, []);

  const handleAddToNewList = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const newList = await apiHandler.createGroceryList(recipe.id);
      localStorage.setItem('currentGroceryListId', newList.id.toString());
      onClose();
    } catch (error) {
      console.error('Failed to create new grocery list:', error);
      setError('Failed to create new grocery list. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToExistingList = async () => {
    if (!existingListId) return;
    setIsLoading(true);
    setError(null);
    try {
      await apiHandler.addRecipeToGroceryList(existingListId, recipe.id);
      onClose();
    } catch (error) {
      console.error('Failed to add recipe to existing grocery list:', error);
      setError('Failed to add recipe to existing list. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className={styles.modal}>Loading...</div>;
  }

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2 className={styles.title}>{recipe.name}</h2>
        <p className={styles.description}>{recipe.description}</p>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.buttonContainer}>
          {existingListId ? (
            <>
              <button 
                className={`${styles.button} ${styles.primaryButton}`} 
                onClick={handleAddToExistingList}
              >
                Add to Existing List
              </button>
              <Link href={`/grocery-list/${existingListId}`} className={styles.link}>
                Go to Existing List
              </Link>
            </>
          ) : (
            <button 
              className={`${styles.button} ${styles.primaryButton}`} 
              onClick={handleAddToNewList}
            >
              Create New List
            </button>
          )}
          <button 
            className={`${styles.button} ${styles.secondaryButton}`} 
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;

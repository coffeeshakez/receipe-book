import React from 'react';
import styles from '../app/grocery-list/[id]/page.module.scss';
import { Recipe } from '@/services/apiHandler';

interface RecipeModalProps {
  recipes: Recipe[];
  onSelect: (recipeId: number) => void;
  onClose: () => void;
}

const RecipeModal: React.FC<RecipeModalProps> = ({ recipes, onSelect, onClose }) => {
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>Select a Recipe</h2>
        <ul>
          {recipes.map(recipe => (
            <li key={recipe.id} onClick={() => onSelect(recipe.id)}>
              {recipe.name}
            </li>
          ))}
        </ul>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default RecipeModal;

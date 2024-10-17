'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Recipe, apiHandler } from '@/services/apiHandler';
import RecipeModal from '@/components/RecipeModal';
import styles from './page.module.scss';

export default function RecipePage() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [showModal, setShowModal] = useState(false);
  const params = useParams();
  const recipeId = parseInt(params.id as string);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const fetchedRecipe = await apiHandler.getRecipe(recipeId);
        setRecipe(fetchedRecipe);
      } catch (error) {
        console.error('Error fetching recipe:', error);
      }
    };

    fetchRecipe();
  }, [recipeId]);

  if (!recipe) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h1>{recipe.name}</h1>
      <img src={recipe.img} alt={recipe.name} className={styles.recipeImage} />
      <p>{recipe.description}</p>
      <button onClick={() => setShowModal(true)}>Add to Grocery List</button>
      {showModal && (
        <RecipeModal
          recipe={recipe}
          onClose={() => setShowModal(false)}
        />
      )}
      {/* Rest of the recipe details */}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import styles from '../page.module.scss';
import { apiHandler, Recipe } from '@/services/apiHandler';
import { Button } from '@/components/Button/Button';
import { TextWithIcon } from '@/components/TextWithIcon/TextWithIcon';
import { Expand } from '@/components/Expand/Expand';
import { useParams } from 'next/navigation';
import RecipeModal from '@/components/RecipeModal';

export default function Recipe() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const fetchedRecipe = await apiHandler.getRecipe(parseInt(id));
        setRecipe(fetchedRecipe);
      } catch (err) {
        setError('Error fetching recipe. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleCreateGroceryList = () => {
    setShowModal(true);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!recipe) return <div>No recipe found</div>;

  return (
    <>
      <div>
        <img className={styles.headerImage} src={recipe.img} alt={recipe.name} />
      </div>
      <div className={styles.splitContainer}>
        <div className={styles.ingredientsSection}>
          <h1 className={`${styles.header} ${styles.center} ${styles.underline}`}>{recipe.name}</h1>
          <div className={styles.flexContainer}>
            <h2 className={styles.subHeader}>Ingredients</h2>
            <Button onClick={handleCreateGroceryList}>Lag handleliste</Button>
          </div>

          <ul>
            {recipe.ingredients.map(ingredient => (
              <li key={ingredient.name}>
                <TextWithIcon iconName={ingredient.name}>
                  {ingredient.quantity} {ingredient.measurement} {ingredient.name}
                </TextWithIcon>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.section}>
          <h1 className={styles.header}>Instructions</h1>

          <ul>
            {recipe.instructions.map((instruction, index) => (
              <li key={instruction.instructionText} className={styles.instructionListItem}>
                <div>
                  <Expand summary={`ingredienser for steg ${index + 1}`}>
                    {instruction.ingredients.map(ingredient => (
                      <TextWithIcon key={ingredient.name} iconName={ingredient.name}>
                        {ingredient.quantity} {ingredient.measurement} {ingredient.name}
                      </TextWithIcon>
                    ))}
                  </Expand>
                </div>
                {index + 1}. {instruction.instructionText}
                <div></div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {showModal && (
        <RecipeModal
          recipe={recipe}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

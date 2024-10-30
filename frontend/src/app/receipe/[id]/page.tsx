'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.scss';
import { apiHandler } from '@/services/apiHandler';
import type { Recipe as RecipeType, GroceryList } from '@/services/apiHandler';
import { Button } from '@/components/Button/Button';
import { TextWithIcon } from '@/components/TextWithIcon/TextWithIcon';
import { Expand } from '@/components/Expand/Expand';
import { useParams, useRouter } from 'next/navigation';

export default function RecipePage() {
  const [recipe, setRecipe] = useState<RecipeType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [groceryLists, setGroceryLists] = useState<GroceryList[]>([]);
  const [showListOptions, setShowListOptions] = useState(false);
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedRecipe, fetchedLists] = await Promise.all([
          apiHandler.getRecipe(parseInt(id)),
          apiHandler.getGroceryLists()
        ]);
        setRecipe(fetchedRecipe);
        setGroceryLists(fetchedLists);
      } catch (err) {
        setError('Error fetching data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleCreateNewList = async () => {
    try {
      const newList = await apiHandler.createGroceryListFromRecipe(parseInt(id));
      router.push(`/grocery-list/${newList.id}`);
    } catch (error) {
      console.error('Error creating grocery list:', error);
      setError('Failed to create grocery list');
    }
  };

  const handleAddToExistingList = async (listId: number) => {
    try {
      await apiHandler.addRecipeToGroceryList(listId, parseInt(id));
      router.push(`/grocery-list/${listId}`);
    } catch (error) {
      console.error('Error adding to grocery list:', error);
      setError('Failed to add to grocery list');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!recipe) return <div>No recipe found</div>;

  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <img className={styles.headerImage} src={recipe.img} alt={recipe.name} />
      </div>
      <div className={styles.content}>
        <div className={styles.ingredientsSection}>
          <h1 className={styles.title}>{recipe.name}</h1>
          <div className={styles.flexContainer}>
            <h2 className={styles.subHeader}>Ingredients</h2>
            <div className={styles.groceryListActions}>
              {!showListOptions ? (
                <Button onClick={() => setShowListOptions(true)} className={styles.mainButton}>
                  Add to Grocery List
                </Button>
              ) : (
                <div className={styles.listOptions}>
                  <h3>Choose an option:</h3>
                  <Button onClick={handleCreateNewList} className={styles.optionButton}>
                    Create New List
                  </Button>
                  {groceryLists.length > 0 && (
                    <div className={styles.existingLists}>
                      <h4>Or add to existing list:</h4>
                      <ul className={styles.listGrid}>
                        {groceryLists.map(list => (
                          <li key={list.id} className={styles.listItem}>
                            <Button 
                              onClick={() => handleAddToExistingList(list.id)}
                              className={styles.listButton}
                            >
                              <span className={styles.listName}>List {list.id}</span>
                              <span className={styles.listInfo}>
                                {list.items.length} items
                                <br />
                                Created {new Date(list.createdAt).toLocaleDateString()}
                              </span>
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <Button 
                    onClick={() => setShowListOptions(false)} 
                    className={styles.cancelButton}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>

          <ul className={styles.ingredientsList}>
            {recipe.ingredients.map(ingredient => (
              <li key={ingredient.name} className={styles.ingredientItem}>
                <TextWithIcon iconName={ingredient.name}>
                  {ingredient.quantity} {ingredient.measurement} {ingredient.name}
                </TextWithIcon>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.instructionsSection}>
          <h2 className={styles.subHeader}>Instructions</h2>
          <ul className={styles.instructionsList}>
            {recipe.instructions.map((instruction, index) => (
              <li key={instruction.instructionText} className={styles.instructionItem}>
                <div className={styles.instructionNumber}>{index + 1}.</div>
                <div className={styles.instructionContent}>
                  <p>{instruction.instructionText}</p>
                  {instruction.ingredients.length > 0 && (
                    <Expand summary={`Ingredients for step ${index + 1}`}>
                      <ul className={styles.stepIngredients}>
                        {instruction.ingredients.map(ingredient => (
                          <li key={ingredient.name}>
                            <TextWithIcon iconName={ingredient.name}>
                              {ingredient.quantity} {ingredient.measurement} {ingredient.name}
                            </TextWithIcon>
                          </li>
                        ))}
                      </ul>
                    </Expand>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

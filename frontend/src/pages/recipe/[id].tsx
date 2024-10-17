import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { apiHandler, Recipe } from '@/services/apiHandler';

const RecipePage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    if (id) {
      fetchRecipe(Number(id));
    }
  }, [id]);

  const fetchRecipe = async (recipeId: number) => {
    try {
      const data = await apiHandler.getRecipe(recipeId);
      setRecipe(data);
    } catch (error) {
      console.error('Error fetching recipe:', error);
    }
  };

  if (!recipe) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{recipe.name}</h1>
      <img src={recipe.img} alt={recipe.name} />
      <p>{recipe.description}</p>
      {/* Add more recipe details here */}
    </div>
  );
};

export default RecipePage;

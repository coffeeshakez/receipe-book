'use client';

import React, { useState, useEffect } from 'react';
import { apiHandler, Recipe, Cuisine, Category, Ingredient } from '@/services/apiHandler';
import styles from './page.module.scss';

export default function EditorPage() {
  const [recipe, setRecipe] = useState<Partial<Recipe>>({
    name: '',
    description: '',
    img: '',
    ingredients: [],
    instructions: [],
  });
  const [cuisines, setCuisines] = useState<Cuisine[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [existingIngredients, setExistingIngredients] = useState<Ingredient[]>([]);
  const [newIngredient, setNewIngredient] = useState({ name: '', category: '' });
  const [ingredientCategories, setIngredientCategories] = useState<string[]>([]);
  const [jsonInput, setJsonInput] = useState('');

  useEffect(() => {
    fetchCuisines();
    fetchCategories();
    fetchExistingIngredients();
    fetchIngredientCategories();
  }, []);

  const fetchCuisines = async () => {
    const fetchedCuisines = await apiHandler.getCuisines();
    setCuisines(fetchedCuisines);
  };

  const fetchCategories = async () => {
    const fetchedCategories = await apiHandler.getCategories();
    setCategories(fetchedCategories);
  };

  const fetchExistingIngredients = async () => {
    const fetchedIngredients = await apiHandler.getIngredients();
    setExistingIngredients(fetchedIngredients);
  };

  const fetchIngredientCategories = async () => {
    const fetchedCategories = await apiHandler.getIngredientCategories();
    setIngredientCategories(fetchedCategories);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setRecipe({ ...recipe, [e.target.name]: e.target.value });
  };

  const handleIngredientChange = (index: number, field: string, value: string) => {
    const updatedIngredients = [...recipe.ingredients];
    updatedIngredients[index] = { ...updatedIngredients[index], [field]: value };
    setRecipe({ ...recipe, ingredients: updatedIngredients });
  };

  const handleAddIngredient = () => {
    setRecipe({ ...recipe, ingredients: [...recipe.ingredients, { name: '', quantity: '', measurement: '' }] });
  };

  const handleRemoveIngredient = (index: number) => {
    const updatedIngredients = recipe.ingredients.filter((_, i) => i !== index);
    setRecipe({ ...recipe, ingredients: updatedIngredients });
  };

  const handleAddNewIngredient = async () => {
    try {
      const addedIngredient = await apiHandler.addIngredient(newIngredient);
      setExistingIngredients([...existingIngredients, addedIngredient]);
      setNewIngredient({ name: '', category: '' });
    } catch (error) {
      console.error('Failed to add new ingredient:', error);
    }
  };

  const handleJsonUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setJsonInput(event.target.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleJsonImport = () => {
    try {
      const importedRecipe = JSON.parse(jsonInput);
      setRecipe(importedRecipe);
    } catch (error) {
      console.error('Failed to parse JSON:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiHandler.addRecipe(recipe as Recipe);
      // Reset form or show success message
    } catch (error) {
      console.error('Failed to add recipe:', error);
    }
  };

  return (
    <div className={styles.editorPage}>
      <h1>Recipe Editor</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" value={recipe.name} onChange={handleInputChange} placeholder="Recipe Name" required />
        <textarea name="description" value={recipe.description} onChange={handleInputChange} placeholder="Description" required />
        <input type="text" name="img" value={recipe.img} onChange={handleInputChange} placeholder="Image URL" />
        
        <select name="category" value={recipe.category} onChange={handleInputChange} required>
          <option value="">Select Category</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
        
        <select name="cuisine" value={recipe.cuisine} onChange={handleInputChange} required>
          <option value="">Select Cuisine</option>
          {cuisines.map(cuisine => (
            <option key={cuisine.id} value={cuisine.id}>{cuisine.name}</option>
          ))}
        </select>
        
        <h2>Ingredients</h2>
        {recipe.ingredients.map((ingredient, index) => (
          <div key={index}>
            <select
              value={ingredient.name}
              onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
              required
            >
              <option value="">Select Ingredient</option>
              {existingIngredients.map(ing => (
                <option key={ing.id} value={ing.id}>{ing.name}</option>
              ))}
            </select>
            <input
              type="text"
              value={ingredient.quantity}
              onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
              placeholder="Quantity"
              required
            />
            <input
              type="text"
              value={ingredient.measurement}
              onChange={(e) => handleIngredientChange(index, 'measurement', e.target.value)}
              placeholder="Measurement"
              required
            />
            <button type="button" onClick={() => handleRemoveIngredient(index)}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={handleAddIngredient}>Add Ingredient</button>
        
        <h3>Add New Ingredient</h3>
        <input
          type="text"
          value={newIngredient.name}
          onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
          placeholder="New Ingredient Name"
        />
        <select
          value={newIngredient.category}
          onChange={(e) => setNewIngredient({ ...newIngredient, category: e.target.value })}
        >
          <option value="">Select Ingredient Category</option>
          {ingredientCategories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <button type="button" onClick={handleAddNewIngredient}>Add New Ingredient</button>
        
        <h2>Instructions</h2>
        {/* Add instruction fields here */}
        
        <h2>Import JSON</h2>
        <input type="file" accept=".json" onChange={handleJsonUpload} />
        <button type="button" onClick={handleJsonImport}>Import JSON</button>
        
        <button type="submit">Save Recipe</button>
      </form>
    </div>
  );
}

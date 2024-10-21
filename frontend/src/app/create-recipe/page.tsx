'use client';

import React, { useState } from 'react';
import { apiHandler, Recipe, Ingredient, Instruction } from '@/services/apiHandler';
import styles from './page.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';

export default function CreateRecipePage() {
  const [recipe, setRecipe] = useState<Partial<Recipe>>({
    name: '',
    img: '',
    description: '',
    category: '',
    cuisine: '',
    ingredients: [],
    instructions: [],
  });

  const [newIngredient, setNewIngredient] = useState<Ingredient>({ name: '', quantity: '', measurement: '' });
  const [newInstruction, setNewInstruction] = useState<Instruction>({ instructionText: '', ingredients: [] });
  const [message, setMessage] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setRecipe({ ...recipe, [e.target.name]: e.target.value });
  };

  const handleAddIngredient = () => {
    if (newIngredient.name && newIngredient.quantity && newIngredient.measurement) {
      setRecipe({
        ...recipe,
        ingredients: [...(recipe.ingredients || []), newIngredient],
      });
      setNewIngredient({ name: '', quantity: '', measurement: '' });
    }
  };

  const handleRemoveIngredient = (index: number) => {
    const updatedIngredients = recipe.ingredients?.filter((_, i) => i !== index);
    setRecipe({ ...recipe, ingredients: updatedIngredients });
  };

  const handleAddInstruction = () => {
    setRecipe({
      ...recipe,
      instructions: [...(recipe.instructions || []), { instructionText: '', ingredients: [] }],
    });
  };

  const handleInstructionTextChange = (index: number, text: string) => {
    const updatedInstructions = [...(recipe.instructions || [])];
    updatedInstructions[index].instructionText = text;
    setRecipe({ ...recipe, instructions: updatedInstructions });
  };

  const handleRemoveInstruction = (index: number) => {
    const updatedInstructions = recipe.instructions?.filter((_, i) => i !== index);
    setRecipe({ ...recipe, instructions: updatedInstructions });
  };

  const handleAddIngredientToInstruction = (instructionIndex: number, ingredientIndex: number) => {
    const updatedInstructions = [...(recipe.instructions || [])];
    const ingredientToAdd = recipe.ingredients?.[ingredientIndex];
    if (ingredientToAdd) {
      updatedInstructions[instructionIndex].ingredients.push(ingredientToAdd);
      setRecipe({ ...recipe, instructions: updatedInstructions });
    }
  };

  const handleRemoveIngredientFromInstruction = (instructionIndex: number, ingredientIndex: number) => {
    const updatedInstructions = [...(recipe.instructions || [])];
    updatedInstructions[instructionIndex].ingredients = updatedInstructions[instructionIndex].ingredients.filter((_, i) => i !== ingredientIndex);
    setRecipe({ ...recipe, instructions: updatedInstructions });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiHandler.addRecipe(recipe as Recipe);
      setMessage('Recipe submitted successfully!');
      setRecipe({
        name: '',
        img: '',
        description: '',
        category: '',
        cuisine: '',
        ingredients: [],
        instructions: [],
      });
    } catch (error) {
      console.error('Failed to submit recipe:', error);
      setMessage('Failed to submit recipe. Please try again.');
    }
  };

  return (
    <div className={styles.createRecipePage}>
      <h1>Create a New Recipe</h1>
      {message && <p className={styles.message}>{message}</p>}
      <form onSubmit={handleSubmit}>
        {/* Recipe Details */}
        <div className={styles.formSection}>
          <h2>Recipe Details</h2>
          <input
            type="text"
            name="name"
            value={recipe.name}
            onChange={handleInputChange}
            placeholder="Recipe Name"
            required
          />
          <textarea
            name="description"
            value={recipe.description}
            onChange={handleInputChange}
            placeholder="Description"
            required
          />
          <input
            type="text"
            name="img"
            value={recipe.img}
            onChange={handleInputChange}
            placeholder="Image URL"
          />
          <div className={styles.selectGroup}>
            <select name="category" value={recipe.category} onChange={handleInputChange} required>
              <option value="">Select Category</option>
              <option value="Dessert">Dessert</option>
              <option value="Starter">Starter</option>
              <option value="MainCourse">Main Course</option>
            </select>
            <select name="cuisine" value={recipe.cuisine} onChange={handleInputChange} required>
              <option value="">Select Cuisine</option>
              <option value="Turkish">Turkish</option>
              <option value="Italian">Italian</option>
              <option value="French">French</option>
            </select>
          </div>
        </div>

        {/* Ingredients Section */}
        <div className={styles.formSection}>
          <h2>Ingredients</h2>
          <div className={styles.ingredientForm}>
            <input
              type="text"
              placeholder="Name"
              value={newIngredient.name}
              onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Quantity"
              value={newIngredient.quantity}
              onChange={(e) => setNewIngredient({ ...newIngredient, quantity: e.target.value })}
            />
            <input
              type="text"
              placeholder="Measurement"
              value={newIngredient.measurement}
              onChange={(e) => setNewIngredient({ ...newIngredient, measurement: e.target.value })}
            />
            <button type="button" onClick={handleAddIngredient}>
              Add Ingredient
            </button>
          </div>
          <ul className={styles.ingredientList}>
            {recipe.ingredients?.map((ing, idx) => (
              <li key={idx}>
                {ing.quantity} {ing.measurement} {ing.name}
                <button type="button" onClick={() => handleRemoveIngredient(idx)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions Section */}
        <div className={styles.formSection}>
          <h2>Instructions</h2>
          <button type="button" className={styles.addInstructionButton} onClick={handleAddInstruction}>
            <FontAwesomeIcon icon={faPlus} /> Add Instruction
          </button>
          <ol className={styles.instructionList}>
            {recipe.instructions?.map((inst, instIdx) => (
              <li key={instIdx} className={styles.instructionItem}>
                <button
                  type="button"
                  className={styles.removeInstructionButton}
                  onClick={() => handleRemoveInstruction(instIdx)}
                  aria-label="Remove Instruction"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
                <div className={styles.instructionContent}>
                  <textarea
                    value={inst.instructionText}
                    onChange={(e) => handleInstructionTextChange(instIdx, e.target.value)}
                    placeholder={`Instruction ${instIdx + 1}`}
                    className={styles.instructionText}
                  />
                  <div className={styles.instructionIngredients}>
                    <h4>Ingredients for this step:</h4>
                    <select
                      onChange={(e) => handleAddIngredientToInstruction(instIdx, parseInt(e.target.value))}
                      value=""
                    >
                      <option value="" disabled>Add ingredient to this step</option>
                      {recipe.ingredients?.map((ing, idx) => (
                        <option key={idx} value={idx}>
                          {ing.name}
                        </option>
                      ))}
                    </select>
                    <ul>
                      {inst.ingredients.map((ing, ingIdx) => (
                        <li key={ingIdx}>
                          <span>{ing.quantity} {ing.measurement} {ing.name}</span>
                          <button type="button" onClick={() => handleRemoveIngredientFromInstruction(instIdx, ingIdx)}>
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Submit Button */}
        <button type="submit" className={styles.submitButton}>Submit Recipe</button>
      </form>
    </div>
  );
}

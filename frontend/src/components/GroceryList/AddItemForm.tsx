import { useState } from 'react';
import { UseMutateFunction } from '@tanstack/react-query';
import { IGroceryItem } from '@/services/apiHandler';
import styles from './AddItemForm.module.scss';

interface Props {
  onAdd: UseMutateFunction<IGroceryItem, Error, string, unknown>;
  isSubmitting?: boolean;
}

export const AddItemForm = ({ onAdd, isSubmitting }: Props) => {
  const [newItemName, setNewItemName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || isSubmitting) return;

    try {
      onAdd(newItemName);
      setNewItemName('');
    } catch (error) {
      console.error('Failed to add item:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="text"
        value={newItemName}
        onChange={(e) => setNewItemName(e.target.value)}
        placeholder="Add new item..."
        className={styles.input}
        disabled={isSubmitting}
        aria-label="New item name"
      />
      <button 
        type="submit"
        className={styles.button}
        disabled={!newItemName.trim() || isSubmitting}
      >
        {isSubmitting ? 'Adding...' : 'Add Item'}
      </button>
    </form>
  );
}; 
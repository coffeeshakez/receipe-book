import { useState } from 'react';
import styles from './AddItemForm.module.scss';

interface Props {
  onAdd: (name: string) => void;
  isSubmitting: boolean;
}

export const AddItemForm = ({ onAdd, isSubmitting }: Props) => {
  const [itemName, setItemName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (itemName.trim() && !isSubmitting) {
      onAdd(itemName.trim());
      setItemName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="text"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
        placeholder="Add new item..."
        disabled={isSubmitting}
        className={styles.input}
      />
      <button 
        type="submit" 
        disabled={!itemName.trim() || isSubmitting}
        className={styles.button}
      >
        {isSubmitting ? 'Adding...' : 'Add'}
      </button>
    </form>
  );
}; 
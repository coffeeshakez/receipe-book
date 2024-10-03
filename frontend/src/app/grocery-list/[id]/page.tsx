'use client';
import styles from './page.module.scss';
import { TextInputWithButton } from '@/components/TextInputWithButton/TextInputWithButton';
import { useEffect, useState, useRef } from 'react';
import { apiHandler, GroceryList, GroceryItem } from '@/api/apiHandler';
import { useParams } from 'next/navigation';

export default function GroceryListPage() {
  const [groceryList, setGroceryList] = useState<GroceryList | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [newItemId, setNewItemId] = useState<number | null>(null);
  const params = useParams();
  const listId = parseInt(params.id as string);

  useEffect(() => {
    const fetchGroceryList = async () => {
      try {
        const list = await apiHandler.getGroceryList(listId);
        setGroceryList(list);
      } catch (error) {
        console.error('Error fetching grocery list:', error);
        setError('Failed to fetch grocery list. Please try again.');
      }
    };

    fetchGroceryList();
  }, [listId]);

  const handleCheckItem = async (itemId: number, checked: boolean) => {
    if (!groceryList) return;

    const updatedItem = groceryList.items.find(item => item.id === itemId);
    if (!updatedItem) return;

    const itemToUpdate = {
      name: updatedItem.name,
      quantity: updatedItem.quantity,
      unit: updatedItem.unit,
      checked: checked
    };

    try {
      const updatedItemFromServer = await apiHandler.updateGroceryItem(listId, itemId, itemToUpdate);
      setGroceryList(prevList => {
        if (!prevList) return null;
        return {
          ...prevList,
          items: prevList.items.map(item => item.id === itemId ? updatedItemFromServer : item)
        };
      });
    } catch (error) {
      console.error('Error updating grocery item:', error);
      setError('Failed to update item. Please try again.');
    }
  };

  const handleAddItem = async () => {
    if (!groceryList || !newItemName.trim()) return;

    try {
      const newItem = await apiHandler.addGroceryItem(listId, {
        name: newItemName,
        quantity: '',
        unit: '',
        checked: false
      });
      setGroceryList(prevList => {
        if (!prevList) return null;
        return {
          ...prevList,
          items: [...prevList.items, newItem]
        };
      });
      setNewItemName('');
      setNewItemId(newItem.id);
      setTimeout(() => setNewItemId(null), 800); // Reset after animation duration
    } catch (error) {
      console.error('Error adding grocery item:', error);
      setError('Failed to add item. Please try again.');
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    if (!groceryList) return;

    try {
      await apiHandler.removeGroceryItem(listId, itemId);
      setGroceryList(prevList => {
        if (!prevList) return null;
        return {
          ...prevList,
          items: prevList.items.filter(item => item.id !== itemId)
        };
      });
    } catch (error) {
      console.error('Error removing grocery item:', error);
      setError('Failed to remove item. Please try again.');
    }
  };

  const renderGroceryItem = (item: GroceryItem) => (
    <div key={item.id} className={`${styles.item} ${item.id === newItemId ? styles.newItem : ''}`}>
      <input
        type="checkbox"
        id={`item-${item.id}`}
        checked={item.checked}
        onChange={() => handleCheckItem(item.id, !item.checked)}
        className={styles.checkbox}
      />
      <label 
        htmlFor={`item-${item.id}`} 
        className={`${styles.itemLabel} ${item.checked ? styles.checkedLabel : ''}`}
      >
        {item.quantity && item.unit
          ? `${item.name} (${item.quantity} ${item.unit})`
          : item.name
        }
      </label>
      <button onClick={() => handleRemoveItem(item.id)} className={styles.removeButton}>
        Remove
      </button>
    </div>
  );

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!groceryList) return <div>Loading...</div>;

  const uncheckedItems = groceryList.items.filter(item => !item.checked);
  const checkedItems = groceryList.items.filter(item => item.checked);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Grocery List</h1>
      <div className={styles.inputContainer}>
        <input
          type="text"
          className={styles.input}
          placeholder="Add a new item"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
        />
        <button onClick={handleAddItem} className={styles.addButton}>
          Add
        </button>
      </div>
      {error && <div className={styles.error}>{error}</div>}
      {!groceryList ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className={styles.itemList}>
            {uncheckedItems.map(renderGroceryItem)}
          </div>
          {checkedItems.length > 0 && (
            <>
              <hr className={styles.divider} />
              <div className={`${styles.itemList} ${styles.checkedItems}`}>
                {checkedItems.map(renderGroceryItem)}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

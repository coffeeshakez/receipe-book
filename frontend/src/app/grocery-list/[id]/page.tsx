'use client';
import styles from './page.module.scss';
import { TextInpuWithButton } from '@/components/TextInputWithButton/TextInputWithButton';
import { useEffect, useState } from 'react';
import { apiHandler, GroceryItem } from '@/api/apiHandler';

export default function GroceryListPage({ params }: { params: { id: number | string } }) {
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>([]);

  useEffect(() => {
    const fetchGroceryItems = async () => {
      try {
        const items = await apiHandler.getGroceryList();
        setGroceryItems(items);
      } catch (error) {
        console.error('Error fetching grocery items:', error);
      }
    };

    fetchGroceryItems();
  }, []);

  const addGroceryItem = async (value: string) => {
    const newItem: GroceryItem = { name: value, quantity: 1, unit: 'grams', checked: false };
    try {
      const addedItem = await apiHandler.addGroceryItem(newItem);
      setGroceryItems([...groceryItems, addedItem]);
    } catch (error) {
      console.error('Error adding grocery item:', error);
    }
  };

  const handleCheckItem = async (index: number, checked: boolean) => {
    const updatedItem = { ...groceryItems[index], checked };
    try {
      await apiHandler.updateGroceryItem(index, updatedItem);
      const updatedItems = groceryItems.map((item, i) => 
        i === index ? updatedItem : item
      );
      setGroceryItems(updatedItems);
    } catch (error) {
      console.error('Error updating grocery item:', error);
    }
  };

  return (
    <div>
      <div className={styles.checkboxList}>
        <h1>Grocery list</h1>
        <div>
          <TextInpuWithButton buttonText="add" onClick={value => addGroceryItem(value)} placeholder="Add item" />
        </div>
        {groceryItems.map((item, index) => (
          <div key={index} className={styles.checkboxItem}>
            <input
              type="checkbox"
              id={`item-${index}`}
              name={item.name}
              checked={item.checked}
              onChange={() => handleCheckItem(index, !item.checked)}
            />
            <label htmlFor={`item-${index}`}>{item.name}</label>
          </div>
        ))}
      </div>
    </div>
  );
}

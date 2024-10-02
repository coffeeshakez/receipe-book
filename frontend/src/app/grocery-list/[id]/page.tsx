'use client';
import styles from './page.module.scss';
import { TextInpuWithButton } from '@/components/TextInputWithButton/TextInputWithButton';
import { useEffect, useState } from 'react';
import { apiHandler, GroceryList, GroceryItem } from '@/api/apiHandler';
import { useParams } from 'next/navigation';

export default function GroceryListPage() {
  const [groceryList, setGroceryList] = useState<GroceryList | null>(null);
  const params = useParams();
  const listId = parseInt(params.id as string);

  useEffect(() => {
    const fetchGroceryList = async () => {
      try {
        const list = await apiHandler.getGroceryList(listId);
        setGroceryList(list);
      } catch (error) {
        console.error('Error fetching grocery list:', error);
      }
    };

    fetchGroceryList();
  }, [listId]);

  const handleCheckItem = async (itemId: number, checked: boolean) => {
    if (!groceryList) return;

    const updatedItem = groceryList.items.find(item => item.id === itemId);
    if (!updatedItem) return;

    updatedItem.checked = checked;

    try {
      await apiHandler.updateGroceryItem(listId, itemId, updatedItem);
      setGroceryList({
        ...groceryList,
        items: groceryList.items.map(item => item.id === itemId ? updatedItem : item)
      });
    } catch (error) {
      console.error('Error updating grocery item:', error);
    }
  };

  if (!groceryList) return <div>Loading...</div>;

  return (
    <div>
      <div className={styles.checkboxList}>
        <h1>Grocery list {listId}</h1>
        {groceryList.items.map((item) => (
          <div key={item.id} className={styles.checkboxItem}>
            <input
              type="checkbox"
              id={`item-${item.id}`}
              name={item.name}
              checked={item.checked}
              onChange={() => handleCheckItem(item.id, !item.checked)}
            />
            <label htmlFor={`item-${item.id}`}>{item.quantity} {item.unit} {item.name}</label>
          </div>
        ))}
      </div>
    </div>
  );
}

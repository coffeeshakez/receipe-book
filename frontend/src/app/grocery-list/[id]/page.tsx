'use client';
import styles from './page.module.scss';
import { TextInputWithButton } from '@/components/TextInputWithButton/TextInputWithButton';
import { useEffect, useState } from 'react';
import { apiHandler, GroceryList, GroceryItem } from '@/api/apiHandler';
import { useParams } from 'next/navigation';

export default function GroceryListPage() {
  const [groceryList, setGroceryList] = useState<GroceryList | null>(null);
  const [newItemName, setNewItemName] = useState('');
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
      const updatedItemFromServer = await apiHandler.updateGroceryItem(listId, itemId, updatedItem);
      setGroceryList({
        ...groceryList,
        items: groceryList.items.map(item => item.id === itemId ? updatedItemFromServer : item)
      });
    } catch (error) {
      console.error('Error updating grocery item:', error);
    }
  };

  const handleAddItem = async () => {
    if (!groceryList || !newItemName.trim()) return;

    try {
      const newItem = await apiHandler.addGroceryItem(listId, {
        name: newItemName,
        quantity: '1',
        unit: 'piece',
        checked: false
      });
      setGroceryList({
        ...groceryList,
        items: [...groceryList.items, newItem]
      });
      setNewItemName('');
    } catch (error) {
      console.error('Error adding grocery item:', error);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    if (!groceryList) return;

    try {
      await apiHandler.removeGroceryItem(listId, itemId);
      setGroceryList({
        ...groceryList,
        items: groceryList.items.filter(item => item.id !== itemId)
      });
    } catch (error) {
      console.error('Error removing grocery item:', error);
    }
  };

  if (!groceryList) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Grocery list {listId}</h1>
      <TextInputWithButton
        buttonText="Add Item"
        placeholder="Enter new item"
        onClick={handleAddItem}
        value={newItemName}
        onChange={(e) => setNewItemName(e.target.value)}
      />
      <div className={styles.itemList}>
        {groceryList.items.map((item) => (
          <div key={item.id} className={styles.item}>
            <input
              type="checkbox"
              id={`item-${item.id}`}
              checked={item.checked}
              onChange={() => handleCheckItem(item.id, !item.checked)}
              className={styles.checkbox}
            />
            <label htmlFor={`item-${item.id}`} className={styles.itemLabel}>
              {item.quantity} {item.unit} {item.name}
            </label>
            <button onClick={() => handleRemoveItem(item.id)} className={styles.removeButton}>
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

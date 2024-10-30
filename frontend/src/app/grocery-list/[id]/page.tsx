'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { apiHandler, GroceryList, GroceryItem } from '@/services/apiHandler';
import styles from './page.module.scss';

export default function GroceryListPage() {
  const [groceryList, setGroceryList] = useState<GroceryList | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [swipedItemId, setSwipedItemId] = useState<number | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const params = useParams();
  const listId = params?.id ? parseInt(params.id as string) : null;

  useEffect(() => {
    if (listId) {
      fetchGroceryList();
    }
  }, [listId]);

  const fetchGroceryList = async () => {
    if (!listId) return;
    try {
      const list = await apiHandler.getGroceryList(listId);
      setGroceryList(list);
    } catch (error) {
      console.error('Error fetching grocery list:', error);
      setError('Failed to load grocery list');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCheck = async (itemId: number, checked: boolean) => {
    if (!groceryList || !listId) return;

    try {
      const itemToUpdate = groceryList.items.find(item => item.id === itemId);
      if (!itemToUpdate) return;

      const updatedItem = await apiHandler.updateGroceryItem(listId, itemId, {
        ...itemToUpdate,
        checked: checked
      });

      setGroceryList(prevList => {
        if (!prevList) return null;
        return {
          ...prevList,
          items: prevList.items.map(item =>
            item.id === itemId ? updatedItem : item
          )
        };
      });
    } catch (error) {
      console.error('Error updating item:', error);
      setError('Failed to update item');
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    if (!groceryList || !listId) return;

    try {
      await apiHandler.removeGroceryItem(listId, itemId);
      setGroceryList(prevList => {
        if (!prevList) return null;
        return {
          ...prevList,
          items: prevList.items.filter(item => item.id !== itemId)
        };
      });
      setSwipedItemId(null);
    } catch (error) {
      console.error('Error removing grocery item:', error);
      setError('Failed to remove item. Please try again.');
    }
  };

  const handleSwipe = (itemId: number, direction: 'left' | 'right') => {
    if (direction === 'left') {
      setSwipedItemId(itemId);
    } else {
      setSwipedItemId(null);
    }
  };

  const handleAddItem = async () => {
    if (!groceryList || !listId || !newItemName.trim()) return;

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
    } catch (error) {
      console.error('Error adding grocery item:', error);
      setError('Failed to add item. Please try again.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!groceryList) return <div>No grocery list found</div>;

  const uncheckedItems = groceryList.items.filter(item => !item.checked);
  const checkedItems = groceryList.items.filter(item => item.checked);

  const renderItem = (item: GroceryItem) => (
    <div 
      key={item.id} 
      className={`${styles.item} ${swipedItemId === item.id ? styles.swiped : ''}`}
      onTouchStart={(e) => {
        const touch = e.touches[0];
        const startX = touch.clientX;
        const handleTouchMove = (e: TouchEvent) => {
          const touch = e.touches[0];
          const diff = startX - touch.clientX;
          if (Math.abs(diff) > 50) {
            handleSwipe(item.id, diff > 0 ? 'left' : 'right');
          }
        };
        document.addEventListener('touchmove', handleTouchMove);
        document.addEventListener('touchend', () => {
          document.removeEventListener('touchmove', handleTouchMove);
        }, { once: true });
      }}
    >
      <div className={styles.itemContent}>
        <input
          type="checkbox"
          checked={item.checked}
          onChange={(e) => handleToggleCheck(item.id, e.target.checked)}
        />
        <span className={`${styles.itemName} ${item.checked ? styles.checked : ''}`}>
          {item.name}
        </span>
        <span className={styles.itemQuantity}>
          {item.quantity} {item.unit}
        </span>
      </div>
      <button 
        className={styles.deleteButton}
        onClick={() => handleRemoveItem(item.id)}
      >
        Delete
      </button>
    </div>
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Grocery List</h1>
      
      <div className={styles.addItemForm}>
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Add new item..."
          className={styles.addItemInput}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleAddItem();
            }
          }}
        />
        <button 
          onClick={handleAddItem}
          className={styles.addItemButton}
          disabled={!newItemName.trim()}
        >
          Add Item
        </button>
      </div>
      
      <div className={styles.itemList}>
        {/* Unchecked items */}
        <div className={styles.uncheckedItems}>
          {uncheckedItems.map(renderItem)}
        </div>

        {/* Checked items */}
        {checkedItems.length > 0 && (
          <div className={styles.checkedItems}>
            <h2>Completed Items</h2>
            {checkedItems.map(renderItem)}
          </div>
        )}
      </div>
    </div>
  );
}

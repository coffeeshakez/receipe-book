'use client';

import { useGroceryList } from '@/hooks/useGroceryList';
import styles from './GroceryListClient.module.scss';
import { AddItemForm } from './components/AddItemForm/AddItemForm';
import { GroceryItem } from './components/GroceryItem/GroceryItem';

interface Props {
  listId: number;
}

export const GroceryListClient = ({ listId }: Props) => {
  const {
    groceryList,
    isLoading,
    error,
    toggleItem,
    removeItem,
    addItem,
    isAddingItem,
    isRemovingItem,
    isTogglingItem,
  } = useGroceryList(listId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error instanceof Error ? error.message : 'An error occurred'}</div>;
  }

  if (!groceryList) {
    return <div>No grocery list found</div>;
  }

  const uncheckedItems = groceryList.items.filter((item) => !item.checked);
  const checkedItems = groceryList.items.filter((item) => item.checked);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Grocery List</h1>
      <AddItemForm onAdd={addItem} isSubmitting={isAddingItem} />
      <div className={styles.itemList}>
        {uncheckedItems.map((item) => (
          <GroceryItem
            key={item.id}
            item={item}
            onToggleCheck={(checked) => toggleItem(item.id, checked)}
            onRemove={() => removeItem(item.id)}
            isChecked={item.checked}
            isLoading={isTogglingItem || isRemovingItem}
          />
        ))}
        {checkedItems.length > 0 && (
          <div>
            <h2>Completed Items</h2>
            {checkedItems.map((item) => (
              <GroceryItem
                key={item.id}
                item={item}
                onToggleCheck={(checked) => toggleItem(item.id, checked)}
                onRemove={() => removeItem(item.id)}
                isChecked={item.checked}
                isLoading={isTogglingItem || isRemovingItem}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 
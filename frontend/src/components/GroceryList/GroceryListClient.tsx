'use client';

import { useGroceryList } from '@/hooks/useGroceryList';
import { AddItemForm } from '@/components/GroceryList/AddItemForm';
import styles from './GroceryListClient.module.scss';
import { GroceryItem } from './GroceryItem';
import { IGroceryItem } from '@/services/apiHandler';
import { UseMutateFunction } from '@tanstack/react-query';

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
    refreshList,
    isAddingItem,
    isRemovingItem,
    isTogglingItem,
    addRecipe
  } = useGroceryList(listId);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer} role="alert" aria-busy="true">
        <div className={styles.spinner} />
        Loading grocery list...
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error} role="alert">
        {error instanceof Error ? error.message : 'An error occurred'}
        <button 
          onClick={refreshList}
          className={styles.retryButton}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!groceryList) {
    return (
      <div className={styles.empty} role="alert">
        No grocery list found
      </div>
    );
  }

  const uncheckedItems = groceryList.items.filter((item: { checked: boolean }) => !item.checked);
  const checkedItems = groceryList.items.filter((item: { checked: boolean }) => item.checked);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Grocery List</h1>
      
      <AddItemForm 
        onAdd={addItem} 
        isSubmitting={isAddingItem}
      />
      
      <div className={styles.itemList} role="list">
        <div className={styles.uncheckedItems}>
          {uncheckedItems.map((item: IGroceryItem) => (
            <GroceryItem
              key={item.id}
              item={item}
              onToggleCheck={(checked) => toggleItem({ itemId: item.id, checked })}
              onRemove={() => removeItem(item.id)}
              isSwipeable
              isChecked={false}
              isLoading={isTogglingItem || isRemovingItem}
            />
          ))}
        </div>

        {checkedItems.length > 0 && (
          <div className={styles.checkedItems}>
            <h2>Completed Items</h2>
            {checkedItems.map(item => (
              <GroceryItem
                key={item.id}
                item={item}
                onToggleCheck={(checked) => toggleItem({ itemId: item.id, checked })}
                onRemove={() => removeItem(item.id)}
                isSwipeable
                isChecked={true}
                isLoading={isTogglingItem || isRemovingItem}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 
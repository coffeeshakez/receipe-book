'use client';

import { useGroceryList } from '@/hooks/useGroceryList';
import { LoadingSpinner } from '@/components/common/LoadingSpinner/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage/ErrorMessage';
import { EmptyState } from '@/components/common/EmptyState/EmptyState';
import { GroceryListView } from './GroceryListView';

interface Props {
  listId: number;
}

export const GroceryListContainer = ({ listId }: Props) => {
  const {
    groceryList,
    isLoading,
    error,
    toggleItem,
    removeItem,
    addItem,
    isAddingItem,
    isRemovingItem,
    isTogglingItem
  } = useGroceryList(listId);

  if (isLoading) {
    return <LoadingSpinner message="Loading grocery list..." />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  if (!groceryList) {
    return <EmptyState message="No grocery list found" />;
  }

  return (
    <GroceryListView
      groceryList={groceryList}
      onToggleItem={toggleItem}
      onRemoveItem={removeItem}
      onAddItem={addItem}
      isAddingItem={isAddingItem}
      isRemovingItem={isRemovingItem}
      isTogglingItem={isTogglingItem}
    />
  );
}; 
import { AddItemForm } from './components/AddItemForm/AddItemForm';
import { IGroceryList } from '@/services/apiHandler';
import styles from './GroceryList.module.scss';
import { UncheckedItems } from './components/ItemLists/UncheckedItems';
import { CheckedItems } from './components/ItemLists/CheckedItems';

interface Props {
  groceryList: IGroceryList;
  onToggleItem: (itemId: number, checked: boolean) => void;
  onRemoveItem: (itemId: number) => void;
  onAddItem: (name: string) => void;
  isAddingItem: boolean;
  isRemovingItem: boolean;
  isTogglingItem: boolean;
}

export const GroceryListView = ({
  groceryList,
  onToggleItem,
  onRemoveItem,
  onAddItem,
  isAddingItem,
  isRemovingItem,
  isTogglingItem
}: Props) => {
  const uncheckedItems = groceryList.items.filter(item => !item.checked);
  const checkedItems = groceryList.items.filter(item => item.checked);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{'Grocery List ' + groceryList.id}</h1>
      
      <AddItemForm
        onAdd={onAddItem} 
        isSubmitting={isAddingItem}
      />
      
      <div className={styles.itemList} role="list">
        <UncheckedItems
          items={uncheckedItems}
          onToggleItem={onToggleItem}
          onRemoveItem={onRemoveItem}
          isLoading={isTogglingItem || isRemovingItem}
        />

        {checkedItems.length > 0 && (
          <CheckedItems
            items={checkedItems}
            onToggleItem={onToggleItem}
            onRemoveItem={onRemoveItem}
            isLoading={isTogglingItem || isRemovingItem}
          />
        )}
      </div>
    </div>
  );
}; 
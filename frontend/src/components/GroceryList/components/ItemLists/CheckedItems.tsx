import { GroceryItem } from '../GroceryItem/GroceryItem';
import { IGroceryItem } from '@/services/apiHandler';
import styles from '../../GroceryList.module.scss';

interface Props {
  items: IGroceryItem[];
  onToggleItem: (itemId: number, checked: boolean) => void;
  onRemoveItem: (itemId: number) => void;
  isLoading: boolean;
}

export const CheckedItems = ({
  items,
  onToggleItem,
  onRemoveItem,
  isLoading
}: Props) => (
  <div className={styles.checkedItems}>
    <h2>Completed Items</h2>
    {items.map(item => (
      <GroceryItem
        key={item.id}
        item={item}
        onToggleCheck={(checked) => onToggleItem(item.id, checked)}
        onRemove={() => onRemoveItem(item.id)}
        isSwipeable
        isChecked={true}
        isLoading={isLoading}
      />
    ))}
  </div>
); 
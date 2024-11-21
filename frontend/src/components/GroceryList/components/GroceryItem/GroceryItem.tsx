import { IGroceryItem } from '@/services/apiHandler';
import styles from './GroceryItem.module.scss';
import { useState } from 'react';

interface Props {
  item: IGroceryItem;
  onToggleCheck: (checked: boolean) => void;
  onRemove: () => void;
  isSwipeable?: boolean;
  isChecked: boolean;
  isLoading?: boolean;
}

export const GroceryItem = ({
  item,
  onToggleCheck,
  onRemove,
  isSwipeable,
  isChecked,
  isLoading
}: Props) => {
  const [isSwipedLeft, setIsSwipedLeft] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isSwipeable) return;

    const touch = e.touches[0];
    const startX = touch.clientX;
    
    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const diff = startX - touch.clientX;
      setIsSwipedLeft(diff > 50);
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', () => {
      document.removeEventListener('touchmove', handleTouchMove);
    }, { once: true });
  };

  return (
    <div 
      className={`${styles.item} ${isChecked ? styles.checked : ''} ${isLoading ? styles.loading : ''} ${isSwipedLeft ? styles.swiped : ''}`}
      onTouchStart={handleTouchStart}
      role="listitem"
    >
      <div className={styles.itemContent}>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={(e) => onToggleCheck(e.target.checked)}
          disabled={isLoading}
          aria-label={`Mark ${item.name} as ${isChecked ? 'uncompleted' : 'completed'}`}
        />
        <span className={styles.itemName}>{item.name}</span>
        {(item.quantity || item.unit) && (
          <span className={styles.itemQuantity}>
            {item.quantity} {item.unit}
          </span>
        )}
      </div>
      <button 
        className={styles.deleteButton}
        onClick={onRemove}
        disabled={isLoading}
        aria-label={`Remove ${item.name} from list`}
      >
        Delete
      </button>
      {isLoading && <div className={styles.loadingOverlay} />}
    </div>
  );
}; 
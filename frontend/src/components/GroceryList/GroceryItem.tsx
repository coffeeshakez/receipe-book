import { IGroceryItem  } from '@/services/apiHandler';
import styles from './GroceryItem.module.scss';

interface Props {
  item: IGroceryItem;
  onToggleCheck: (checked: boolean) => void;
  onRemove: () => void;
  isSwipeable?: boolean;
  onSwipe?: (direction: 'left' | 'right') => void;
  isChecked: boolean;
  isLoading?: boolean;
}

export const GroceryItem = ({
  item,
  onToggleCheck,
  onRemove,
  isSwipeable,
  onSwipe,
  isChecked,
  isLoading
}: Props) => {
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isSwipeable || !onSwipe) return;

    const touch = e.touches[0];
    const startX = touch.clientX;
    
    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const diff = startX - touch.clientX;
      if (Math.abs(diff) > 50) {
        onSwipe(diff > 0 ? 'left' : 'right');
      }
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', () => {
      document.removeEventListener('touchmove', handleTouchMove);
    }, { once: true });
  };

  return (
    <div 
      className={`${styles.item} ${isChecked ? styles.checked : ''} ${isLoading ? styles.loading : ''}`}
      onTouchStart={handleTouchStart}
      role="listitem"
    >
      <div className={styles.itemContent}>
        <input
          type="checkbox"
          checked={item.checked}
          onChange={(e) => onToggleCheck(e.target.checked)}
          disabled={isLoading}
          aria-label={`Mark ${item.name} as ${item.checked ? 'uncompleted' : 'completed'}`}
        />
        <span className={styles.itemName}>
          {item.name}
        </span>
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
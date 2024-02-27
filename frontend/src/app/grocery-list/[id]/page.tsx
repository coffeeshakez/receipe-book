'use client';
import styles from './page.module.scss';
import groceryListTestData from '../../../mockdata/groceryList.json';
import {TextInpuWithButton} from '@/components/TextInputWithButton/TextInputWithButton';
import {useState} from 'react';

type GroceryItem = {
  name: string;
  quantity: number;
  unit: string;
  checked: boolean;
};

export default function Recipe({params}: {params: {id: number | string}}) {
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>(groceryListTestData);

  const addGroceryItem = (value: string) => {
    setGroceryItems([...groceryItems, {name: value, quantity: 1, unit: 'grams', checked: false}]);
  };

  const handleCheckItem = (index: number, checked: boolean) => {
    setGroceryItems(prevItems => {
      const newItems = [...prevItems];
      newItems[index] = {...newItems[index], checked};
      return newItems;
    });
  };

  return (
    <div>
      <div className={styles.checkboxList}>
        <h1>Grocery list</h1>
        <div>
          <TextInpuWithButton buttonText="add" onClick={value => addGroceryItem(value)} placeholder="Add item" />
        </div>
        {groceryItems.map((item, index) => {
          if (!item.checked) {
            return (
              <div key={index} className={styles.checkboxItem}>
                <input
                  onClick={() => handleCheckItem(index, !groceryItems[index].checked)}
                  type="checkbox"
                  id={`item-${index}`}
                  name={item.name}
                />
                <label htmlFor={`item-${index}`}>{item.name}</label>
              </div>
            );
          }
          return null;
        })}
      </div>
      <div className={styles.completedItems}>
        {groceryItems.map((item, index) => {
          if (!item.checked) {
            return (
              <div key={index} className={styles.checkboxItem}>
                <input
                  onClick={() => handleCheckItem(index, !groceryItems[index].checked)}
                  type="checkbox"
                  id={`item-${index}`}
                  name={item.name}
                />
                <label htmlFor={`item-${index}`}>{item.name}</label>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}

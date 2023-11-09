import styles from './page.module.scss';
import receipes from '../../mockdata/receipes.json';
import {Icons} from '@/components/Icons/Icons';
import {classNames} from '@/util/styles';

export default function Receipe() {
  const receipe = receipes.recipes[0];
  return (
    <div>
      <div>
        <img className={styles.headerImage} src={receipe.img} alt="burger" />
      </div>
      <div className={styles.splitContainer}>
        <div className={styles.ingredientsSection}>
          <h1 className={classNames([styles.subHeader, styles.center, styles.underline])}>{receipe.name}</h1>
          <h2 className={styles.header}>Ingredients</h2>

          <ul>
            {receipe.ingredients.map(ingredient => (
              <li key={ingredient.name}>
                <Icons className={styles.icon} iconName={ingredient.name} size="lg" />
                {ingredient.quantity} {ingredient.measurement} {ingredient.name}
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.section}>
          <h1 className={styles.header}>Instructions</h1>
          <ul>
            {receipe.instructions.map((ingredient, index) => (
              <li key={ingredient}>
                {index + 1}. {ingredient}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

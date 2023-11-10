import styles from './page.module.scss';
import receipes from '../../mockdata/receipes.json';
import {Icons} from '@/components/Icons/Icons';
import {classNames} from '@/util/styles';
import {Button} from '@/components/Button/Button';

type Ingredient = {
  name: string;
  quantity: number | string;
  measurement: string;
};

type Instruction = {
  instruction: string;
  ingredients: Ingredient[];
};

type Recipe = {
  name: string;
  img: string;
  description: string;
  ingredients: Ingredient[];
  instructions: Instruction[];
};

export default function Receipe() {
  const receipe = receipes.recipes[0] as Recipe;
  return (
    <div>
      <div>
        <img className={styles.headerImage} src={receipe.img} alt="burger" />
      </div>
      <div className={styles.splitContainer}>
        <div className={styles.ingredientsSection}>
          <h1 className={classNames(styles.subHeader, styles.center, styles.underline)}>{receipe.name}</h1>
          <h2 className={styles.header}>Ingredients</h2>

          <ul>
            {receipe.ingredients.map(ingredient => (
              <li key={ingredient.name}>
                <Icons className={styles.icon} iconName={ingredient.name} size="lg" />
                {ingredient.quantity} {ingredient.measurement} {ingredient.name}
              </li>
            ))}
          </ul>
          <Button>!Lag handleliste!</Button>
        </div>
        <div className={styles.section}>
          <h1 className={styles.header}>Instructions</h1>

          <ul>
            {receipe.instructions.map((instruction, index) => (
              <li key={instruction.instruction} className={styles.instructionListItem}>
                <div className={styles.instructionIngredientSection}>
                  {instruction.ingredients.map(ingredient => (
                    // eslint-disable-next-line react/jsx-key
                    <div className={styles.ingredientCard}>
                      <Icons className={styles.icon} iconName={ingredient.name} size="lg" />
                      {ingredient.quantity} {ingredient.measurement} {ingredient.name}
                    </div>
                  ))}
                </div>
                {index + 1}. {instruction.instruction}
                <div></div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

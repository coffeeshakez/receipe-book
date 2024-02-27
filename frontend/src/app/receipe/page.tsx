'use client';
import styles from './page.module.scss';
import receipes from '../../mockdata/receipes.json';
import {Icons} from '@/components/Icons/Icons';
import {classNames} from '@/util/styles';
import {Button} from '@/components/Button/Button';
import {Tag} from '@/components/Tag/Tag';
import {TextWithIcon} from '@/components/TextWithIcon/TextWithIcon';
import {Expand} from '@/components/Expand/Expand';
import {useRouter} from 'next/navigation';

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
  const router = useRouter();

  const handleClick = () => {
    router.push('/grocery-list/100');
  };
  return (
    <div>
      <div>
        <img className={styles.headerImage} src={receipe.img} alt="burger" />
      </div>
      <div className={styles.splitContainer}>
        <div className={styles.ingredientsSection}>
          <h1 className={classNames(styles.header, styles.center, styles.underline)}>{receipe.name}</h1>
          <div className={styles.flexContainer}>
            <h2 className={styles.subHeader}>Ingredients</h2>
            <Button onClick={handleClick}>!Lag handleliste!</Button>
          </div>

          <ul>
            {receipe.ingredients.map(ingredient => (
              <li key={ingredient.name}>
                <TextWithIcon iconName={ingredient.name}>
                  {ingredient.quantity} {ingredient.measurement} {ingredient.name}
                </TextWithIcon>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.section}>
          <h1 className={styles.header}>Instructions</h1>

          <ul>
            {receipe.instructions.map((instruction, index) => (
              <li key={instruction.instruction} className={styles.instructionListItem}>
                <div>
                  <Expand summary={`ingredienser for steg ${index + 1}`}>
                    {instruction.ingredients.map(ingredient => (
                      <TextWithIcon key={ingredient.name} iconName={ingredient.name}>
                        {ingredient.quantity} {ingredient.measurement} {ingredient.name}
                      </TextWithIcon>
                    ))}
                  </Expand>
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

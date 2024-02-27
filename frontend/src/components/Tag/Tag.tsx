import {Icons} from '../Icons/Icons';
import styles from './Tag.module.scss';

type TagProps = {
  children: React.ReactNode;
};

export const Tag = ({children}: TagProps) => <div className={styles.ingredientCard}>{children}</div>;

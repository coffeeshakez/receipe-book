import {classNames} from '@/util/styles';
import styles from './Button.module.scss';

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({children, className = '', ...rest}: ButtonProps) => (
  <button className={classNames(styles.button, className)} {...rest}>
    {children}
  </button>
);

import {Icons} from '../Icons/Icons';
import styles from './TextWithIcon.module.scss';

type TextWithIconProps = {
  children: React.ReactNode;
  iconName: string;
};

export const TextWithIcon = ({children, iconName}: TextWithIconProps) => (
  <p className={styles.text}>
    <Icons className={styles.icon} iconName={iconName} size="lg" />
    {children}
  </p>
);

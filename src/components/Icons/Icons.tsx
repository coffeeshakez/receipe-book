import styles from './Icons.module.scss';

enum IconNamesEnum {
  chicken = 'chicken',
  cucumber = 'cucumber',
  fish = 'fish',
  onion = 'onion',
  paprika = 'paprika',
  pepper = 'pepper',
  peppershaker = 'peppershaker',
  spaghetti = 'spaghetti',
  salt = 'salt',
  beef = 'beef',
  tomato = 'tomato',
  garlic = 'garlic',
  cheese = 'cheese',
  basil = 'herbs',
  oregano = 'herbs',
}

type IconNamesEnumType = keyof typeof IconNamesEnum;

type IconsProps = {
  size: 'sm' | 'md' | 'lg';
  iconName: string;
  className?: string;
};

const ingredientToIcon = (icon: string) => {
  let iconName = 'fish';
  for (const [key, value] of Object.entries(IconNamesEnum)) {
    if (icon.toLowerCase().includes(key.toString())) {
      iconName = value;
    }
  }
  return iconName;
};

export const Icons = ({size, iconName, className}: IconsProps) => (
  <img className={styles.icon + ' ' + className} src={`/icons/${ingredientToIcon(iconName)}.svg`} />
);

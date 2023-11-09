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

enum IconNamesEnumNo {
  chicken = 'kylling',
  cucumber = 'agurk',
  fish = 'fisk',
  onion = 'løk',
  paprika = 'paprika',
  pepper = 'pepper',
  peppershaker = 'peppershaker',
  spaghetti = 'spaghetti',
  salt = 'salt',
  beef = 'kjøtt',
  tomato = 'tomat',
  garlic = 'hvitløk',
  cheese = 'ost',
  basil = 'basilikum',
  oregano = 'oregano',
}

type IconsProps = {
  size: 'sm' | 'md' | 'lg';
  iconName: string;
  className?: string;
};

const ingredientToIcon = (icon: string) => {
  let iconName = 'fish';
  for (const [key, value] of Object.entries(IconNamesEnumNo)) {
    if (icon.toLowerCase().includes(value.toString())) {
      iconName = key;
    }
  }
  return iconName;
};

export const Icons = ({size, iconName, className}: IconsProps) => (
  <img className={styles.icon + ' ' + className} src={`/icons/${ingredientToIcon(iconName)}.svg`} />
);

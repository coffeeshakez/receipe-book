import {MenuSection, MenuSectionProps} from './MenuSection';
import styles from './Menu.module.scss';

type MenuProps = {
  menuSections: MenuSectionProps[];
};

export const Menu = ({menuSections}: MenuProps) => (
  <div className={styles.menuContainer}>
    {menuSections.map(menuSection => (
      <MenuSection {...menuSection} key={menuSection.heading + '-menuSection'} />
    ))}
  </div>
);

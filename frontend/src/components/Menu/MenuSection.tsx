import styles from './MenuSection.module.scss';

type MenuItem = {
  name: string;
  description: string;
  link: string;
};

export type MenuSectionProps = {
  heading: string;
  img: string;
  menuItems: MenuItem[];
};

export const MenuSection = ({heading, img, menuItems}: MenuSectionProps) => (
  <div className={styles.menuSectionContainer}>
    <h1 className={styles.heading}>{heading}</h1>
    <img className={styles.image} src={img} alt={heading} />
    <div className={styles.menuItemsContainer}>
      {menuItems.map(menuItem => (
        <div key={menuItem.name} className={styles.menuItem}>
          <h2 className={styles.name}>
            <a href={menuItem.link}>{menuItem.name}</a>
          </h2>
          <p>{menuItem.description}</p>
        </div>
      ))}
    </div>
  </div>
);

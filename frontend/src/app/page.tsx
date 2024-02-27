import {Menu} from '@/components/Menu/Menu';
import Link from 'next/link';
import styles from './page.module.css';

export default function Page() {
  return (
    <div className={styles.pageContainer}>
      <Link href="/receipe">Receipes</Link>
      <Menu
        menuSections={[
          {
            heading: 'Appetizers',
            img: './burger.jpg',
            menuItems: [
              {
                link: '/receipe',
                name: 'Stuffed Mushrooms',
                description: 'mushrooms filled with a savory blend of cheese and herbs',
              },
              {
                link: '/receipe',
                name: 'Spinach Artichoke Dip',
                description: 'creamy dip with spinach, artichokes, and melted cheese',
              },
              {
                link: '/receipe',
                name: 'Bruschetta',
                description: 'toasted bread topped with diced tomatoes, garlic, and basil',
              },
              {link: '/receipe', name: 'Chicken Wings', description: 'crispy wings tossed in your choice of sauce'},
              {
                link: '/receipe',
                name: 'Caprese Skewers',
                description: 'mozzarella, cherry tomatoes, and basil drizzled with balsamic glaze',
              },
              {
                link: '/receipe',
                name: 'Shrimp Cocktail',
                description: 'chilled shrimp served with tangy cocktail sauce',
              },
            ],
          },
          {
            heading: 'Main dishes',
            img: './burger.jpg',
            menuItems: [
              {
                link: '/receipe',
                name: 'Filet Mignon',
                description: 'tender and juicy, served with a red wine reduction',
              },
              {link: '/receipe', name: 'Ribeye Steak', description: 'marbled for maximum flavor, cooked to perfection'},
              {
                link: '/receipe',
                name: 'New York Strip',
                description: 'a classic cut, grilled with a garlic butter glaze',
              },
              {link: '/receipe', name: 'Surf and Turf', description: 'a combination of filet mignon and lobster tail'},
              {
                link: '/receipe',
                name: 'Pepper Crusted Sirloin',
                description: 'sirloin steak coated in peppercorns, pan-seared to perfection',
              },
              {
                link: '/receipe',
                name: 'Chimichurri Skirt Steak',
                description: 'grilled skirt steak topped with zesty chimichurri sauce',
              },
            ],
          },
          {
            heading: 'Sweet Indulgences',
            img: './burger.jpg',
            menuItems: [
              {
                link: '/receipe',
                name: 'Triple Chocolate Mousse Cake',
                description: 'layers of dark, milk, and white chocolate mousse',
              },
              {
                link: '/receipe',
                name: 'Tiramisu',
                description: 'classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone',
              },
              {
                link: '/receipe',
                name: 'Strawberry Shortcake',
                description: 'fresh strawberries layered with sponge cake and whipped cream',
              },
              {
                link: '/receipe',
                name: 'Molten Lava Cake',
                description: 'warm chocolate cake with a gooey molten center, served with vanilla ice cream',
              },
            ],
          },
          {
            heading: 'Desserts',
            img: './burger.jpg',
            menuItems: [
              {
                link: 'receipe',
                name: 'Red Velvet Cupcakes',
                description: 'moist red velvet cupcakes topped with cream cheese frosting',
              },
              {link: '/receipe', name: 'Pecan Pie', description: 'classic pecan pie with a buttery, flaky crust'},
              {
                link: '/receipe',
                name: 'Chocolate Dipped Strawberries',
                description: 'fresh strawberries dipped in rich, dark chocolate',
              },
              {
                link: '/receipe',
                name: 'Lemon Tart',
                description: 'tangy lemon filling in a buttery tart crust, topped with meringue',
              },
              {
                link: '/receipe',
                name: 'Creme Brulee',
                description: 'silky vanilla custard with a caramelized sugar crust',
              },
              {
                link: '/receipe',
                name: 'Mango Sorbet',
                description: 'refreshing mango sorbet served in a chilled glass',
              },
            ],
          },
        ]}
      />
    </div>
  );
}

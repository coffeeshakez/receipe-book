import Header from '@/components/Header/Header';
import styles from './layout.module.scss';

export default function RecipeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.layoutContainer}>
      <Header />
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}

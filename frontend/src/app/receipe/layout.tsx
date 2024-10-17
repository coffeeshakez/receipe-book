import styles from './layout.module.scss';

export default function RecipeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.layoutContainer}>
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}

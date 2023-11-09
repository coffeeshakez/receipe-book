import styles from './Layout.module.scss';

export const Layout = ({children}: {children: React.ReactNode}) => <div className={styles.container}>{children}</div>;

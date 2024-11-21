import styles from './LoadingSpinner.module.scss';

interface Props {
  message?: string;
}

export const LoadingSpinner = ({ message = 'Loading...' }: Props) => (
  <div className={styles.container} role="alert" aria-busy="true">
    <div className={styles.spinner} />
    {message}
  </div>
); 
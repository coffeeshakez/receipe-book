import styles from './ErrorMessage.module.scss';

interface Props {
  error: Error | unknown;
  onRetry?: () => void;
}

export const ErrorMessage = ({ error, onRetry }: Props) => (
  <div className={styles.container} role="alert">
    <p className={styles.message}>
      {error instanceof Error ? error.message : 'An error occurred'}
    </p>
    {onRetry && (
      <button onClick={onRetry} className={styles.retryButton}>
        Retry
      </button>
    )}
  </div>
); 
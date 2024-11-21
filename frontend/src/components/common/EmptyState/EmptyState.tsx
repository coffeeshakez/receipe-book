import React from 'react';
import styles from './EmptyState.module.scss';

interface Props {
  message?: string;
  icon?: React.ReactNode;
}

export const EmptyState = ({ 
  message = 'No items found',
  icon
}: Props) => (
  <div className={styles.container} role="alert">
    {icon && <div className={styles.icon}>{icon}</div>}
    <p className={styles.message}>{message}</p>
  </div>
); 
import styles from './Expand.module.scss';

type ExpandProps = {
  summary: string;
  children: React.ReactNode;
};

export const Expand = ({summary, children}: ExpandProps) => (
  <div className={styles.expand}>
    <details>
      <summary>{summary}</summary>
      <div>{children}</div>
    </details>
  </div>
);

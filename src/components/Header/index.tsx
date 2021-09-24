import styles from './header.module.scss';
import Link from 'next/link';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Link href="/">
          <img src="/images/Logo.svg" alt="logo" />
        </Link>
      </div>
    </header>
  );
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import db from '../lib/db'
import styles from './Navbar.module.css'

function Navbar() {
  const pathname = usePathname()
  const { user, isLoading } = db.useAuth()

  const handleSignOut = () => {
    db.auth.signOut()
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <Link href="/" className={styles.logo}>
          MemeApp
        </Link>

        <div className={styles.navLinks}>
          <Link 
            href="/" 
            className={`${styles.navLink} ${pathname === '/' ? styles.active : ''}`}
          >
            Feed
          </Link>
          <Link 
            href="/create" 
            className={`${styles.navLink} ${pathname === '/create' ? styles.active : ''}`}
          >
            Create
          </Link>
        </div>

        <div className={styles.authSection}>
          {isLoading ? (
            <div className={styles.authLoading}>...</div>
          ) : user ? (
            <div className={styles.userInfo}>
              <span className={styles.userEmail}>
                {user.email || 'Guest'}
              </span>
              <button onClick={handleSignOut} className={styles.signOutBtn}>
                Sign Out
              </button>
            </div>
          ) : (
            <Link href="/auth" className={styles.signInBtn}>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar

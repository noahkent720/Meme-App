'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import db from '../../lib/db'
import AuthGate from '../../components/AuthGate'
import styles from './page.module.css'

export default function AuthPage() {
  const router = useRouter()
  const { user, isLoading } = db.useAuth()

  useEffect(() => {
    if (user) {
      // Redirect to create page if already signed in
      router.push('/create')
    }
  }, [user, router])

  if (isLoading) {
    return (
      <div className={styles.authPage}>
        <div className={styles.loading}>Loading...</div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect
  }

  return (
    <AuthGate requireAuth={true}>
      <div></div>
    </AuthGate>
  )
}

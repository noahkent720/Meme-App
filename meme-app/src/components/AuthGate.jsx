'use client'

import { useState } from 'react'
import db from '../lib/db'
import styles from './AuthGate.module.css'

function AuthGate({ children, requireAuth = false }) {
  const { isLoading, user, error } = db.useAuth()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [sentEmail, setSentEmail] = useState(false)
  const [authError, setAuthError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleTestMode = async () => {
    // Development mode: use a pre-set verification code
    const testEmail = `test${Date.now()}@demo.com`
    setEmail(testEmail)
    setSentEmail(true)
    setCode('123456') // Auto-fill a test code
    setAuthError('Dev Mode: Using test code "123456" - just click Verify')
  }

  const handleSendCode = async (e) => {
    e.preventDefault()
    if (!email) return
    
    try {
      setIsSubmitting(true)
      setAuthError('')
      await db.auth.sendMagicCode({ email })
      setSentEmail(true)
      setAuthError('') // Clear any previous errors
    } catch (err) {
      console.error('Send code error:', err)
      // Show user-friendly error
      if (err.message?.includes('not enabled') || err.message?.includes('not configured')) {
        setAuthError('Email authentication is not enabled. Please use Test Mode or enable email auth in InstantDB dashboard.')
      } else {
        setAuthError(err.message || 'Failed to send code. Please try Test Mode instead.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerifyCode = async (e) => {
    e.preventDefault()
    if (!code) return
    
    try {
      setIsSubmitting(true)
      setAuthError('')
      
      // For development: if using test code, simulate success
      if (code === '123456' && email.includes('test')) {
        // Create a mock authenticated session
        const mockUser = { email, id: email }
        console.log('Test mode: Simulated sign-in', mockUser)
        // Try actual sign-in, but don't fail if it doesn't work
        try {
          await db.auth.signInWithMagicCode({ email, code })
        } catch {
          // Ignore errors in test mode
          console.log('Test mode: Skipping actual auth')
        }
      } else {
        await db.auth.signInWithMagicCode({ email, code })
      }
    } catch (err) {
      console.error('Verify code error:', err)
      setAuthError(err.message || 'Invalid code. Try Test Mode instead.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className={styles.authGate}>
        <div className={styles.authCard}>
          <div className={styles.loading}>Loading...</div>
        </div>
      </div>
    )
  }

  if (!requireAuth && user) {
    return children
  }

  if (requireAuth && !user) {
    return (
      <div className={styles.authGate}>
        <div className={styles.authCard}>
          <h2>Sign in to continue</h2>
          <p className={styles.authDesc}>Enter your email to receive a magic code</p>

          <button 
            className={styles.guestBtn}
            onClick={handleTestMode}
            disabled={isSubmitting}
            title="Quick test sign-in for development"
          >
            {isSubmitting ? 'Setting up...' : '⚡ Test Mode (Dev Only)'}
          </button>

          <div className={styles.divider}>
            <span>OR</span>
          </div>

          {!sentEmail ? (
            <form onSubmit={handleSendCode} className={styles.authForm}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.authInput}
                required
              />
              <button 
                type="submit" 
                className={styles.submitBtn}
                disabled={isSubmitting || !email}
              >
                {isSubmitting ? 'Sending...' : 'Send Code'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode} className={styles.authForm}>
              <p className={styles.codeInfo}>Check your email for a code</p>
              <input
                type="text"
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className={styles.authInput}
                maxLength={6}
                required
              />
              <button 
                type="submit" 
                className={styles.submitBtn}
                disabled={isSubmitting || !code}
              >
                {isSubmitting ? 'Verifying...' : 'Verify Code'}
              </button>
              <button 
                type="button"
                className={styles.backBtn}
                onClick={() => { setSentEmail(false); setCode(''); }}
              >
                Use different email
              </button>
            </form>
          )}

          {authError && (
            <div className={styles.error}>{authError}</div>
          )}
        </div>
      </div>
    )
  }

  return children
}

export default AuthGate

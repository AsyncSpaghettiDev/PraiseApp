import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router'

interface RequireAuthProps {
  children: ReactNode
}

export function RequireAuth ({ children }: RequireAuthProps) {
  const location = useLocation()
  const token = window.localStorage.getItem('token')

  if (!token) {
    return <Navigate to='/login' replace state={{ from: location }} />
  }

  return <>{children}</>
}

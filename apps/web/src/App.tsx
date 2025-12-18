import { BrowserRouter, Route, Routes } from 'react-router'
import { LoginPage, NotFoundPage, HomePage, Register } from './pages'
import { RequireAuth } from './components/RequireAuth'

export function App () {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/'
          element={
            <RequireAuth>
              <HomePage />
            </RequireAuth>
          }
        />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<Register />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

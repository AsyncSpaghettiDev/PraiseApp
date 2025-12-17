import { BrowserRouter, Route, Routes } from 'react-router'
import { LoginPage, NotFoundPage, HomePage, Register } from './pages'

export function App () {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<Register />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

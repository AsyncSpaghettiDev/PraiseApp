import { BrowserRouter, Route, Routes } from 'react-router'
import {
  LoginPage,
  NotFoundPage,
  HomePage,
  Register,
  SongsPage,
  SetlistsPage,
  SaveSongPage,
  SaveSetlistPage
} from './pages'
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
        <Route
          path='/songs'
          element={
            <RequireAuth>
              <SongsPage />
            </RequireAuth>
          }
        />
        <Route
          path='/save-song'
          element={
            <RequireAuth>
              <SaveSongPage />
            </RequireAuth>
          }
        />
        <Route
          path='/setlists'
          element={
            <RequireAuth>
              <SetlistsPage />
            </RequireAuth>
          }
        />
        <Route
          path='/save-setlist'
          element={
            <RequireAuth>
              <SaveSetlistPage />
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

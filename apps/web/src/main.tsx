import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MantineProvider } from '@mantine/core'
import { Toaster } from 'react-hot-toast'
import { App } from './App.tsx'
import '@mantine/core/styles.css'
import './index.css'

async function enableMocking () {
  if (!import.meta.env.DEV) {
    return
  }

  const { worker } = await import('./mocks/browser')
  await worker.start({ onUnhandledRequest: 'bypass' })
}

function renderApp () {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <MantineProvider>
        <App />
        <Toaster position='top-right' />
      </MantineProvider>
    </StrictMode>
  )
}

enableMocking()
  .then(() => {
    renderApp()
  })
  .catch((error) => {
    console.error(error)
    renderApp()
  })

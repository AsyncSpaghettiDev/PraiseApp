import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MantineProvider } from '@mantine/core'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { App } from './App.tsx'
import '@mantine/core/styles.css'
import './index.css'

const queryClient = new QueryClient()

async function enableMocking () {
  if (!import.meta.env.DEV || import.meta.env.VITE_MOCK_ENABLED !== 'true') {
    return
  }

  const { worker } = await import('./mocks/browser')
  await worker.start({ onUnhandledRequest: 'bypass' })
}

function renderApp () {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <MantineProvider>
          <App />
          <Toaster position='top-right' />
        </MantineProvider>
      </QueryClientProvider>
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

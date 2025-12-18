import { Box, Title } from '@praise-app/ui-kit'
import { Navbar } from '../../components/Navbar'

export function HomePage () {
  return (
    <Box>
      <Navbar />

      <Box p='md'>
        <Title order={1}>Home</Title>
      </Box>
    </Box>
  )
}

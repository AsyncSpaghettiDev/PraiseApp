import { Link } from 'react-router'
import { Box, Flex, Button } from '@praise-app/ui-kit'
import { Navbar } from '../../components/Navbar'

export function HomePage () {
  return (
    <Box>
      <Navbar />

      <Box p='md'>
        <h1>Home</h1>
        <Flex gap='md' mt='md'>
          <Button component={Link} to='/create-song' variant='light'>
            Create Song
          </Button>
        </Flex>
      </Box>
    </Box>
  )
}

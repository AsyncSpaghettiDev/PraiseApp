import { Link } from 'react-router'
import { Box, Button, Flex } from '@praise-app/ui-kit'

export function NotFoundPage () {
  return (
    <Flex
      direction='column'
      align='center'
      justify='center'
      style={{ minHeight: '100vh', padding: 16 }}
    >
      <Box style={{ width: '100%', maxWidth: 520, textAlign: 'center' }}>
        <h1>404 - Page Not Found</h1>
        <Button component={Link} to='/' variant='light'>
          Go Home
        </Button>
      </Box>
    </Flex>
  )
}

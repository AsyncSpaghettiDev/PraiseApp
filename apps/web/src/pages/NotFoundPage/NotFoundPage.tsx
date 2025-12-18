import { Link } from 'react-router'
import { Box, Button, Flex, Title } from '@praise-app/ui-kit'

export function NotFoundPage () {
  return (
    <Flex
      direction='column'
      align='center'
      justify='center'
      style={{ minHeight: '100vh', padding: 16 }}
    >
      <Box style={{ width: '100%', maxWidth: 520, textAlign: 'center' }}>
        <Title order={1}>404 - Page Not Found</Title>
        <Button component={Link} to='/' variant='light'>
          Go Home
        </Button>
      </Box>
    </Flex>
  )
}

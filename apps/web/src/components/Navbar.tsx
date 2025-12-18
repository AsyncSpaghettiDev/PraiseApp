import { Link, useNavigate } from 'react-router'
import { Anchor, Box, Button, Flex } from '@praise-app/ui-kit'

interface NavbarProps {
  appName?: string
}

export function Navbar ({ appName = 'Praise App' }: NavbarProps) {
  const navigate = useNavigate()

  const logout = () => {
    window.localStorage.removeItem('token')
    window.localStorage.removeItem('refreshToken')
    navigate('/login', { replace: true })
  }

  return (
    <Box
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        background: '#0B2B5B',
        borderBottom: '1px solid rgba(255,255,255,0.15)'
      }}
      p='md'
    >
      <Flex align='center' justify='space-between'>
        <Flex gap='sm' align='center'>
          <Anchor
            component={Link}
            to='/'
            style={{ textDecoration: 'none', color: 'white', fontWeight: 700 }}
          >
            {appName}
          </Anchor>
          <Button component={Link} to='/songs' variant='light'>
            Songs
          </Button>
          <Button component={Link} to='/setlists' variant='light'>
            Setlists
          </Button>
        </Flex>

        <Flex gap='sm' align='center'>
          <Button variant='filled' onClick={logout}>
            Logout
          </Button>
        </Flex>
      </Flex>
    </Box>
  )
}

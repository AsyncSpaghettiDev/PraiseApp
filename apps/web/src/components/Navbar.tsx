import { Link, useNavigate } from 'react-router'
import { Box, Button, Flex } from '@praise-app/ui-kit'

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
        background: 'white',
        borderBottom: '1px solid rgba(0,0,0,0.08)'
      }}
      p='md'
    >
      <Flex align='center' justify='space-between'>
        <Box>
          <Link to='/' style={{ textDecoration: 'none', color: 'inherit', fontWeight: 700 }}>
            {appName}
          </Link>
        </Box>

        <Button variant='light' onClick={logout}>
          Logout
        </Button>
      </Flex>
    </Box>
  )
}

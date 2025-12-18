import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import toast from 'react-hot-toast'
import { Box, Button, Flex, Input } from '@praise-app/ui-kit'

interface LoginFormData {
  username: string
  password: string
}

export function LoginPage () {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>()

  const onSubmit = async ({ password, username }: LoginFormData) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const responseData = await response.json()
      if (response.ok) {
        window.localStorage.setItem('token', responseData.accessToken)
        window.localStorage.setItem('refreshToken', responseData.refreshToken)
        toast.success('Login successful!')
        navigate('/')
      } else {
        toast.error(responseData.message || 'Login failed')
      }
    } catch (error) {
      console.error(error)
      toast.error('An error occurred during login')
    }
  }

  return (
    <Flex
      direction='column'
      align='center'
      justify='center'
      style={{ minHeight: '100vh', padding: 16 }}
    >
      <Flex gap='md' style={{ marginBottom: 16 }}>
        <Button component={Link} to='/' variant='subtle'>
          Go Home
        </Button>
        <Button component={Link} to='/register' variant='subtle'>
          Register
        </Button>
      </Flex>

      <Box style={{ width: '100%', maxWidth: 420 }}>
        <h1 style={{ textAlign: 'center' }}>Login</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex direction='column' gap='sm'>
            <Input
              type='text'
              placeholder='Username'
              {...register('username', { required: 'Username is required' })}
            />
            {errors.username && (
              <Box style={{ color: 'red', fontSize: 12 }}>{errors.username.message}</Box>
            )}

            <Input
              type='password'
              placeholder='Password'
              {...register('password', { required: 'Password is required' })}
            />
            {errors.password && (
              <Box style={{ color: 'red', fontSize: 12 }}>{errors.password.message}</Box>
            )}

            <Button type='submit'>Login</Button>
          </Flex>
        </form>
      </Box>
    </Flex>
  )
}

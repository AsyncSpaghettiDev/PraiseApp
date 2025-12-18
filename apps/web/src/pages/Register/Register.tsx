import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import toast from 'react-hot-toast'
import { Box, Button, Flex, Input, Title } from '@praise-app/ui-kit'
import { useRegisterMutation } from '../../hooks'

interface RegisterFormData {
  firstName: string
  lastName: string
  username: string
  password: string
  confirmPassword: string
}

export function Register () {
  const navigate = useNavigate()
  const registerMutation = useRegisterMutation()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<RegisterFormData>()

  const password = watch('password')

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const responseData = await registerMutation.mutateAsync({
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        password: data.password
      })
      window.localStorage.setItem('token', responseData.accessToken)
      window.localStorage.setItem('refreshToken', responseData.refreshToken)
      toast.success('Registration successful!')
      navigate('/')
    } catch (error) {
      console.error(error)
      toast.error(error instanceof Error ? error.message : 'An error occurred during registration')
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
        <Button component={Link} to='/login' variant='subtle'>
          Login
        </Button>
      </Flex>

      <Box style={{ width: '100%', maxWidth: 420 }}>
        <Title order={1} style={{ textAlign: 'center' }}>
          Register
        </Title>
        <Box component='form' onSubmit={handleSubmit(onSubmit)}>
          <Flex direction='column' gap='sm'>
            <Input
              type='text'
              placeholder='First Name'
              {...register('firstName', { required: 'First name is required' })}
            />
            {errors.firstName && (
              <Box style={{ color: 'red', fontSize: 12 }}>{errors.firstName.message}</Box>
            )}

            <Input type='text' placeholder='Last Name' {...register('lastName')} />

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

            <Input
              type='password'
              placeholder='Confirm Password'
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) => value === password || 'Passwords do not match'
              })}
            />
            {errors.confirmPassword && (
              <Box style={{ color: 'red', fontSize: 12 }}>{errors.confirmPassword.message}</Box>
            )}

            <Button type='submit' disabled={registerMutation.isPending}>
              Register
            </Button>
          </Flex>
        </Box>
      </Box>
    </Flex>
  )
}

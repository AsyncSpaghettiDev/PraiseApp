import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import toast from 'react-hot-toast'

interface RegisterFormData {
  firstName: string
  lastName: string
  username: string
  password: string
  confirmPassword: string
}

export function Register () {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<RegisterFormData>()

  const password = watch('password')

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          username: data.username,
          password: data.password
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const responseData = await response.json()
      if (response.ok) {
        window.localStorage.setItem('token', responseData.accessToken)
        window.localStorage.setItem('refreshToken', responseData.refreshToken)
        toast.success('Registration successful!')
        navigate('/')
      } else {
        toast.error(responseData.message || 'Registration failed')
      }
    } catch (error) {
      console.error(error)
      toast.error('An error occurred during registration')
    }
  }

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <Link to='/'>Go Home</Link>
      <Link to='/login'>Login</Link>
      <h1 className='text-2xl font-bold text-center'>Register</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col gap-2 max-w-md mx-auto w-full px-4'
      >
        <input
          type='text'
          placeholder='First Name'
          {...register('firstName', { required: 'First name is required' })}
          className='border border-gray-300 rounded-md p-2'
        />
        {errors.firstName && (
          <span className='text-red-500 text-sm'>{errors.firstName.message}</span>
        )}

        <input
          type='text'
          placeholder='Last Name'
          {...register('lastName')}
          className='border border-gray-300 rounded-md p-2'
        />

        <input
          type='text'
          placeholder='Username'
          {...register('username', { required: 'Username is required' })}
          className='border border-gray-300 rounded-md p-2'
        />
        {errors.username && <span className='text-red-500 text-sm'>{errors.username.message}</span>}

        <input
          type='password'
          placeholder='Password'
          {...register('password', { required: 'Password is required' })}
          className='border border-gray-300 rounded-md p-2'
        />
        {errors.password && <span className='text-red-500 text-sm'>{errors.password.message}</span>}

        <input
          type='password'
          placeholder='Confirm Password'
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value) => value === password || 'Passwords do not match'
          })}
          className='border border-gray-300 rounded-md p-2'
        />
        {errors.confirmPassword && (
          <span className='text-red-500 text-sm'>{errors.confirmPassword.message}</span>
        )}

        <button type='submit' className='bg-blue-500 text-white rounded-md p-2'>
          Register
        </button>
      </form>
    </div>
  )
}

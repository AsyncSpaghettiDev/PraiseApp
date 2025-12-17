import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import toast from 'react-hot-toast'

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
    <div className='flex flex-col items-center justify-center h-screen'>
      <Link to='/'>Go Home</Link>
      <Link to='/register'>Register</Link>
      <h1 className='text-2xl font-bold text-center'>Login</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col gap-2 max-w-md mx-auto w-full px-4'
      >
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

        <button type='submit' className='bg-blue-500 text-white rounded-md p-2'>
          Login
        </button>
      </form>
    </div>
  )
}

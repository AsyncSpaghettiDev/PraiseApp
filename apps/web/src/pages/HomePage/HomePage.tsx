import { Link } from 'react-router'

export function HomePage () {
  return (
    <div>
      <h1>Home</h1>
      <div className='flex gap-3'>
        <Link to='/login'>Login</Link>

        <Link to='/create-song'>Create Song</Link>
      </div>
    </div>
  )
}

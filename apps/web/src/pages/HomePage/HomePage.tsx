import { Link } from 'react-router'

export function HomePage () {
  return (
    <div>
      <h1>Home</h1>
      <div style={{ display: 'flex', gap: '10px' }}>
        <Link to='/login'>Login</Link>

        <Link to='/create-song'>Create Song</Link>
      </div>
    </div>
  )
}

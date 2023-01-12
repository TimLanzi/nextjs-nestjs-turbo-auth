import React from 'react'
import Link from 'next/link'
import { useSession } from '@hooks/useSession';
import { Button } from '@ui/atoms/Button'

const Navbar = () => {
  const { data: session, logout } = useSession();

  const handleLogout = async() => {
    await logout();
  }
  return (
    <header className='fixed p-4 w-full justify-between flex'>
      <Link className='text-xl text-indigo-500' href='/'>
        Home Page
      </Link>
      
      { !!session && (
        <Button
          type="button"
          label="Logout"
          onClick={() => handleLogout()}
        />
      )}
    </header>
  )
}

export default Navbar
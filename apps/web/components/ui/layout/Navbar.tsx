import React from 'react'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react';
import { Button } from '@ui/atoms/Button'
import { useTokenStore } from '@stores/tokenStore';

const Navbar = () => {
  const { data: session } = useSession();
  const removeTokens = useTokenStore(s => s.removeTokens);

  return (
    <header className='fixed p-4 w-full justify-between flex'>
      <Link className='text-xl text-indigo-500' href='/'>
        Home Page
      </Link>
      
      { !!session && (
        <Button
          type="button"
          label="Logout"
          onClick={() => signOut().then(() => removeTokens())}
        />
      )}
    </header>
  )
}

export default Navbar
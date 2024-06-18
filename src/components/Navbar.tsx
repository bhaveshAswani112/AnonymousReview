"use client"

import React from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { Button } from './ui/button'

function Navbar() {
    const { data: session } = useSession()
    const user = session?.user

    return (
        <>
            <nav className="bg-gray-800 p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <Link href="#" className="text-white text-xl font-bold">
                        Anonymous Review
                    </Link>
                    <div>
                        {user ? (
                            <Button onClick={() => signOut()} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                                Logout
                            </Button>
                        ) : (
                            <Link href="sign-in" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                                    Login
                            </Link>
                        )}
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar

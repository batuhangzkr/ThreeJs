'use client'
import { useRouter } from 'next/navigation'
import React from 'react'

const Home = () => {
    const router = useRouter();
    return (
        <div className='bg-blue-500 flex justify-center '>
            <div className='flex justify-center'>
                <button onClick={() => router.push('/')}>
                    İşte O Muhteşem küp
                </button>
            </div>
        </div>
    )
}

export default Home
import { useAppStore } from '@/store'
import React from 'react'

const Call = () => {
    const {incoming,outgoing} = useAppStore();

    return (
        <div className='w-full-screen bg-black-500'>

        </div>
    )
}

export default Call

import { MoveRight } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

function Home() {

    const navigate = useNavigate()

    const handleLogin = () =>{
        navigate('/login')
    }
  return (
    <div className='m-0 items-center flex justify-center flex-col gap-10'>
      <p className='text-4xl mt-9'>This is the Home Page for this Dynamic Form Builder </p>
      <div className='flex flex-row gap-2'>
        <p className='mt-2'>Click here to move to Login page</p>
        <MoveRight className='mt-2'/>
        <button onClick={handleLogin} className='h-12 w-20 border rounded-xl bg-blue-500 text-white'>Login</button>
      </div>
    </div>
  )
}

export default Home

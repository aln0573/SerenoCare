import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Login = () => {

  const [state, setState] = useState('Sign Up')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const {token , setToken , backend_Url} = useContext(AppContext)
  const navigate = useNavigate()

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    
    try {
      
      if(state === 'Sign Up'){
        
        const {data} = await axios.post('https://serenocare.onrender.com/api/user/register', {name, email, password})

        if(data.success){
          localStorage.setItem('token',data.token)
          setToken(data.token)
        } else{
          toast.error(data.message)
        }

      } else {

        const {data} = await axios.post('https://serenocare.onrender.com/api/user/login', {email, password})

        if(data.success){
          localStorage.setItem('token',data.token)
          setToken(data.token)
        } else{
          toast.error(data.message)
        }
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

      useEffect(()=> {

      if(token){
        navigate('/')
      }

    },[token])

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center justify-center px-4'>

      <div className='w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-lg p-8'>

        <h2 className='text-3xl font-semibold text-center mb-2'>{state === 'Sign Up' ? 'Create account' : 'Login'}</h2>
        <p className='text-center text-sm text-gray-500 mb-6'> Please {state === 'Sign Up' ? 'sign up' : 'login'} to book your appointment</p>

        {state === 'Sign Up' && (
          <div className='mb-4'>
            <label className='block mb-1 text-sm text-gray-700'>Full Name</label>
            <input  type='text'  value={name}  onChange={(e) => setName(e.target.value)}  required className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500'/>
          </div>
        )}

        <div className='mb-4'>
          <label className='block mb-1 text-sm text-gray-700'>Email</label>
          <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} required className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500'/>
        </div>

        <div className='mb-6'>
          <label className='block mb-1 text-sm text-gray-700'>Password</label>
          <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} required className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500'/>
        </div>

        <button  type='submit' className='w-full bg-red-600 text-white py-2.5 rounded-md hover:bg-red-700 transition duration-300'>
          {state === 'Sign Up' ? 'Create account' : 'Login'}
        </button>

        <p className='text-center text-sm text-gray-600 mt-4'>
          {state === 'Sign Up' ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span onClick={() => setState(state === 'Sign Up' ? 'Login' : 'Sign Up')}  className='text-red-600 cursor-pointer font-medium' >
            {state === 'Sign Up' ? 'Login' : 'Sign Up'}
          </span>
        </p>

      </div>

    </form>
  )
}

export default Login

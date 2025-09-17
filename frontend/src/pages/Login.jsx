import React, { useState } from 'react'
import { client } from '../api'
import { useNavigate } from 'react-router-dom'

export default function Login(){
  const [username,setUsername]=useState('')
  const [password,setPassword]=useState('')
  const [isSignup,setIsSignup]=useState(false)
  const [error,setError]=useState(null)
  const nav = useNavigate()

  const submit = async (e)=>{
    e.preventDefault()
    setError(null)
    try{
      const url = isSignup? '/signup' : '/login'
      const {data} = await client.post(url, {username, password})
      localStorage.setItem('jwt', data.token)
      nav('/dashboard')
    }catch(err){
      setError(err.response?.data?.detail || 'Something went wrong')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={submit} className="max-w-sm w-full border rounded-xl p-6 space-y-4">
        <h1 className="text-xl font-semibold">{isSignup? 'Create account' : 'Welcome back'}</h1>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <input className="border w-full p-2 rounded" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)}/>
        <input className="border w-full p-2 rounded" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)}/>
        <button className="w-full bg-black text-white rounded p-2">{isSignup? 'Sign up' : 'Log in'}</button>
        <button type="button" className="text-sm underline" onClick={()=>setIsSignup(!isSignup)}>
          {isSignup? 'Have an account? Log in' : "New here? Sign up"}
        </button>
      </form>
    </div>
  )
}

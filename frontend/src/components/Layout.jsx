import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

export function Sidebar() {
  const { pathname } = useLocation()
  const link = (to, label) => (
    <Link className={`block px-4 py-2 rounded hover:bg-gray-100 ${pathname===to?'bg-gray-100':''}`} to={to}>{label}</Link>
  )
  return (
    <aside className="w-60 border-r p-4 space-y-2">
      <div className="text-xl font-semibold mb-4">Contracts RAG</div>
      {link('/dashboard','Contracts')}
      {link('/insights','Insights')}
      {link('/reports','Reports')}
      {link('/settings','Settings')}
    </aside>
  )
}

export function Topbar() {
  const nav = useNavigate()
  const logout = () => { localStorage.removeItem('jwt'); nav('/login') }
  return (
    <header className="h-14 border-b px-4 flex items-center justify-between">
      <div className="font-medium">Business Dashboard</div>
      <button className="text-sm underline" onClick={logout}>Logout</button>
    </header>
  )
}

export function Page({children}){
  return <div className="flex h-screen">
    <Sidebar/>
    <div className="flex-1 flex flex-col">{children}</div>
  </div>
}

import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './Login'
import Dashboard from './Dashboard'
import Upload from './Upload'
import ContractDetail from './ContractDetail'
import Ask from './Ask'
import Insights from './Insights'
import Reports from './Reports'
import Settings from './Settings'
import { Page, Topbar } from '../components/Layout'

const Private = ({children}) => {
  const token = localStorage.getItem('jwt')
  return token ? children : <Navigate to="/login"/>
}

export default function App(){
  return (
    <Routes>
      <Route path="/login" element={<Login/>} />
      <Route path="/" element={<Navigate to="/dashboard"/>} />
      <Route path="/" element={<Private><Page><Topbar/></Page></Private>} />
      <Route path="/dashboard" element={<Private><Page><Topbar/><Dashboard/></Page></Private>} />
      <Route path="/upload" element={<Private><Page><Topbar/><Upload/></Page></Private>} />
      <Route path="/contracts/:id" element={<Private><Page><Topbar/><ContractDetail/></Page></Private>} />
      <Route path="/ask" element={<Private><Page><Topbar/><Ask/></Page></Private>} />
      <Route path="/insights" element={<Private><Page><Topbar/><Insights/></Page></Private>} />
      <Route path="/reports" element={<Private><Page><Topbar/><Reports/></Page></Private>} />
      <Route path="/settings" element={<Private><Page><Topbar/><Settings/></Page></Private>} />
    </Routes>
  )
}

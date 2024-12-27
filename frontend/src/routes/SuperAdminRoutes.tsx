import React from 'react'
import { Route, Routes } from 'react-router-dom'
import SuperAdminLogin from '../components/admin/SuperAdminLogin'

const SuperAdminRoutes : React.FC = () => {
  return (
    
    <Routes>
      <Route path="login" element={ <SuperAdminLogin/> } />
    </Routes>


  )
}

export default SuperAdminRoutes
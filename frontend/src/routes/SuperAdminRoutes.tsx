import React from 'react'
import { Route, Routes } from 'react-router-dom'
import SuperAdminLogin from '../components/superAdmin/SuperAdminLogin'
import SuperAdminDashboard from '../pages/dashboards/SuperAdminDashboard'

const SuperAdminRoutes : React.FC = () => {
  return (
    
    <Routes>
      <Route path="dashboard" element={ <SuperAdminDashboard/> } />
    </Routes>


  )
}

export default SuperAdminRoutes
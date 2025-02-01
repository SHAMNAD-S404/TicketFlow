
import React from 'react'
import { Route,Routes } from 'react-router-dom'
import EmployeeDashboard from '../pages/dashboards/EmployeeDashboard'


const EmployeeRoutes : React.FC= () => {
  return (
   
    <Routes>
        <Route path='dashboard' element={<EmployeeDashboard/>} />
    </Routes>

  )
}

export default EmployeeRoutes
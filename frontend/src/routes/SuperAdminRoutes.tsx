import React from 'react'
import { Route, Routes } from 'react-router-dom'
import SuperAdminDashboard from '../pages/dashboards/SuperAdminDashboard'
import SDashHome from '@/components/superAdmin/dashboard/SDashHome'
import CompanyManagement from '@/components/superAdmin/CompanyManagement'
import SubscriptionManagement from '@/components/superAdmin/SubscriptionManagement'
import NotFound from '@/pages/404'

const SuperAdminRoutes : React.FC = () => {
  return (
    
    <Routes>
      <Route path="dashboard/" element={ <SuperAdminDashboard/> } >
          <Route  path='dashboard' element={<SDashHome/>} />
          <Route path='companymanagement' element={<CompanyManagement/>} />
          <Route path='subscription' element={<SubscriptionManagement/>} />
          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>


  )
}

export default SuperAdminRoutes
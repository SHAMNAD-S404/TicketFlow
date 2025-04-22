// import React from 'react'
// import { Route, Routes } from 'react-router-dom';
// import Dashboard from '../pages/dashboards/CompanyDashboard';
// import PaymentSuccess from '@/pages/payment/PaymentSuccess';

// const CompanyAdminRoutes : React.FC = () => {
//   return (

//     <Routes>
//         <Route path='dashboard' element= { <Dashboard/> } />
//         <Route path='/payment/success'  element={<PaymentSuccess/>} />
//     </Routes>
//   )
// }

// export default CompanyAdminRoutes


import React from 'react'
import { Route, Routes } from 'react-router-dom';
import Dashboard from '../pages/dashboards/CompanyDashboard';
import PaymentSuccess from '@/pages/payment/PaymentSuccess';
import ShowSubscription from '@/components/company/subscription/ShowSubscription';
import ProfileUI from '@/components/company/profileMenu/mainMenu/ProfileUI';
import { TicketHome } from '@/components/company/Ticket/TicketHome';
import EmployeeManagement from '@/components/company/employeeMenu/mainMenu/EmployeeManagement';
import DepartmentManagement from '@/components/company/departmentMenu/mainMenu/DepartmentManagement';
import DashHome from '@/components/company/dashboard/DashHome';
import PaymentCancel from '@/pages/payment/PaymentCancel';
import PurchaseHistory from '@/components/company/subscription/PurchaseHistory';
import CompanyChat from '@/components/company/chat/CompanyChat';

const CompanyAdminRoutes : React.FC = () => {
  return (

    <Routes>
        <Route path='dashboard/' element= { <Dashboard/> } >
          <Route path="subscription" element={<ShowSubscription/>} />
          <Route path='payment/success'  element={<PaymentSuccess/>} />
          <Route path='payment/cancel' element={<PaymentCancel/>} />
          <Route path='purchase-history' element={<PurchaseHistory/>} />
          <Route path='profile' element={<ProfileUI/>} />
          <Route path='tickets' element={<TicketHome/>} />
          <Route path='employeemanagement' element={<EmployeeManagement/>} />
          <Route path='departmentmanagement' element={<DepartmentManagement/>} />
          <Route path='dashboard' element={<DashHome/>} />
          <Route path='chat' element={<CompanyChat/>} />
        </Route>

    </Routes>
  )
}

export default CompanyAdminRoutes
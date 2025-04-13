import ShowSubscription from '@/components/company/subscription/ShowSubscription'
import { PaymentCancel } from '@/components/payment/PaymentCancel'
import { PaymentSuccess } from '@/components/payment/PaymentSuccess'
import React from 'react'
import { Route,Routes } from 'react-router-dom'


const PaymentRoutes : React.FC= () => {
  return (
   
    <Routes>
        <Route path='/subscription' element={<ShowSubscription/>} />
          {/* New payment routes */}
    <Route path="/success" element={<PaymentSuccess />} />
    <Route path="/cancel" element={<PaymentCancel />} />
    </Routes>

  )
}

export default PaymentRoutes
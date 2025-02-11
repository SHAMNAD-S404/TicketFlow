import React from 'react'
import { Route,Routes } from 'react-router-dom'
import SignUp from '../pages/SignUp'
import SignIn from '../pages/SignIn'
import NewPassword from '../components/signIn/NewPassword'
import SuperAdminLogin from '../components/superAdmin/SuperAdminLogin'

const AuthRoutes : React.FC = () => {
  return (
    
    <Routes>
        <Route path='signup' element= { <SignUp/> } />
        <Route path='login' element= { <SignIn/> } />
        <Route path='employee/resetPassword' element = { <NewPassword userType='employee'/> } />
        <Route path='sudo/login' element = {<SuperAdminLogin/>} />
    </Routes>
  )
}

export default AuthRoutes
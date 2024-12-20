import React from 'react'
import { Route,Routes } from 'react-router-dom'
import SignUp from '../pages/SignUp'
import SignIn from '../pages/SignIn'

const AuthRoutes : React.FC = () => {
  return (
    
    <Routes>
        <Route path='/signup' element= { <SignUp/> } />
        <Route path='/login' element= { <SignIn/> } />
    </Routes>
  )
}

export default AuthRoutes
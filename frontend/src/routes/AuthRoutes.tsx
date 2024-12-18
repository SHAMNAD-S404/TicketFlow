import React from 'react'
import { Route,Routes } from 'react-router-dom'
import SignUp from '../pages/SignUp'

const AuthRoutes : React.FC = () => {
  return (
    
    <Routes>
        <Route path='/signup' element= { <SignUp/> } />
    </Routes>
  )
}

export default AuthRoutes
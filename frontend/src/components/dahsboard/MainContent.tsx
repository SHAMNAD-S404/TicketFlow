import React from 'react'
import { useUser } from '../../pages/Dashboard';

interface MainContentProps {
  activeMenu : string;
}

const MainContent : React.FC <MainContentProps> = ({activeMenu}) => {

  const userData = useUser();
  if(!userData) return <div>loading....</div>

  return (

    <div className='p-6 bg-gray-100 flex-1'>



        <h2 className='text-2xl font-bold'  >{activeMenu}</h2>
        <p className='mt-4' >this is the content for the a {activeMenu} page. </p>
        <p className='font-bold'>{userData.companyName }</p>
        <p>{userData.companyType}</p>

    </div>
  )
}

export default MainContent
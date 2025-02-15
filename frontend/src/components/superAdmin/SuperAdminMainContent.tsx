import React from 'react'
import { DefaultComponent } from '../common/DefaultComponent';
import { superAdminMenuComponents } from './superAdminMenuComponents';

interface MainContentProps {
  activeMenu : string;
}


const CompanyMainContent : React.FC <MainContentProps> = ({activeMenu}) => {

//   const ActiveComponent = menuComponents[activeMenu] || DefaultComponent;
  const ActiveComponent =  superAdminMenuComponents[activeMenu] || DefaultComponent;


  return (
    <div className='p-6 bg-gray-100 flex-1'>
        <h2 className='text-2xl font-bold text-center mb-2'  >{activeMenu}</h2>
        <ActiveComponent/>
    </div>
  )
}

export default CompanyMainContent;
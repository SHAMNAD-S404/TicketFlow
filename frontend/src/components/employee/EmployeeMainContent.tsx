import React from 'react'
import { menuComponents } from './menuComponents';
import { DefaultComponent } from '../common/DefaultComponent';
import { useEmployeeData } from '../../pages/dashboards/EmployeeDashboard';

interface MainContentProps {
  activeMenu : string;
}

const EmployeeMainContent : React.FC <MainContentProps> = ({activeMenu}) => {

  const userData = useEmployeeData();
  if(!userData) return <div>loading....</div>

  const ActiveComponent = menuComponents[activeMenu] || DefaultComponent;

  return (
    <div className='p-6 bg-gray-100 flex-1'>
        <h2 className='text-2xl font-bold text-center mb-2'  >{activeMenu}</h2>
        <ActiveComponent/>
    </div>
  )
}

export default EmployeeMainContent;
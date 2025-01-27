import React, { useState } from 'react'
import DynamicCard from '../../../../utility/DynamicCard';
import CardImage from '../../../../../assets/images/register.png'
import CardImage2 from '../../../../../assets/images/userlogin.png'



const EmployeeManagement : React.FC = () => {

    const [aciveSubMenu , setActiveSubMenu] = useState<string | null>(null);

  return (
    <div className='flex flex-wrap gap-12 justify-center p-6'>
    
        <DynamicCard
            header='Employee Registration'
            description='Register employees and manage their details easily.'
            buttonText='Register'
            onButtonClick={()=> setActiveSubMenu("Employee Registration")}
            image={CardImage}
        />

          <DynamicCard
            header='Manage Employees'
            description='Manage employees and theire details'
            buttonText='Manage'
            onButtonClick={()=> setActiveSubMenu("Mange Employees")}
            image={CardImage2}
        />
       

       
      


        
    </div>
  )
}

export default EmployeeManagement
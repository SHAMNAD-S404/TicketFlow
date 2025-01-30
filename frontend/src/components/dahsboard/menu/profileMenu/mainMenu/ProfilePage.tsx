import React, { useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import ProfileUI from './ProfileUI';
import ProfileEdit from '../subMenu/EditProfile';
import EmployeeProfileEdit from '../subMenu/EmployeeProfileEdit';
import { useUser } from '../../../../../pages/Dashboard';

const ProfilePage : React.FC = () => {


  const [currentView, setCurrentView] = useState<'view' | 'edit'>('view');
  const userData =  useUser().user;
  const userRole = userData?.role || localStorage.getItem("userRole");
//   const { isLoading } = useProfile();

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-purple-100 to-purple-200 p-4 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
//       </div>
//     );
//   }

  return (
    <div className="">
      

          {currentView === 'edit' ? (
            userRole === "company" ? (
            <ProfileEdit onCancel={() => setCurrentView('view')} />
            ) : (
                <EmployeeProfileEdit 
                onCancel = {()=> setCurrentView("view")}
                />
            )
          ) : (
            <ProfileUI onEdit={() => setCurrentView('edit')} />
          )}
       
    </div>
  );
}

export default ProfilePage;
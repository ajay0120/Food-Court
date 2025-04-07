// import React, { useState } from "react";
// // import { useDataContext } from "../DataContext";
// import Avatar from "react-avatar";

// const PersonalInfo = () => {
    
//   const { userData, updatePersonalInfo } = useDataContext();
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({
//     first_name: userData.first_name || "",
//     last_name: userData.last_name || "",
//     dob: userData.dob || "",
//     mobile_no: userData.mobile_no || "",
//   });

//   const toggleEditMode = () => {
//     setIsEditing(!isEditing);
//     if (!isEditing) {
//       setFormData({
//         first_name: userData.first_name || "",
//         last_name: userData.last_name || "",
//         dob: userData.dob || "",
//         mobile_no: userData.mobile_no || "",
//       });
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSave = () => {
//     updatePersonalInfo(formData);
//     setIsEditing(false);
//   };

//   const fullName = `${userData.first_name} ${userData.last_name}`;

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center py-12 bg-gray-100">
//       {/* Profile Card */}
//       <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg max-w-md mb-8 w-full">
//         <Avatar
//           name={fullName || userData.username}
//           size="100"
//           round={true}
//           className="mx-auto mb-4"
//         />
//         {fullName && (
//           <p className="text-xl mb-2 text-center">
//             <strong>Name:</strong> {fullName}
//           </p>
//         )}
//         <p className="text-xl mb-2 text-center">
//           <strong>Username:</strong> {userData.username}
//         </p>
//         <p className="text-xl text-center">
//           <strong>Email:</strong> {userData.email}
//         </p>
//       </div>

//       {/* Info Edit Section */}
//       <div className="bg-white shadow-xl rounded-lg overflow-hidden w-full max-w-4xl">
//         <div className="bg-blue-600 text-white py-5 px-6 text-center">
//           <h1 className="text-2xl font-semibold">Personal Information</h1>
//         </div>

//         <div className="px-8 py-10">
//           <div className="flex justify-end mb-6">
//             <button
//               onClick={toggleEditMode}
//               className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition duration-200"
//             >
//               {isEditing ? "Cancel" : "Edit"}
//             </button>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             {/* First Name */}
//             <div className="mb-5">
//               <h2 className="mb-1 font-medium">First Name</h2>
//               {isEditing ? (
//                 <input
//                   type="text"
//                   name="first_name"
//                   value={formData.first_name}
//                   onChange={handleInputChange}
//                   className="border border-gray-300 rounded-md p-2 w-full"
//                 />
//               ) : (
//                 <div className="bg-gray-100 rounded-md px-4 py-3 text-gray-700">
//                   {userData.first_name}
//                 </div>
//               )}
//             </div>

//             {/* Last Name */}
//             <div className="mb-5">
//               <h2 className="mb-1 font-medium">Last Name</h2>
//               {isEditing ? (
//                 <input
//                   type="text"
//                   name="last_name"
//                   value={formData.last_name}
//                   onChange={handleInputChange}
//                   className="border border-gray-300 rounded-md p-2 w-full"
//                 />
//               ) : (
//                 <div className="bg-gray-100 rounded-md px-4 py-3 text-gray-700">
//                   {userData.last_name}
//                 </div>
//               )}
//             </div>

//             {/* Date of Birth */}
//             <div className="mb-5">
//               <h2 className="mb-1 font-medium">Date of Birth</h2>
//               {isEditing ? (
//                 <input
//                   type="date"
//                   name="dob"
//                   value={formData.dob}
//                   onChange={handleInputChange}
//                   className="border border-gray-300 rounded-md p-2 w-full"
//                 />
//               ) : (
//                 <div className="bg-gray-100 rounded-md px-4 py-3 text-gray-700">
//                   {userData.dob
//                     ? new Date(userData.dob).toLocaleDateString()
//                     : "N/A"}
//                 </div>
//               )}
//             </div>

//             {/* Mobile Number */}
//             <div className="mb-5">
//               <h2 className="mb-1 font-medium">Mobile Number</h2>
//               {isEditing ? (
//                 <input
//                   type="number"
//                   name="mobile_no"
//                   value={formData.mobile_no}
//                   onChange={handleInputChange}
//                   className="border border-gray-300 rounded-md p-2 w-full"
//                 />
//               ) : (
//                 <div className="bg-gray-100 rounded-md px-4 py-3 text-gray-700">
//                   {userData.mobile_no}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Save Button */}
//           {isEditing && (
//             <div className="flex justify-end">
//               <button
//                 onClick={handleSave}
//                 className="px-4 py-2 bg-green-500 text-white rounded-md"
//               >
//                 Save
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PersonalInfo;


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from 'react-avatar';

function PersonalInfo() {
    const username =localStorage.getItem("username");
    const email = localStorage.getItem("email");
    const name = localStorage.getItem("name");
  return (
    <div className="min-h-screen flex justify-center items-center py-12">
      <div className="bg-gray-800 shadow-xl rounded-lg overflow-hidden w-full max-w-4xl">
        {/* Header Section */}
        <div className="bg-orange-500 text-white py-5 px-6 text-center">
          <h1 className="text-2xl font-semibold">Personal Information</h1>
        </div>

        <div className="px-8 py-10">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                    <Avatar
                    color={Avatar.getRandomColor("sitebase", ["blue"])}
                    name={username}
                    size="60"
                    round={true}
                    />
                    
                </div>
                <div>
                    <h2 className="text-lg font-medium text-white">
                    {name} 
                    </h2>
                    <p className="text-sm text-white">{email}</p>
                </div>

                {/* Form Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* name */}
                    <div className="mb-5">
                    <h2>Name</h2>
                    <div className="bg-gray-100 rounded-md px-4 py-3 text-gray-700">
                        {name}
                    </div>
                    </div>

                    {/* UserName */}
                    <div className="mb-5">
                    <h2>User Name</h2>
                        <div className="bg-gray-100 rounded-md px-4 py-3 text-gray-700">
                        {username}
                        </div>
                    </div>

                    {/* Email */}
                    <div className="mb-5">
                        <h2>Email</h2>
                        <div className="bg-gray-100 rounded-md px-4 py-3 text-gray-700">
                            {email}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default PersonalInfo

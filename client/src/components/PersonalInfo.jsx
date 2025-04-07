import React from "react";
import Avatar from "react-avatar";

function PersonalInfo() {
  const username = localStorage.getItem("username");
  const email = localStorage.getItem("email");
  const name = localStorage.getItem("name");

  return (
    <div className="min-h-screen flex justify-center items-center py-12 bg-black text-white">
      <div className="bg-gray-800 shadow-xl rounded-lg overflow-hidden w-full max-w-4xl">
        {/* Header */}
        <div className="bg-orange-500 text-white py-5 px-6">
          <h1 className="text-2xl font-semibold">Personal Information</h1>
        </div>

        {/* Content */}
        <div className="px-8 py-10">
          {/* Avatar and Basic Info */}
          <div className="flex items-center space-x-4 ">
            <Avatar
              color={Avatar.getRandomColor("sitebase", ["blue"])}
              name={username}
              size="80"
              round={true}
              className="mb-4"
            />
            <div className="flex-col  ">
                <h2 className="text-xl  font-medium">{name}</h2>
                <p className="text-sm ">{email}</p>
            </div>
            
          </div>

          {/* Detailed Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Name */}
            <div className="mb-5">
              <h2 className="text-gray-300 mb-1">Name</h2>
              <div className="bg-gray-100 rounded-md px-4 py-3 text-gray-800">
                {name}
              </div>
            </div>

            {/* Username */}
            <div className="mb-5">
              <h2 className="text-gray-300 mb-1">Username</h2>
              <div className="bg-gray-100 rounded-md px-4 py-3 text-gray-800">
                {username}
              </div>
            </div>

            {/* Email */}
            <div className="mb-5">
              <h2 className="text-gray-300 mb-1">Email</h2>
              <div className="bg-gray-100 rounded-md px-4 py-3 text-gray-800">
                {email}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PersonalInfo;

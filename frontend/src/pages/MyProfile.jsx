import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import { toast } from 'react-toastify';

const MyProfile = () => {
  const { userData, setUserData, token } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const updateUserProfileData = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("address", JSON.stringify({
        line1: userData.address.line1,
        line2: userData.address.line2
      }));
      formData.append("gender", userData.gender);
      formData.append("dob", userData.dob);
      if (image) formData.append("image", image);

      const res = await fetch('http://localhost:4000/api/user/update-profile', {
        method: 'POST',
        headers: {token},
        body: formData
      });

      const result = await res.json();

      if (!result.success) throw new Error(result.message);

      setUserData(result.userData);
      toast.success(result.message || "Profile updated successfully!");
      setIsEdit(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.message || "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return userData && (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-3xl bg-white border border-gray-200 rounded-xl shadow-lg p-8">

        {/* Profile Image & Name */}
        <div className="flex flex-col items-center gap-3 mb-6">
          {isEdit ? (
            <>
              <label htmlFor="image" className="relative cursor-pointer">
                <img src={image ? URL.createObjectURL(image) : userData.image} alt="Profile Preview" className="w-28 h-28 object-cover rounded-full border border-gray-300"/>
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 hover:opacity-100 transition">
                  <img src={assets.upload_icon} alt="Upload" className="w-8 h-8" />
                </div>
                <input type="file" id="image" accept="image/*" hidden onChange={(e) => setImage(e.target.files[0])}/>
              </label>

              <input type="text" value={userData.name} onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))} className="text-xl font-semibold text-center border border-gray-300 rounded-md px-4 py-1 focus:outline-none focus:ring-2 focus:ring-red-500"/>
            </>
          ) : (
            <>
              <img src={userData.image} alt="Profile" className="w-28 h-28 object-cover rounded-full border border-gray-300"/>
              <p className="text-xl font-semibold">{userData.name}</p>
            </>
          )}
        </div>

        <hr className="mb-6" />

        {/* Contact Information */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">CONTACT INFORMATION</h3>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600 mb-1">Email</p>
              <p className="font-medium">{userData.email}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Phone</p>
              {isEdit ? (
                <input type="text" value={userData.phone} onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))} className="w-full border border-gray-300 rounded-md px-4 py-1 focus:outline-none focus:ring-2 focus:ring-red-500"/>
              ) : (
                <p className="font-medium">{userData.phone}</p>
              )}
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Address</p>
              {isEdit ? (
                <div className="space-y-2">
                  <input type="text" value={userData.address.line1} onChange={(e) => setUserData(prev => ({...prev, address: { ...prev.address, line1: e.target.value }}))} className="w-full border border-gray-300 rounded-md px-4 py-1 focus:outline-none focus:ring-2 focus:ring-red-500"/>
                  <input type="text" value={userData.address.line2} onChange={(e) => setUserData(prev => ({...prev,address: { ...prev.address, line2: e.target.value }}))} className="w-full border border-gray-300 rounded-md px-4 py-1 focus:outline-none focus:ring-2 focus:ring-red-500"/>
                </div>
              ) : (
                <p className="font-medium">
                  {userData.address.line1}<br />{userData.address.line2}
                </p>
              )}
            </div>
          </div>
        </div>

        <hr className="mb-6" />

        {/* Basic Information */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">BASIC INFORMATION</h3>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Gender</p>
              {isEdit ? (
                <select value={userData.gender} onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))} className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              ) : (
                <p className="font-medium">{userData.gender}</p>
              )}
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Birthday</p>
              {isEdit ? (
                <input type="date" value={userData.dob} onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))} className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"/>
              ) : (
                <p className="font-medium">{userData.dob}</p>
              )}
            </div>
          </div>
        </div>

        {/* Edit / Save Button */}
        <div className="flex justify-end">
          {isEdit ? (
            <button onClick={updateUserProfileData} disabled={loading} className={`${ loading ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'} text-white px-6 py-2 rounded-md transition`}>
              {loading ? 'Saving...' : 'Save Information'}
            </button>
          ) : (
            <button onClick={() => setIsEdit(true)} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition">
              Edit
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default MyProfile;

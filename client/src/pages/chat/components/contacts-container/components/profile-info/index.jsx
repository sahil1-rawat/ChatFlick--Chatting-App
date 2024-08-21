import { apiClient } from '@/lib/api-client';
import { getColor } from '@/lib/utils';
import ToolTips from '@/pages/Extra/ToolTips.jsx';
import { useAppStore } from '@/store';
import { HOST, LOGOUT_ROUTE } from '@/utils/constants';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import React from 'react';
import { MdLogout, MdEdit } from 'react-icons/md';
import { HiOutlinePencil } from 'react-icons/hi';

import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUserCircle } from 'react-icons/fa';

const ProfileInfo = () => {
  const { userInfo, setUserInfo, setSelectedChatData } = useAppStore();
  const navigate = useNavigate();
  const logOut = async () => {
    try {
      const res = await apiClient.post(
        LOGOUT_ROUTE,
        {},
        { withCredentials: true }
      );
      if (res.status === 200) {
        navigate('/auth');
        setUserInfo(null);

        toast.success('Goodbye for now!');
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className='absolute bottom-0 h-16 flex items-center justify-between px-10 w-full bg-[#2a2b33]'>
      <div className='flex gap-3 items-center justify-center'>
        <div className='w-12 h-12 relative'>
          <Avatar className='h-12 w-12 rounded-full overflow-hidden'>
            {userInfo.image ? (
              <AvatarImage
                src={`${HOST}/${userInfo.image}`}
                alt='profile'
                className='object-fill h-12 w-12 rounded-[50%] bg-black'
              />
            ) : (
              <div className={`h-12 w-12 `}>
                <FaUserCircle
                  className={`${getColor(
                    userInfo.color
                  )} h-full w-full rounded-full`}
                />
              </div>
            )}
          </Avatar>
        </div>
        <div className='text-sm lg:text-md font-serif font-semibold line-clamp-2'>
          {userInfo.firstName || userInfo.lastName
            ? `${userInfo.firstName} ${userInfo.lastName}`
            : ''}
        </div>
      </div>
      <div className='flex gap-5 '>
        <ToolTips
          icon={
            <HiOutlinePencil
              className='text-[#0abde3] text-xl '
              onClick={() => {
                navigate('/profile');
              }}
            />
          }
          content='Edit Profile'
        />
        <ToolTips
          icon={<MdLogout className='text-red-500 text-xl' onClick={logOut} />}
          content='Logout'
        />
      </div>
    </div>
  );
};
export default ProfileInfo;

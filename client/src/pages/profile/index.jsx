import { useAppStore } from '@/store';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import { Avatar } from '@radix-ui/react-avatar';
import { AvatarImage } from '@/components/ui/avatar';
import { colors, getColor } from '@/lib/utils';
import { FaEdit, FaUserCircle } from 'react-icons/fa';
import { Button } from '@/components/ui/button';

import { toast } from 'react-toastify';
import { apiClient } from '@/lib/api-client.js';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from '@/components/ui/menubar';

import ToolTips from '../Extra/ToolTips';
import {
  ADD_PROFILE_IMAGE_ROUTE,
  HOST,
  REMOVE_PROFILE_IMAGE_ROUTE,
  UPDATE_PROFILE_ROUTE,
} from '@/utils/constants.js';
import { HiOutlinePencilAlt } from 'react-icons/hi';
import { MdArrowBack } from 'react-icons/md';

const Profile = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [image, setImage] = useState(null);
  const [initialImage, setInitialImage] = useState(null); // Track initial image state
  const [bio, setBio] = useState(''); // New state for bio
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const [isChanged, setIsChanged] = useState(false);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (userInfo.profileSetup) {
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setSelectedColor(userInfo.color);
      setBio(userInfo.bio || ''); // Initialize bio state
    }

    if (userInfo.image) {
      const imageUrl = `${HOST}/${userInfo.image}`;
      setImage(imageUrl);
      setInitialImage(imageUrl);
    }
  }, [userInfo]);

  useEffect(() => {
    const hasChanges = () => {
      return (
        firstName !== userInfo.firstName ||
        lastName !== userInfo.lastName ||
        selectedColor !== userInfo.color ||
        image !== initialImage ||
        bio !== userInfo.bio // Check if bio has changed
      );

      return false;
    };
    setIsChanged(hasChanges());
  }, [firstName, lastName, selectedColor, image, userInfo, initialImage, bio]);

  const validateProfile = () => {
    if (!firstName && !lastName) {
      toast.dismiss();
      toast.error('Your name cannot be empty');
      if (userInfo.firstName || userInfo.lastName) {
        setFirstName(userInfo.firstName);
        setLastName(userInfo.lastName);
      }
      return false;
    }

    return true;
  };

  const saveChange = async () => {
    if (validateProfile()) {
      try {
        const res = await apiClient.post(
          UPDATE_PROFILE_ROUTE,
          {
            firstName,
            lastName,
            color: selectedColor,
            bio, // Include bio in the API request
          },
          { withCredentials: true }
        );
        if (res.status === 200 && res.data) {
          setUserInfo({ ...res.data });
          toast.dismiss();
          toast.success('Profile Updated..');
          navigate('/chat');
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleNavigate = () => {
    if (userInfo.profileSetup) {
      navigate('/chat');
    } else {
      toast.dismiss();
      toast.error('Please setup profile');
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];

    try {
      if (file) {
        const formData = new FormData();
        formData.append('profile-image', file);

        const res = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE, formData, {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log(formData);

        if (res.status === 200 && res.data.image) {
          setUserInfo({ ...userInfo, image: res.data.image });
          toast.dismiss();
          toast.success('Image Updated...');
          setHovered(false);
        }
        const reader = new FileReader();
        reader.onload = () => {
          setImage(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteImage = async () => {
    try {
      const res = await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE, {
        withCredentials: true,
      });
      if (res.status === 200) {
        setUserInfo({ ...userInfo, image: null });
        toast.dismiss();
        toast.success('Image removed successfully');
        setImage(null);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleViewImage = () => {
    image && window.open(image, '_blank');
  };

  // Handler for bio change with character limit
  const handleBioChange = (e) => {
    const newBio = e.target.value;

    // Allow editing even if it doesn't match the full regex after backspacing
    if (
      /^[a-zA-Z!@#\$%\^\&*\)\(+=._-]+(\s?[a-zA-Z!@#\$%\^\&*\)\(+=._-]*)?$/.test(
        newBio
      ) ||
      newBio === ''
    ) {
      if (newBio.length <= 139) {
        setBio(newBio);
      }
    }

    const textarea = textareaRef.current;
    textarea.style.height = 'auto'; // Reset the height first
    textarea.style.height = `${Math.min(textarea.scrollHeight, 3 * 24)}px`;
  };

  const handleNameChange = (e, setName) => {
    const { value } = e.target;

    if (/^[a-zA-Z]+(\s?[a-zA-Z]*)?$/.test(value) || value === '') {
      setName(value);
    }
  };

  return (
    <div className='bg-[#2c3e50] h-[100vh] flex items-center justify-center flex-col gap-10'>
      <div className='flex flex-col gap-10 w-[80vw] md:w-max'>
        <div onClick={handleNavigate}>
          <ToolTips
            icon={
              <MdArrowBack className='text-4xl lg:text-4xl text-white/90 cursor-pointer' />
            }
            content='Back'
          />
        </div>
        <div className='grid grid-cols-2'>
          <div
            className='h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center'
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}>
            <Avatar className='h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden'>
              {image ? (
                <AvatarImage
                  src={image}
                  alt='profile'
                  className='object-fill w-full bg-black'
                />
              ) : (
                <div className={` h-32 w-32 md:w-48 md:h-48 }`}>
                  <FaUserCircle
                    className={`${getColor(selectedColor)} h-full w-full`}
                  />
                </div>
              )}
            </Avatar>
            {hovered &&
              (!image ? (
                <div
                  className='absolute inset-0 flex items-center justify-center bg-black/50 ring-fuchsia-50 rounded-[50%] max-[768px]:h-32 max-[768px]:w-32 max-[768px]:top-[95px] cursor-pointer '
                  onClick={handleFileInputClick}>
                  <ToolTips
                    icon={
                      <HiOutlinePencilAlt className='text-2xl text-black/90' />
                    }
                    content='Edit Profile'
                  />{' '}
                </div>
              ) : (
                <Menubar className='p-0 border-none'>
                  <MenubarMenu>
                    <MenubarTrigger className='p-0'>
                      <div className='absolute inset-0 flex items-center justify-center bg-white/30 ring-fuchsia-50 rounded-[50%] max-[768px]:h-32 max-[768px]:w-32 max-[768px]:top-[95px] cursor-pointer'>
                        <HiOutlinePencilAlt
                          className='text-2xl text-black'
                          aria-label='edit profile'
                        />
                      </div>
                    </MenubarTrigger>
                    <MenubarContent
                      className='min-w-0 bg-[#2c2e3b] p-0 m-0 shadow-none border-none outline-none leading-none hover:bg-[#2c2e3b]'
                      side='top'
                      align='center'
                      sideOffset={5}
                      alignOffset={10}>
                      <MenubarItem className='bg-none p-0 m-0 shadow-none border-none outline-none leading-none hover:bg-[#2c2e3b]  rounded-none '>
                        <Button
                          className=' bg-[#2c2e3b] hover:bg-[#353745] text-white border-none rounded-none'
                          onClick={handleDeleteImage}>
                          Remove image
                        </Button>
                      </MenubarItem>
                      {!isChanged && (
                        <MenubarItem className=' bg-none p-0 m-0 shadow-none border-none outline-none leading-none hover:bg-[#2c2e3b]  rounded-none w-20'>
                          <Button
                            className=' bg-[#2c2e3b] hover:bg-[#353745] text-white border-none rounded-none'
                            onClick={handleViewImage}>
                            View image
                          </Button>
                        </MenubarItem>
                      )}
                      <MenubarItem className=' bg-none p-0 m-0 shadow-none border-none outline-none leading-none hover:bg-[#2c2e3b] w-0 rounded-none'>
                        <Button
                          className=' bg-[#2c2e3b] hover:bg-[#353745] text-white border-none rounded-none'
                          onClick={handleFileInputClick}>
                          Change image
                        </Button>
                      </MenubarItem>
                    </MenubarContent>
                  </MenubarMenu>
                </Menubar>
              ))}
            <input
              type='file'
              ref={fileInputRef}
              className='hidden'
              onChange={handleImageChange}
              name='profile-image'
              accept='.png,.jpg,.jpeg,.svg,.webp'
            />
          </div>
          <div className='flex items-center justify-center min-w-32 md:min-w-64 flex-col gap-5 text-white'>
            <div className='flex flex-col gap-5 text-white'>
              <input
                type='email'
                value={userInfo.email}
                disabled
                className='bg-[#2c2e3b] border-[1px] border-gray-600 text-white p-2 rounded-md outline-none cursor-not-allowed'
              />
              <input
                type='text'
                value={firstName}
                onChange={(e) => handleNameChange(e, setFirstName)}
                className='bg-[#2c2e3b] border-[1px] border-gray-600 text-white p-2 rounded-md outline-none'
                placeholder='First Name'
                autoComplete='off'
              />
              <input
                type='text'
                value={lastName}
                onChange={(e) => handleNameChange(e, setLastName)}
                className='bg-[#2c2e3b] border-[1px] border-gray-600 text-white p-2 rounded-md outline-none'
                placeholder='Last Name'
                autoComplete='off'
              />
              <textarea
                ref={textareaRef}
                value={bio}
                onChange={handleBioChange}
                className='bg-[#2c2e3b] border-[1px] border-gray-600 text-white p-2 rounded-md outline-none resize-none overflow-hidden'
                placeholder='Bio'
                rows='1'
                style={{ lineHeight: '24px' }}
              />
            </div>
            <div className='flex flex-col gap-2 items-center'>
              <span className='text-sm text-white'>Choose Color</span>
              <div className='w-full flex gap-5'>
                {colors.map((color, index) => (
                  <div
                    className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 ${
                      selectedColor === index
                        ? 'outline outline-black/50 outline-1'
                        : ''
                    }`}
                    key={index}
                    onClick={() => setSelectedColor(index)}></div>
                ))}
              </div>
            </div>
            <Button
              disabled={!isChanged}
              className={`mt-10 bg-fuchsia-600 rounded-full text-white hover:bg-fuchsia-800 ${
                !isChanged
                  ? 'cursor-not-allowed opacity-50 hover:bg-fuchsia-600'
                  : 'cursor-pointer'
              }`}
              onClick={saveChange}>
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

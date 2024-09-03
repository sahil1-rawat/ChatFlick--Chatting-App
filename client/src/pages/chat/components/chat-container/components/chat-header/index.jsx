import React, { useState, useRef, useEffect } from 'react';
import { getColor } from '@/lib/utils';
import { useAppStore } from '@/store';
import { EDIT_GROUT_INFO_ROUTE, HOST } from '@/utils/constants';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import {
  RiCloseFill,
  RiMessageFill,
  RiMore2Fill,
  RiPhoneFill,
  RiVideoFill,
} from 'react-icons/ri';
import { IoCallOutline, IoVideocamOutline } from 'react-icons/io5';
import { FaUserCircle, FaUserFriends } from 'react-icons/fa';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@headlessui/react';
import { apiClient } from '@/lib/api-client';
import { toast } from 'react-toastify';
import moment from 'moment';

const ChatHeader = () => {
  const {
    closeChat,
    selectedChatData,
    selectedChatType,
    onlineStatuses,
    userInfo,
  } = useAppStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
      setIsEditingGroup(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDropdownItemClick = (action, event) => {
    event.stopPropagation();
    if (action === 'View Profile') {
      setDropdownOpen(false); // Close dropdown
      setSheetOpen(true); // Open sheet
    } else {
      console.log(`${action} clicked`);

      setDropdownOpen(false);
    }
  };
  const [isEditingGroup, setIsEditingGroup] = useState(false);
  const [name, setName] = useState(selectedChatData.name || '');
  const [description, setDescription] = useState(
    selectedChatData.description || ''
  );
  const [isChanged, setIsChanged] = useState(false);
  const { _id } = selectedChatData;

  useEffect(() => {
    const hasChanges = () => {
      if (name.length < 2) {
        return false;
      }
      return (
        name !== selectedChatData.name ||
        description !== selectedChatData.description
      );

      return false;
    };
    setIsChanged(hasChanges());
  }, [name, description, selectedChatData]);

  const handleSaveGroup = async () => {
    try {
      const res = await apiClient.patch(
        `${EDIT_GROUT_INFO_ROUTE}/${_id}`,
        {
          name,
          description,
        },
        { withCredentials: true }
      );

      if (res.status === 200 && res.data) {
        const updatedGroup = res.data;

        useAppStore.setState((state) => ({
          selectedChatData: {
            ...state.selectedChatData,
            name: updatedGroup.name,
            description: updatedGroup.description,
          },
        }));
        useAppStore.setState((state) => ({
          groups: state.groups.map((group) => {
            if (group._id === _id) {
              return {
                ...group,
                name: updatedGroup.name,
                description: updatedGroup.description,
              };
            }
            // Otherwise, return the group unchanged
            return group;
          }),
        }));
        setIsEditingGroup(false);
      }
    } catch (err) {
      console.log(err);
    }
    // Handle group save logic
  };
  const handleCancel = () => {
    setIsEditingGroup(false);
    setName(selectedChatData.name);
    setDescription(selectedChatData.description);
  };
  const handleAddPeople = () => {
    // Handle add people logic
  };

  const handleExitGroup = () => {
    // Handle exit group logic
  };
  useEffect(() => {
    if (selectedChatData.name || selectedChatData.description) {
      setName(selectedChatData.name);
      setDescription(selectedChatData.description);
    }
  }, [selectedChatData]);
  const handleNameChange = (e) => {
    const newName = e.target.value;

    if (!newName.startsWith(' ') && newName.length <= 30) {
      setName(newName);
    } else if (newName.length > 30) {
      setName(newName.slice(0, 30));
    }
  };
  const handleDescriptionChange = (e) => {
    const newDescription = e.target.value;

    if (!newDescription.startsWith(' ') && newDescription.length <= 50) {
      setDescription(newDescription);
    } else if (newDescription.length > 50) {
      setDescription(newDescription.slice(0, 50));
    }
  };
  return (
    <div className='h-[10vh] min-h-[60px] border-b-2 border-[#2f303b] flex items-center justify-between px-4 sm:px-20 shadow-md relative'>
      <div className='flex gap-3 sm:gap-5 items-center w-full justify-between'>
        <div className='flex gap-3 items-center'>
          <div className='w-10 h-10 sm:w-12 sm:h-12 relative'>
            {selectedChatType === 'contact' ? (
              <Avatar className='w-full h-full rounded-full overflow-hidden flex items-center justify-center '>
                {selectedChatData.image ? (
                  <AvatarImage
                    src={`${HOST}/${selectedChatData.image}`}
                    alt='profile'
                    className='object-cover rounded-full bg-black w-[40px] h-[40px]'
                  />
                ) : (
                  <div
                    className={`w-full h-full flex items-center justify-center  `}>
                    <FaUserCircle
                      className={`${getColor(
                        selectedChatData.color
                      )}  rounded-full w-[40px] h-[40px] `}
                    />
                  </div>
                )}
                {onlineStatuses[selectedChatData._id] === true ? (
                  <span className='absolute right-0.5 bottom-2  inline-block w-2 h-2 bg-green-500 rounded-full border-2 border-black'></span>
                ) : (
                  <span className='absolute right-0.5 bottom-2 inline-block w-2 h-2 bg-gray-700 rounded-full border-2 border-black'></span>
                )}
              </Avatar>
            ) : (
              <Avatar className='w-full h-full rounded-full overflow-hidden'>
                <div
                  className={` w-full h-full flex items-center justify-center`}>
                  <FaUserFriends
                    className={`rounded-full bg-[#aaa6d0] text-black/50 border-[1px] border-[#bbb7e4] w-[40px] h-[40px]`}
                  />
                </div>
              </Avatar>
            )}
          </div>
          <div className='text-white font-bold text-sm sm:text-base line-clamp-1'>
            {selectedChatType === 'contact'
              ? selectedChatData.fullName
                ? selectedChatData.fullName
                : selectedChatData.email
              : selectedChatData.name}
          </div>
        </div>
        <div className='flex items-center gap-2 sm:gap-5'>
          <button
            className='text-2xl sm:text-3xl text-neutral-500 hover:text-white transition-all'
            title='Video Call'>
            <IoVideocamOutline />
          </button>
          <button
            className='text-2xl sm:text-3xl text-neutral-500 hover:text-white transition-all'
            title='Voice Call'>
            <IoCallOutline />
          </button>
          <button
            className='text-2xl sm:text-3xl text-neutral-500 hover:text-white transition-all'
            onClick={toggleDropdown}
            title='More Options'>
            <RiMore2Fill />
          </button>
          {dropdownOpen && (
            <div
              className='absolute right-0 mt-2 bg-[#2a2b33] rounded-md shadow-lg border border-[#3a3b43] z-10 max-h-60'
              ref={dropdownRef}
              style={{ top: '90%' }}>
              <ul className='list-none p-2'>
                <li
                  className='px-4 py-2 text-white hover:bg-[#3a3b43] cursor-pointer transition-colors'
                  onClick={(event) =>
                    handleDropdownItemClick('View Profile', event)
                  }>
                  {selectedChatType === 'contact'
                    ? ' View Profile'
                    : 'View Group'}
                </li>
                <li
                  className='px-4 py-2 text-white hover:bg-[#3a3b43] cursor-pointer transition-colors'
                  onClick={(event) =>
                    handleDropdownItemClick('Clear Chat', event)
                  }>
                  Clear Chat
                </li>
                {selectedChatData === 'contact' && (
                  <li
                    className='px-4 py-2 text-white hover:bg-[#3a3b43] cursor-pointer transition-colors'
                    onClick={(event) =>
                      handleDropdownItemClick('Block Contact', event)
                    }>
                    Block Contact
                  </li>
                )}

                <li
                  className='px-4 py-2 text-white hover:bg-[#3a3b43] cursor-pointer transition-colors'
                  onClick={closeChat}>
                  Close Chat
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Sheet Component */}
      {sheetOpen && (
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetClose asChild>
            <button
              onClick={() => setSheetOpen(false)}
              className='absolute top-4 right-4 p-2 text-white bg-gray-800 rounded-full hover:bg-gray-700 transition'>
              <RiCloseFill size={24} />
            </button>
          </SheetClose>
          <SheetContent
            className='p-0 bg-white rounded-t-3xl shadow-lg max-w-md mx-auto overflow-hidden'
            aria-describedby={undefined}>
            {/* Gradient Background with Avatar */}
            <SheetHeader>
              <SheetTitle></SheetTitle>
            </SheetHeader>
            <div className='relative h-40 bg-gradient-to-r from-blue-500 to-purple-600 flex justify-center items-center'>
              {selectedChatType === 'contact' ? (
                <>
                  <Avatar className='w-32 h-32 border-white rounded-full shadow-lg'>
                    {selectedChatData.image ? (
                      <AvatarImage
                        src={`${HOST}/${selectedChatData.image}`}
                        alt='profile'
                        className='object-cover w-full h-full rounded-full border-4'
                      />
                    ) : (
                      <div className='w-full h-full flex items-center justify-center'>
                        <FaUserCircle
                          className={`${getColor(
                            selectedChatData.color
                          )} h-full w-full rounded-full border-4`}
                        />
                      </div>
                    )}
                  </Avatar>
                  {onlineStatuses[selectedChatData._id] === true && (
                    <span className='absolute bottom-2 right-4 h-3 w-3 bg-green-500 border-2 border-white rounded-full'></span>
                  )}
                </>
              ) : (
                <Avatar className='w-32 h-32 border-white rounded-full shadow-lg'>
                  <div className='w-full h-full flex items-center justify-center'>
                    <FaUserFriends className='h-full w-full rounded-full border-4 bg-[#aaa6d0] text-black/50 border-[#bbb7e4]' />
                  </div>
                </Avatar>
              )}
            </div>

            {/* Profile Info Section */}
            {selectedChatType === 'contact' && (
              <div className='p-6'>
                <div className='text-center mt-1'>
                  <div className='text-xl font-semibold text-gray-900'>
                    {selectedChatData.fullName}
                  </div>
                  <div className='text-sm text-gray-500'>
                    {selectedChatData.email}
                  </div>
                </div>

                <div className='mt-6 p-4 bg-gray-100 rounded-lg shadow-inner'>
                  <h3 className='text-sm font-medium text-gray-600'>Bio</h3>
                  <p className='mt-2 text-gray-800'>
                    {selectedChatData.bio || 'No bio available'}
                  </p>
                </div>
              </div>
            )}

            {/* Group Info Section */}
            {selectedChatType === 'group' && (
              <div className='p-6'>
                <div className='mt-1 p-4 bg-gray-100 rounded-lg shadow-inner'>
                  <div className='font-semibold'>Group Name:</div>
                  {isEditingGroup ? (
                    <input
                      type='text'
                      value={name}
                      onChange={handleNameChange}
                      className='mt-1 p-2 border border-gray-300 rounded-lg w-full'
                    />
                  ) : (
                    <p>{selectedChatData.name || 'No group name available'}</p>
                  )}
                  <div className='font-semibold mt-2'>Group Description:</div>
                  {isEditingGroup ? (
                    <textarea
                      value={description}
                      onChange={handleDescriptionChange}
                      className='mt-1 p-2 border border-gray-300 rounded-lg w-full resize-none'
                      rows='3'
                    />
                  ) : (
                    <p>{selectedChatData.description || 'No Description'}</p>
                  )}
                  {!isEditingGroup && (
                    <div className='text-[10px] mt-3 font-bold'>
                      created by {selectedChatData.admin.fullName} ,
                      {moment(selectedChatData.createdAt).format('DD/MM/YYYY')}
                    </div>
                  )}

                  {isEditingGroup ? (
                    <div className='mt-4 flex justify-end space-x-2'>
                      <button
                        disabled={!isChanged}
                        onClick={handleSaveGroup}
                        className={`px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition
                        ${
                          !isChanged
                            ? 'cursor-not-allowed opacity-50'
                            : 'cursor-pointer'
                        }
                        `}>
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className='px-4 py-2 text-white bg-gray-500 rounded-lg hover:bg-gray-600 transition'>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className='mt-4 flex space-x-2'>
                      {userInfo.id === selectedChatData.admin._id && (
                        <button
                          onClick={handleAddPeople}
                          className='px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 transition'>
                          Add People
                        </button>
                      )}

                      <button
                        onClick={handleExitGroup}
                        className='px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition'>
                        Exit Group
                      </button>
                      <button
                        onClick={() => setIsEditingGroup(true)}
                        className='px-4 py-2 text-white bg-gray-800 rounded-lg hover:bg-gray-700 transition'>
                        Edit
                      </button>
                    </div>
                  )}
                </div>

                <div className='mt-6'>
                  <h3 className='text-sm font-medium text-gray-600'>
                    Members:
                  </h3>
                  <ul className='overflow-y-auto max-h-[30vh] scrollbar-thin scrollbar-thumb-[#3a3a3a] scrollbar-track-[#1b1c24] overflow-x-hidden'>
                    {selectedChatData.members &&
                    selectedChatData.members.length > 0 ? (
                      selectedChatData.members.map((member) => (
                        <li
                          key={member._id}
                          className='flex items-center space-x-2'>
                          <Avatar className='w-8 h-8 border-white rounded-full'>
                            {member.image ? (
                              <AvatarImage
                                src={`${HOST}/${member.image}`}
                                alt='profile'
                                className='object-cover w-full h-full rounded-full border-4'
                              />
                            ) : (
                              <FaUserCircle
                                className={`h-full w-full rounded-full border-4 ${getColor(
                                  member.color
                                )}`}
                              />
                            )}
                          </Avatar>
                          <span>{member.fullName || 'Unknown'}</span>
                        </li>
                      ))
                    ) : (
                      <p>No members available</p>
                    )}
                  </ul>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
};

export default ChatHeader;

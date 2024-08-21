import React, { useState, useRef, useEffect } from 'react';
import { getColor } from '@/lib/utils';
import { useAppStore } from '@/store';
import { HOST } from '@/utils/constants';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import { RiCloseFill, RiMore2Fill } from 'react-icons/ri';
import { IoCallOutline, IoVideocamOutline } from 'react-icons/io5';
import { FaUserCircle } from 'react-icons/fa';
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

const ChatHeader = () => {
  const { closeChat, selectedChatData, selectedChatType, onlineStatuses } =
    useAppStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
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

  return (
    <div className='h-[10vh] min-h-[60px] border-b-2 border-[#2f303b] flex items-center justify-between px-4 sm:px-20 shadow-md relative'>
      <div className='flex gap-3 sm:gap-5 items-center w-full justify-between'>
        <div className='flex gap-3 items-center'>
          <div className='w-10 h-10 sm:w-12 sm:h-12 relative'>
            <Avatar className='w-full h-full rounded-full overflow-hidden'>
              {selectedChatData.image ? (
                <AvatarImage
                  src={`${HOST}/${selectedChatData.image}`}
                  alt='profile'
                  className='object-cover w-full h-full rounded-full bg-black'
                />
              ) : (
                <div
                  className={`w-full h-full flex items-center justify-center`}>
                  <FaUserCircle
                    className={`${getColor(
                      selectedChatData.color
                    )} h-full w-full rounded-full`}
                  />
                </div>
              )}
              {onlineStatuses[selectedChatData._id] === true ? (
                <span className='absolute bottom-1 right-0 inline-block w-2 h-2 bg-green-500 rounded-full border-2 border-black'></span>
              ) : (
                <span className='absolute bottom-1 right-0 inline-block w-2 h-2 bg-gray-700 rounded-full border-2 border-black'></span>
              )}
            </Avatar>
          </div>
          <div className='text-white font-bold text-sm sm:text-base'>
            {selectedChatType === 'contact' &&
              (selectedChatData.fullName
                ? selectedChatData.fullName
                : selectedChatData.email)}
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
                  View Profile
                </li>
                <li
                  className='px-4 py-2 text-white hover:bg-[#3a3b43] cursor-pointer transition-colors'
                  onClick={(event) =>
                    handleDropdownItemClick('Clear Chat', event)
                  }>
                  Clear Chat
                </li>
                <li
                  className='px-4 py-2 text-white hover:bg-[#3a3b43] cursor-pointer transition-colors'
                  onClick={(event) =>
                    handleDropdownItemClick('Block Contact', event)
                  }>
                  Block Contact
                </li>
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
              className='absolute top-4 right-4 p-2 text-white bg-gray-800 rounded-full'>
              <RiCloseFill />
            </button>
          </SheetClose>
          <SheetContent
            className='p-6 bg-[#1f2028] text-white rounded-lg shadow-md max-w-md mx-auto'
            aria-describedby={undefined}>
            <SheetHeader>
              <SheetTitle className='text-center text-2xl font-bold text-white/70'>
                User Profile
              </SheetTitle>
            </SheetHeader>
            <div className='flex flex-col items-center mt-6'>
              <Avatar className='w-28 h-28 rounded-full overflow-hidden shadow-lg'>
                {selectedChatData.image ? (
                  <AvatarImage
                    src={`${HOST}/${selectedChatData.image}`}
                    alt='profile'
                    className='object-cover w-full h-full'
                  />
                ) : (
                  <div
                    className={`w-full h-full flex items-center justify-center`}>
                    <FaUserCircle
                      className={`${getColor(
                        selectedChatData.color
                      )} h-full w-full rounded-full`}
                    />
                  </div>
                )}
              </Avatar>
              <div className='mt-5 text-lg font-semibold'>
                {selectedChatType === 'contact' && selectedChatData.fullName}
              </div>
              <div className='text-sm text-gray-400'>
                {selectedChatType === 'contact' && selectedChatData.email}
              </div>
              {/* Add Bio/Status */}
              <div className='mt-4 text-sm text-gray-300 w-full text-center bg-[#2f303b] p-3 rounded-md'>
                <h3 className='text-sm font-medium text-gray-400'>Bio</h3>
                <p className='mt-2 text-justify'>
                  {selectedChatData.bio || 'No bio available'}
                </p>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
};

export default ChatHeader;

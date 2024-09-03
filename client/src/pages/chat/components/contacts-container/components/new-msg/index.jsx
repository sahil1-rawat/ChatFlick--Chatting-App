import React, { useEffect, useRef, useState } from 'react';
import {
  FaSadCry,
  FaSadTear,
  FaSearch,
  FaTimes,
  FaUserCircle,
} from 'react-icons/fa';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import ToolTips from '@/pages/Extra/ToolTips';
import { apiClient } from '@/lib/api-client';
import { HOST, SEARCH_CONTACTS_ROUTE } from '@/utils/constants';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import { useAppStore } from '@/store';
import { BsChatDots, BsPlus } from 'react-icons/bs';
import { getColor } from '@/lib/utils';

const NewMessage = () => {
  const { setSelectedChatType, setSelectedChatData } = useAppStore();
  const [openNewContactModel, setOpenNewContactModel] = useState(false);
  const [searchedContacts, setSearchedContacts] = useState([]);
  const [searchingName, setSearchingName] = useState('');
  const DialogRef = useRef();

  const searchContacts = async (searchTerm) => {
    try {
      if (searchTerm && searchTerm.length > 0) {
        const res = await apiClient.post(
          SEARCH_CONTACTS_ROUTE,
          { searchTerm },
          { withCredentials: true }
        );
        if (res.status === 200 && res.data.contacts.length > 0) {
          setSearchedContacts(res.data.contacts);
        } else {
          setSearchedContacts([]);
        }
      } else {
        setSearchedContacts([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (DialogRef.current && !DialogRef.current.contains(event.target)) {
        setOpenNewContactModel(false);
        setSearchedContacts([]);
        clearAll();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectNewContact = (contact) => {
    clearAll();
    setOpenNewContactModel(false);
    setSelectedChatType('contact');
    setSelectedChatData(contact);
    setSearchedContacts([]);
  };

  const handleDialogOpenChange = (isOpen) => {
    if (!isOpen) {
      setSearchedContacts([]);
    }
    setOpenNewContactModel(isOpen);
  };

  const clearAll = () => {
    setSearchedContacts([]);
    setSearchingName('');
  };

  return (
    <>
      <ToolTips
        icon={
          <div
            className='relative'
            onClick={() => handleDialogOpenChange(true)}>
            <BsChatDots className='text-2xl text-[#3498db]' />
            <BsPlus className='absolute text-sm text-white -top-0.5 -right-1 bg-[#3498db] rounded-full' />
          </div>
        }
        content='Start a New Chat'
      />
      <Dialog open={openNewContactModel} onOpenChange={handleDialogOpenChange}>
        <DialogContent
          className='bg-[#f2f2f2] border-none text-black w-[400px] h-[500px] flex flex-col dialog-content'
          ref={DialogRef}
          aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle className='text-lg font-semibold'>
              Select a Contact
            </DialogTitle>
          </DialogHeader>
          <div className='relative'>
            <Input
              placeholder='Search Contacts'
              className='rounded-lg p-4 pl-10 bg-white border border-gray-300 shadow-sm'
              value={searchingName}
              onChange={(e) => {
                searchContacts(e.target.value);
                setSearchingName(e.target.value);
              }}
            />
            {searchingName ? (
              <FaTimes
                className='absolute top-2 right-2 text-gray-500 cursor-pointer'
                onClick={clearAll}
                aria-label='Clear search'
              />
            ) : (
              <FaSearch
                className='absolute top-2 right-2 text-gray-500'
                aria-label='Search'
              />
            )}
          </div>
          {searchedContacts.length > 0 ? (
            <ScrollArea className='flex-1 overflow-y-auto'>
              <div className='flex flex-col p-4'>
                {searchedContacts.map((contact) => (
                  <div
                    key={contact._id}
                    className='flex gap-3 items-center p-2 cursor-pointer hover:bg-gray-100 rounded-lg'
                    onClick={() => {
                      selectNewContact(contact);
                    }}>
                    <div className='w-12 h-12'>
                      <Avatar className='w-12 h-12 rounded-full'>
                        {contact.image ? (
                          <AvatarImage
                            src={`${HOST}/${contact.image}`}
                            alt='profile'
                            className='object-cover w-full h-full rounded-full'
                          />
                        ) : (
                          <FaUserCircle
                            className={`${getColor(
                              contact.color
                            )} w-full h-full rounded-full`}
                          />
                        )}
                      </Avatar>
                    </div>
                    <div className='flex flex-col'>
                      <span className='font-medium'>
                        {contact.fullName ? contact.fullName : contact.email}
                      </span>
                      <span className='text-gray-500'>{contact.email}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className='flex-1 flex flex-col justify-center items-center'>
              {
                <div className='flex-1 flex flex-col justify-center items-center'>
                  {searchedContacts.length === 0 &&
                    searchingName.length === 0 && (
                      <>
                        <div className='load'>
                          <div></div>
                          <div></div>
                          <div></div>
                        </div>
                        <div className='no-contacts-message'>
                          <span className='text-[#0984e3]'>
                            Search New Contacts .
                          </span>
                        </div>
                      </>
                    )}

                  {searchedContacts.length === 0 &&
                    searchingName.length > 0 && (
                      <div className='flex flex-col items-center'>
                        <FaSadTear className='text-4xl text-[#0984e3] logo' />
                        <div className='no-contacts-message mt-4 text-black'>
                          <span className='text-[#0984e3]'>
                            No Contacts Found.
                          </span>
                        </div>
                      </div>
                    )}
                </div>
              }
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewMessage;

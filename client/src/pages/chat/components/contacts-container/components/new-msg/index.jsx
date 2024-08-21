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
  DialogDescription,
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
            <BsChatDots className='text-2xl' />
            <BsPlus className='absolute text-sm text-white -top-1 -right-1 bg-teal-600 rounded-full' />
          </div>
        }
        content='Start a New Chat'
      />
      <Dialog open={openNewContactModel} onOpenChange={handleDialogOpenChange}>
        <DialogContent
          className='bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col dialog-content'
          ref={DialogRef}>
          <DialogHeader>
            <DialogTitle>Please select a contact</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <Input
              placeholder='Search Contacts'
              className='relative rounded-lg p-6 pr-10 bg-[#2c2e3b] border-none'
              value={searchingName}
              onChange={(e) => {
                searchContacts(e.target.value);
                setSearchingName(e.target.value);
              }}
            />
            {searchingName ? (
              <FaTimes
                className='absolute top-20 text-[#fff]/40 right-10 cursor-pointer'
                onClick={clearAll}
                aria-label='Clear search'
              />
            ) : (
              <FaSearch
                className='absolute top-20 right-10 text-[#fff]/40 cursor-pointer'
                aria-label='Search'
              />
            )}
          </div>
          {searchedContacts.length > 0 ? (
            <ScrollArea className='flex-1 overflow-y-auto'>
              <div className='flex flex-col gap-5 p-4'>
                {searchedContacts.map((contact) => (
                  <div
                    key={contact._id}
                    className='flex gap-3 items-center cursor-pointer'
                    onClick={() => {
                      selectNewContact(contact);
                    }}>
                    <div className='w-12 h-12 relative'>
                      <Avatar className='h-12 w-12 rounded-full overflow-hidden'>
                        {contact.image ? (
                          <AvatarImage
                            src={`${HOST}/${contact.image}`}
                            alt='profile'
                            className='object-cover h-12 w-12 rounded-[50%] bg-black'
                          />
                        ) : (
                          <div className={`w-full h-full  `}>
                            <FaUserCircle
                              className={`${getColor(
                                contact.color
                              )} h-full w-full rounded-full`}
                            />
                          </div>
                        )}
                      </Avatar>
                    </div>
                    <div className='flex flex-col'>
                      <span>
                        {contact.fullName
                          ? `${contact.fullName}`
                          : contact.email}
                      </span>
                      <span className='text-xs'>{contact.email}</span>
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
                          Search
                          <span className='text-[#0984e3]'>
                            {' '}
                            New Contacts .
                          </span>
                        </div>
                      </>
                    )}

                  {searchedContacts.length === 0 &&
                    searchingName.length > 0 && (
                      <div className='flex flex-col items-center'>
                        <FaSadTear className='text-4xl text-[#0984e3] logo' />
                        <div className='no-contacts-message mt-4'>
                          No{' '}
                          <span className='text-[#0984e3]'>
                            Contacts Found.
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

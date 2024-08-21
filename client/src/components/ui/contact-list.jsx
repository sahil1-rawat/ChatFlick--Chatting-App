import { getColor } from '@/lib/utils';
import { useAppStore } from '@/store';
import { HOST } from '@/utils/constants';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import moment from 'moment';
import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';

const ContactList = ({ contacts = [], isgroup = false }) => {
  const {
    selectedChatData,
    setSelectedChatData,
    setSelectedChatType,
    selectedChatType,
    setSelectedChatMessages,
    onlineStatuses,
  } = useAppStore();

  const handleClick = (contact) => {
    if (isgroup) setSelectedChatType('group');
    else setSelectedChatType('contact');
    setSelectedChatData(contact);
    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessages([]);
    }
  };

  const formatLastMessageTime = (timestamp) => {
    const now = moment();
    const messageDate = moment(timestamp);

    if (now.isSame(messageDate, 'day')) {
      return messageDate.format('hh:mm A');
    } else if (now.subtract(1, 'day').isSame(messageDate, 'day')) {
      return 'Yesterday';
    } else {
      return messageDate.format('DD-MM-YY');
    }
  };

  const sortedContacts = contacts.sort((a, b) => {
    if (a.lastMessageTime && b.lastMessageTime) {
      return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
    }
    return 0;
  });

  return (
    <div className='mt-4 space-y-1'>
      {sortedContacts.length > 0 ? (
        sortedContacts.map((contact) => (
          <ContextMenu key={contact._id}>
            <ContextMenuTrigger
              className={`flex items-center space-x-4 p-3  rounded-lg shadow-lg transition-transform transform hover:scale-[1.02]  cursor-pointer ${
                selectedChatData && selectedChatData._id === contact._id
                  ? 'bg-[#0abde355] hover:bg-[#0abde344]'
                  : 'bg-[#2f303b] hover:bg-[#393a48]'
              }`}
              onClick={() => handleClick(contact)}>
              <div
                className={`flex items-center space-x-4 w-full transition-transform transform  rounded-lg cursor-pointer`}>
                <div className='relative'>
                  {!isgroup && (
                    <Avatar className='w-12 h-12 rounded-full overflow-hidden'>
                      {contact.image ? (
                        <AvatarImage
                          src={`${HOST}/${contact.image}`}
                          alt='profile'
                          className='object-cover w-10 h-10 rounded-full'
                        />
                      ) : (
                        <div className={` w-10 h-10`}>
                          <FaUserCircle
                            className={`${getColor(
                              contact.color
                            )} h-full w-full rounded-full`}
                          />
                        </div>
                      )}
                      {onlineStatuses[contact._id] === true && (
                        <span className='absolute top-2 left-[34px] inline-block w-2 h-2 bg-green-500 rounded-full'></span>
                      )}
                    </Avatar>
                  )}
                  {isgroup && (
                    <div className='bg-[#ffffff22] h-14 w-14 flex items-center justify-center rounded-full text-xl'>
                      #
                    </div>
                  )}
                </div>
                <div className='flex-1'>
                  <span className='text-[13px] font-medium font-serif text-[#e0e0e0] line-clamp-1'>
                    {isgroup ? contact.name : contact.fullName || contact.email}
                  </span>
                  {contact.messageType === 'text' && (
                    <span
                      className='text-left text-[12px] line-clamp-1 
            '>
                      {contact.lastMessage || ''}
                    </span>
                  )}
                </div>
                {contact.lastMessageTime && (
                  <div className='text-[11px] text-gray-400'>
                    {formatLastMessageTime(contact.lastMessageTime)}
                  </div>
                )}
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent className='w-56 bg-[#1f1f2b] text-[#e0e0e0] rounded-lg shadow-lg'>
              <ContextMenuItem className='hover:bg-[#34343f]'>
                Back
                <ContextMenuShortcut>⌘[</ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuItem className='hover:bg-[#34343f]' disabled>
                Forward
                <ContextMenuShortcut>⌘]</ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuItem className='hover:bg-[#34343f]'>
                Reload
                <ContextMenuShortcut>⌘R</ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuSub>
                <ContextMenuSubTrigger className='hover:bg-[#34343f]'>
                  More Tools
                </ContextMenuSubTrigger>
                <ContextMenuSubContent className='w-48 bg-[#1f1f2b]'>
                  <ContextMenuItem className='hover:bg-[#34343f]'>
                    Save Page As...
                    <ContextMenuShortcut>⇧⌘S</ContextMenuShortcut>
                  </ContextMenuItem>
                  <ContextMenuItem className='hover:bg-[#34343f]'>
                    Create Shortcut...
                  </ContextMenuItem>
                  <ContextMenuItem className='hover:bg-[#34343f]'>
                    Name Window...
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem className='hover:bg-[#34343f]'>
                    Developer Tools
                  </ContextMenuItem>
                </ContextMenuSubContent>
              </ContextMenuSub>
              <ContextMenuSeparator />
              <ContextMenuCheckboxItem checked className='hover:bg-[#34343f]'>
                Show Bookmarks Bar
                <ContextMenuShortcut>⌘⇧B</ContextMenuShortcut>
              </ContextMenuCheckboxItem>
              <ContextMenuCheckboxItem className='hover:bg-[#34343f]'>
                Show Full URLs
              </ContextMenuCheckboxItem>
              <ContextMenuSeparator />
              <ContextMenuRadioGroup value='pedro'>
                <ContextMenuLabel inset>People</ContextMenuLabel>
                <ContextMenuSeparator />
                <ContextMenuRadioItem
                  value='pedro'
                  className='hover:bg-[#34343f]'>
                  Pedro Duarte
                </ContextMenuRadioItem>
                <ContextMenuRadioItem
                  value='colm'
                  className='hover:bg-[#34343f]'>
                  Colm Tuite
                </ContextMenuRadioItem>
              </ContextMenuRadioGroup>
            </ContextMenuContent>
          </ContextMenu>
        ))
      ) : (
        <p className='text-center text-gray-500'>No contacts available</p>
      )}
    </div>
  );
};

export default ContactList;

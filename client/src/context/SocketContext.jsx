import { useAppStore } from '@/store';
import { HOST } from '@/utils/constants';
import { createContext, useContext, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const socket = useRef(null);
  const { userInfo, setOnlineStatus, setOnlineStatuses, addMessage } =
    useAppStore();

  useEffect(() => {
    if (userInfo) {
      socket.current = io(HOST, {
        withCredentials: true,
        query: { userId: userInfo.id },
      });

      socket.current.on('connect', () => {
        console.log('Connected to socket server');
      });

      const handleReceiveMessage = (message) => {
        const { selectedChatData, selectedChatType } = useAppStore.getState();
        if (
          selectedChatType &&
          (selectedChatData._id === message.sender._id ||
            selectedChatData._id === message.recipient._id ||
            userInfo._id === message.sender._id)
        ) {
          addMessage(message);
        }
      };

      const handleUserStatusChange = ({ userId, status }) => {
        setOnlineStatus(userId, status === 'online');
      };

      const handleMultipleUserStatusChange = (statuses) => {
        setOnlineStatuses(statuses);
      };

      socket.current.on('receiveMessage', handleReceiveMessage);
      socket.current.on('senderMessage', handleReceiveMessage);
      socket.current.on('userStatusChange', handleUserStatusChange);
      socket.current.on(
        'multipleUserStatusChange',
        handleMultipleUserStatusChange
      );

      return () => {
        socket.current.disconnect();
      };
    }
  }, [userInfo, setOnlineStatus, setOnlineStatuses, addMessage]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};

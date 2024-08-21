export const createChatSlice = (set, get) => ({
  // Initial state values
  selectedChatType: undefined, // Type of the selected chat (e.g., direct message, group chat)
  selectedChatData: undefined, // Data related to the selected chat (e.g., chat details)
  selectedChatMessages: [], // Messages for the selected chat, initialized as an empty array
  directMessgesContacts: [], // Correct spelling for consistency
  isUploading: false,
  isDownloading: false,
  fileUploadProgress: 0,
  fileDownloadProgress: 0,
  setIsUploading: (isUploading) => {
    set({ isUploading });
  },
  setIsDownloading: (isDownloading) => set({ isDownloading }),

  setFileUploadProgress: (fileUploadProgress) => set({ fileUploadProgress }),
  setFileDownloadProgress: (fileDownloadProgress) =>
    set({ fileDownloadProgress }),
  // Function to update the chat type
  setSelectedChatType: (selectedChatType) => set({ selectedChatType }),

  // Function to update the chat data
  setSelectedChatData: (selectedChatData) => set({ selectedChatData }),

  // Function to update the chat messages
  setSelectedChatMessages: (selectedChatMessages) =>
    set({ selectedChatMessages }),

  // Function to set direct messages contacts
  setDirectMessgesContacts: (directMessgesContacts) =>
    set({ directMessgesContacts }),

  // Function to reset chat state
  closeChat: () =>
    set({
      selectedChatData: undefined, // Reset chat data to undefined
      selectedChatType: undefined, // Reset chat type to undefined
      selectedChatMessages: [], // Clear messages by setting to an empty array
    }),

  // Function to add a new message to the chat
  addMessage: (message) => {
    const selectedChatMessages = get().selectedChatMessages; // Get the current list of messages
    const selectedChatType = get().selectedChatType; // Get the current chat type

    set({
      selectedChatMessages: [
        ...selectedChatMessages, // Spread existing messages
        {
          ...message, // Spread new message properties
          recipient:
            selectedChatType === 'group'
              ? message.recipient // If chat type is 'group', use original recipient
              : message.recipient._id, // Otherwise, use recipient ID
          sender:
            selectedChatType === 'group'
              ? message.sender // If chat type is 'group', use original sender
              : message.sender._id, // Otherwise, use sender ID
        },
      ],
    });
  },
  // Function to update the online status of a user
  setOnlineStatus: (userId, isOnline) => {
    set((state) => ({
      onlineStatuses: {
        ...state.onlineStatuses,
        [userId]: isOnline, // Update the user's online status
      },
    }));
  },

  // Function to handle multiple online status updates
  setOnlineStatuses: (statuses) => {
    set((state) => ({
      onlineStatuses: {
        ...state.onlineStatuses,
        ...statuses, // Merge new statuses with the existing ones
      },
    }));
  },
});

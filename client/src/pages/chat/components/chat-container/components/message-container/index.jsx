import React, { useEffect, useRef, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { useAppStore } from '@/store';
import {
  GET_ALL_MESSAGES_ROUTE,
  HOST,
  UNSEND_MESSAGES_ROUTE,
} from '@/utils/constants';
import moment from 'moment';
import { AiOutlineDownload } from 'react-icons/ai';
import { IoCloseSharp } from 'react-icons/io5';
import { MdCopyAll, MdDelete, MdSaveAs, MdUndo } from 'react-icons/md';
import { toast } from 'react-toastify';
import {
  FaFile,
  FaFileAlt,
  FaPause,
  FaPlay,
  FaVolumeMute,
  FaVolumeOff,
  FaVolumeUp,
} from 'react-icons/fa';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { color } from 'framer-motion';

const MessageContainer = () => {
  const scrollRef = useRef(null);
  const {
    selectedChatType,
    selectedChatData,
    selectedChatMessages,
    setSelectedChatMessages,
    setIsDownloading,
    setFileDownloadProgress,
    directMessagesContacts,
    setIsMessageSent,
    isMessageSent,
  } = useAppStore();
  const videoRef = useRef(null);
  const [showImage, setShowImage] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  // Download file function

  const downloadFile = async (url) => {
    try {
      setIsDownloading(true);
      setFileDownloadProgress(0);
      const res = await apiClient.get(`${HOST}/${url}`, {
        responseType: 'blob',
        onDownloadProgress: (ProgressEvent) => {
          const { loaded, total } = ProgressEvent;
          const percentCompleted = Math.floor(Math.round(loaded * 100) / total);
          setFileDownloadProgress(percentCompleted);
        },
      });
      const urlBlob = URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = urlBlob;
      link.setAttribute('download', url.split('/').pop());
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(urlBlob);
      setIsDownloading(false);
      setFileDownloadProgress(0);
    } catch (error) {
      setIsDownloading(false);
      toast.error('Downloading Failed');
      console.error('Error downloading file:', error);
    }
  };

  useEffect(() => {
    const updateDirectMessages = () => {
      const msg = selectedChatMessages[selectedChatMessages.length - 1];
      if (!msg || !msg.content) return; // Safety check to ensure msg exists and has content

      useAppStore.setState((state) => {
        const existingContact = state.directMessagesContacts.find(
          (contact) => contact._id === selectedChatData._id
        );

        if (existingContact) {
          // If the contact already exists, update it
          return {
            directMessagesContacts: state.directMessagesContacts.map(
              (contact) =>
                contact._id === selectedChatData._id
                  ? {
                      ...contact,
                      lastMessage: msg.content,
                      messageType: msg.messageType,
                      lastMessageTime: msg.timestamp,
                    }
                  : contact
            ),
          };
        } else if (isMessageSent) {
          // If the contact does not exist, add it only if a new message is sent
          const newContact = {
            _id: selectedChatData._id,
            email: selectedChatData.email,
            fullName: selectedChatData.fullName,
            lastMessage: msg.content,
            messageType: msg.messageType,
            lastMessageTime: msg.timestamp,
            image: selectedChatData.image || null,
            color: selectedChatData.color,
          };

          return {
            directMessagesContacts: [
              ...state.directMessagesContacts,
              newContact,
            ],
          };
        }

        // Return the existing state if no conditions are met
        return state;
      });
    };

    // Update direct messages only if there are selected chat messages and a new message is sent
    if (selectedChatMessages.length > 0) {
      updateDirectMessages();
    }

    // Reset the isMessageSent flag when selectedChatData changes
    setIsMessageSent(false);
  }, [selectedChatMessages, selectedChatData._id]);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Error copying to clipboard:', err);
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await apiClient.post(
          GET_ALL_MESSAGES_ROUTE,
          { id: selectedChatData._id },
          { withCredentials: true }
        );

        if (res.data.messages) {
          setSelectedChatMessages(res.data.messages);
        }
      } catch (err) {
        console.error('Failed to fetch messages:', err);
      }
    };

    if (selectedChatData._id && selectedChatType === 'contact') {
      fetchMessages();
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [selectedChatMessages]);

  const checkIfImage = (filePath) =>
    /\.(jpg|jpeg|png|gif|webp|svg|ico)$/i.test(filePath);

  const checkIfVideo = (filePath) => {
    const videoExtensions = /\.(mp4|webm|ogg)$/i;
    return videoExtensions.test(filePath);
  };
  const isValidURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };
  const formatDate = (timestamp) => {
    const today = moment().startOf('day');
    const messageDate = moment(timestamp);

    if (messageDate.isSame(today, 'day')) {
      return 'Today';
    } else if (messageDate.isSame(today.clone().subtract(1, 'day'), 'day')) {
      return 'Yesterday';
    } else {
      return messageDate.format('LL');
    }
  };

  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format('YYYY-MM-DD');
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={index}>
          {showDate && (
            <div className='text-center text-gray-500 my-2'>
              {formatDate(message.timestamp)}
            </div>
          )}
          {selectedChatType === 'contact' && renderDMMessages(message)}
        </div>
      );
    });
  };
  useEffect(() => {
    const videoElement = videoRef.current;

    if (!videoElement) return;

    const updateProgress = () => {
      const { currentTime, duration } = videoElement;
      if (duration > 0) {
        setProgress((currentTime / duration) * 100);
      }
      if (videoElement.ended) {
        setIsPlaying(false);
      }
    };

    videoElement.addEventListener('timeupdate', updateProgress);
    videoElement.addEventListener('loadedmetadata', updateProgress); // Ensure progress is set on load

    videoElement.currentTime = 0; // Reset the current time to the beginning

    return () => {
      videoElement.removeEventListener('timeupdate', updateProgress);
      videoElement.removeEventListener('loadedmetadata', updateProgress);
    };
  }, [videoUrl]);

  // Update video control functions to reset progress and states
  const controlVideo = () => {
    if (videoRef.current) {
      if (videoRef.current.paused || videoRef.current.ended) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleProgressClick = (e) => {
    const videoElement = videoRef.current;
    if (!videoElement) eturn;

    const { left, width } = e.currentTarget.getBoundingClientRect();
    const clickPosition = e.clientX - left;
    const newTime = (clickPosition / width) * videoElement.duration;
    videoElement.currentTime = newTime;

    setProgress((newTime / videoElement.duration) * 100);
  };

  const renderDMMessages = (message) => {
    const isSentMessage = message.sender !== selectedChatData._id;

    const handleUnsend = async () => {
      try {
        const res = await apiClient.delete(
          `${UNSEND_MESSAGES_ROUTE}/${message._id}`
        );
        if (res.status === 200) {
          setSelectedChatMessages(
            selectedChatMessages.filter((m) => m._id !== message._id)
          );
        }
      } catch (err) {
        console.log(err);
      }
    };
    const handleCopy = async () => {
      copyToClipboard(message.content);
    };

    return (
      <div
        className={`mb-2 relative ${
          isSentMessage ? 'text-right' : 'text-left'
        }`}>
        <ContextMenu>
          <ContextMenuTrigger>
            {message.messageType === 'text' && (
              <>
                <div
                  className={`inline-block py-3 px-4 my-2 max-w-[70%] break-words text-left ${
                    isSentMessage
                      ? 'bg-teal-500 text-white border border-teal-600 rounded-br-xl'
                      : 'bg-yellow-100 text-gray-900 border border-yellow-300 rounded-bl-xl'
                  } relative`}>
                  {isValidURL(message.content) ? (
                    <a
                      href={message.content}
                      target='_blank'
                      rel='noopener noreferrer'
                      className=' hover:underline '>
                      {message.content}
                    </a>
                  ) : (
                    <div>{message.content}</div>
                  )}
                </div>
              </>
            )}
            {message.messageType === 'file' && (
              <div
                className={`inline-block p-4 rounded-lg my-1  break-words ${
                  isSentMessage
                    ? 'bg-transparent text-white'
                    : 'bg-transparent text-white'
                } ${
                  checkIfImage(message.fileUrl)
                    ? 'max-w-[70%]'
                    : 'max-w-[80%] lg:max-w-[60%] xl:max-w-[40%]'
                }`}>
                {checkIfImage(message.fileUrl) ? (
                  <div
                    className='cursor-pointer'
                    onClick={() => {
                      setShowImage(true);
                      setImageUrl(message.fileUrl);
                    }}>
                    <img
                      src={`${HOST}/${message.fileUrl}`}
                      alt=''
                      height={300}
                      width={300}
                    />
                  </div>
                ) : (
                  <>
                    {checkIfVideo(message.fileUrl) ? (
                      <div
                        className='cursor-pointer relative'
                        onClick={() => {
                          setShowVideo(true);
                          setIsPlaying(true);
                          setVideoUrl(message.fileUrl);
                        }}>
                        <video
                          height='250'
                          width='250'
                          className='object-cover'>
                          <source
                            src={`${HOST}/${message.fileUrl}`}
                            type={`video/${message.fileUrl
                              .split('.')
                              .pop()
                              .toLowerCase()}`}
                          />
                        </video>
                        <FaPlay className='absolute top-[50%] left-[50%]' />
                      </div>
                    ) : (
                      <div
                        className={`flex items-center gap-2 border p-4 text-left ${
                          isSentMessage
                            ? 'bg-teal-500 text-white border border-teal-600 rounded-br-xl'
                            : 'bg-yellow-100 text-gray-900 border border-yellow-300 rounded-bl-xl'
                        } `}>
                        <span className='text-white text-3xl bg-black/20 rounded-full p-3'>
                          <FaFile />
                        </span>
                        <span className='line-clamp-1'>
                          {message.fileUrl.split('/').pop()}
                        </span>
                        <span
                          className='bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300'
                          onClick={() => downloadFile(message.fileUrl)}>
                          <AiOutlineDownload />
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
            <div
              className={`text-xs ${
                isSentMessage ? 'text-[#7FA1C3]' : 'text-[#636e72]'
              } mt-1`}>
              {moment(message.timestamp).format('LT')}
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent className='w-48'>
            <ContextMenuItem onClick={handleUnsend}>
              <MdUndo className='text-xl' />
              <span>Unsend</span>
            </ContextMenuItem>
            <ContextMenuItem>
              <MdDelete className='text-xl' />
              Delete
            </ContextMenuItem>

            {message.messageType === 'file' ? (
              <ContextMenuItem onClick={() => downloadFile(message.fileUrl)}>
                <MdSaveAs className='text-xl' />
                Save As
              </ContextMenuItem>
            ) : (
              <ContextMenuItem onClick={handleCopy}>
                <MdCopyAll className='text-xl' />
                Copy
              </ContextMenuItem>
            )}
          </ContextMenuContent>
        </ContextMenu>
      </div>
    );
  };

  return (
    <div className='flex flex-col flex-1 overflow-y-auto p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full scrollbar-hide scrollbar-thin '>
      {renderMessages()}
      <div ref={scrollRef}></div>
      {showImage && (
        <div className='fixed z-[9] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col transition-opacity duration-500'>
          <div>
            <img
              src={`${HOST}/${imageUrl}`}
              alt='image'
              className='h-[80vh] w-full bg-cover'
            />
          </div>
          <div className='flex gap-5 fixed top-0 mt-5'>
            <button
              className='bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300'
              onClick={() => downloadFile(imageUrl)}
              title='download'>
              <AiOutlineDownload />
            </button>
            <button
              className='bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300'
              onClick={() => {
                setShowImage(false);
                setImageUrl(null);
              }}
              title='close'>
              <IoCloseSharp />
            </button>
          </div>
        </div>
      )}
      {showVideo && (
        <div className='fixed z-[9] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col transition-opacity duration-500'>
          <div className='relative group cursor-pointer'>
            <video
              ref={videoRef}
              autoPlay
              className='h-[500px] w-full'
              onClick={controlVideo}>
              <source
                src={`${HOST}/${videoUrl}`}
                type={`video/${videoUrl.split('.').pop().toLowerCase()}`}
              />
            </video>

            {/* Play/Pause and Mute buttons */}
            <div
              className='absolute top-4 right-4 flex space-x-4'
              onClick={controlVideo}>
              <div className='cursor-pointer'>
                {isPlaying ? (
                  <button title='pause'>
                    <FaPause className='text-white text-2xl' />
                  </button>
                ) : (
                  <button title='play'>
                    <FaPlay className='text-white text-2xl' />
                  </button>
                )}
              </div>

              <div className='cursor-pointer' onClick={(e) => handleMute(e)}>
                {isMuted ? (
                  <button title='unmute'>
                    <FaVolumeMute className='text-white text-2xl' />
                  </button>
                ) : (
                  <button title='mute'>
                    <FaVolumeUp className='text-white text-2xl' />
                  </button>
                )}
              </div>
            </div>

            {/* Progress bar */}
            <div
              className='absolute bottom-0 left-0 w-full h-2 bg-gray-700 cursor-pointer'
              onClick={handleProgressClick}>
              <div
                className='h-full bg-blue-500'
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className='flex gap-5 fixed top-0 mt-5'>
            <button
              className='bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300'
              onClick={() => downloadFile(videoUrl)}
              title='download'>
              <AiOutlineDownload />
            </button>
            <button
              className='bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300'
              onClick={() => {
                setShowVideo(false);
                setVideoUrl(null);
                setIsPlaying(false);
                setIsMuted(false);
              }}
              title='close'>
              <IoCloseSharp />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageContainer;

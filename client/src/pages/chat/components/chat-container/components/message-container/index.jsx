import React, { useEffect, useRef, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { useAppStore } from '@/store';
import { GET_ALL_MESSAGES_ROUTE, HOST } from '@/utils/constants';
import moment from 'moment';
import { AiOutlineDownload } from 'react-icons/ai';
import { IoCloseSharp } from 'react-icons/io5';
import { MdFolder } from 'react-icons/md';
import { toast } from 'react-toastify';
import { FaFile, FaFileAlt, FaPause, FaPlay } from 'react-icons/fa';
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

// Loader component for fetching messages
const Loader = () => (
  <div className='flex justify-center items-center my-4'>
    <div className='loaders'></div>
  </div>
);

const MessageContainer = () => {
  const scrollRef = useRef(null);
  const {
    selectedChatType,
    selectedChatData,
    selectedChatMessages,
    setSelectedChatMessages,
    setIsDownloading,
    setFileDownloadProgress,
  } = useAppStore();
  const videoRef = useRef(null);
  const [showImage, setShowImage] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(true); // State for loading messages
  const [isPlaying, setIsPlaying] = useState(true);

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
    const fetchMessages = async () => {
      setLoading(true);
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
      } finally {
        setLoading(false);
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
  }, [selectedChatMessages, loading]);

  const checkIfImage = (filePath) =>
    /\.(jpg|jpeg|png|gif|webp|svg|ico)$/i.test(filePath);

  const checkIfVideo = (filePath) => {
    const videoExtensions = /\.(mp4|webm|ogg)$/i;
    return videoExtensions.test(filePath);
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

  const controlVideo = () => {
    if (isPlaying && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const renderDMMessages = (message) => {
    const isSentMessage = message.sender !== selectedChatData._id;

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
                  className={`inline-block py-4 px-3 rounded-lg my-1 max-w-[60%] break-words text-left  ${
                    isSentMessage
                      ? 'bg-[#6482AD] text-white border border-white/20'
                      : 'bg-[#636e72]/20 text-white border border-white/20'
                  }`}>
                  <div>{message.content}</div>
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
                        className={`flex items-center gap-4 border p-4 rounded-lg ${
                          isSentMessage
                            ? 'bg-[#6482AD] text-white border border-white/20'
                            : 'bg-[#636e72]/20 text-white border border-white/20'
                        }`}>
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
          <ContextMenuContent className='w-64'>
            <ContextMenuItem inset>
              Back
              <ContextMenuShortcut>⌘[</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem inset disabled>
              Forward
              <ContextMenuShortcut>⌘]</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem inset>
              Reload
              <ContextMenuShortcut>⌘R</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuSub>
              <ContextMenuSubTrigger inset>More Tools</ContextMenuSubTrigger>
              <ContextMenuSubContent className='w-48'>
                <ContextMenuItem>
                  Save Page As...
                  <ContextMenuShortcut>⇧⌘S</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuItem>Create Shortcut...</ContextMenuItem>
                <ContextMenuItem>Name Window...</ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem>Developer Tools</ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>
            <ContextMenuSeparator />
            <ContextMenuCheckboxItem checked>
              Show Bookmarks Bar
              <ContextMenuShortcut>⌘⇧B</ContextMenuShortcut>
            </ContextMenuCheckboxItem>
            <ContextMenuCheckboxItem>Show Full URLs</ContextMenuCheckboxItem>
            <ContextMenuSeparator />
            <ContextMenuRadioGroup value='pedro'>
              <ContextMenuLabel inset>People</ContextMenuLabel>
              <ContextMenuSeparator />

              <ContextMenuRadioItem value='colm'>
                Colm Tuite
              </ContextMenuRadioItem>
            </ContextMenuRadioGroup>
          </ContextMenuContent>
        </ContextMenu>
      </div>
    );
  };

  return (
    <div className='flex flex-col flex-1 overflow-y-auto p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full scrollbar-hide scrollbar-thin'>
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
              onClick={() => downloadFile(imageUrl)}>
              <AiOutlineDownload />
            </button>
            <button
              className='bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300'
              onClick={() => {
                setShowImage(false);
                setImageUrl(null);
              }}>
              <IoCloseSharp />
            </button>
          </div>
        </div>
      )}
      {showVideo && (
        <div className='fixed z-[9] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col transition-opacity duration-500'>
          <div className='relative cursor-pointer' onClick={controlVideo}>
            <video ref={videoRef} autoPlay className='h-[500px] w-full'>
              <source
                src={`${HOST}/${videoUrl}`}
                type={`video/${videoUrl.split('.').pop().toLowerCase()}`}
              />
            </video>

            <div className='absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2'>
              {isPlaying ? <FaPause /> : <FaPlay />}
            </div>
          </div>
          <div className='flex gap-5 fixed top-0 mt-5'>
            <button
              className='bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300'
              onClick={() => downloadFile(imageUrl)}>
              <AiOutlineDownload />
            </button>
            <button
              className='bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300'
              onClick={() => {
                setShowVideo(false);
                setVideoUrl(null);
                setIsPlaying(false);
              }}>
              <IoCloseSharp />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageContainer;

import React from 'react';
import { useAppStore } from '@/store';
import { Link } from 'react-router-dom';
import ChatBubbleAnimation from '@/components/ui/CustomChatAnimation';
import { FaRegHandshake } from 'react-icons/fa';

const EmptyChatContainer = () => {
  const { userInfo } = useAppStore();

  return (
    <div className='flex-1 flex-col justify-center items-center bg-gradient-to-br from-[#1a1a1a] via-[#2b2b2b] to-[#3c3c3c] p-8 md:p-16 text-center hidden md:flex'>
      <div className='relative mb-2'>
        {' '}
        {/* Reduced margin-bottom */}
        <ChatBubbleAnimation className='w-20 h-20 ' />
      </div>
      <div className='text-white max-w-lg mx-auto'>
        <h3 className='text-4xl font-bold leading-tight'>
          <div className='flex items-center justify-center '>
            Hi {userInfo.fullName}
            <span className='text-[#ffd60a] animate-pulse'>
              <FaRegHandshake className='ml-3' />
            </span>
          </div>
          <br />
          Welcome to <span className={`text-[#74b9ff]`}>ChatFlick</span>
        </h3>
        <p className='text-lg text-gray-300 mt-4'>
          Start chatting with ease. Enjoy seamless conversations with our
          intuitive platform.
        </p>
        <div className='mt-5'>
          <p className='text-base text-gray-400'>
            Need help? Visit our{' '}
            <Link
              to='/help-center'
              className='text-[#0984e3] underline hover:text-[#2e9cef] transition-colors'>
              Help Center
            </Link>{' '}
            or{' '}
            <a
              href='/contact'
              className='text-[#0984e3] underline hover:text-[#2e9cef] transition-colors'>
              Contact Us
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmptyChatContainer;

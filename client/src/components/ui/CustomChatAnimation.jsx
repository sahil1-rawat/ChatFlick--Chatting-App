import React from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import { useAppStore } from '@/store';
import { HOST } from '@/utils/constants';
import { FaUserCircle } from 'react-icons/fa';
import { getColor } from '@/lib/utils';

const ChatBubbleAnimation = ({ className }) => {
  const { userInfo } = useAppStore();

  return (
    <motion.div
      className={`relative flex items-center justify-center ${className}`}
      initial={{ opacity: 1, scale: 1 }}
      animate={{
        opacity: [1, 0.8, 1],
        scale: [1, 1.05, 1],
        y: [0, -10, 0],
        transition: {
          duration: 1.5,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'easeInOut',
        },
      }}>
      <Avatar className='h-16 w-16 rounded-full overflow-hidden shadow-md  ]'>
        {userInfo.image ? (
          <AvatarImage
            src={`${HOST}/${userInfo.image}`}
            alt='profile'
            className='object-cover h-full w-full'
          />
        ) : (
          <div className={`h-full w-full `}>
            <FaUserCircle
              className={`${getColor(
                userInfo.color
              )} h-full w-full rounded-full`}
            />
          </div>
        )}
      </Avatar>
    </motion.div>
  );
};

export default ChatBubbleAnimation;

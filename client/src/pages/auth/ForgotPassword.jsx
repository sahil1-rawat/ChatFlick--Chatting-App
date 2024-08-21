import Logo from '@/assets/logo.png';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Background from '@/assets/login4.png';

import { toast } from 'react-toastify';
// import { FORGOT_PASSWORD_ROUTE } from '@/utils/constants';
// import { apiClient } from '@/lib/api-client';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '@/lib/api-client';
import { FORGOT_PASSWORD_ROUTE } from '@/utils/constants';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleForgotPassword = async () => {
    /* try {
      const res = await apiClient.post(
        FORGOT_PASSWORD_ROUTE,
        { email },
        { withCredentials: true }
      );
      if (res.status === 200) {
        toast.success('Password reset link sent to your email');
        navigate('/login');
      } else {
        toast.error('Error sending password reset link');
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.msg) {
        toast.dismiss();
        toast.error(error.response.data.msg);
      } else {
        toast.dismiss();
        toast.error(error.response.data);
      }
      console.error('Login error:', error.response.data);
    } */
  };

  return (
    <div className='flex h-screen items-center justify-center bg-[#216A8B]'>
      <div className='relative w-11/12 md:w-9/12 lg:w-7/12 xl:w-5/12 bg-white border-2 border-white text-opacity-90 shadow-2xl rounded-3xl grid sm:grid-cols-2 overflow-hidden'>
        <div className='flex flex-col gap-6 items-center justify-center p-6'>
          <div className='flex flex-col items-center'>
            <img
              src={Logo}
              alt='App Logo'
              className='h-24 md:h-32 lg:h-40 logo'
            />
            <p className='text-center font-medium mt-2 text-sm md:text-base lg:text-lg'>
              Enter your email to receive a password reset link.
            </p>
          </div>
          <div className='flex flex-col gap-3'>
            <Input
              placeholder='Email'
              type='email'
              name='email'
              className='rounded-full p-4 md:p-5'
              value={email}
              autoComplete='off'
              onChange={handleChange}
              onKeyPress={(event) =>
                event.key === 'Enter' && handleForgotPassword()
              }
            />
            <Button
              className='rounded-full p-4 md:p-5 bg-[#3498db] hover:bg-[#2980b9]'
              onClick={handleForgotPassword}>
              Send Reset Link
            </Button>
          </div>
        </div>
        <div className='hidden sm:flex justify-center items-center'>
          <img
            src={Background}
            alt='background image'
            className='h-[400px] bg_pulse'
          />{' '}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

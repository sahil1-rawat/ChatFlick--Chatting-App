import Background from '@/assets/login4.png';
import Logo from '@/assets/logo.png';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import { validatePassword } from './validation';
import { apiClient } from '@/lib/api-client';
import { LOGIN_ROUTE, SIGNUP_ROUTE } from '@/utils/constants';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Auth = () => {
  const navigate = useNavigate();
  const { setUserInfo, onlineStatuses } = useAppStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const { email, password, confirmPassword } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateLogin = () => {
    if (!email.length) {
      toast.dismiss();
      toast.error('Email is required.');
      return false;
    }
    if (!password.length) {
      toast.dismiss();
      toast.error('Password is required!');
      return false;
    }
    return true;
  };

  const validateSignup = () => {
    if (!email.length) {
      toast.dismiss();
      toast.error('Email is required.');
      return false;
    }
    if (!password.length) {
      toast.dismiss();
      toast.error('Password is required!');
      return false;
    }
    const passwordError = validatePassword(password);
    if (passwordError) {
      toast.dismiss();
      toast.error(passwordError);
      return false;
    }
    if (confirmPassword !== password) {
      toast.dismiss();
      toast.error('Password and Confirm Password do not match!');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (validateLogin()) {
      try {
        const res = await apiClient.post(
          LOGIN_ROUTE,
          { email, password },
          { withCredentials: true }
        );
        toast.dismiss();
        toast.success('Login Successful.');

        if (res.data.user.id) {
          setUserInfo(res.data.user);
          if (res.data.user.profileSetup) {
            navigate('/chat');
          } else {
            navigate('/profile');
          }
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
        reset();
      }
    } else {
      reset();
    }
  };

  const handleSignup = async () => {
    if (validateSignup()) {
      try {
        const res = await apiClient.post(
          SIGNUP_ROUTE,
          { email, password },
          { withCredentials: true }
        );

        if (res.status === 201) {
          setUserInfo(res.data.user);
          navigate('/profile');
        }
        toast.success('Profile Created Successfully');
        reset();
      } catch (error) {
        if (error.response && error.response.data && error.response.data.msg) {
          toast.dismiss();
          toast.error(error.response.data.msg);
        }
        console.error('Signup error:', error.response.data);
        reset();
      }
    } else {
      reset();
    }
  };

  const reset = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
    });
    setPasswordVisible(false);
    setConfirmPasswordVisible(false);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  return (
    <div className='flex h-screen items-center justify-center bg-[#216A8B]'>
      <div className='relative w-11/12 md:w-9/12 lg:w-7/12 xl:w-5/12 bg-white border-2 border-white text-opacity-90 shadow-2xl rounded-3xl grid sm:grid-cols-2 overflow-hidden'>
        <div className='flex flex-col gap-10 items-center justify-center p-6'>
          <div className='flex flex-col items-center mb-8'>
            <img
              src={Logo}
              alt='App Logo'
              className='h-24 md:h-32 lg:h-40 logo'
            />
            <p className='text-center font-medium mt-4 text-sm md:text-base lg:text-lg'>
              Fill in your profile to start with the ultimate chat app!
            </p>
          </div>
          <Tabs className='w-full' defaultValue='login'>
            <TabsList className='bg-transparent rounded-none w-full'>
              <TabsTrigger
                value='login'
                className='data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 w-full rounded-none data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-[#0abde3] p-3 transition-all duration-300'
                onClick={reset}>
                Login
              </TabsTrigger>
              <TabsTrigger
                value='signup'
                className='data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 w-full rounded-none data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-[#0abde3] p-3 transition-all duration-300'
                onClick={reset}>
                Signup
              </TabsTrigger>
            </TabsList>
            <TabsContent
              className='flex flex-col gap-5 mt-6 md:mt-8 lg:mt-10'
              value='login'>
              <Input
                placeholder='Email'
                type='email'
                name='email'
                className='rounded-full p-4 md:p-5'
                value={email}
                autoComplete='off'
                onChange={handleChange}
                onKeyPress={(event) => event.key === 'Enter' && handleLogin()}
              />
              <div className='relative'>
                <Input
                  placeholder='Password'
                  type={passwordVisible ? 'text' : 'password'}
                  name='password'
                  className='rounded-full p-4 md:p-5 pr-12'
                  value={password}
                  onChange={handleChange}
                  onKeyPress={(event) => event.key === 'Enter' && handleLogin()}
                />
                {password.length > 0 && (
                  <button
                    type='button'
                    className='absolute right-4 top-1/2 transform -translate-y-1/2'
                    onClick={togglePasswordVisibility}>
                    {passwordVisible ? <FaEye /> : <FaEyeSlash />}
                  </button>
                )}
              </div>
              <Button
                className='rounded-full p-4 md:p-5 bg-[#3498db] hover:bg-[#2980b9]'
                onClick={handleLogin}>
                Login
              </Button>
              <Link
                to='/forgot-password'
                className='text-[#0abde3] text-sm md:text-base'>
                Forgot Password?
              </Link>
            </TabsContent>
            <TabsContent className='flex flex-col gap-5' value='signup'>
              <Input
                placeholder='Email'
                type='email'
                name='email'
                className='rounded-full p-4 md:p-5'
                value={email}
                autoComplete='off'
                onChange={handleChange}
                onKeyPress={(event) => event.key === 'Enter' && handleSignup()}
              />
              <div className='relative'>
                <Input
                  placeholder='Password'
                  type={passwordVisible ? 'text' : 'password'}
                  name='password'
                  className='rounded-full p-4 md:p-5 pr-12'
                  value={password}
                  onChange={handleChange}
                  onKeyPress={(event) =>
                    event.key === 'Enter' && handleSignup()
                  }
                />
                {password.length > 0 && (
                  <button
                    type='button'
                    className='absolute right-4 top-1/2 transform -translate-y-1/2'
                    onClick={togglePasswordVisibility}>
                    {passwordVisible ? <FaEye /> : <FaEyeSlash />}
                  </button>
                )}
              </div>
              <div className='relative'>
                <Input
                  placeholder='Confirm Password'
                  type={confirmPasswordVisible ? 'text' : 'password'}
                  name='confirmPassword'
                  className='rounded-full p-4 md:p-5 pr-12'
                  value={confirmPassword}
                  onChange={handleChange}
                  onKeyPress={(event) =>
                    event.key === 'Enter' && handleSignup()
                  }
                  onBlur={() => setConfirmPasswordVisible('password')}
                />
                {confirmPassword.length > 0 && (
                  <button
                    type='button'
                    className='absolute right-4 top-1/2 transform -translate-y-1/2'
                    onClick={toggleConfirmPasswordVisibility}>
                    {confirmPasswordVisible ? <FaEye /> : <FaEyeSlash />}
                  </button>
                )}
              </div>
              <Button
                className='rounded-full p-4 md:p-5 bg-[#3498db] hover:bg-[#2980b9]'
                onClick={handleSignup}>
                Signup
              </Button>
            </TabsContent>
          </Tabs>
        </div>
        <div className='hidden sm:flex justify-center items-center'>
          <img
            src={Background}
            alt='background image'
            className='h-[400px] bg_pulse'
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;

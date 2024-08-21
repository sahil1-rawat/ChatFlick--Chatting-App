import { useAppStore } from '@/store';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ContactUs = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
  });
  const { userInfo } = useAppStore();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.dismiss();
    toast.success('Thank You for Contact us...');
    // Reset form
    setFormData({
      subject: '',
      message: '',
    });
    navigate('/chat');
  };

  return (
    <div className='flex-1 flex flex-col items-center bg-gradient-to-br from-[#1a1a1a] via-[#2b2b2b] to-[#3c3c3c] p-8 md:p-16 text-center text-white'>
      <h1 className='text-4xl md:text-5xl font-extrabold mb-6'>Contact Us</h1>
      <p className='text-lg md:text-xl mb-6'>
        We're here to help! Fill out the form below to reach our support team.
      </p>

      <form
        onSubmit={handleSubmit}
        className='w-full max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg'>
        <div className='mb-4'>
          <label htmlFor='name' className='block text-lg font-semibold mb-2'>
            Name
          </label>
          <input
            type='text'
            id='name'
            name='name'
            value={`${userInfo.firstName} ${userInfo.lastName}`}
            disabled
            className='w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500'
            required
          />
        </div>
        <div className='mb-4'>
          <label htmlFor='email' className='block text-lg font-semibold mb-2'>
            Email
          </label>
          <input
            type='email'
            id='email'
            name='email'
            value={userInfo.email}
            disabled
            className='w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500'
            required
          />
        </div>
        <div className='mb-4'>
          <label htmlFor='subject' className='block text-lg font-semibold mb-2'>
            Subject
          </label>
          <input
            type='text'
            id='subject'
            name='subject'
            value={formData.subject}
            onChange={handleChange}
            className='w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500'
            required
          />
        </div>
        <div className='mb-4'>
          <label htmlFor='message' className='block text-lg font-semibold mb-2'>
            Message
          </label>
          <textarea
            id='message'
            name='message'
            value={formData.message}
            onChange={handleChange}
            rows='5'
            className='w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500'
            required></textarea>
        </div>
        <button
          type='submit'
          className='px-6 py-3 bg-purple-600 text-white rounded-lg shadow-lg hover:bg-purple-700 transition-all duration-300'>
          Submit
        </button>
      </form>

      <div className='mt-12'>
        <h2 className='text-3xl md:text-4xl font-bold mb-4'>
          Other Ways to Reach Us
        </h2>
        <p className='text-lg md:text-xl mb-6'>
          If you prefer, you can also contact us via email or phone.
        </p>
        <div className='flex flex-col gap-4 items-center'>
          <a
            href='mailto:rwtshail1@gmail.com'
            className='px-6 py-3 bg-purple-600 text-white rounded-lg shadow-lg hover:bg-purple-700 transition-all duration-300'>
            Email Support
          </a>
          <a
            href='tel:+91 7900519254'
            className='px-6 py-3 bg-gray-600 text-white rounded-lg shadow-lg hover:bg-gray-700 transition-all duration-300'>
            Call Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

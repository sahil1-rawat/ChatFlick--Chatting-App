import React from 'react';

const HelpCenter = () => {
  return (
    <div className='flex-1 flex flex-col items-center bg-gradient-to-br from-[#1a1a1a] via-[#2b2b2b] to-[#3c3c3c] p-8 md:p-16 text-center text-white'>
      <h1 className='text-4xl md:text-5xl font-extrabold mb-6'>Help Center</h1>

      {/* FAQs Section */}
      <section className='max-w-3xl mx-auto mb-12'>
        <h2 className='text-3xl md:text-4xl font-bold mb-4'>
          Frequently Asked Questions
        </h2>
        <div className='space-y-6'>
          <div className='bg-gray-800 p-6 rounded-lg shadow-lg'>
            <h3 className='text-xl font-semibold mb-2'>
              How do I start a new chat?
            </h3>
            <p className='text-gray-300'>
              To start a new chat, simply click the "Start a New Chat" button on
              the home page. From there, you can search for contacts or create a
              new conversation.
            </p>
          </div>
          <div className='bg-gray-800 p-6 rounded-lg shadow-lg'>
            <h3 className='text-xl font-semibold mb-2'>
              How do I change my profile settings?
            </h3>
            <p className='text-gray-300'>
              Navigate to the "Settings" tab in your profile. Here you can
              update your personal information, change your password, and adjust
              other settings.
            </p>
          </div>
          <div className='bg-gray-800 p-6 rounded-lg shadow-lg'>
            <h3 className='text-xl font-semibold mb-2'>
              What should I do if I encounter a technical issue?
            </h3>
            <p className='text-gray-300'>
              If you encounter any technical issues, please contact our support
              team through the "Contact Us" page or visit our troubleshooting
              guide for common issues.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className='max-w-3xl mx-auto mb-12'>
        <h2 className='text-3xl md:text-4xl font-bold mb-4'>Contact Us</h2>
        <p className='text-lg md:text-xl mb-6'>
          If you need further assistance, feel free to reach out to our support
          team. We're here to help!
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
      </section>

      {/* Additional Resources Section */}
      <section className='max-w-3xl mx-auto'>
        <h2 className='text-3xl md:text-4xl font-bold mb-4'>
          Additional Resources
        </h2>
        <p className='text-lg md:text-xl mb-6'>
          Explore our additional resources for more information about using our
          platform and troubleshooting common issues.
        </p>
        <ul className='list-disc list-inside space-y-2'>
          <li>
            <a href='/user-guide' className='text-purple-300 hover:underline'>
              User Guide
            </a>
          </li>
          <li>
            <a
              href='/troubleshooting'
              className='text-purple-300 hover:underline'>
              Troubleshooting Guide
            </a>
          </li>
          <li>
            <a
              href='/community-forum'
              className='text-purple-300 hover:underline'>
              Community Forum
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default HelpCenter;

import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { apiPost } from '../../utils/api';
import Loader from '../Others/Loader';

function Contact() {

  const initialFormData = {
    NAME: '',
    EMAIL: '',
    MOBILE: '',
    MESSAGE: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [loader, setLoader] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData({ ...formData, [name]: newValue });
  };

  const handleSubmit = async (e) => {
    setLoader(true);
    e.preventDefault();
    try {
      const res = await apiPost('contactUs/create', formData);
      if (res.code === 200) {
        toast.success("Thank you for your message. We will get back to you soon.")
        setFormData(initialFormData);
      } else {
        toast.error("Failed to send message. Please try again.")
        console.error(res.message);
      }
    } catch (error) {
      toast.error('Somthing Went Wrong')
      console.error('API call failed:', error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="my-10 px-4 flex justify-center">
      <ToastContainer />
      <div className="w-full max-w-6xl">
        <div className="mb-6 text-center" data-aos="zoom-in-right" data-aos-duration="1000">
          <h3 className="text-3xl text-primary font-poppins font-semibold relative heading_section inline-block">
            Contact Us
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 bg-white rounded-xl shadow-lg">
            <div className="flex justify-center items-center mb-4">
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl p-2 px-4 rounded-lg text-center text-white font-poppins font-semibold relative inline-block max-w-full bg-primary">
                Our Office
              </p>
            </div>
            <div className="p-6 items-center">
              <div className="flex items-center mt-6 text-gray-600">
                <div className="bg-blue-100 p-2 rounded-full">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    className="w-8 h-8 text-blue-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div className="ml-4 text-m font-semibold">
                  Basav Nagar Factory Road, Kagwad, <br />Karnataka - 591223
                </div>
              </div>
              <div className="flex items-center mt-2 text-gray-600">
                <div className="bg-green-100 p-2 rounded-full">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    className="w-8 h-8 text-green-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div className="ml-4 text-m font-semibold">
                  +91 8618749880
                </div>
              </div>
              <div className="flex items-center mt-2 text-gray-600">
                <div className="bg-red-100 p-2 rounded-full">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    className="w-8 h-8 text-red-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="ml-4 text-m font-semibold">
                  sumitghatage2001@gmail.com
                </div>
              </div>
            </div>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2801.4412043267585!2d74.71547927576681!3d16.695994345823316!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc0d99d7d5a8133%3A0xa67c070e3df0f690!2sAradhya%20Restaurant!5e0!3m2!1sen!2sin!4v1721380231071!5m2!1sen!2sin"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
        <div className="mt-6 rounded-xl shadow-xl p-4">
          <div className="justify-center items-center p-4 hover:scale-105 transition-transform duration-300 ease-in-out w-full">
            <p className="text-2xl font-bold text-center text-secondary">Get In Touch With Us</p>
            <p className="text-sm font-bold text-center text-gray-700">Fill in the form to start a conversation</p>
          </div>
          <div className="flex flex-col md:flex-row justify-center items-center">
            <img src="contact.jpg" alt="map" className="w-full md:w-1/2 mb-4 md:mb-0" />
            {loader ? <Loader /> :
              <form className="p-6 w-full md:w-1/2">
                <label htmlFor="name" className="text-sm font-semibold text-gray-600 block">
                  Full Name
                </label>
                <input
                  type="text"
                  name="NAME"
                  id="name"
                  placeholder="Full Name"
                  value={formData.NAME}
                  onChange={handleChange}
                  className="w-full mt-2 py-2 px-4 rounded-lg border border-gray-300 text-gray-800 focus:outline-none focus:border-orange-500"
                />
                <label htmlFor="email" className="text-sm font-semibold text-gray-600 mt-4 block">
                  Email
                </label>
                <input
                  type="email"
                  name="EMAIL"
                  id="email"
                  placeholder="Email"
                  value={formData.EMAIL}
                  onChange={handleChange}
                  className="w-full mt-2 py-2 px-4 rounded-lg border border-gray-300 text-gray-800 focus:outline-none focus:border-orange-500"
                />
                <label htmlFor="tel" className="text-sm font-semibold text-gray-600 mt-4 block">
                  Telephone Number
                </label>
                <input
                  type="tel"
                  name="MOBILE"
                  id="tel"
                  placeholder="Telephone Number"
                  value={formData.MOBILE}
                  onChange={handleChange}
                  className="w-full mt-2 py-2 px-4 rounded-lg border border-gray-300 text-gray-800 focus:outline-none focus:border-orange-500"
                />
                <label htmlFor="message" className="text-sm font-semibold text-gray-600 mt-4 block">
                  Message
                </label>
                <textarea
                  name="MESSAGE"
                  id="message"
                  placeholder="Message"
                  value={formData.MESSAGE}
                  onChange={handleChange}
                  className="w-full mt-2 py-2 px-4 rounded-lg border border-gray-300 text-gray-800 focus:outline-none focus:border-orange-500"
                />
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="w-full mt-6 bg-secondary hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300"
                >
                  Submit
                </button>
              </form>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;

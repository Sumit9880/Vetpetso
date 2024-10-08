import React from 'react'
import ReactDOM from 'react-dom/client'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Home from './components/Home/Home.jsx'
import About from './components/About/About.jsx'
import Contact from './components/Contact/Contact.jsx'
import Events from './components/Events/Events.jsx'
import EventDetails from './components/Events/EventDetails.jsx'
import History from './components/History/History.jsx'
import PhotoGallery from './components/Gallery/PhotoGallery.jsx'
import VideoGallery from './components/Gallery/VideoGallery.jsx'
import PrivacyPolicy from './components/Others/PrivacyPolicy.jsx'
import TermsOfUse from './components/Others/TermsOfUse.jsx'
import NotFound from './components/Others/NoFound.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Home />} />
      <Route path="about" element={<About />} />
      <Route path="events" element={<Events />} />
      <Route path="contact" element={<Contact />} />
      <Route path="eventdetails" element={<EventDetails />} />
      <Route path="history" element={<History />} />
      <Route path="photogallery" element={<PhotoGallery />} />
      <Route path="videogallery" element={<VideoGallery />} />
      <Route path="privacypolicy" element={<PrivacyPolicy />} />
      <Route path="termsofuse" element={<TermsOfUse />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <RouterProvider router={router} />
  // </React.StrictMode>,
)

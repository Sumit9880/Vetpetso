import React from 'react'
import ReactDOM from 'react-dom/client'
import { Navigate, Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Profile from './pages/Profile.jsx'
import Login from './pages/Login.jsx'
import Events from './pages/Events.jsx'
import Banners from './pages/Banners.jsx'
import Breed from './pages/Breed.jsx'
import CaseType from './pages/CaseType.jsx'
import University from './pages/University.jsx'
import Plan from './pages/Plan.jsx'
import Members from './pages/Members.jsx'
import MemberRequsets from './pages/MemberRequset.jsx'
import District from './pages/District.jsx'
import Taluka from './pages/Taluka.jsx'
import Cast from './pages/Cast.jsx'
import AnimalSample from './pages/AnimalSample.jsx'
import AnimalType from './pages/AnimalType.jsx'
import Notice from './pages/Notice.jsx'
import Commitee from './pages/Commitee.jsx'
import Contact from './pages/Contact.jsx'
import History from './pages/History.jsx'
import Gallery from './pages/Gallery.jsx'

const isAuthenticated = () => {
  return sessionStorage.getItem('token') !== null;
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/login" element={isAuthenticated() ? <Navigate to="/" /> : <Login />} />
      <Route path="/" element={isAuthenticated() ? <App /> : <Login />}>
        <Route index element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/events" element={<Events />} />
        <Route path="/banners" element={<Banners />} />
        <Route path="/breed" element={<Breed />} />
        <Route path="/casetype" element={<CaseType />} />
        <Route path="/university" element={<University />} />
        <Route path="/plan" element={<Plan />} />
        <Route path="/district" element={<District />} />
        <Route path="/taluka" element={<Taluka />} />
        <Route path="/cast" element={<Cast />} />
        <Route path="/animalSample" element={<AnimalSample />} />
        <Route path="/animalType" element={<AnimalType />} />
        <Route path="/members" element={<Members />} />
        <Route path="/notice" element={<Notice />} />
        <Route path="/memberrequest" element={<MemberRequsets />} />
        <Route path="/commitee" element={<Commitee />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/history" element={<History />} />
        <Route path="/contactUs" element={<Contact />} />
      </Route>
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)

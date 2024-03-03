import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Register from './pages/Register'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Header from './components/Header'
import PrivateRoutes from './components/PrivateRoutes'
import CreateListing from './pages/CreateListing'
import UpdateLIsting from './pages/UpdateLIsting'
import Listing from './pages/Listing'
import Search from './pages/Search'
import axios from 'axios'
//https://modern-real-estate-marketplace-1.onrender.com
const App = () => {
  axios.defaults.baseURL='https://modern-real-estate-marketplace-1.onrender.com'
  return (
    <BrowserRouter>
    <Header/>
      <Routes>
         <Route path="/" element={<Home/>}/>
         <Route path="/about" element={<About/>}/>
         <Route path="/register" element={<Register/>}/>
         <Route path="/login" element={<Login/>}/>
         <Route path="/search" element={<Search/>}/>
         <Route path="/listing/:listingId" element={<Listing/>}/>
         <Route element={<PrivateRoutes/>}>
         <Route path="/profile" element={<Profile/>}/>
         <Route path="/create-listing" element={<CreateListing/>}/>
         <Route path="/update-listing/:listingId" element={<UpdateLIsting/>}/>
          
         </Route> 
      </Routes>
    </BrowserRouter>
    // <h1 className="text-red-800">hello</h1>
  )
}

export default App
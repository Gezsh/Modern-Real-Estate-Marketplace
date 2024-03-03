import { useEffect, useState } from "react"
import axios from 'axios'
import { useParams } from "react-router-dom"
import style from 'styled-components'
import {Swiper , SwiperSlide} from 'swiper/react'
import SwiperCore from 'swiper'
import {Navigation} from 'swiper/modules'
import 'swiper/css/bundle'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HotelIcon from '@mui/icons-material/Hotel';
import ChairIcon from '@mui/icons-material/Chair';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import BathtubOutlinedIcon from '@mui/icons-material/BathtubOutlined';
import {useSelector} from 'react-redux'
import Contact from "../components/Contact"

const Main =style.div`
    
@media only screen and (min-device-width: 320px) and (max-device-width: 640px) and (-webkit-device-pixel-ratio: 2) {
  width:100%;
  justify-content:flex-start;
  padding:10px;
  margin-left:5px;
  margin-right:5px;
}  

`

const Listing = () => {
    SwiperCore.use([Navigation]);
    const params =useParams()
    const [listing,setListing]=useState({})
    const [loading,setLoading] =useState(false)
    const [error,setError]=useState(false)
    const [copied, setCopied] = useState(false);
    const [contact, setContact] = useState(false);
    const {currentUser}=useSelector(state=>state.user)
    useEffect(()=>{
         const fetchListing=async()=>{
            try{
                setLoading(true)
               await axios.get(`/api/listing/getListing/${params.listingId}`)
                  .then(response=>{
                   
                    setListing(response.data)
                    setLoading(false)
                    setError(false)
                    console.log(listing)
                  
                  })
                  .catch(error=>{
                    setError(true)
                    setLoading(false)
                    console.log(error.message)
                  })
            }catch(error){
                setError(error.message)
            }
            
         }
         fetchListing();
    },[params.listingId])
  return (
    <Main>
        {loading && <p style={{textAlign:"center",fontSize:"24px",marginTop:"20px"}}>Loading...</p>}
        {error && <p style={{textAlign:"center",fontSize:"24px",marginTop:"20px",color:"#b91c1c"}}>Something went wrong...</p>}

        {listing && !loading && !error && listing.imageUrls  &&(

           <div>

              <Swiper navigation>
                 {listing.imageUrls.map(
                    url=>(
                        <SwiperSlide key={url}>
                             <div
                              style={{height:"550px",background:`url(${url})`,position:"center",backgroundRepeat: "no-repeat",backgroundSize:"cover"}}
                             >
                                
                             </div>
                        </SwiperSlide>
                    )
                 )}

              </Swiper>
               
              <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
            <ContentCopyIcon
              className='text-slate-500'
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
              Link copied!
            </p>
          )}
          <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
            <p className='text-2xl font-semibold'>
              {listing.name} - ${' '}
              {listing.offer
                ? listing.discountPrice.toLocaleString('en-US')
                : listing.regularPrice.toLocaleString('en-US')}
              {listing.type === 'rent' && ' / month'}
            </p>

             <div style={{display:"flex",color:"#4d7c0f"}}>
             <LocationOnIcon/>
             <p>{listing.address}</p>
               </div>

               <div style={{display:"flex"}}>
                  <p style={{backgroundColor:"#7f1d1d",width:"100%",color:"white",marginTop:"10px",marginBottom:"10px",textAlign:"center",padding:"8px",borderRadius:"10px",maxWidth:"200px"}}>
                    {listing.type === 'rent' ? 'For rent ' : 'For sale'}
                  </p>

             {
                listing.offer &&(
                    <p style={{backgroundColor:"#14532d",width:"100%",marginLeft:"10px",color:"white",marginTop:"10px",marginBottom:"10px",textAlign:"center",padding:"8px",borderRadius:"10px",maxWidth:"200px"}}>${+listing.regularPrice - +listing.discountPrice} OFF</p>
                )
             }

               </div>

               <p style={{color:"#1e293b"}}><span style={{fontWeight:"700",color:"black"}}>Description :- </span>{listing.description}</p>

               <ul style={{display:"flex",gap:"10px"}}>
                  <li style={{display:"flex",alignItems:"center",gap:"8px",fontWeight:"500",color:"#4d7c0f"}}>
                   <HotelIcon/>
                   {listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`}
                  </li>
                  <li style={{display:"flex",alignItems:"center",gap:"8px",fontWeight:"500",color:"#4d7c0f"}}>
                   <BathtubOutlinedIcon/>
                   {listing.bathrooms > 1 ? `${listing.bathrooms} baths` : `${listing.batshrooms} bath`}
                  </li>
                  <li style={{display:"flex",alignItems:"center",gap:"8px",fontWeight:"500",color:"#4d7c0f"}}>
                   <LocalParkingIcon/>
                   { !listing.parking ? 'No parking' : 'Parking'}
                  </li>
                  <li style={{display:"flex",alignItems:"center",gap:"8px",fontWeight:"500",color:"#4d7c0f"}}>
                   <ChairIcon/>
                   {listing.furnished ? 'Furnished' : 'Unfurnished'}
                  </li>
               </ul>
               {currentUser && listing.UserRef !==currentUser._id && !contact && (
                <button onClick={()=>setContact(true)} className='bg-slate-600 text-white rounded-lg uppercase hover:opacity-95 p-3'>Contact landlord</button>
               )}

               {contact && (
                 <Contact listing={listing}/>
               ) }
                 
               </div>
                
           </div>
        )}
        
    </Main>
  )
}

export default Listing
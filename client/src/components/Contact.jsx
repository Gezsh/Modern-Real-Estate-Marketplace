import axios  from "axios"
import { useEffect, useState } from "react"
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";


const Contact = ({listing}) => {
    const [landlord,setLandlord]=useState(null)
    const [message,setMessage]=useState('')
  
  console.log(message)

  useEffect(()=>{
       const fetchLandlord=async()=>{
          await axios.get(`/api/user/${listing.UserRef}`)
                    .then(response=>{
                        setLandlord(response.data)
                        console.log(landlord.username)
                    }).catch(error=>{
                        console.log(error.message)

                     }) 
       }
        
       fetchLandlord()
  },[listing.UserRef])

  return (
    <>
        {landlord && (
            <div className='flex flex-col gap-2'>
            <p>Contact <span className='font-semibold'>{landlord.username} for </span> <span className='font-semibold'>{listing.name.toLowerCase()}</span> </p>
             <textarea 
             name="message" 
             id="message"  
             rows="2" 
             value={message} 
             onChange={(e)=>setMessage(e.target.value)} 
             placeholder="Enter your Message here"
             className='w-full border p-3 rounded-lg'
             />

             <Link 
               to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
               className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'
               >Send message</Link>
             </div>
        )}
    </>
  )
}



Contact.propTypes = {
    listing: PropTypes.object.isRequired // Assuming listing is an object
  };
  
export default Contact
import style from 'styled-components'
import {useSelector} from 'react-redux'
import {useEffect, useRef, useState} from 'react'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import { app } from '../firebase'
//import { updateCurrentUser } from 'firebase/auth'
import { 
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess ,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure
   } from '../redux/user/userSlice'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { Link } from 'react-router-dom'
const Wrapper=style.div `
padding:10px;
 max-width:32rem;
 margin-left:auto;
 margin-right:auto;

 @media only screen and (min-device-width: 320px) and (max-device-width: 640px) and (-webkit-device-pixel-ratio: 2) {
  width:100% !important;
  justify-content:space-around;
   
 
  
}
`

const Title =style.h1`
font-size:1.875rem;
display:flex;
justify-content:center;
font-weight:600;
margin-top: 1.75rem;
margin-bottom:1.75rem;
`
const Form =style.form`
   display:flex;
   flex-direction:column;
   gap:13px;
`
const ProfileImg=style.img`
   border-radius:50%;
   height:90px;
   width:90px;
   background-color:pink;
   object-fit:cover;
   cursor:pointer;
   margin-left:auto;
   margin-right:auto;
   margin-bottom:15px;
`

const Input =style.input`
padding:12px;
border-radius:10px;

&:focus{
  outline:none;
 
}
`
const UpdateBut =style.button`
  background-color:#334155;
  color:white;
   padding:12px;
   border-radius:10px;
   text-transform:uppercase;
   &:hover{
    opacity:95%;
   };
   &:disabled{
    opacity:88%;
   }

`

const SignOutContainer=style.div`
   display:flex;
   justify-content:space-between;
   margin-top:1.25rem;
`
const Profile = () => {
  const {currentUser,isLoading,error} =useSelector((state)=>state.user)
  const fileRef = useRef(null);
  
  const [file,setFile] =useState(undefined)
  const [filePer,setFilePer]=useState(0)
  const [fileUploadError ,setFileUploadError]=useState(false)
  const [showListingError,setShowListingError]=useState(false)
  const [formData,setFormData]=useState({})
  const [userListing,setUserListing]=useState([])
  const [updateSuccess,setUpdateSuccess]=useState(false);
  const dispatch=useDispatch()
 
  

  console.log(filePer)
  console.log(fileUploadError)
  useEffect(()=>{
         if(file){
          handleFileUpload(file);
         }
  },[file])

  const handleFileUpload=(file)=>{
     const storage=getStorage(app)
     const fileName=new Date().getTime() + file.name;
     const storageRef= ref(storage ,fileName);
     const uploadTask= uploadBytesResumable(storageRef,file) //to see the percentage of uploading the file
     
     uploadTask.on('state_changed',
       (snapshot)=>{
        const progress= (snapshot.bytesTransferred /
        snapshot.totalBytes) * 100
         setFilePer(Math.round(progress))
       },

     
     (error) => {
        setFileUploadError(true)
        console.log(error)
     },
     ()=>{
        getDownloadURL(uploadTask.snapshot.ref).then(
          (downloadURL)=>{
            setFormData({...formData, avatar:downloadURL})
          }
        )
     }

     );
  }

  const handleCkeck=(e)=>{
    setFormData({...formData,[e.target.id]: e.target.value})
    console.log({formData})
  }

  const handleDelete=(e)=>{
    e.preventDefault()
     dispatch(deleteUserStart())
    axios.delete(`/api/user/delete/${currentUser?._id}`,{withCredentials:true})
                .then(response=>{

                  console.log('delete response',response.data)
                  dispatch(deleteUserSuccess(response.data))
                })

              .catch((error)=> {
                dispatch(deleteUserFailure(error.message))
              })

  }
  
  const handleSignOut=(e)=>{
    e.preventDefault()
    dispatch(signOutUserStart())
      axios.get('/api/auth/signOut',{withCredentials:true})
             .then(response=>{
                 console.log(response.log),
                 dispatch(signOutUserSuccess(response.data))
             })
             .catch((error)=>{
              dispatch(signOutUserFailure(error.message))
             })
  }

  useEffect(()=>{
        console.log(currentUser?._id)
  },[])


  const handleSubmit=(e)=>{
       e.preventDefault()
    
       dispatch(updateUserStart());
       axios.patch(`/api/user/update/${currentUser._id}`,formData,{withCredentials:true})
                  .then(response=>{
                      
                      
                     dispatch(updateUserSuccess(response.data))
                     console.log("response->data",response.data)
                     setUpdateSuccess(true)
                    }
                  
                    )
                    .catch(error=>
                      dispatch(updateUserFailure(error.message))
                      )
   
  }

  const handleShowClick=async()=>{
       try{
        setShowListingError(false)
      axios.get(`/api/user/listing/${currentUser?._id}`,{withCredentials:true})
         .then(response=>{
         
          
          setUserListing(response.data.listings)
           console.log(userListing)
           console.log("response",response.data)
         })
       }catch(error){
        setShowListingError(true)
       }
       
  }

  const handleDeleteListing=async(listingId)=>{
       try{
              axios.delete(`/api/listing/delete/${listingId}`,{withCredentials:true})
                          .then(response=>{
                              console.log(response.data)
                             setUserListing ((prev)=>prev.filter((listing)=>listing._id !== listingId))
                          })
                          .catch(error=>{
                            console.log(error.message)
                          })
       }catch(error){
          console.log(error.message)
       }
  }

  return (
    <Wrapper>
    <Title>Profile</Title>
    <Form onSubmit={handleSubmit}>
       <input onChange={(e)=>setFile(e.target.files[0])} type='file'  ref={fileRef} hidden accept="image/.*" />
       <ProfileImg onClick={()=>fileRef.current.click()} src={ formData?.avatar ||currentUser.avatar} alt='profile'  />
       <p style={{marginLeft:"auto",marginRight:"auto"}}>
        { fileUploadError ? 
           <span style={{color:"#b91c1c"}}>Error image upload</span>  
           :
           filePer >0 && filePer <100 ?(
            <span style={{color:"#334155"}}>{`Uploading ${filePer}`}</span>)
           :
           
           filePer ===100 ?(
            <span style={{color:"#15803d"}}>Profile Successfuly uploaded</span>)
            : ""
      }
       </p>
       <Input type='text' id="username" placeholder='username' defaultValue={currentUser?.username} onChange={handleCkeck} />
       <Input type='email' id="email"  placeholder='email' defaultValue={currentUser?.email} onChange={handleCkeck}/>
       <Input type='password' id="password" placeholder='password'  onChange={handleCkeck}/>
       <UpdateBut disabled={isLoading}>{  isLoading ? 'Loading...' :'Update' }</UpdateBut>
      
     <Link to="/create-listing"
                     type='button' disabled={isLoading}
                     style={{  backgroundColor:"#15803d",
                      color:"white",
                       padding:"12px",
                       borderRadius:"10px",
                       textTransform:"uppercase",
                       textAlign:"center"
                      }}
      >Create listing</Link>
      
      
    </Form>
    <SignOutContainer>
      <span  onClick={handleDelete} style={{color:"#b91c1c" ,cursor:"pointer"}}>Delete account</span>
      <span onClick={handleSignOut} style={{color:"#b91c1c" ,cursor:"pointer"}}>Sign out</span>
      
    </SignOutContainer>
    <p style={{color:"#b91c1c",marginTop:"10px"}}>{error ? error : ''}</p>
    <p style={{color:""}}>{updateSuccess ? 'user is updated successfully' : ''}</p>
    <button onClick={handleShowClick} style={{color:"#15803d",width:"100%"}} >Show listing</button>
    <p style={{marginTop:"10px",color:"#b91c1c"}}>{showListingError ? 'error showing listing' :''}</p>

    {userListing  &&  userListing.length >0  &&
      <div style={{display:"flex", flexDirection:"column",gap:"10px"}}>
       <h1 style={{textAlign:"center",marginTop:"10px",marginBottom:"10px",fontSize:"25px",fontWeight:"700"}}>Your listing</h1>
         {
         userListing.map((listing)=>(
            <div key={listing._id} style={{borderWidth:"2px",display :"flex",alignItems:"center",justifyContent:"space-between", padding:"12px",gap:"5px"}}>
              <Link to={`/listing/${listing._id}`}>
                 <img style={{height:"4rem",width:"4rem", objectFit:"contain" }} src={listing.imageUrls[0]}/>
              </Link>
              <Link style={{color:"#334155",fontWeight:"500", flex:"1" ,truncate:"true"}} to={`/listing/${listing._id}`}>
                <p > {listing.name}</p>
              </Link>
                  
               <div style={{display:"flex",flexDirection:"column"}}>
                   <button onClick={()=>handleDeleteListing(listing._id)} style={{color:"#b91c1c",textTransform:"uppercase"}}>Delete</button>
                   <Link to={`/update-listing/${listing._id}`}>
                   <button style={{color:"#15803d",textTransform:"uppercase"}}>Edit</button>
                   </Link>
               </div>   
            </div>

       ))
         }
      </div>
       
    }

    </Wrapper>
  )
}



export default Profile
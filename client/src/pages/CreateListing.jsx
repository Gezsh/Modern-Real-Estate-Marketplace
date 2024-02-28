import { useState } from 'react'
import style from 'styled-components'
import {app} from '../firebase'
import axios from 'axios'
import {useSelector} from 'react-redux' 
import {useNavigate} from 'react-router-dom'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
const MainContainer=style.main`
  padding:12px;
  max-width:56rem;
  margin-left:auto;
  margin-right:auto;
`
const Title =style.h1`
  text-align:center;
  font-size:24px;
  font-weight:500;
  margin-top:20px;
  margin-bottom:20px;

`
const Form=style.form`
  display :flex;
  flex-direction:columun;
  gap:15px;
`
const LeftColumn=style.div`

  flex:1;

  
`
const RightColumn=style.div`
   display:flex;
   flex-direction:column;
   flex:1;
`
const InputContainer=style.div`
  display:flex;
  flex-direction:column;
  margin-left:10px;
  gap:16px;
`
const CheckBoxContainer=style.div`
   display:flex;
   flex-wrap:wrap;
   gap:20px;
   margin-top:12px;
`
const Input=style.input`
  border-radius:12px;
  max-length:62;
  min-length:10;
  
  padding:12px;
`
const Textarea=style.textarea`
border-radius:12px;
max-length:62;
min-length:10;

padding:12px;
`
const CheckboxInput=style.input`
  width:30px;       
  height:20px;
`
const NumberInputContainer =style.div`
  display:flex;
  justify-content:space-between;
  margin-top:25px;
  flex-wrap:wrap;
  gap:10px;
`
const NumberInput =style.input`
  width:40px;
  height:40px;
  border:2px;
  border-radius:12px;
  border-color:#d1d5db;
`

const FileUploadContainer =style.div`
  display:flex;
  gap:12px;
  margin-top:10px;
`
const FileInput=style.input`
   padding:12px;
   border-color:#d1d5db;
   width:70%;
   border-radius:12px;
`
const UploadBut=style.button`
padding: 12px;
color: #15803d;
border-width: 1px; 
padding: 12px;
border-color: #15803d;
&:hover {
 box-shadow: 0 0 0 2px #15803d; 
`
 const CreateListingBut=style.button`
 background-color:#334155;
 color:white;
  margin-top:25px;
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
const ListedImage=style.img`
     width:5rem;
     height:5rem;
     object-fit:cover;
     border-radius:10px;
`
const ListedImageContainer=style.div`
    display:flex;
    justify-content:space-between;
    padding:12px;
    border:2px;
    align-items:center;
`
const DeleteButton=style.button`
   padding:12px;
   color:#b91c1c;
   border-radius:12px;
   text-transorm:uppercase;
   &:hover{
    opacity:75%;
   }
`
function CreateListing() {
  const navigate=useNavigate()
  const {currentUser}=useSelector(state=>state.user)
  const [files,setFiles]=useState([])
  const [error,setError]=useState(false)
  const [loading,setLoading]=useState(false)
  console.log(files)
  const [formData,setFormData] =useState({
    imageUrls : [],
    name: '',
    description: '',
    address:'',
    type:'rent',
    bedrooms:1,
    bathrooms:1,
    regularPrice:100,
    discountPrice:0,
    offer:false,
    parking:false,
    furnished:false
  })
 
  const [imageUploadError,setImageUploadError]=useState(false)
  const [uploading,setUploading]=useState(false)
  console.log(formData)

  const handleImageSubmit=()=>{
    if( files.length > 0 && files.length + formData.imageUrls.length <7){
     const promises =[];
     
     for (let i=0;i<files.length;i++){
          setUploading(true);
          setImageUploadError(false)
           promises.push(storeImage(files[i]))
          
           
    }
      Promise.all(promises).then((urls)=>{
          console.log(urls)
          setFormData({...formData , imageUrls :formData.imageUrls.concat(urls)});
          setImageUploadError(false);
          setUploading(false);
          
      }).catch((error)=>{
        setImageUploadError('image upload failed (2 mb max per image )')
        setUploading(false);
        console.log(error)
      })
    }else{
      setImageUploadError('you can only upload 6 image per listing')
      setUploading(false);
    }

  }

  const storeImage=async(file)=>{
   // console.log("storage image function called")
      return new Promise((resolve,reject)=>{
           const storage = getStorage(app);
           const fileName =new Date().getTime() + file.name;
           const storageRef =ref(storage,fileName);
           const uploadTask= uploadBytesResumable(storageRef,file)
         //  console.log("Uploading",uploadTask)
           uploadTask.on(
             "state_changed",
             (snapshot)=>{
                          const progress =(snapshot.bytesTransferred /snapshot.totalBytes) * 100;
                          console.log(`upload is ${progress}% done`)
             },
             (error)=>{
                     reject(error);
             
           },
             ()=>{
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
                  
                  resolve(downloadURL)
                  
                })
                
             }
           )
      })
  }


  const handleDeleteImage=(index)=>{
         setFormData({
          ...formData,
          imageUrls : formData.imageUrls.filter((_,i)=> i!== index)
         })
  }

  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit =(e)=>{
     e.preventDefault();
      try{
        if(formData.imageUrls.length < 1) return setError("you must upload at least one image")
        if(+formData.regularPrice < +formData.discountPrice) return setError("discount price must be lower than regular price")
          setLoading(true)
          setError(false)
          axios.post('/api/listing/create',{...formData, UserRef : currentUser._id})
                .then(response=>{
                   console.log('list-response', response.data)
                   navigate(`/listing/${response.data._id}`)
                       setLoading(false)
                }).catch(error=>{
                  console.log(error.message)
                  setError(false)
                })
      }catch(error){
        setError(error.message)
        setLoading(false)
      }
  }

  return (
    <MainContainer>
       <Title>Create a listing</Title>
       <Form onSubmit={handleSubmit}>
          <LeftColumn>
                <InputContainer>
                    <Input id='name' required type="text" placeholder="name" onChange={handleChange} value={formData.name} />
                    <Input id='address' type="text" placeholder="address" onChange={handleChange} value={formData.address} />
                    <Textarea row='4' id='description' type='text' placeholder="description" onChange={handleChange} value={formData.description} />
                </InputContainer>
                <CheckBoxContainer>
                  <div style={{display:"flex",alignItems:"center"}}>
                    <CheckboxInput type='checkbox' id='sale' onChange={handleChange} checked={formData.type ==='sale'} />
                    <span>Sell</span>
                  </div>
                  <div style={{display:"flex",alignItems:"center"}}>
                    <CheckboxInput type='checkbox' id='rent' onChange={handleChange} checked={formData.type ==='rent'} />
                    <span>Rent</span>
                  </div>
                  <div style={{display:"flex",alignItems:"center"}}>
                    <CheckboxInput type='checkbox' id='parking' onChange={handleChange} checked={formData.parking} />
                    <span>Parking spot</span>
                  </div>
                  <div style={{display:"flex",alignItems:"center"}}>
                    <CheckboxInput type='checkbox' id='furnished' onChange={handleChange} checked={formData.furnished} />
                    <span>Furnished</span>
                  </div>
                  <div style={{display:"flex",alignItems:"center"}}>
                    <CheckboxInput type='checkbox' id='offer' onChange={handleChange} checked={formData.offer} />
                    <span>Offer</span>
                  </div>
                </CheckBoxContainer>
                <NumberInputContainer>
                     <div style={{display:"flex",alignItems:"center" ,gap:"8px"}}>
                           <NumberInput type='number' id='bedrooms' min='1' max='10' required onChange={handleChange} value={formData.bedrooms} />
                          <span>Beds</span>
                    </div>
                     <div style={{display:"flex",alignItems:"center" ,gap:"8px"}}>
                           <NumberInput type='number' id='bathrooms' min='1' max='10' required onChange={handleChange} value={formData.bathrooms} />
                         <span>Baths</span>
                    </div>
                     <div style={{display:"flex",alignItems:"center" ,gap:"8px"}}>
                           <NumberInput type='number' id='regularPrice' min='100' max='1000000' required onChange={handleChange} value={formData.regularPrice} />
                         <div>
                           <p>Regular price</p>
                           <span style={{display:"flex",fontSize:'10px'}}>$ / month</span>
                         </div>
                    </div>
                    {formData.offer && (
                      <div style={{display:"flex",alignItems:"center" ,gap:"8px"}}>
                           <NumberInput type='number' id='discountPrice' min='0' max='1000000' required onChange={handleChange} value={formData.discountPrice} />
                         <div>
                           <p>Discount price</p>
                           <span style={{display:"flex",fontSize:'10px'}}>$ / month</span>
                         </div>
                    </div>
                    )}
                     
               </NumberInputContainer>
          </LeftColumn>
          <RightColumn>
               <p style={{fontWeight:"500"}} >Images:<span style={{fontWeight:"initial",color:"#4b5563"}}>The first image will be the cover(max 6) </span></p>
               <FileUploadContainer>
                   <FileInput onChange={(e)=>setFiles(e.target.files)} type="file" id="images" accept="image/*" multiple/>
                   <UploadBut disabled={uploading} onClick={handleImageSubmit} type="button">{uploading ? 'Uploading' :'Upload'}</UploadBut>
                  
               </FileUploadContainer>
               <p style={{color:'#b91c1c'}}>{imageUploadError ? imageUploadError : ''}</p>
               {
                formData.imageUrls.length > 0 && formData.imageUrls.map((url,index) => (
               <ListedImageContainer key={url}>
                      <ListedImage src={url} alt='listing image' />
                      <DeleteButton type="button" onClick={()=>handleDeleteImage(index)} >Delete</DeleteButton>
               </ListedImageContainer>
                  ))
               }
               <CreateListingBut disabled={loading || uploading} >{loading ? 'Loading...' : 'create listing'}</CreateListingBut>
               {error && <p style={{color:"#b91c1c"}}>{error}</p>}
          </RightColumn>
       </Form>
    </MainContainer>
  )
}

export default CreateListing 
import  style from 'styled-components'
import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth'
import { app } from '../firebase';
import axios from 'axios'
import {useDispatch} from 'react-redux';
import {signInFailure, signInSuccess} from '../redux/user/userSlice'
import { useNavigate } from 'react-router-dom';
const OAuthButn=style.button `
background-color:#b91c1c;
color:white;
padding:12px;
border-radius:10px;
text-transform:uppercase;
&:hover{
 opacity:95%;
};
`
function OAuth() {
      const dispatch =useDispatch()
      const navigate=useNavigate()
    const handleGoogleClick =async()=>{
        try{
            const provider =new GoogleAuthProvider();
            const auth=getAuth(app)
            
            const result =await signInWithPopup(auth,provider)
            console.log(result) 
                        axios.post('/api/auth/google',{username:result.user.displayName,email:result.user.email,photo:result.user.photoURL}) 
                     .then(response=> {
                      console.log('response :',response.data),
                      navigate('/'),
                      
                     dispatch(signInSuccess(response.data.rest))},
                     
                     
                     )           
                     .catch(error=>{
                        if (error.response) {
                        //   console.log(error);                       
                        //  setIsloading(false);
                        // setError(error.response.data.message);
                        dispatch(signInFailure(error.response.data.message))
                      } else {
                        // Handle network errors or other exceptions
                        console.log('Error:', error);
                      }
                      })
        }catch(error){
           console.log('could not sign in with google')
        }
    }

  return (
    <OAuthButn type='button' onClick={handleGoogleClick}>Continue with google</OAuthButn>
  )
}

export default OAuth
import style from 'styled-components';
import {Link , useNavigate} from 'react-router-dom';
import {useState} from 'react'
import axios from 'axios';
import {  useDispatch, useSelector} from 'react-redux';
import { signInStart,signInSuccess,signInFailure } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';
const Wrapper=style.div `
 padding:10px;
 max-width:32rem;
 margin-left:auto;
 margin-right:auto;
`

const Text=style.h1 `
  font-size:1.875rem;
  display:flex;
  justify-content:center;
  font-weight:600;
  margin-top: 1.75rem;
  margin-bottom:1.75rem;
`
const Form =style.form`
  display:flex;
  
  flex-direction: column;
  
  gap:15px;

  
`
const Input=style.input`
  padding:12px;
  border-radius:10px;
  &:focus{
    outline:none;
   
  }
`
const SignupButton=style.button`
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

const Login = () => {
   
   const [email,setEmail]=useState('');
   const [password,setPassword]=useState('');
   //const [error,setError]=useState('');
   //const [isLoading,setIsloading]=useState(false)
   const {isLoading,error} =useSelector((state)=>state.user)
  const navigate=useNavigate()
  const dispatch=useDispatch();
  const handleSubmit=async(e)=>{
      e.preventDefault();
        
        dispatch(signInStart())
         axios.post('/api/auth/signin',{email,password},{withCredentials:true})
                      .then(response=>{
                      //  console.log(response.data);
                      //  setError('');
                      //  setIsloading(false);
                      dispatch(signInSuccess(response.data.rest))
                       navigate('/')
                      })
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
    
  }
     
  
 
   console.log(email,password)

  return (
    <Wrapper>
      <Text>sign in</Text>
      <Form onSubmit={handleSubmit}>
        
         <Input
             id="email"
             type="email"
             placeholder="sth@gmail.com"
             value={email}
             onChange={(e)=>setEmail(e.target.value)}
         />
         <Input
             id="password"
             type="password"
             placeholder="password"
             value={password}
             onChange={(e)=>setPassword(e.target.value)}
         />
         <SignupButton disabled={isLoading}>{isLoading ? "Loading..." :"sign in"  }</SignupButton>
         <OAuth/>
      </Form>
      <div style={{display:"flex" ,gap:"5px",marginTop:"1.25rem"}}>
         <p>Dont Have an account?</p>
         <Link to='/register'><span style={{color:"#1d4ed8"}}>sign up</span></Link>
      </div> 
        {error && <p style={{color:"#ef4444",marginTop:"10px"}}>{error}</p>}
    </Wrapper>
  )
}
 
export default Login
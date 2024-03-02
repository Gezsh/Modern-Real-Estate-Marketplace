import style from 'styled-components';
import SearchIcon from '@mui/icons-material/Search';
import {Link ,useNavigate} from "react-router-dom";
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

const HeaderContainer=style.div`
   background-color: #e2e8f0;
   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
   

`

const Wrapper =style.div `
  display:flex;
  justify-content:space-between;
  align-items:center;
  max-width: 72rem;
  margin-left:auto;
  margin-right:auto;
  padding:0.75rem;
`
const Logo=style.div`
  display:flex;
  flex-wrap:wrap;
  font-weight:bold;
  font-size:1.4rem;
  
  
`
const Form=style.form`
  background-color:#f1f5f9;
  padding :0.75rem;
  border-radius :0.825rem;
  display:flex;
  align-items:center;

`
const Search=style.input`
  background:transparent;
  width:6rem;

  &:focus {
    outline:none;
  }
  @media (min-width: 640px) {
    width:16rem;
  }
`

const ListContainer=style.ul`
  display:flex;
  gap:1rem;
 
`
const List =style.li`
color:#334155;
&:hover{
  text-decoration:underline;
}
`
const ProfileImg=style.img`
border-radius:50%;
width:38px;
height:38px;

object-fit:cover;

`

const Header = () => {
  const {currentUser} = useSelector(state=>state.user)
  const [searchTerm,setSearchTerm]=useState('')
  const navigate=useNavigate()
  const handleSubmit=(e)=>{
         e.preventDefault();
         const urlParams=new URLSearchParams(window.location.search)
         urlParams.set('searchTerm',searchTerm);
         const searchQuery= urlParams.toString();
         navigate(`search?${searchQuery}`)

  }

    useEffect(()=>{
         
       const urlParams =new URLSearchParams(location.search)
       const SearchTermFromUrl = urlParams.get('searchTerm')
       
      if(SearchTermFromUrl){
        setSearchTerm(SearchTermFromUrl);
      }

    },[location.search])
  return (
    <HeaderContainer>
       <Wrapper className="flex justify-between item-center">
        <Logo>
            <span style={{color:"#64748b"}}>Gezsh</span>
            <span style={{color:"#334155"}}>Estate</span>
        </Logo>
        <Form onSubmit={handleSubmit}>
            <Search 
            type="text" 
            placeholder="search..."
            value={searchTerm}
            onChange={(e)=>setSearchTerm(e.target.value)}
            />
            <button>
              <SearchIcon style={{color:"#475569"}}/>
            </button>
            
        </Form>
        <ListContainer>
           <Link to="/"><List>Home</List> </Link>  
          <Link to="/about"><List>About</List></Link> 
          
          <Link to="/profile"> 
          { currentUser ?
            (<ProfileImg src={currentUser?.avatar}  alt=""/>) : <List>Sign in</List>
          }
          </Link> 
           
        </ListContainer>
        </Wrapper>
    </HeaderContainer>
  )
}


export default Header
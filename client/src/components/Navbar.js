import React,{useContext} from 'react'
import {Link, useHistory} from 'react-router-dom'
import {UserContext} from '../App'
import M from 'materialize-css'

const NavBar = ()=>{

    const {state, dispatch} = useContext(UserContext)
    const history = useHistory()
    const renderList =()=>{
      if(state){
        return [
          <li><Link to="/profile">Profile</Link></li>,
          <li><Link to="/createpost">Raise question</Link></li>,
          <li>
              <button className="btn waves-effect waves-light #ef5350 red lighten-1" 
                onClick={()=>{
                  localStorage.clear()
                  dispatch({type:"CLEAR"})
                  history.push('/signin')
                  M.toast({html: "Signed out successfully", classes:"#7cb342 light-green darken-1"});
                }}>Logout</button>
          </li>
        ]
      }else{
        return [
          <li><Link to="/signup">Sign up</Link></li>,
          <li><Link to="/signin">Sign in</Link></li>
        ]
      }
    }
    return(
        <nav>
    <div className="nav-wrapper white">
      <Link to={state? "/":"/signin"} className="brand-logo"><img className="brand-logo-img" src="https://res.cloudinary.com/kalpesh-uddesh/image/upload/v1616249255/twc2wnespsiwaswjw6fe.png" alt="Discussion Forum"/></Link>
      <ul id="nav-mobile" className="right hide-on-med-and-down">
       {renderList()}  
      </ul>
    </div>
  </nav>
    )
}

export default NavBar;

{/* <Link to=""> is used instead of <a href=""> to avoid page reload */}
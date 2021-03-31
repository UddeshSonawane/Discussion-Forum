import React,{useState,useContext} from 'react'
import {Link, useHistory, useParams} from 'react-router-dom'

import M from 'materialize-css'

const Signin = () => {

    const history = useHistory();
    const [password, setPassword] = useState("");
    const {token} = useParams()
    console.log(token)
    const PostData = ()=>{
      fetch("/new-password", {
          method:"post",
          headers:{
              "Content-Type":"application/json"
          },
          body:JSON.stringify({
              password,
              token
          })
      }).then(res=>res.json())
      .then(data=>{
        console.log(data)
          if(data.error){
              M.toast({html: data.error, classes:"#e53935 red darken-1"});
          }
          else{
              
              M.toast({html: data.message, classes:"#7cb342 light-green darken-1"});
              history.push('/signin')
          }   
      }).catch(err=>{
          console.log(err)
      })
  }

  return (
    <div className="mycard">
      <div className="card auth-card input-field">
        <img src="https://res.cloudinary.com/kalpesh-uddesh/image/upload/v1616249255/twc2wnespsiwaswjw6fe.png" alt='Discussion Forum' height="300px"/>
     
        <input type="password" placeholder="Enter new password"
        value={password} onChange={(e)=>setPassword(e.target.value)}></input>
        <button className="btn waves-effect waves-light #ef5350 red lighten-1" onClick={()=>PostData()}>Update password</button>
      
       
      </div>
    </div>
  )
}

export default Signin
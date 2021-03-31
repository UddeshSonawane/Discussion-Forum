import React,{useState,useContext} from 'react'
import {Link, useHistory} from 'react-router-dom'

import M from 'materialize-css'

const Reset = () => {

  const history = useHistory();

  const [email, setEmail] = useState("");

  const PostData = ()=>{

      if(!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email))
      {
          M.toast({html: "Please enter valid email", classes:"#e53935 red darken-1"});
          return;
      }

      fetch("/reset-password", {
          method:"post",
          headers:{
              "Content-Type":"application/json"
          },
          body:JSON.stringify({
      
              email
          })
      }).then(res=>res.json())
      .then(data=>{
  
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
        <img src="discussion-forum-logo.png" alt='Discussion Forum' height="300px"/>
        <input type="text" placeholder="email"
        value={email} onChange={(e)=>setEmail(e.target.value)}></input>
        <button className="btn waves-effect waves-light #ef5350 red lighten-1" onClick={()=>PostData()}>Reset Password</button>
      </div>
    </div>
  )
}

export default Reset
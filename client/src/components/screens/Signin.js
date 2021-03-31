import React,{useState,useContext} from 'react'
import {Link, useHistory} from 'react-router-dom'
import {UserContext} from '../../App'
import M from 'materialize-css'

const Signin = () => {
  const {state, dispatch} = useContext(UserContext)
  const history = useHistory();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const PostData = ()=>{

      if(!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email))
      {
          M.toast({html: "Please enter valid email", classes:"#e53935 red darken-1"});
          return;
      }

      fetch("/signin", {
          method:"post",
          headers:{
              "Content-Type":"application/json"
          },
          body:JSON.stringify({
              password,
              email
          })
      }).then(res=>res.json())
      .then(data=>{
        console.log(data)
          if(data.error){
              M.toast({html: data.error, classes:"#e53935 red darken-1"});
          }
          else{
              localStorage.setItem("jwt",data.token)
              localStorage.setItem("user", JSON.stringify(data.user))
              dispatch({type:"USER", payload:data.user})
              M.toast({html: "Signed in successfully", classes:"#7cb342 light-green darken-1"});
              history.push('/')
          }   
      }).catch(err=>{
          console.log(err)
      })
  }

  return (
    <div className="mycard">
      <div className="card auth-card input-field">
        <img src="https://res.cloudinary.com/kalpesh-uddesh/image/upload/v1616249255/twc2wnespsiwaswjw6fe.png" alt='Discussion Forum' height="300px"/>
        <input type="text" placeholder="email"
        value={email} onChange={(e)=>setEmail(e.target.value)}></input>
        <input type="password" placeholder="password"
        value={password} onChange={(e)=>setPassword(e.target.value)}></input>
        <button className="btn waves-effect waves-light #ef5350 red lighten-1" onClick={()=>PostData()}>Signin</button>
        <div className="signin-nu-fp-link">
            <h6><Link to="/reset">Forget password?</Link></h6>
            <h6><Link to="/signup">New user?</Link></h6>
        </div>
      </div>
    </div>
  )
}

export default Signin
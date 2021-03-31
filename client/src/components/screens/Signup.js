import React,{useState, useEffect} from 'react'
import {Link, useHistory} from 'react-router-dom'
import M from 'materialize-css'

const Signup =()=>{

    const history = useHistory();
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [image, setImage] = useState("")
    const [url, setUrl] = useState(undefined)

    useEffect(()=>{
        if(url){
            uploadFields()
        }
    },[url])

    const uploadProfilePic = ()=>{
        const data = new FormData()
            data.append("file", image)
            data.append("upload_preset","discussion-forum")
            data.append("cloud_name","kalpesh-uddesh")
            fetch("https://api.cloudinary.com/v1_1/kalpesh-uddesh/image/upload", {
                method:"post",
                body:data
            })
            .then(res=>res.json())
            .then(data=>{
                // console.log(data)
                setUrl(data.url)
            })
            .catch(err=>{
                console.log(err)
            })
    }

    const uploadFields = ()=>{
        if(!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email))
        {
             M.toast({html: "Please enter valid email", classes:"#e53935 red darken-1"});
            return;
        }

        fetch("/signup", {
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name,
                password,
                email,
                profilePic:url
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

    const PostData = ()=>{
        if(image){
            uploadProfilePic()
        }else{
            uploadFields()
        }   
    }

    return(
        <div className="mycard">
        <div className="card auth-card input-field">
        <img src="https://res.cloudinary.com/kalpesh-uddesh/image/upload/v1616249255/twc2wnespsiwaswjw6fe.png" alt='Discussion Forum' height="300px"/>
        <input type="text" placeholder="name"
        value={name} onChange={(e)=>setName(e.target.value)}></input>
        <input type="text" placeholder="email"
        value={email} onChange={(e)=>setEmail(e.target.value)}></input>
        <input type="password" placeholder="password"
        value={password} onChange={(e)=>setPassword(e.target.value)}></input>
        <div className="file-field input-field">
            <div className="btn">
                <span>Profile image</span>
                <input type="file" 
                    onChange={(e)=>setImage(e.target.files[0])}/>
            </div>
            <div className="file-path-wrapper">
                <input className="file-path validate" type="text"/>
            </div>
        </div>
        <button className="btn waves-effect waves-light #ef5350 red lighten-1"
        onClick={()=>PostData()}>Signup</button>
     
        <h6>
            <Link to="/signin">Already have an account?</Link>
        </h6>
      </div>
    </div>
    )
}

export default Signup
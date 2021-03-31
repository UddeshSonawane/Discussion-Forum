import React,{useState, useEffect} from "react"
import { useHistory} from 'react-router-dom'
import M from 'materialize-css'

const CreatePost =() =>{

    const history = useHistory();

    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")

    const postDetails = ()=>{

        if(image){
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
        else{
            M.toast({html: "Please add all the fields - add image", classes:"#e53935 red darken-1"});
        }

    }

    // following useEffect comes into picture when url gets changed
    // as updating URL needs time, so till then we need to wait
    // so, after first network request (to cloudinary) 
    // this will wait and once url of image gets updated
    // we will proceed to next request to db
    useEffect(()=>{
        if(url){
            fetch("/createpost", {
                method:"post",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    title,
                    body,
                    pic:url
                })
            }).then(res=>res.json())
            .then(data=>{
            //   console.log(data)
                if(data.error){
                    M.toast({html: data.error, classes:"#e53935 red darken-1"});
                }
                else{
                    M.toast({html: "Question raised successfully!", classes:"#7cb342 light-green darken-1"});
                    history.push('/')
                }   
            }).catch(err=>{
                console.log(err)
            })
        }
    },[url])


    return(

        <div className="card input-field"
        style={{margin:"10px auto", maxWidth:"500px", padding: "20px", textAlign:"center"}}>
            <input type="text" placeholder="Category of Question"
                value={title} onChange={(e)=>setTitle(e.target.value)}/>
            <input type="text" placeholder="Your question here"
                value={body} onChange={(e)=>setBody(e.target.value)}/>

            <div className="file-field input-field">
                <div className="btn">
                    <span>Upload image</span>
                    <input type="file" 
                        onChange={(e)=>setImage(e.target.files[0])}/>
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text"/>
                </div>
            </div>

            <button className="btn waves-effect waves-light #ef5350 red lighten-1"
            onClick={()=>postDetails()}>Submit question</button>


        </div>
    )
}

export default CreatePost
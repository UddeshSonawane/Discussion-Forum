import React,{useState, useEffect, useContext} from 'react'
import {UserContext} from '../../App'
import {Link} from 'react-router-dom'

const Home =()=>{
    const [data, setData] = useState([])
    const {state, dispatch} = useContext(UserContext)

    useEffect(()=>{
        fetch('/allpost',{
            headers:{
                "Authorization": "Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            // console.log(result)
            setData(result.posts)
        })
    },[])

    const answerQuestion = (text, postId) =>{
        fetch('/answer',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization": "Bearer "+localStorage.getItem("jwt") 
            },
            body:JSON.stringify({
                postId,
                text
            })
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            const newAnswer = data.map(item=>{
                if(item._id==result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newAnswer)
        }).catch(err=>{
            console.log(err)
        })
    }

    const deleteQuestion =(postid)=>{
        fetch(`/deletequestion/${postid}`,{
            method:"delete",
            headers:{
                "Authorization": "Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            const newData = data.filter(item=>{
                return item._id !== result._id
            })
            setData(newData)
        })
    }

    return(
        <div className="home">
            {
                data.map(item=>{
                    return(
                        <div className="card home-card" key={item._id}>
                                    <h5><Link to={item.postedBy._id !== state._id ? "/profile/"+item.postedBy._id : "/profile"} style={{marginLeft:"15px"}}>{item.postedBy.name}</Link> 
                                    {item.postedBy._id == state._id 
                                    && <i className="material-icons" style={{float:"right", cursor:"Pointer", marginRight:"10px", marginTop:"10px"}}
                                    onClick={()=>deleteQuestion(item._id)}
                                    >delete</i>
                                    }</h5>
                                
                            <div style={{display:"flex"}}>
                                <div>
                                    <div className="card-image">
                                        <img src={item.photo} style={{height:"400px", width:"400px"}}/>
                                    </div>
                                </div>
                                <div>
                                    <div className="card-content"> 
                                        {/* <i className="material-icons" style={{color:"red"}}>favorite</i> */}
                                            <h6>{item.title}</h6>
                                            <p>{item.body}</p>
                                            <div style={{overflowY:"scroll", height:"270px"}}>
                                                {
                                                    item.answers.map(record=>{
                                                        return(
                                                            <h6 key={record._id}>
                                                                <span style={{fontWeight:"500"}}>
                                                                    {record.postedBy.name}</span> {record.text}
                                                            </h6>
                                                        )
                                                    })
                                                }
                                            </div>
                                            
                                            <form onSubmit={(e)=>{
                                                e.preventDefault()
                                                answerQuestion(e.target[0].value, item._id)
                                            }} style={{position:"absolute", bottom:"5%", width:"470px"}}>
                                                <input type="text" placeholder ="Add your answer here"/>
                                            </form>   
                                    </div>
                                </div>
                            </div>

                        </div> 
                    )
                })
            }
            

        </div>

    )
}

export default Home
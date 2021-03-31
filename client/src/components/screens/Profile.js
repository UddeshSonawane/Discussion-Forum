import React,{useEffect, useState, useContext} from 'react'
import {UserContext} from '../../App'

const Profile = () => {
    const [myQuestions, setQuestion] = useState([])
    const {state, dispatch} = useContext(UserContext)
    useEffect(()=>{
        fetch('/mypost', {
            headers:{
                "Authorization": "Bearer "+localStorage.getItem("jwt")
            }
        }).then(res => res.json())
        .then(result=>{
            console.log(result)
            setQuestion(result.mypost)
        })
    }, [])
    return (

        <div style={{ maxWidth: "550px", margin: "0px auto" }}>

                <div style={{
                    display: "flex", justifyContent: "space-around",
                    margin: "18px 0px", borderBottom: "1px solid grey"
                }}>
                    <div>
                        <img style={{ width: "160px", height: "160px", borderRadius: "80px" }} src={state?state.profilePic:"loading"}></img>
                    </div>
                    <div>
                        <h4>{state?state.name:"Loading..."}</h4>
                        <div style={{ display: "flex", justifyContent: "space-between", width: "108%" }}>
                            <h6>{myQuestions.length} Questions raised</h6>
                        </div>
                    </div>
                </div>
            
        
            <div className="gallery">
                {
                    myQuestions.map(item=>{
                        return(
                            <img key={item._id} className="item" src={item.photo} alt={item.title}></img>
                        )
                    })
                }
           </div>
        </div>


    )
}

export default Profile
import './gallery.css';
import './navbar.css';
import './overlay.css';
import './uploader.css';
import content from "./content.json";

import React, { useState } from 'react';



export default function App() {
  const [overlay, setOverlay] = useState("");
  const [uploadState, setUploadeState] = useState("hidden")

  return (
    <React.Fragment>

      <Navbar uploder={()=>{setUploadeState("reveal");console.log(uploadState)}}/>

      <Overlay display={overlay} closer={()=>{setOverlay("");}} />
      <Uploader closer={()=>setUploadeState("hidden")} display={uploadState}/>

      <div className="gallery">
        {content.images.map((image, i) => (
          <Card data={image} key={i} onClick={()=>{setOverlay(image)}} />
        ))}
      </div>

    </React.Fragment>
  );
}


function Card(props){

  return(
    <div className={"card"}  onClick={props.onClick} >
      <p className='title'>{props.data.title}</p>
      <img className='image' src={`${props.data.locale}`} alt={props.alt}/>
    </div>
  )
}

function Navbar(props){
  return(
    <nav>
      <h1 className='logo'>IMAGE - <span>IN</span></h1>
      <p className='upload' onClick={props.uploder}>Add Image</p>
    </nav>
  )
}

function Uploader(props){
  return(
    <div className={'uploader '.concat(props.display)}>
      <section className='offclick' onClick={(props.closer)} />
      
    </div>
  )
}

function Overlay(props){
  return(
    <div className={'overlay '.concat(props.display?"reveal":"hidden")} >
        <section className='offclick' onClick={props.closer} />
        <img className='overlayImg' src={`${props.display.locale}`}  alt={props.display.alt}/>
        
        <aside className='right'>
          <p className='close' onClick={props.closer}>X</p>
          <p className='overlayTitle'>{props.display.title}</p>
          <p className='desc'>{props.display.desc}</p>
        </aside>
    </div>
  )
}
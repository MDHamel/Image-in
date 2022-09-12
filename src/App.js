import './gallery.css';
import './navbar.css'
import content from "./content.json";

import React, { useState } from 'react';



export default function App() {
  const [display, setDisplay] = useState("");
  return (
    <React.Fragment>
      <Navbar />

      <div className={'overlay '.concat(display?"reveal":"hidden")} >
        <aside className='offclick' onClick={()=>{setDisplay("")}} />
        <img className='overlayImg' src={`${display.locale}`}  alt={display.alt}/>
        
        <section className='right'>
          <p className='close' onClick={()=>{setDisplay("")}}>X</p>
          <p className='overlayTitle'>{display.title}</p>
          <p className='desc'>{display.desc}</p>
        </section>
      </div>

      <div className="gallery">
        {content.images.map((image, i) => (
          <Card data={image} key={i} onClick={()=>{setDisplay(image)}} />
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

function Navbar(){
  return(
    <nav>
      <h1 className='logo'>IMAGE - <span>IN</span></h1>

      <p className='upload'>Add Image</p>
    </nav>
  )
}
import './gallery.css';
import './navbar.css';
import './overlay.css';
import './uploader.css';
import content from "./content.json";

import  { useRef,useState } from 'react';




export default function App() {
  const [overlay, setOverlay] = useState("");
  const [uploadState, setUploadeState] = useState("hidden")

  return (
    <main>

      <Navbar uploder={()=>{setUploadeState("reveal");console.log(uploadState)}}/>

      <Overlay display={overlay} closer={()=>{setOverlay("");}} />
      <Uploader closer={()=>setUploadeState("hidden")} display={uploadState}/>

      <div className="gallery">
        {content.images.map((image, i) => (
          <Card data={image} key={i} onClick={()=>{setOverlay(image)}} />
        ))}
      </div>

    </main>
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
      <h1 className='logo'>IMAGE <span>IN</span></h1>
      <p className='upload' onClick={props.uploder}>Add Image</p>
    </nav>
  )
}

function Uploader(props){
  const [image, setImage] = useState("");
  const inputFile = useRef(null);
  const src = image ==="" ? "../assets/images/imageplaceholder.png" : URL.createObjectURL(image);
  const acceptedFileTypes = ".jpg, .jpeg, .gif, .png, .webp";
  const [uploadError, setError] = useState("");

  const closeUploader = () => {
    props.closer(); 
    setImage(""); 
    document.getElementById("image-uploader").reset();
  }

  const onUploadTextClick = () => {
      inputFile.current.click();
  };

  const uploadFileHandler = (e) => {
    const { files } = e.target;
    if (files && files.length) {

      setImage(files[0]);
      
    }
  };

 const submitUpload = async (e) => {
    e.preventDefault();
    if(!(image && e.target.title.value && e.target.desc.value)){
      setError("error");
    }
    else{

      //need a cloud storage or somewhere for the images to be uploaded

            
      // content.append(
      //   {
      //       "id": content.length,
      //       "title": e.target.title.value,
      //       "desc": e.target.desc.value,
      //       "locale": "../assets/images/The_Puppy.jpg",
      //       "alt":e.target.alt.value
      //   }
      // );

      //closeUploader();
    }

  }

  return(
    <div className={'uploader '.concat(props.display)} >
      <section className='offclick' onClick={closeUploader}/>

      <form id="image-uploader" onSubmit={submitUpload}>
      
          <aside className='uploaderLeft' onClick={onUploadTextClick}>
              <p>Click Here to Upload</p>
            
            <img  id={image ==="" ? "imageplaceholder" : ""} src= {src} alt="Uploaded" />
            <input id="fileIn" name="file" type="file" ref={inputFile} onChange={uploadFileHandler} accept={acceptedFileTypes}/>
          </aside>
        
      
        <aside className='uploaderRight'>
          <section className='formOffset'>
            <input id="title" name="title" type="text" placeholder="Title" />
            <textarea id="desc" name="desc" placeholder="Enter your description here!" />
            <input id="alt" name="alt" type="text" placeholder="Alternate Text (Optional)"  />
            
            <button className={uploadError} type="submit" onAnimationEnd={()=>{setError("")}}> Upload </button>
          </section>
        </aside>
      </form>
      
    </div>
  )
}

function Overlay(props){
  return(
    <div className={'overlay '.concat(props.display?"reveal":"hidden")} >
        <section className='offclick' onClick={props.closer} />
        <img className='overlayImg' src={`${props.display.locale}`}  alt={props.display.alt}/>
        
        <aside className='rightOverlay'>
          <p className='close' onClick={props.closer}>X</p>
          <p className='overlayTitle'>{props.display.title}</p>
          <p className='desc'>{props.display.desc}</p>
        </aside>
    </div>
  )
}
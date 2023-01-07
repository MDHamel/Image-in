import './App.css';
import './gallery.css';
import './navbar.css';
import './overlay.css';
import './uploader.css';
import "./App.css";
import axios from 'axios';


import { useRef, useState, useEffect } from 'react';

const serverURL = process.env.REACT_APP_SERVER_URL;

const getContent = async () => {
  return axios.get(serverURL);
};


export default function App() {

  const [overlay, setOverlay] = useState("");
  const [uploadState, setUploadeState] = useState("hidden");
  const [content, setContent] = useState([])

  useEffect(() => {

    if (content.length === 0) {
      getContent().then((res) => { setContent(res.data.content) });
    }

    return () => { }
  }, [content]);

  return (
    <main>

      <Navbar uploder={() => { setUploadeState("reveal");}} />

      <Overlay display={overlay} closer={() => { setOverlay(""); }} />
      <Uploader closer={() => setUploadeState("hidden")} display={uploadState} updater={() => { getContent().then((res) => { setContent(res.data.content) }) }} />

      <div className="gallery">
        {content.map((image, i) => (
          <Card data={image} key={i} onClick={() => { setOverlay(image) }} />
        ))}
      </div>

    </main>
  );
}


function Card(props) {
  let locale;
  if (props.data.drive_id) {
    locale = `https://drive.google.com/uc?export=view&id=${props.data.drive_id}`;
  }
  else {
    locale = "#";
  }

  return (
    <div className={"card"} onClick={props.onClick} >
      <p className='title'>{props.data.title}</p>
      <img className='image' src={locale} alt={props.alt} />
    </div>
  )
}

function Navbar(props) {
  return (
    <nav>
      <h1 className='logo'>IMAGE <span>IN</span></h1>
      <span className='upload' onClick={props.uploder}>Add Image</span>
    </nav>
  )
}

function Overlay(props) {
  let locale;
  if (props.display.drive_id) {
    locale = `https://drive.google.com/uc?export=view&id=${props.display.drive_id}`;
  }
  else {
    locale = "#";
  }

  return (
    <div className={'overlay '.concat(props.display ? "reveal" : "hidden")} >
      <section className='offclick' onClick={props.closer} />
      <img className='overlayImg' src={locale} alt={props.display.alt} />

      <aside className='rightOverlay'>
        <p className='close' onClick={props.closer}>X</p>
        <p className='overlayTitle'>{props.display.title}</p>
        <p className='desc'>{props.display.desc}</p>
      </aside>
    </div>
  )
}


function Uploader(props) {
  const [image, setImage] = useState("");
  const inputFile = useRef(null);
  const src = image === "" ? "../imageplaceholder.png" : URL.createObjectURL(image);
  const acceptedFileTypes = ".jpg, .jpeg, .gif, .png, .webp";
  const [uploadError, setError] = useState("");
  const [loginReveal, setReveal] = useState(false);

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
    if (!(image && e.target.title.value && e.target.desc.value)) {
      setError("error");
    }
    else {

      let formdata = new FormData();
      formdata.append("file", image);
      formdata.append("title", e.target.title.value);
      formdata.append("desc", e.target.desc.value);
      formdata.append("alt", e.target.alt.value);
      formdata.append("tags", e.target.tags.value);

      await axios.post(serverURL, formdata)
        .then(res => {
          closeUploader();
          props.updater();
        })
        .catch(err => { 
          setError("error");
          setReveal("true")
        });
    }

  }

  return (
    <div className={'uploader '.concat(props.display)} >

      <section className='offclick' onClick={closeUploader} />
      <Login reveal={loginReveal} setReveal={setReveal}/>

      <form id="image-uploader" onSubmit={submitUpload}>
      
        <aside className='uploaderLeft' onClick={onUploadTextClick}>
        
          <p>Click Here to Upload</p>
          <img id={image === "" ? "imageplaceholder" : ""} src={src} alt="Uploaded" />
          <input id="fileIn" name="file" type="file" ref={inputFile} onChange={uploadFileHandler} accept={acceptedFileTypes} />
        </aside>

        <aside className='uploaderRight'>
          <section className='formOffset'>
            <input id="title" name="title" type="text" placeholder="Title" />
            <textarea id="desc" name="desc" placeholder="Enter your description here!" />
            <input id="tags" name="tags" type="text" placeholder="Tags, seperate with ; (Optional)" />
            <input id="alt" name="alt" type="text" placeholder="Alternate Text (Optional)" />

            <button className={uploadError} type="submit" onAnimationEnd={() => { setError("") }}> Upload </button>
          </section>
        </aside>
      </form>

    </div>
  );
}



function Login(props) {

  const loginpost = () => {    
    const info = {
      user: document.getElementById("uname").value,
      password: document.getElementById("password").value
    }

    axios.post(process.env.REACT_APP_LOGIN_URL, JSON.stringify(info)).then((res) => { props.setReveal(false); }).catch((err) => {
      console.log("ERROR", err.response);
    });
  }

  return (
    <section className={"login " + (props.reveal ? "visible" : "hidden")}>
      <form>
        <label htmlFor="uname">Username</label><br />
        <input type="text" id="uname" /><br />
        <label htmlFor="password">Password</label><br />
        <input type="password" id="password" />
      </form>

      <div className="bottom">
          <span className="button" onClick={loginpost}>Login</span>
          <span className="button" onClick={() => { props.setReveal(false) }} style={{ backgroundColor: "#778" }}>Cancel</span>
        </div>


    </section>
  )
}
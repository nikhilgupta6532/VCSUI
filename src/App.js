import logo from './logo.svg';
import './App.css';
import { Component } from 'react';
import axios,{post} from 'axios';
import Popup from "reactjs-popup";
import { Modal, Button, Form } from "react-bootstrap";

class App extends Component {

  state = {
    selectedFile : null,
    files : [],
    showFiles : false,
    showPopup : false,
    file : {},
    setShow : false,
    changes : [],
    showHistory : false
  };

  onFileChange = event => { 
    // Update the state 
    this.setState({ selectedFile: event.target.files[0] }); 
  }; 


  onFileUpload = (event) =>  {
    event.preventDefault();
    console.log('starting uploading file.....');

    const formData = new FormData();
    formData.append('file', this.state.selectedFile);

    //details of the uploaded file.
    console.log(this.state.selectedFile);

    post('http://localhost:8000/vcs/upload',formData)
      .then(response => {
        console.log('post request successfull');
        console.log(response);
        const files = [...this.state.files];
        const fileInfo = {
          id : response.data._id,
          ver : response.data._ver,
          name : response.data.fileName
        }
        files.push(fileInfo);
        console.log('files',files);
        this.setState({
          showFiles : true,
          files : files
        });
     }).catch(error =>{
        console.log('error',error);
      })
  }

  getFile = (file) => {
    console.log('file',file);
    var params = new URLSearchParams();
    params.append('id', file.id);
    params.append('ver',file.ver);
    axios.get('http://localhost:8000/vcs/getFile',{params})
    .then(response => {
      console.log(response.data);
      console.log('caling popup');
    alert(response.data.content);
    }).catch(error => {
      console.log(error);
    });

  }

  updateFile = (file) => {
   this.setState({
     showPopup : true,
     file : file
   });
  }

  OnFileUpdate = (event,file) => {
    event.preventDefault();

    console.log('file to be updated',file);

    const formData = new FormData();
    formData.append('file', this.state.selectedFile);
    formData.append('id',file.id);
    formData.append('ver',file.ver);

    post('http://localhost:8000/vcs/updateFile',formData)
    .then(response => {
      console.log('update request successfull');
      console.log(response);
   }).catch(error =>{
      console.log('error',error);
    })
  }

  handleShow = () => {
    this.setState({
      setShow : true
    });
  }

  getHistory = (event,file) => {
    event.preventDefault();

    console.log('file to be updated',file);

    const formData = new FormData();
    formData.append('id',file.id);

    axios.get('http://localhost:8000/vcs/history/'+file.id+'/versions',formData)
    .then(response => {
      console.log('history request successfull');
      console.log(response);
      this.setState({
        changes : response.data.changes,
        showHistory : true
      });
   }).catch(error =>{
      console.log('error',error);
    })
  }

  render() {

    let history = false;

    if(this.state.showHistory) {
      const changes = this.state.changes;
     history = (
       <div>
          {changes.map(change => (
            <div id = {change.revision}>
              {change.content}
            </div>
          ))}
       </div>
     )
    }

    let showSelectedFiles = null;

    if(this.state.showFiles) {
        showSelectedFiles = (
          <div className = "UploadedFile">
            {this.state.files.map(file => {
              return (
                <div>
                <p key = {file._id}>{file.name}</p>
                  <button className = "button" onClick = {() => this.getFile(file)}>View</button>
                  <button className = "button" onClick = {(event)=>this.getHistory(event,file)}>History</button>
                  <div className = "update">
                  <form method = "post" enctype="multipart/form-data">
                    <input className = "button" type="file" name="file" onChange = {this.onFileChange}/><br />
                      <br /> 
                    <input className = "button" type = "submit" value = "UpdateFile" onClick = {(event) => this.OnFileUpdate(event,file)}></input>
                </form>
                </div>
                  {/* <button className = "button" onClick = {() => this.updateFile(file)}>Update</button> */}
              </div>
              )
        })}
          </div>
        )
    }


    return (
      <div>
        <div className = "App">
          <h1>File Upload</h1>
          <form method = "post" enctype="multipart/form-data">
		        <input className = "button" type="file" name="file" onChange = {this.onFileChange}/><br />
		        <br /> 
            <input className = "button" type = "submit" value = "upload" onClick = {this.onFileUpload}></input>
	        </form>
          </div>
        <div className = "Files">
        <h2>Uploaded Files</h2>
        {showSelectedFiles}
        </div>
      <div>{history}</div>
      </div>
    )
  }
}

export default App;

import React,{Component} from 'react';

class Form extends Component {

    render() {
        return (
            <div className = "form">
                <form method = "post" enctype="multipart/form-data">
                    <input className = "button" type="file" name="file" onChange = {this.onFileChange}/><br />
                  <br /> 
                    <input className = "button" type = "submit" value = "upload" onClick = {this.OnFileUpdate}></input>
                </form>
              </div>
        )
    }
}

export default Form;
import React,{Component} from "react";
import Popup from "reactjs-popup";
import './Popup.css';
import Form from '../../Form/Form';
 
class ReactPopup extends Component {  
    render(){
        return (
            <div>
                <Popup trigger={<button className={['Button',[this.props.btnType]].join(' ')}>Add Repository</button>} modal
                    position="right center">
                    {close => (
                         <div>
                              <a className="Close" onClick={close}>
                                &times;
                             </a>
                             <Form closePopup = {close} />
                         </div>
                     )}
                </Popup>
            </div>
        )
    }
}

export default ReactPopup;
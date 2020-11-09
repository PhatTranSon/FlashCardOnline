import React from 'react';
import './style.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { 
    faTrash,
    faHeart
} from '@fortawesome/free-solid-svg-icons';

import {
    faHeart as faHeartRegular
} from '@fortawesome/free-regular-svg-icons'

class Like extends React.Component {
    constructor(props) {
        super(props);

        //Binding
        this.onDeleteClicked = this.onDeleteClicked.bind(this);
        this.onLikeClicked = this.onLikeClicked.bind(this);
    }

    onDeleteClicked() {
        //Call passed method
        this.props.onDelete();
    }

    onLikeClicked() {
        //Call passed method
        this.props.onLike();
    }

    render() {
        //Display if show delete button or not
        const { showDelete, liked, likes } = this.props;

        //Render 
        return (
            <div className="like-panel">
                {
                    /*Display delete button or not*/
                    showDelete ? 
                    <FontAwesomeIcon 
                        icon={faTrash} 
                        className="green-icon"
                        style={{ marginRight: "2vh"}}
                        onClick={() => this.onDeleteClicked()}/> 
                    : null
                }
                {
                    liked ?
                    <FontAwesomeIcon 
                        icon={faHeart} 
                        style={{ marginRight: "1vh"}} 
                        className="red-icon"
                        onClick={() => this.onLikeClicked()}/>:
                    <FontAwesomeIcon 
                        icon={faHeartRegular} 
                        style={{ marginRight: "1vh"}}
                        className="red-icon"
                        onClick={() => this.onLikeClicked()}/>
                }
                <span>{likes}</span>
            </div>
        )
    }
}

export default Like;
import React from 'react';
import './style.css';

import {
    formatColor
} from '../../../Common/Helpers';

import Like from './Like';

class Card extends React.Component {
    constructor(props) {
        super(props);

        //Bind methods
        this.onDelete = this.onDelete.bind(this);
        this.onLike = this.onLike.bind(this);
    }

    onDelete(id) {
        //Call parent method
        this.props.onDelete(id);
    }   

    onLike(id) {
        //Call parent method
        this.props.onLike(id);
    }

    render() {
        //Get the name, description and like
        const { id, title, description, likes, liked, color } = this.props;

        //Render components
        return (
            <div className="card collection-card" >
                <p 
                    className="collection-card-title"
                    style={{
                        color: formatColor(color),
                        borderBottom: `3px solid ${formatColor(color)}`
                    }}>
                    { title }
                </p>

                <p 
                    className="collection-card-content"
                    style={{color: formatColor(color)}}
                    >
                    { description }
                </p>

                <Like 
                    showDelete={true} 
                    liked={liked} 
                    likes={likes}
                    onDelete={() => this.onDelete(id)}
                    onLike={() => this.onLike(id)}/>
            </div>
        )
    }
}

export default Card;
import React from 'react';
import './style.css';

class Card extends React.Component {
    render() {
        //Get the name, description and like
        const { id, title, description, likes, liked } = this.props;

        //Render components
        return (
            <div className="card collection-card">
                <h1 className="card-title">{ title }</h1>
                <p>
                    { description }
                </p>
            </div>
        )
    }
}

export default Card;
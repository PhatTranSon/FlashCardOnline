import React from 'react';
import './style.css';

import { formatColor } from '../../../Common/Helpers';
import Like from '../Collection/Like';

class Card extends React.Component {
    constructor(props) {
        super(props);

        //Bind methods
        this.onDelete = this.onDelete.bind(this);
        this.onLike = this.onLike.bind(this);
    }

    onLike(id) {
        this.props.onLike(id);
    }

    onDelete(id) {
        this.props.onDelete(id);
    }

    render() {
        //Get the data
        const { id, title, phonetic, description, liked, likes, color } = this.props;

        return (
            <div 
                className="flashcard card"
                style={{ background: formatColor(color) }}>
                <h1 className="flashcard-title">{ title }</h1>
                <p className="flashcard-phonetic">{ phonetic }</p>
                <p className="flashcard-description">{ description }</p>

                <Like 
                    showDelete={true}
                    likes={likes}
                    liked={liked}
                    onDelete={() => this.onDelete(id)}
                    onLike={() => this.onLike(id)}/>
            </div>
        )
    }
}

export default Card;
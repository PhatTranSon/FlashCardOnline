import React from 'react';
import './style.css';

import Card from './Card';

class CardPanel extends React.Component {
    constructor(props) {
        super(props);

        //Bind methods
        this.onDelete = this.onDelete.bind(this);
        this.onLike = this.onLike.bind(this);
    }

    onDelete(id) {
        //Test
        console.log(id);
    }

    onLike(id) {
        //Test
        console.log(id);
    }

    render() {
        //Get the cards from props
        const { cards, title } = this.props

        return (
            <div>
                <h1 className="flashcard-panel-title">{ title }</h1>
                <div className="flashcard-panel">
                {
                    cards.map((card, index) => {
                        return (
                            <Card 
                                key={index}
                                {...card}
                                onDelete={id => this.onDelete(id)}
                                onLike={id => this.onLike(id)}/>
                        )
                    })
                }
                </div>
            </div>
        )
    }
}

export default CardPanel;
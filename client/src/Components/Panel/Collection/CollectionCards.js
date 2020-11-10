import React from 'react';
import './style.css';

import Card from './CollectionCard';

class CollectionCardPanel extends React.Component {
    constructor(props) {
        super(props);

        this.onDeleteCollection = this.onDeleteCollection.bind(this);
        this.onLikeCollection = this.onLikeCollection.bind(this);
    }

    onDeleteCollection(id, index) {
        this.props.onDeleteCollection(id, index);
    }

    onLikeCollection(id, index) {
        this.props.onLikeCollection(id, index);
    }

    render() {
        //Get the card data from props
        const { cards, title } = this.props;

        //Render cards
        return (
            <div>
                <h1 className="collection-panel-title">{ title }</h1>
                <div className="collection-panel">
                    {
                        cards.map((card, index) => {
                            return ( 
                                <Card 
                                    key={index}
                                    onLike={(id) => this.onLikeCollection(id, index)}
                                    onDelete={(id) => this.onDeleteCollection(id, index)}
                                    {...card}/>
                            );
                        })
                    }
                </div>
            </div>
        )
    }
}

export default CollectionCardPanel;
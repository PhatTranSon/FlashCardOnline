import React from 'react';
import './style.css';

import Card from './CollectionCard';

class CollectionCardPanel extends React.Component {
    render() {
        //Get the card data from props
        const { cards } = this.props;

        //Render cards
        return (
            <div>
                <h1 className="collection-panel-title">Your collections</h1>
                <div className="collection-panel">
                    {
                        cards.map(card => {
                            return <Card {...card}/>
                        })
                    }
                </div>
            </div>
        )
    }
}

export default CollectionCardPanel;
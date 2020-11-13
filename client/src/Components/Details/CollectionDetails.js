import React from 'react';

import {
    Redirect
} from 'react-router-dom';

import './style.css';
import Navbar from '../Common/LogOutNavbar';

import { 
    getOneCollection,
    getCardsFromCollection
} from '../../Common/Operations';

import {
    formatColor
} from '../../Common/Helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowAltLeft } from '@fortawesome/free-solid-svg-icons';

import FlashCards from '../Panel/Card/Cards';

class CollectionDetails extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            //Collection data
            id: null,
            title: null,
            color: null,
            description: null,
            liked: null,
            likes: null,
            cards: [],

            //Return flag
            back: false
        }

        this.loadCollection = this.loadCollection.bind(this);
        this.loadCards = this.loadCards.bind(this);
        this.returnHome = this.returnHome.bind(this);
    }

    componentDidMount() {
        this.loadCollection();
        this.loadCards();
    }

    loadCollection() {
        //Get collection id from collection
        const { collectionId } = this.props.match.params;
        
        //Get the collection
        getOneCollection(collectionId)
            .then(response => {
                //Get
                const collection = response.data;

                //Set state
                this.setState(collection);
            })
            .catch(error => {
                //Error handling
                this.setState({
                    error: true
                });
            });
    }

    loadCards() {
        //Get the collection id
        const { collectionId } = this.props.match.params;

        //Get cards
        getCardsFromCollection(collectionId)
            .then(response => {
                //Get cards
                const cards = response.data.cards;

                //Set cards
                this.setState({
                    cards
                });
            })
            .catch(error => {
                //Error handling
                this.setState({
                    error: true
                });
            });
    }

    returnHome() {
        this.setState({
            back: true
        });
    }

    render() {
        //Expand state
        const { id, title, color, description, liked, likes, cards, back } = this.state;

        console.log(cards);

        //Render
        return (
            back ? 
            <Redirect to="/panel"/> :
            <div>
                <Navbar/>
                {
                    title ? 
                    <div className="collection-details-panel">
                        <div style={{ marginBottom: "3vh" }}>
                            <FontAwesomeIcon 
                                icon={ faLongArrowAltLeft } 
                                size="3x"
                                onClick={() => this.returnHome()}/>
                        </div>

                        <h1 className="collection-details-title"
                            style={{ 
                                borderBottom: `5px solid ${formatColor(color)}`,
                                color: formatColor(color)
                            }}>
                            { title }
                        </h1>

                        <p className="collection-details-description">
                            { description }
                        </p>

                        <FlashCards cards={cards}/>
                    </div> : 
                    null
                }
            </div>
        )
    }
}

export default CollectionDetails;
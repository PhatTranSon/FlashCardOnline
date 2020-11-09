import React from 'react';
import './style.css';

import TabChild from './Tab/TabChild';
import TabParent from './Tab/TabParent';

import CollectionCards from './Collection/CollectionCards';
import FlashCards from './Card/Cards';

import Modal from './Modal/CreateCollectionModal';

import {
    getAllCollections,
    getAllCards
} from '../../Common/Operations';

class Content extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            //My collections and cards
            myCollections: [],
            myCards: [],

            //Hot collections and cards
            hotCollections: [],
            hotCards: [],

            //Liked collections and cards
            likedCollections: [],
            likedCards: [],

            //Show card create modal
            showCollectionModal: true
        }

        //Bind
        this.loadMyCollections = this.loadMyCollections.bind(this);
        this.loadMyCards = this.loadMyCards.bind(this);
        this.loadHotCollections = this.loadHotCollections.bind(this);
        this.loadHotCards = this.loadHotCards.bind(this);
        this.loadLikedCollections = this.loadLikedCollections.bind(this);
        this.loadLikedCards = this.loadLikedCards.bind(this);
    }

    //Component mounted -> Get data
    componentDidMount() {
        //Load my cards and collections
        this.loadMyCollections();
        this.loadMyCards();

        //Load hot cards and collections
        this.loadHotCollections();
        this.loadHotCards();

        //Load liked cards and collections
        this.loadLikedCollections();
        this.loadLikedCards();
    }

    //Load datasets
    loadMyCollections() {
        getAllCollections()
            .then((response) => {
                //Get the collections
                const collections = response.data.collections;

                //Set state
                this.setState({
                    myCollections: collections
                });
            })
            .catch((error) => {
                //Extract error mesage and status
                const status = error.response.status;
                //TODO: Error handling
            });
    }

    loadMyCards() {
        getAllCards()
            .then((response) => {
                //Get the cards
                const cards = response.data.cards;

                //Set state
                this.setState({
                    myCards: cards
                })
            })
            .catch((error) => {
                //Extract error mesage and status
                const status = error.response.status;
                //TODO: Error handling
            });
    }

    loadHotCollections() {

    }

    loadHotCards() {

    }

    loadLikedCollections() {

    }

    loadLikedCards() {

    }

    //Handle user interactions

    render() {
        //Get state
        const {
            myCollections,
            myCards,
            showCollectionModal
        } = this.state;
        return (
            <div>
                { /* Section for tab */ }
                <TabParent>
                    <TabChild name="Hot">
                        1
                    </TabChild>

                    <TabChild name="Mine">
                        <CollectionCards 
                            title="Your collections"
                            cards={myCollections}/>

                        <FlashCards 
                            title="Your cards"
                            cards={myCards}/>
                    </TabChild>

                    <TabChild name="Liked">
                        3
                    </TabChild>
                </TabParent>

                { /* Section for modal */ }
                <Modal isOpen={showCollectionModal}/>
            </div>
        )
    }
}

export default Content;
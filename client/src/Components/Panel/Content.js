import React from 'react';
import TabChild from './Tab/TabChild';
import TabParent from './Tab/TabParent';

import CollectionCards from './Collection/CollectionCards';
import FlashCards from './Card/Cards';

import {
    getAllCollections,
    getAllCards
} from '../../Common/Operations';

class Content extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            //My collections and cards
            myCollections: [
                //Mock data
                {
                    id: 1,
                    title: "July",
                    description: "Words on the best of July",
                    liked: 0,
                    likes: 12,
                    color: 'e63946'
                },
                {
                    id: 2,
                    title: "May",
                    description: "To may or not to may",
                    liked: 1,
                    likes: 20,
                    color: '457b9d'
                },
                {
                    id: 3,
                    title: "May",
                    description: "To may or not to may",
                    liked: 1,
                    likes: 20,
                    color: '2a9d8f'
                },
                {
                    id: 4,
                    title: "May",
                    description: "To may or not to may",
                    liked: 1,
                    likes: 20,
                    color: 'ffafcc'
                }
            ],
            myCards: [
                {
                    "id": 1,
                    "title": "Donald Trumpanzese",
                    "phonetic": "None",
                    "description": "Soon to be president of USA",
                    "createdAt": "2020-11-09T04:01:26.000Z",
                    "updatedAt": "2020-11-09T04:12:16.000Z",
                    "liked": 0,
                    "likes": 0,
                    "color": "6d6875"
                },
                {
                    "id": 2,
                    "title": "Donald Trumpanzese",
                    "phonetic": "None",
                    "description": "Soon to be president of USA",
                    "createdAt": "2020-11-09T04:01:26.000Z",
                    "updatedAt": "2020-11-09T04:12:16.000Z",
                    "liked": 0,
                    "likes": 0,
                    "color": "f77f00"
                },
                {
                    "id": 3,
                    "title": "Donald Trumpanzese",
                    "phonetic": "None",
                    "description": "Soon to be president of USA",
                    "createdAt": "2020-11-09T04:01:26.000Z",
                    "updatedAt": "2020-11-09T04:12:16.000Z",
                    "liked": 0,
                    "likes": 0,
                    "color": "003049"
                },
                {
                    "id": 4,
                    "title": "Donald Trumpanzese",
                    "phonetic": "None",
                    "description": "Soon to be president of USA",
                    "createdAt": "2020-11-09T04:01:26.000Z",
                    "updatedAt": "2020-11-09T04:12:16.000Z",
                    "liked": 0,
                    "likes": 0,
                    "color": "a2d2ff"
                },
            ],

            //Hot collections and cards
            hotCollections: [],
            hotCards: [],

            //Liked collections and cards
            likedCollections: [],
            likedCards: []
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
        return (
            <TabParent>
                <TabChild name="Hot">
                    1
                </TabChild>

                <TabChild name="Mine">
                    <CollectionCards 
                        title="Your collections"
                        cards={this.state.myCollections}/>

                    <FlashCards 
                        title="Your cards"
                        cards={this.state.myCards}/>
                </TabChild>

                <TabChild name="Liked">
                    3
                </TabChild>
            </TabParent>
        )
    }
}

export default Content;
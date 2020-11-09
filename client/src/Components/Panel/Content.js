import React from 'react';
import './style.css';

import TabChild from './Tab/TabChild';
import TabParent from './Tab/TabParent';

import CollectionCards from './Collection/CollectionCards';
import FlashCards from './Card/Cards';

import Modal from './Modal/CreateCollectionModal';

import {
    getAllCollections,
    getAllCards,
    createCollection
} from '../../Common/Operations';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';

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
            showCollectionModal: false,
            modalSuccess: false,
            modalError: false,
            modalErrorMessage: ""
        }

        //Bind
        this.loadMyCollections = this.loadMyCollections.bind(this);
        this.loadMyCards = this.loadMyCards.bind(this);
        this.loadHotCollections = this.loadHotCollections.bind(this);
        this.loadHotCards = this.loadHotCards.bind(this);
        this.loadLikedCollections = this.loadLikedCollections.bind(this);
        this.loadLikedCards = this.loadLikedCards.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.createCollection = this.createCollection.bind(this);
        this.closeModal = this.closeModal.bind(this);
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
    toggleModal() {
        this.setState({
            showCollectionModal: true
        });
    }

    closeModal() {
        this.setState({
            showCollectionModal: false
        });
    }

    createCollection({ title, color, description }) {
        //Log
        //console.log(title, color, description);
        createCollection(title, description, color)
            .then(response => {
                console.log('success');
                //Get the newly created collection
                const newCollection = {
                    id: response.data.id,
                    title: response.data.title,
                    description: response.data.description,
                    color: response.data.color,
                    likes: response.data.likes,
                    liked: response.data.liked
                }

                //Add to state, set modal success
                this.setState({
                    myCollections: [...this.state.myCollections, newCollection],
                    modalSuccess: true,
                    modalError: false
                });
            })
            .catch(error => {
                console.log('error');
                //Get the error
                const status = error.response.status;
                const data = error.response.data;
                
                //Get the error message
                const errorMessage = data.message;

                console.log(errorMessage);

                //Set the modal error
                this.setState({
                    modalSuccess: false,
                    modalError: true,
                    modalErrorMessage: errorMessage
                });
            })
    }

    render() {
        //Get state
        const {
            myCollections,
            myCards,
            showCollectionModal,
            modalErrorMessage,
            modalError,
            modalSuccess
        } = this.state;
        return (
            <div>
                { /* Section for tab */ }
                <TabParent>
                    <TabChild name="Hot">
                        1
                    </TabChild>

                    <TabChild name="Mine">
                        { /* Collections with add icon */ }
                        <CollectionCards 
                            title={
                                <p>
                                    <span style={{marginRight: "2vh"}}>
                                        Your collections
                                    </span>

                                    <FontAwesomeIcon 
                                        icon={ faPlusCircle }
                                        onClick={() => this.toggleModal()}/>
                                </p>
                            }
                            cards={myCollections}/>

                        { /* Cards */ }
                        <FlashCards 
                            title={"Your cards"}
                            cards={myCards}/>
                    </TabChild>

                    <TabChild name="Liked">
                        3
                    </TabChild>
                </TabParent>

                { /* Section for modal */ }
                <Modal 
                    isOpen={showCollectionModal}
                    success={modalSuccess}
                    error={modalError}
                    errorMessage={modalErrorMessage}
                    onCreateCollection={this.createCollection}
                    onClose={this.closeModal}/>
            </div>
        )
    }
}

export default Content;
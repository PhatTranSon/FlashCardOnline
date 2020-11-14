import React from 'react';

import './style.css';

import {
    Redirect
} from 'react-router-dom';

import Loader from 'react-loader-spinner';

import './style.css';
import Navbar from '../Common/LogOutNavbar';

import { 
    getOneCollection,
    getCardsFromCollection,
    createCard,
    likeCard,
    unlikeCard,
    deleteCard
} from '../../Common/Operations';

import {
    formatColor
} from '../../Common/Helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowAltLeft } from '@fortawesome/free-solid-svg-icons';

import FlashCards from '../Panel/Card/Cards';
import IconPanel from './IconPanel';
import CollectionModal from './Model/UpdateCollectionModal';

import {
    getUserId
} from '../../Common/Authentication';

import {
    updateCollection
} from '../../Common/Operations';
import CardModal from './Model/AddCardPanel';
import TestModal from './Model/TestModal';

class CollectionDetails extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            //Collection loading state
            collectionLoading: false,

            //Collection data
            id: null,
            userId: null,
            title: null,
            color: null,
            description: null,
            liked: null,
            likes: null,

            //Card loading
            cardsLoading: false,
            cards: [],

            //Return flag
            back: false,

            //Collection modal open or not
            updateModalOpen: false,
            updateModalSuccess: false,
            updateModalError: false,
            updateModalMessage: "",

            //Card modal open or not
            cardModalOpen: false,
            cardModalSuccess: false,
            cardModalError: false,
            cardModalMessage: false,

            //Test modal open or not
            testModalOpen: false,
            testModalToggle: 0
        }

        this.loadCollection = this.loadCollection.bind(this);
        this.loadCards = this.loadCards.bind(this);
        this.returnHome = this.returnHome.bind(this);
        this.onAdd = this.onAdd.bind(this);
        this.onEdit = this.onEdit.bind(this);
        this.onTest = this.onTest.bind(this);
        this.updateCollection = this.updateCollection.bind(this);
        this.closeUpdateModal = this.closeUpdateModal.bind(this);
        this.closeCardModal = this.closeCardModal.bind(this);
        this.closeTestModal = this.closeTestModal.bind(this);
        this.createCard = this.createCard.bind(this);
        this.likeCard = this.likeCard.bind(this);
        this.deleteCard = this.deleteCard.bind(this);
    }

    componentDidMount() {
        this.loadCollection();
        this.loadCards();
    }

    loadCollection() {
        //Get collection id from collection
        const { collectionId } = this.props.match.params;

        //Set to loading first
        this.setState({
            collectionLoading: true
        });
        
        //Get the collection
        getOneCollection(collectionId)
            .then(response => {
                //Get
                const collection = response.data;

                //Set state
                this.setState({ 
                    ...collection,
                    collectionLoading: false
                });
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

    //Event handlers for icon
    onAdd() {
        this.setState({
            cardModalOpen: true
        });
    }

    onEdit() {
        //Open
        this.setState({
            updateModalOpen: true
        });
    }

    onTest() {
        //Open test modal
        this.setState({
            testModalOpen: true,
            testModalToggle: !this.state.testModalToggle
        });
    }

    //Method to update collection
    updateCollection(data) {
        //Get the id
        const { id } = this.state;

        //Expand to get data
        const { title, description, color } = data;

        //Call update method
        updateCollection(id, title, description, color)
            .then(response => {
                //Successfully update the collection
                this.setState({
                    updateModalSuccess: true,
                    title,
                    description,
                    color
                });
            })
            .catch(error => {
                //Error -> Get message
                const data = error.response.data;

                //Display message
                this.setState({
                    updateModalError: true,
                    updateModalMessage: data.message
                });
            });
    }

    //Create card
    createCard(data) {
        //Get the collection id
        const collectionId = this.state.id;

        //Expand to get the data
        const { title, phonetic, description, color } = data;

        //Make request
        createCard(collectionId, title, phonetic, description, color)
            .then(response => {
                //Get data from reponse
                const card = response.data;

                //Set state
                this.setState({
                    cards: [...this.state.cards, card],
                    cardModalSuccess: true
                });
            })
            .catch(error => {
                //Error handing - Set error
                const data = error.response.data;

                //Set error and error message
                this.setState({
                    cardModalError: true,
                    cardModalMessage: data.message
                });
            })
    }

    //Close update modal
    closeUpdateModal() {
        //Reset modal
        this.setState({
            updateModalOpen: false,
            updateModalSuccess: false,
            updateModalError: false,
            updateModalMessage: false
        });
    }

    closeCardModal() {
        this.setState({
            cardModalOpen: false,
            cardModalSuccess: false,
            cardModalError: false,
            cardModalMessage: false
        });
    }

    closeTestModal() {
        this.setState({
            testModalOpen: false
        });
    }

    //Method to delete and like cards
    deleteCard(id, index) {
        //Get cards
        const cards = this.state.cards;

        deleteCard(id)
            .then(response => {
                //Successfully deleted card
                cards.splice(index, 1);

                //Set state
                this.setState({
                    cards
                });
            })
            .catch(error => {
                //Error Handling -> TODO
                console.log(error);
            });
    }

    likeCard(id, index) {
        //Check if card is liked
        const cards = this.state.cards;
        
        //Get the card
        const card = cards[index];

        if (card.liked === 0) {
            //Not liked -> Like
            likeCard(card.id)
                .then(response => {
                    //Successfully liked card -> Modify liked status
                    card.liked = 1;
                    card.likes += 1;

                    //Set state
                    this.setState({
                        cards
                    });
                })
                .catch(error => {
                    //Error handling -> TODO
                    console.log(error);
                });
        } else {
            //Liked -> Unliked
            unlikeCard(card.id)
                .then(response => {
                    //Successfully unliked card -> Modify unlike
                    card.liked = 0;
                    card.likes -= 1;

                    //Set state
                    this.setState({
                        cards
                    });
                })
                .catch(error => {
                    //Error handling -> TODO
                    console.log(error);
                });
        }
    }

    render() {
        //Expand state
        const { 
            userId, id, title, color, description, liked, likes, collectionLoading,
            cards, cardsLoading,
            back,
            updateModalOpen, updateModalSuccess, updateModalError, updateModalMessage,
            cardModalOpen, cardModalSuccess, cardModalError, cardModalMessage,
            testModalOpen, testModalToggle
        } = this.state;

        //Check if user is owner
        const owner = userId == getUserId();

        //Render
        return (
            back ? 
            <Redirect to="/panel"/> :
            <div>
                <Navbar/>
                {
                    collectionLoading ? 
                    <div className="loader-wrapper">
                        <Loader
                            type="Puff"
                            color="#2A9D8F"
                            height={100}
                            width={100}/>
                    </div> : 
                    (
                        id ? 
                        <div className="collection-details-panel">
                            <div style={{ marginBottom: "3vh" }}>
                                <FontAwesomeIcon 
                                    icon={ faLongArrowAltLeft } 
                                    size="3x"
                                    onClick={() => this.returnHome()}/>
                            </div>

                            <div className="columns">
                                <div className="column is-four-fifths">
                                    <h1 className="collection-details-title"
                                        style={{ 
                                            borderBottom: `5px solid ${formatColor(color)}`,
                                            color: formatColor(color)
                                        }}>
                                        { title }
                                    </h1>
                                </div>

                                {
                                    owner ? 
                                    <div className="column is-one-fifth icon-panel-wrapper">
                                        <IconPanel size="1x" onAdd={this.onAdd} onEdit={this.onEdit} onTest={this.onTest}/>
                                    </div> :
                                    null
                                }
                            </div>

                            <p className="collection-details-description">
                                { description }
                            </p>

                            <FlashCards 
                                cards={cards}
                                showDelete={owner}
                                onDeleteCard={this.deleteCard}
                                onLikeCard={this.likeCard}/>
                            {
                                owner ? 
                                <CollectionModal 
                                    isOpen={updateModalOpen}
                                    success={updateModalSuccess}
                                    error={updateModalError}
                                    errorMessage={updateModalMessage}
                                    title={title}
                                    description={description}
                                    onUpdateCollection={this.updateCollection}
                                    onSuccessButtonClicked={this.closeUpdateModal}/> :
                                null
                            }
                            {
                                owner ?
                                <CardModal 
                                    isOpen={cardModalOpen}
                                    success={cardModalSuccess}
                                    error={cardModalError}
                                    errorMessage={cardModalMessage}
                                    onCreateCard={this.createCard}
                                    onSuccessButtonClicked={this.closeCardModal}
                                    onCreateCard={this.createCard}/> :
                                null
                            }
                            <TestModal 
                                key={testModalToggle}
                                isOpen={testModalOpen}
                                cards={cards}
                                collection={{userId, id, title, color, description, liked, likes }}
                                onDoneClicked={this.closeTestModal}/>
                        </div> :
                        null
                    )
                }
            </div>
        )
    }
}

export default CollectionDetails;
import React from 'react';
import './style.css';

import TabChild from './Tab/TabChild';
import TabParent from './Tab/TabParent';

import CollectionCards from './Collection/CollectionCards';
import FlashCards from './Card/Cards';

import Modal from './Modal/CreateCollectionModal';

import CollectionCarousel from './Carousel/CollectionCarousel';
import CardCarousel from './Carousel/CardCarousel';

import {
    //Collection operations
    getAllCollections,
    createCollection,
    getMyCollections,
    deleteCollection,
    likeCollection,
    unlikeCollection,

    //Card operations
    getAllCards,
    getMyCards,
    likeCard,
    unlikeCard,
    getLikedCollections,
    deleteCard,
    getLikedCards
} from '../../Common/Operations';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { Redirect } from 'react-router-dom';

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

            //Redirecting
            unauthorized: false,

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
        this.onModalSuccessButton = this.onModalSuccessButton.bind(this);
        this.onDeleteCollection = this.onDeleteCollection.bind(this);
        this.onLikeOwnCollection = this.onLikeOwnCollection.bind(this);
        this.onLikeOwnCard = this.onLikeOwnCard.bind(this);
        this.unlikeLikedCollection = this.unlikeLikedCollection.bind(this);
        this.unlikeLikedCard = this.unlikeLikedCard.bind(this);
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
        getMyCollections()
            .then((response) => {
                console.log(response);
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
                //console.log(error);

                //console.log(error.response.data);

                //TODO: Error handling
                if (status === 403) {
                    //Unauthorized error -> Nagivate back to Login
                    this.setState({
                        unauthorized: true
                    });
                }
            });
    }

    loadMyCards() {
        getMyCards()
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
        //Get all collections sorted by likes
        getAllCollections()
            .then(response => {
                //Successfully retrieved the collections -> Display
                const collections = response.data.collections;

                //Set state
                this.setState({
                    hotCollections: collections
                });
            })
            .catch(error => {
                //Extract error mesage and status
                const status = error.response.status;
                //TODO: Error handling
            });
    }

    loadHotCards() {
        //Get all cards sorted by likes
        getAllCards()
            .then((response) => {
                //Get the cards
                const cards = response.data.cards;

                //Set state
                this.setState({
                    hotCards: cards
                })
            })
            .catch((error) => {
                //Extract error mesage and status
                const status = error.response.status;

                //TODO: Error handling
            });
    }

    loadLikedCollections() {
        getLikedCollections()
            .then(response => {
                //Get the collections 
                const collections = response.data.collections;

                //Set state
                this.setState({
                    likedCollections: collections
                });
            })
            .catch(error => {
                //Extract error mesage and status
                const status = error.response.status;
                
                //TODO: Error handling
            });
    }

    loadLikedCards() {
        getLikedCards()
            .then(response => {
                //Get cards
                const cards = response.data.cards;

                //Set state
                this.setState({
                    likedCards: cards
                });
            })
            .catch(error => {
                //Extract error mesage and status
                const status = error.response.status;
                
                //TODO: Error handling
            });
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

    onModalSuccessButton() {
        this.closeModal();
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

    //Handle card like and delete
    onDeleteCollection(id, index) {
        //Just log
        //console.log(id, index);
        deleteCollection(id)
            .then(response => {
                //Successfully deleted card -> Remove
                let myCollections = this.state.myCollections;

                //Remove from collection
                myCollections.splice(index, 1);

                //Set state
                this.setState({
                    myCollections
                });
            })
            .catch(error => {
                //Get message
                const status = error.response.status;

                //Not authorized -> Expired token
                if (status === 403) {
                    this.setState({
                        unauthorized: true
                    });
                }
            });
    }

    onLikeOwnCollection(id, index) {
        //Check if unlike or like
        if (this.state.myCollections[index].liked === 0) {
            //console.log(id, index);
            likeCollection(id)
                .then(response => {
                    //Successfuly liked the collection
                    let myCollections = this.state.myCollections;
                    
                    //Modify element
                    myCollections[index] = {
                        ...myCollections[index],
                        likes: myCollections[index].likes + 1,
                        liked: 1
                    };

                    //Add liked collection to liked collections
                    let likedCollections = this.state.likedCollections;
                    let collectionIndex = myCollections.findIndex(item => item.id === id);
                    likedCollections = [...likedCollections, myCollections[collectionIndex]];

                    //Set collection
                    this.setState({
                        myCollections,
                        likedCollections
                    });
                })
                .catch(error => {
                    //Get message
                    const status = error.response.status;

                    //Not authorized -> Expired token
                    if (status === 403) {
                        this.setState({
                            unauthorized: true
                        });
                    }
                });
        } else {
            //console.log(id, index);
            unlikeCollection(id)
                .then(response => {
                    //Successfuly liked the collection
                    let myCollections = this.state.myCollections;
                    
                    //Modify element
                    myCollections[index] = {
                        ...myCollections[index],
                        likes: myCollections[index].likes - 1,
                        liked: 0
                    };

                    //Remove from likedCollection
                    let likedCollections = this.state.likedCollections;
                    let collectionIndex = likedCollections.findIndex(item => item.id === id);
                    likedCollections.splice(collectionIndex, 1);

                    //Set collection
                    this.setState({
                        myCollections,
                        likedCollections
                    });
                })
                .catch(error => {
                    //Get message
                    const status = error.response.status;

                    //Not authorized -> Expired token
                    if (status === 403) {
                        this.setState({
                            unauthorized: true
                        });
                    }
                });
        }
    }

    onDeleteCard(id, index) {
        deleteCard(id)
            .then(response => {
                //Successfully deleted card
                let myCards = this.state.myCards;

                //Remove card from array
                myCards.splice(index, 1);

                //Set cards
                this.setState({
                    myCards
                });
            })
            .catch(error => {
                //Get message
                const status = error.response.status;

                //Not authorized -> Expired token
                if (status === 403) {
                    this.setState({
                        unauthorized: true
                    });
                }
            });
    }

    onLikeOwnCard(id, index) {
        if (this.state.myCards[index].liked === 0) {
            likeCard(id)
                .then(response => {
                    //Successfully liked card
                    let myCards = this.state.myCards;

                    //Modify my cards
                    myCards[index] = {
                        ...myCards[index],
                        liked: 1,
                        likes: myCards[index].likes + 1
                    }

                    //Add liked collection to liked collections
                    let likedCards = this.state.likedCards;
                    let cardIndex = myCards.findIndex(item => item.id === id);
                    likedCards = [...likedCards, myCards[cardIndex]];

                    //Set state
                    this.setState({
                        myCards,
                        likedCards
                    });
                })
                .catch(error => {
                    //Get message
                    const status = error.response.status;

                    //Not authorized -> Expired token
                    if (status === 403) {
                        this.setState({
                            unauthorized: true
                        });
                    }
                });
        } else {
            unlikeCard(id)
                .then(response => {
                    //Successfully liked card
                    let myCards = this.state.myCards;

                    //Modify my cards
                    myCards[index] = {
                        ...myCards[index],
                        liked: 0,
                        likes: myCards[index].likes - 1
                    }

                    //Remove from liked cards
                    let likedCards = this.state.likedCards;
                    let cardIndex = likedCards.findIndex(item => item.id === id);
                    likedCards.splice(cardIndex, 1);

                    //Set state
                    this.setState({
                        myCards
                    });
                })
                .catch(error => {
                    console.log(error);
                    //Get message
                    const status = error.response.status;

                    //Not authorized -> Expired token
                    if (status === 403) {
                        this.setState({
                            unauthorized: true
                        });
                    }
                });
        }
    }  

    //Dislike liked collection
    unlikeLikedCollection(id, index) {
        unlikeCollection(id)
            .then(response => {
                //Remove from liked collections
                let likedCollections = this.state.likedCollections;
                likedCollections.splice(index, 1);

                //Set state
                this.setState({
                    likedCollections
                });

                //Reload my collections
                this.loadMyCollections();
            })
            .catch(error => {
                //Get message
                const status = error.response.status;

                //Not authorized -> Expired token
                if (status === 403) {
                    this.setState({
                        unauthorized: true
                    });
                }
            });
    }

    //Unlike liked card
    unlikeLikedCard(id, index) {
        unlikeCard(id)
            .then(response => {
                //Remove from liked collections
                let likedCards = this.state.likedCards;
                likedCards.splice(index, 1);

                //Set state
                this.setState({
                    likedCards
                });

                //Reload my collections
                this.loadMyCards();
            })
            .catch(error => {
                //Get message
                const status = error.response.status;

                //Not authorized -> Expired token
                if (status === 403) {
                    this.setState({
                        unauthorized: true
                    });
                }
            });
    }

    render() {
        //Get state
        const {
            myCollections,
            myCards,
            hotCollections,
            hotCards,
            likedCards,
            likedCollections,
            showCollectionModal,
            modalErrorMessage,
            modalError,
            modalSuccess,
            unauthorized
        } = this.state;


        return (
            unauthorized ? 
            <Redirect to={{
                pathname: '/login',
                state: { message: 'Token expired. Please log in again' }
            }}/> :
            <div className="content-box">
                { /* Section for tab */ }
                <TabParent>
                    <TabChild name="Hot">
                        <CollectionCarousel 
                            collections={hotCollections}
                            title="Hot collections"/>

                        <CardCarousel
                            cards={hotCards}
                            title="Hot flashcards"/>
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
                            cards={myCollections}
                            onDeleteCollection={(id, index) => this.onDeleteCollection(id, index)}
                            onLikeCollection={(id, index) => this.onLikeOwnCollection(id, index)}
                            showDelete={true}/>

                        { /* Cards */ }
                        <FlashCards 
                            title={"Your cards"}
                            showDelete={false}
                            cards={myCards}
                            showDelete={true}
                            onLikeCard={(id, index) => this.onLikeOwnCard(id, index)}
                            onDeleteCard={(id, index) => this.onDeleteCard(id, index)}/>
                    </TabChild>

                    <TabChild name="Liked">
                        { /* Collections with no add icon */ }
                        <CollectionCards 
                            title="Like collections"
                            cards={likedCollections}
                            onLikeCollection={(id, index) => this.unlikeLikedCollection(id, index)}
                            showDelete={false}/>

                        { /* Cards */ }
                        <FlashCards 
                            title={"Liked cards"}
                            showDelete={false}
                            cards={likedCards}
                            showDelete={false}
                            onLikeCard={(id, index) => this.unlikeLikedCard(id, index)}/>
                    </TabChild>
                </TabParent>

                { /* Section for create modal */ }
                <Modal 
                    isOpen={showCollectionModal}
                    success={modalSuccess}
                    error={modalError}
                    errorMessage={modalErrorMessage}
                    onCreateCollection={this.createCollection}
                    onClose={this.closeModal}
                    onSuccessButtonClicked={this.onModalSuccessButton}/>
            </div>
        )
    }
}

export default Content;
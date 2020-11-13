import React from 'react';

import './style.css';

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
import IconPanel from './IconPanel';
import CollectionModal from './Model/UpdateCollectionModal';

import {
    getUserId
} from '../../Common/Authentication';

import {
    updateCollection
} from '../../Common/Operations';

class CollectionDetails extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            //Collection data
            id: null,
            userId: null,
            title: null,
            color: null,
            description: null,
            liked: null,
            likes: null,
            cards: [],

            //Return flag
            back: false,

            //Modal open or not
            updateModalOpen: false,
            updateModalSuccess: false,
            updateModalError: false,
            updateModalMessage: ""
        }

        this.loadCollection = this.loadCollection.bind(this);
        this.loadCards = this.loadCards.bind(this);
        this.returnHome = this.returnHome.bind(this);
        this.onAdd = this.onAdd.bind(this);
        this.onEdit = this.onEdit.bind(this);
        this.onTest = this.onTest.bind(this);
        this.updateCollection = this.updateCollection.bind(this);
        this.closeUpdateModal = this.closeUpdateModal.bind(this);
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
                
                console.log(collection.userId);

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

    //Event handlers for icon
    onAdd() {
        
    }

    onEdit() {
        //Open
        this.setState({
            updateModalOpen: true
        });
    }

    onTest() {
        console.log("test");
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

    render() {
        //Expand state
        const { 
            userId, id, title, color, description, liked, likes, 
            cards, 
            back,
            updateModalOpen, updateModalSuccess, updateModalError, updateModalMessage
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

                        <FlashCards cards={cards}/>
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
                    </div> : 
                    null
                }
            </div>
        )
    }
}

export default CollectionDetails;
import axios from 'axios';
import qs from 'qs';

//Get token from storage
import { getAccessToken } from './Authentication';

//Set root url
axios.defaults.baseURL = "http://localhost:8000";

//Helper method to make www-form-urlencoded request
function makeRequest(url, body, type="get", authorization=false) {
    //Configuration
    const config = authorization ? 
    {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${getAccessToken()}`
        }
    } :
    {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
    }

    //Make request
    if (type === "get") {
        return axios.get(url, qs.stringify(body), config);
    } else if (type === "post") {
        return axios.post(url, qs.stringify(body), config);
    } else if (type === "put") {
        return axios.put(url, qs.stringify(body), config);
    } else if (type === "delete") {
        return axios.delete(url, qs.stringify(body), config);
    }
}

//Get all collections
function getAllCollections() {
    return axios({
        method: 'GET',
        url: '/collections',
        headers: {
            'Authorization': `Bearer ${getAccessToken()}`
        }
    });
}

//Get user collections
function getMyCollections() {
    return axios({
        method: 'GET',
        url: '/mine/collections',
        headers: {
            'Authorization': `Bearer ${getAccessToken()}`
        }
    });
} 

//Get liked collections
function getLikedCollections() {
    return axios({
        method: 'GET',
        url: '/mine/collections/liked',
        headers: {
            'Authorization': `Bearer ${getAccessToken()}`
        }
    });
} 

//Delete a user collection
function deleteCollection(id) {
    return axios({
        method: 'DELETE',
        url: `/collections/${id}`,
        headers: {
            'Authorization': `Bearer ${getAccessToken()}`
        }
    });
}

//Like and Unlike collection
function likeCollection(id) {
    return makeRequest('/collections/likes', { collectionId: id }, 'post', true);
}

function unlikeCollection(id) {
    return makeRequest('/collections/unlikes', { collectionId: id }, 'post', true);
}

//Create a collection
function createCollection(title, description, color) {
    //Make urlencoded request with authorization
    return makeRequest('/collections', { title, description, color }, 'post', true);
}

//Get all cards
function getAllCards() {
    return axios({
        method: 'GET',
        url: '/cards',
        headers: {
            'Authorization': `Bearer ${getAccessToken()}`
        }
    });
}

//Get liked cards
function getLikedCards() {
    return axios({
        method: 'GET',
        url: '/mine/cards/liked',
        headers: {
            'Authorization': `Bearer ${getAccessToken()}`
        }
    });
}

//Get my cards
function getMyCards() {
    return axios({
        method: 'GET',
        url: '/mine/cards/',
        headers: {
            'Authorization': `Bearer ${getAccessToken()}`
        }
    });
}

//Delete card
function deleteCard(id) {
    return makeRequest('/cards/delete', { id }, 'post', true);
}

//Like and Unlike card
function likeCard(id) {
    return makeRequest('/cards/likes', { cardId: id }, 'post', true);
}

function unlikeCard(id) {
    return makeRequest('/cards/unlikes', { cardId: id }, 'post', true);
}

export {
    //Collection operations
    getAllCollections,
    getMyCollections,
    createCollection,
    deleteCollection,
    likeCollection,
    unlikeCollection,
    getLikedCollections,

    //Card operations
    getAllCards,
    getMyCards,
    getLikedCards,
    likeCard,
    unlikeCard,
    deleteCard
}

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
        authorization: getAccessToken()
    });
}

//Get all cards
function getAllCards() {
    return axios({
        method: 'GET',
        url: '/cards',
        authorization: getAccessToken()
    });
}

//Create a collection
function createCollection(title, description, color) {
    //Make urlencoded request with authorization
    return makeRequest('/collections', { title, description, color }, 'post', true);
}

export {
    getAllCollections,
    getAllCards,
    createCollection
}

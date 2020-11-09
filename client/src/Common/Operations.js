import axios from 'axios';

//Get token from storage
import { getAccessToken } from './Authentication';

//Set root url
axios.defaults.baseURL = "http://localhost:8000";

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

export {
    getAllCollections,
    getAllCards
}

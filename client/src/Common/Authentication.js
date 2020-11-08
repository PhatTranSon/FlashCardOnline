const axios = require('axios');
const qs = require('qs');

//Constant for URL
axios.defaults.baseURL = "http://localhost:8000";

//Helper method to make www-form-urlencoded request
function makeRequest(url, body, type="get") {
    //Configuration
    const config = {
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

exports.signup = (name, password)  => {
    return makeRequest('/auth/create', { name, password }, 'post')
            .then(response => {
                //Get the access token
                const token = response.data.accessToken;

                //Set token therefore log in
                setAccessToken(token);

                //Return the response again
                return response
            });
}

exports.login = (name, password) => {
    return makeRequest('/auth/validate', { name, password }, 'post')
            .then(response => {
                //Get the access token
                const token = response.data.accessToken;

                //Set token therefore log in
                setAccessToken(token);

                //Return the response
                return response;
            });
}

function setAccessToken(accessToken) {
    localStorage.setItem("accessToken", accessToken);
}

exports.isLoggedIn = () => {
    return !(localStorage.getItem("accessToken") === null);
}

exports.logout = () => {
    return localStorage.setItem("accessToken", null);
}
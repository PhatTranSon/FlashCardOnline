const axios = require('axios');
const { response } = require('express');
const { access } = require('fs');
const qs = require('querystring');

//Constants for URL
axios.defaults.baseURL = "localhost";

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
        return axios.get(url, qs.stringify(body), config);
    }
}

function signup(name, password) {
    makeRequest('/auth/create', { name, password }, 'get')
        .then(response => {
            //Get the access token
            const token = response.data.accessToken;

            //Set token therefore log in
            setAccessToken(token);
        });
}

function login(name, password) {
    makeRequest('/auth/validate', { name, password }, 'get')
        .then(response => {
            //Get the access token
            const token = response.data.accessToken;

            //Set token therefore log in
            setAccessToken(token);
        });
}

function setAccessToken(accessToken) {
    localStorage.setItem("accessToken", accessToken);
}

function isLoggedIn() {
    return localStorage.getItem("accessToken") !== null;
}

function logout() {
    return localStorage.setItem("accessToken", null);
}

module.exports = {
    signup,
    login
}
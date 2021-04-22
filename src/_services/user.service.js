import config from 'config';
import { authHeader, handleResponse } from '@/_helpers';

export const userService = {
    getAll,
    setUserStatus,
    getUserProfile,
    updateUserProfile
};

function getAll() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`${config.apiUrl}/api/getusers`, requestOptions).then(handleResponse);
}

function getUserProfile() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`${config.apiUrl}/api/getUserProfile`, requestOptions).then(handleResponse);
}

function updateUserProfile(userProfile) {
    const requestOptions = { 
        method: 'POST', 
        headers: authHeader() ,
        body: JSON.stringify(userProfile)
    };
    return fetch(`${config.apiUrl}/api/UpdateUserProfile`, requestOptions).then(handleResponse);
}

function setUserStatus(user){
    const requestOptions = { 
        method: 'POST', 
        headers: authHeader(),
        body: JSON.stringify(user)
    };

    return fetch(`${config.apiUrl}/api/SetUserStatus`, requestOptions)
        .then(handleResponse);
}
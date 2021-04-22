import { BehaviorSubject } from 'rxjs';

import config from 'config';
import { authHeader, handleResponse } from '@/_helpers';
import { handleSignupResponse } from '@/_helpers';
import jwt from 'jwt-decode'

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));

export const authenticationService = {
    login,
    logout,
    signup,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue () { return currentUserSubject.value }
};

function login(email, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin':'*'
        },
        body: JSON.stringify({ email, password })
    };

    return fetch(`${config.apiUrl}/api/login`, requestOptions)
        .then(handleResponse)
        .then(user => {
            const parsedToken = jwt(user.token); 
            user.id = parsedToken.id;
            user.role = parsedToken.role || '';

            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));
            currentUserSubject.next(user);

            return user;
        });
}

function signup(email, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    };

    return fetch(`${config.apiUrl}/api/signup`, requestOptions)
        .then(handleSignupResponse)
        .then(user => {
            return user;
        });
}


function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    currentUserSubject.next(null);
}

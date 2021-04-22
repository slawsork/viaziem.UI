import { authenticationService } from '@/_services';

export function authHeader() {
    // return authorization header with jwt token
    const currentUser = authenticationService.currentUserValue;
    if (currentUser && currentUser.token) {
        return { 'Content-Type': 'application/json', Authorization: currentUser.token };
    } else {
        return { 'Content-Type': 'application/json' };
    }
}
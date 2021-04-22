import React from 'react';

import { authenticationService } from '@/_services';

class SignedUpPage extends React.Component {
    constructor(props) {
        super(props);

        // redirect to home if already logged in
        if (authenticationService.currentUserValue) { 
           // this.props.history.push('/');
        }
    }

    render() {
        return (
            <div>
                <h2>Success!</h2>
                <a href="/Login" target="_top">You're signed up successfully, now you can log in using credentials.</a>
            </div>
        )
    }
}

export { SignedUpPage }; 
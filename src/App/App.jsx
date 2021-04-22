import React from 'react';
import { Router, Route, Link } from 'react-router-dom';

import { history } from '@/_helpers';
import { authenticationService } from '@/_services';
import { PrivateRoute } from '@/_components';
import { HomePage } from '@/HomePage';
import { LoginPage } from '@/LoginPage';
import { SignupPage } from '@/SignupPage';
import { SignedUpPage } from '@/SignedUpPage';
import { ProfilePage } from '@/ProfilePage';
import { AdminPage } from '@/AdminPage';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUser: null
        };
    }

    componentDidMount() {
        authenticationService.currentUser.subscribe(x => this.setState({ currentUser: x }));
    }

    logout() {
        authenticationService.logout();
        history.push('/login');
    }

    render() {
        const { currentUser } = this.state;
        return (
            <Router history={history}>
                <div>
                    {currentUser &&
                        <nav className="navbar navbar-expand navbar-dark bg-dark">
                            <div className="navbar-nav">
                                <Link to="/" className="nav-item nav-link">Home</Link>
                                <Link to="/profile" className="nav-item nav-link">Profile</Link>
                                <a onClick={this.logout} className="nav-item nav-link">Logout</a>
                            </div>
                        </nav>
                    }
                    <div className="jumbotron">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-6 offset-md-3">
                                    <PrivateRoute exact path="/" component={HomePage} />
                                    <Route path="/login" component={LoginPage} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 offset-md-3">
                                    <Route path="/signup" component={SignupPage} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 offset-md-3">
                                    <Route path="/signedup" component={SignedUpPage} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 offset-md-3">
                                    <Route path="/profile" component={ProfilePage} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 offset-md-3">
                                    <Route path="/admin" component={AdminPage} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Router>
        );
    }
}

export { App }; 
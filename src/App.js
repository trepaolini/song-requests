import React, { Component } from 'react';
import './App.css';
import { Auth } from './Auth';
import { HomePage } from './HomePage';
import firebase from 'firebase';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import { HashRouter as Router, Route, Link } from "react-router-dom";
import { MySongs } from './MySongs';
import { DataTool } from './DataTool';

class App extends Component {
    constructor(props) {
        super(props);
        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.state = {
            collapsed: true,
            user: null,
            loaded: false
        };
    }
    toggleNavbar() {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }


    handleSignOut() {
        this.setState({ errorMessage: null }); //clear old error

        /* Sign out the user, and update the state */
        firebase.auth().signOut()
            .catch((err) => {
                console.log(err)
                this.setState({ errorMessage: err.message });
            });
    }

    componentDidMount() {
        // Authentication
        this.stopWatchingAuth = firebase.auth().onAuthStateChanged(firebaseUser => {
            if (firebaseUser) {
                this.setState({
                    user: firebaseUser,
                    errorMessage: '',
                    loaded: true
                });
            }
            else {
                this.setState({ user: null, loaded: true }); //null out the saved state
            }
        });
    }

    render() {
        return (
            <div>
                {(this.state.user && this.state.loaded) &&
                    <Router>
                        <div>
                            <Navbar color="faded" light>
                                <Link to="/" className="brand">Song Requests</Link>
                                <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
                                <Collapse isOpen={!this.state.collapsed} navbar>
                                    <Nav navbar>
                                        <NavItem>
                                            <Link className="linkItem" to="/my-songs">My Songs</Link>
                                        </NavItem>
                                        <NavItem>
                                            <Link className="linkItem" to="/data-tool">User Comparison</Link>
                                        </NavItem>
                                        <NavItem>
                                            <span className="linkItem" onClick={() => this.handleSignOut()}>LogOut</span>
                                        </NavItem>
                                    </Nav>
                                </Collapse>
                            </Navbar>
                            <Route exact path="/" component={HomePage} />
                            <Route path="/my-songs" component={MySongs} />
                            <Route path="/data-tool" component={DataTool} />
                        </div>
                    </Router >
                }
                {(!this.state.user && this.state.loaded) &&
                    <Auth />

                }

            </div>
        );
    }
}

export default App;

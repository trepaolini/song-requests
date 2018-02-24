import React, { Component } from 'react';
import './App.css';
import { Auth } from './Auth';
import { HomePage } from './HomePage';
import firebase from 'firebase';
import { HashRouter as Router, Route, Link } from "react-router-dom";
import { MySongs } from './MySongs';
import { DataTool } from './DataTool';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Menu from 'material-ui/Menu';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Divider from 'material-ui/Divider';
import 'materialize-css/dist/css/materialize.css';
import 'typeface-roboto';



class App extends Component {
    constructor(props) {
        super(props);
        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.state = {
            open: false,
            user: null,
            loaded: false
        };
    }
    toggleNavbar() {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    handleToggle() {
        this.setState({ open: !this.state.open });
    }

    handleClose() {
        this.setState({ open: false });
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
                <MuiThemeProvider>
                    <AppBar
                        title="Song Requests"
                        onLeftIconButtonClick={() => this.handleToggle()}
                    />
                    <div>
                        {(this.state.user && this.state.loaded) &&
                            <Router>
                                <div>

                                    <Drawer docked={false}
                                        width={200}
                                        open={this.state.open}
                                        onRequestChange={(open) => this.setState({ open })}>
                                        <Menu selectedMenuItemStyle={{ backgroundColor: 'green' }}>
                                            <Link to="/" className="brand">
                                                <MenuItem>
                                                    Song Requests
                                            </MenuItem>
                                            </Link>
                                            <Link className="linkItem" to="/my-songs">
                                                <MenuItem selected={true}>
                                                    My Songs
                                            </MenuItem>
                                            </Link>
                                            <Link className="linkItem" to="/data-tool">
                                                <MenuItem>
                                                    Compare Users
                                            </MenuItem>
                                            </Link>
                                            <Divider />
                                            <span className="linkItem" onClick={() => this.handleSignOut()}>
                                                <MenuItem>
                                                    LogOut
                                            </MenuItem>
                                            </span>
                                        </Menu>
                                    </Drawer>
                                    <Route exact path="/" component={HomePage} />
                                    <Route path="/my-songs" component={MySongs} />
                                    <Route path="/data-tool" component={DataTool} />
                                </div>
                            </Router >

                        }
                        {
                            (!this.state.user && this.state.loaded) &&
                            <Auth />

                        }
                    </div>
                </MuiThemeProvider >
            </div>
        );
    }
}

export default App;

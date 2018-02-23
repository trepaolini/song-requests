// Auth.js
import React, { Component } from 'react';
import firebase from 'firebase';
import { Redirect } from 'react-router-dom';

class Auth extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            username: ''
        };
    }
    handleSignUp(email, password, username) {

        /* Create a new user and save their information */
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(firebaseUser => {
                console.log('set username', username)
                //include information (for app-level content)
                let profilePromise = firebaseUser.updateProfile({
                    displayName: username,
                }); //return promise for chaining

                return profilePromise;
            })
            .then(firebaseUser => {
                console.log('handle sign up', firebase.auth().currentUser, this)
                this.setState({
                    user: firebase.auth().currentUser
                })
            })
            .catch((err) => {
                console.log(err);
                this.setState({ errorMessage: err.message })
            })
    }
    handleSignIn(email, password) {
        //A callback function for logging in existing users


        /* Sign in the user */
        firebase.auth().signInWithEmailAndPassword(email, password)
            .catch((err) => {
                console.log(err)
                this.setState({ errorMessage: err.message })
            });
    }

    handleChange(event) {
        let field = event.target.name; //which input
        let value = event.target.value; //what value

        let changes = {}; //object to hold changes
        changes[field] = value; //change this field
        this.setState(changes); //update state
    }


    render() {
        return (
            <div className="container">
                <div className="form-group">
                    <label>Email:</label>
                    <input className="form-control"
                        name="email"
                        value={this.state.email}
                        onChange={(event) => { this.handleChange(event) }}
                    />
                </div>

                <div className="form-group">
                    <label>Password:</label>
                    <input type="password" className="form-control"
                        name="password"
                        value={this.state.password}
                        onChange={(event) => { this.handleChange(event) }}
                    />
                </div>

                <div className="form-group">
                    <label>Username:</label>
                    <input className="form-control"
                        name="username"
                        value={this.state.username}
                        onChange={(event) => { this.handleChange(event) }}
                    />
                </div>

                <div className="form-group">
                    <button className="btn btn-primary mr-2" onClick={() => this.handleSignUp(this.state.email, this.state.password, this.state.username)}>
                        Sign Up
                     </button>
                    <button className="btn btn-success mr-2" onClick={() => this.handleSignIn(this.state.email, this.state.password)}>
                        Sign In
                    </button>
                </div>
            </div>
        );
    }
}

export { Auth };

import React, { Component } from 'react';
import firebase from 'firebase';
import { RequestList } from './RequestList';
import './Homepage.css';

export class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            songLink: '',
            requests: []
        };
    }
    componentDidMount() {
        // Listening to changes
        this.requestRef = firebase.database().ref('requests');

        this.requestRef.on('value', (snapshot) => {
            let requests = snapshot.val();
            this.setState({ requests: requests });
        });
    }

    updateSong(event) {
        this.setState({ songLink: event.target.value });
    }
    addRequest() {
        let song = {
            songLink: this.state.songLink,
            user: firebase.auth().currentUser.displayName,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            likes: 0
        };
        this.requestRef.push(song);
    }

    render() {
        let requestKeys = Object.keys(this.state.requests);
        let requestArray = requestKeys.map((key) => { //map array of keys into array of tasks
            let request = this.state.requests[key]; //access element at that key
            request.key = key; //save the key for later referencing!
            return request; //the transformed object to store in the array
        });

        return (
            <div className="container homePage">
                <div className="form-group">
                    <input className="form-control"
                        placeholder="Input the URL to a song on Spotify"
                        name="songLink"
                        value={this.state.songLink}
                        onChange={(event) => { this.updateSong(event) }}
                    />
                    <button className="btn btn-success mr-2" onClick={() => this.addRequest()}>
                        Add Request
                        </button>
                </div>

                <RequestList requests={requestArray} />

            </div>
        );
    }
}


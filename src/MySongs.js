import React, { Component } from 'react';
import './MySongs.css';
import firebase from 'firebase';
import { RequestList } from './RequestList';
import { Redirect } from 'react-router-dom';


export class MySongs extends Component {
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

    deleteSong(key) {
        console.log('key', key)
        let songRef = firebase.database().ref('requests/' + key)
        songRef.remove();

    }


    render() {
        let requestKeys = Object.keys(this.state.requests);
        let requestArray = requestKeys.map((key) => { //map array of keys into array of tasks
            let request = this.state.requests[key]; //access element at that key
            request.key = key; //save the key for later referencing!
            return request; //the transformed object to store in the array
        }).filter((d) => {
            console.log(d.user, firebase.auth().currentUser)
            return d.user === firebase.auth().currentUser.displayName
        })

        return (
            <div className="container">
                <h1>Songs I've Requested</h1>
                {
                    requestArray.map((d, i) => {
                        return <div key={'link-' + i}>
                            <a href={d.songLink}>Link </a>
                            has {d.likes} likes.
                            <span className="delete" onClick={() => this.deleteSong(d.key)}>(delete)</span>
                        </div>
                    })
                }


            </div>
        );
    }
}


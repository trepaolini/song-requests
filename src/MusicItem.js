// Auth.js
import React, { Component } from 'react';
import firebase from 'firebase';
import './MusicItem.css';
class MusicItem extends Component {
    likeItem() {

        let songRef = firebase.database().ref('requests/' + this.props.info.key + '/likes');
        songRef.transaction(function (currentClicks) {
            // If node/clicks has never been set, currentRank will be `null`.
            return (currentClicks || 0) + 1;
        });
    }
    render() {
        return (
            <div className="musicItem">
                <iframe src={"https://open.spotify.com/embed?uri=" + this.props.info.songLink} width="300" height="380" frameBorder="0" allowtransparency="true"></iframe>
                <p>Requested by: {this.props.info.user}</p>
                <p className="likes" onClick={() => this.likeItem()}>Likes: {this.props.info.likes}</p>
            </div>
        )
    }
}

export { MusicItem };
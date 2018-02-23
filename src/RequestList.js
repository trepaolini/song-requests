// Auth.js
import React, { Component } from 'react';
import { MusicItem } from './MusicItem';
export class RequestList extends Component {
    render() {
        return (
            <div className="requestList">
                {this.props.requests.map((d, i) => {
                    return <MusicItem key={'request' + i} info={d} />
                })

                }
            </div>

        )
    }
}
import React, { Component } from 'react';
import './App.css';
import { Auth } from './Auth';
import firebase from 'firebase';
import { RequestList } from './RequestList';
import * as d3 from 'd3';
import { ResponsiveContainer, Label, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';
import 'typeface-roboto';
import RaisedButton from 'material-ui/RaisedButton';
export class DataTool extends Component {
    constructor(props) {
        super(props);
        this.state = {
            xAxis: 'likes',
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

    render() {
        let requestKeys = Object.keys(this.state.requests);
        let requestArray = requestKeys.map((key) => { //map array of keys into array of tasks
            let request = this.state.requests[key]; //access element at that key
            request.key = key; //save the key for later referencing!
            return request; //the transformed object to store in the array
        });

        // User data
        let byUser = d3.nest()
            .key((d) => d.user)
            .rollup((d => {
                console.log(d)
                return {
                    likes: d3.sum(d, (f) => f.likes),
                    numSongs: d.length
                };
            }))
            .entries(requestArray);

        let height = window.innerHeight - 200;
        let xLabel = this.state.xAxis == 'numSongs' ? 'Number of Requests' : 'Number of Likes'
        return (
            <div className="container">
                <h3>User Data</h3>
                <RaisedButton primary={true} onClick={() => this.setState({ xAxis: 'numSongs' })}># Requests</RaisedButton>{'  '}
                <RaisedButton primary={true} onClick={() => this.setState({ xAxis: 'likes' })}># Likes</RaisedButton>
                <ResponsiveContainer width={"100%"} height={height}>
                    <BarChart className="chart" layout="vertical" data={byUser} margin={{ top: 5, right: 30, left: 100, bottom: 15 }}>
                        <XAxis type="number" dataKey={"value." + this.state.xAxis}>
                            <Label value={xLabel} offset={-10} position="insideBottom" />
                        </XAxis>
                        <YAxis type="category" dataKey="key">
                            <Label value={"User"} offset={50} position="left" />
                        </YAxis>
                        <Tooltip content={(d) => {
                            console.log(d.payload)
                            if (d.payload.length > 0) {
                                let ele = d.payload[0];
                                console.log(d.payload[0])
                                return (<div style={{ backgroundColor: 'white', padding: '5px' }}>
                                    User: {ele.payload.key} <br />
                                    {xLabel}: {ele.value}
                                </div>)
                            }
                            return 'test'

                        }} />
                        <Bar dataKey={"value." + this.state.xAxis} fill='#8884d8' />
                    </BarChart>
                </ResponsiveContainer>

            </div >
        );
    }
}


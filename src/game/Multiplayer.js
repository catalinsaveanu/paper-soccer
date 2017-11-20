import React, { Component } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Peer from 'peerjs';

class Multiplayer extends Component {
    constructor(props) {
        super(props);

        this.moveToSend = null;

        this.state = {
            opponentId: props.opponentId,
            gameLink: ''
        }
    }

    componentDidMount() {
        this.peer = new Peer({ key: 'lwjd5qra8257b9' });

        if (!this.state.opponentId) {
            this.peer.on('open', id => {
                this.setState({
                    gameLink: `${window.location}#${id}`
                })
            });

            this.peer.on('connection', (conn) => {
                this.conn = conn;

                this.setState({
                    gameLink: ''
                })

                this.initConnection();
            });            
        } else {
            this.conn = this.peer.connect(this.state.opponentId);

            this.initConnection()
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.moveToSend !== null && nextProps.moveToSend !== this.moveToSend) {
            this.sendMove(nextProps.moveToSend);
        }
    }

    initConnection() {
        this.conn.on('open', () => {
            this.conn.on('data', (data) => this.onReceivedData(data));
        });
    }

    onReceivedData(move) {
        this.props.onReceivedMove(move);
    }

    sendMove(move) {
        this.moveToSend = move;
        this.conn.send(move);
    }
 
    render() {
        if (this.state.gameLink === '') {
            return (
                <div/>
            )
        }

        return (
            <div className="modal-overlay">
                <h2 className="game-link-msg">Copy and send this link to opponent:</h2>
                <div className="game-link">
                    <input type="text" value={this.state.gameLink} readOnly="readonly"/>
                    <CopyToClipboard text={this.state.gameLink}>
                        <button className="border-button">Copy to clipboard</button>
                    </CopyToClipboard>
                </div>
            </div>
        )
    }
}

export default Multiplayer;
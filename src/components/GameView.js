import React, { Component } from 'react';
import {Layer, Line, Circle, Stage, Group} from 'react-konva';
import Game from '../game/Game';
import Multiplayer from '../game/Multiplayer';
import Ball from '../components/Ball';
import Header from './Header';
import LinkButton from './common/LinkButton';

import * as constants from '../utils/constants';
import { GATE_W } from '../utils/constants';

class GameView extends Component {
    constructor(props) {
        super(props);

        const opponentId = props.location.hash.substr(1);

        this.game = new Game(constants.POINTS_W, constants.POINTS_H);
        this.finishAudio = new Audio('/sounds/football_crowd.mp3');
        this.opponentMoves = [];
        this.weAnimate = false;

        this.state = {
            fieldMoves: this.getMoves(),
            fieldPoints: new Array(99).fill(constants.MAIN_COLOR),
            ballPosition: this.getBallPosition(this.game.cVertex),
            winner: '',
            opponentId: opponentId,
            opponent: props.match.params.opponent,
            cTurn: 0,
            player: (opponentId === '' ? 0 : 1),
            moveToSend: null
        }
    }


    getPointPosition(point) {
        return {
            x: point % this.game.width,
            y: Math.floor(point / this.game.width)
        }
    }

    getPoints(nodeA, nodeB) {
        let points = [
            ...Object.values(this.getPointPosition(nodeA)),
            ...Object.values(this.getPointPosition(nodeB))
        ];
        
        return points.map(point => point * constants.SPACE_BETWEEN_POINTS);
    }

    getMoves() {
        var moves = [];

        for (let i = 0; i < this.game.totalVertices; i++) {
            for (let j = 0; j < this.game.totalVertices; j++) {
                if (this.game.isPlayerMove(i, j) && i < j) {
                    let linePoints = this.getPoints(i, j),
                        color = constants.MOVES_COLOR[this.game.getPlayerFromMove(i, j)];

                    //this.changePointsColor(i, MOVES_COLOR[playerIndex]);
                    //this.changePointsColor(j, MOVES_COLOR[playerIndex]);
        
                    moves.push(<Line id={`move-${i}_${j}`} key={`move-${i}_${j}`} points={linePoints} stroke={color} strokeWidth={constants.STROKE_W}/>);
                }
            }
        }

        return moves;
    }

    changePointsColor(pointIndex, color) {
        this.setState((prevState, props) => ({
            fieldPoints: [
                ...prevState.fieldPoints.slice(0, pointIndex),
                color,
                ...prevState.fieldPoints.slice(pointIndex + 1)
            ]
        }));
    }

    getFieldPoints() {
        let points = new Array(this.game.totalVertices).fill(1);

        return points.map((value, index) => {
            const xpos = (index % this.game.width) * constants.SPACE_BETWEEN_POINTS,
                  ypos = Math.floor(index / this.game.width) * constants.SPACE_BETWEEN_POINTS;

            return (
                <Group key={`group-${index}`}>
                    {/* <Text key={`text-${index}`} text={`${index}`} fill={`${constants.MAIN_COLOR}`} fontSize={13} x={xpos - 7} y={ypos - 5} /> */}
                    <Circle ref={`point-${index}`} id={`point-${index}`} key={`point-${index}`} radius={10} fill={this.state.fieldPoints[index]} x={xpos} y={ypos}/>
                </Group>
            )
        })
    }

    onOverPoints(e) {
        let circle = e.target,
            vertex = parseInt(circle.id().substr(6), 10);
        
        if (this.game.weCanMoveTo(vertex) && this.state.player === this.game.playerTurn) {
            circle.to({scaleX: 1.5, scaleY: 1.5, duration: 0.1});
        }
    }

    onOutPoints(e) {
        let circle = e.target;
        circle.to({scaleX: 1, scaleY: 1, duration: 0.1});
    }

    onClickPoints(e) {
        let circle = e.target,
            vertex = parseInt(circle.id().substr(6), 10);

        if (this.weAnimate) {
            return;
        }

        if (this.game.weCanMoveTo(vertex) && this.state.player === this.game.playerTurn) {
            this.makeMoveTo(vertex);
        }
    }

    makeMoveTo(vertex) {
        let linePoints = this.getPoints(this.game.cVertex, vertex),
            stage = this.refs.stage.getStage(),
            ball = stage.find('#ballImg').rotation(0),
            ballGroup = stage.find('#ballGroup'),
            fieldMoves = stage.find('#fieldMoves');
        
        this.weAnimate = true;
        new Audio('/sounds/ball_bounce.mp3').play();

        var line = new window.Konva.Line({
            points: [linePoints[0], linePoints[1], linePoints[0], linePoints[1]],
            stroke: constants.MOVES_COLOR[this.game.playerTurn],
            strokeWidth: constants.STROKE_W
        });

        fieldMoves.add(line);

        ballGroup.to({
            x: linePoints[2] + GATE_W,
            y: linePoints[3],
            easing: window.Konva.Easings.EaseOut,
            duration: 0.5
        });

        ball.to({
            rotation: 360,
            easing: window.Konva.Easings.EaseOut,
            duration: 0.5
        })

        line.to({
            points: linePoints,
            easing: window.Konva.Easings.EaseOut,
            duration: 0.5,
            onFinish: () => {
                line.destroy();
                this.onCompleteMoveAnimation(vertex);
            }           
        })
    }

    onCompleteMoveAnimation(vertex) {
        this.game.makeMoveTo(vertex);
        this.setState({
            fieldMoves: this.getMoves(),
            ballPosition: this.getBallPosition(vertex),
            cTurn: this.game.playerTurn
        }, () => {
            this.weAnimate = false;
        });

        if (this.game.isGameOver) {
            let winnerMsg = '';

            if (this.game.winner === this.state.player) {
                winnerMsg = 'You Win!';
            } else if (this.state.opponent === 'human') {
                winnerMsg = 'Opponent Wins!'
            } else {
                winnerMsg = 'Computer Wins!';
            }

            this.setState({
                winner: `${winnerMsg}`
            });

            this.finishAudio.play();
        } else {
            if (this.state.opponent === 'human') {
                this.setState({
                    moveToSend: vertex
                });
            }

            if (this.state.player !== this.game.playerTurn && this.state.opponent === 'dumb-ai') {
                this.opponentMoves = this.game.getAIMoves();
                this.makeMoveTo(this.opponentMoves.shift());
            }
        }
    }

    onReceivedMove(move) {
        if (move === 'restart') {
            if (this.state.moveToSend !== 'restart') {
                this.setState({
                    moveToSend: 'restart'
                })
            }

            this.restartGame();

            return;
        }

        this.makeMoveTo(move);
    }

    getBallPosition(vertex) {
        let indices = this.game.getVertexIndices(vertex);

        return {
            x: indices.j * constants.SPACE_BETWEEN_POINTS,
            y: indices.i * constants.SPACE_BETWEEN_POINTS
        }
    }

    onClickRematch() {
        this.stopFinishSound();

        if (this.state.opponent === 'human') {
            this.setState({
                moveToSend: 'restart'
            })
        } else {
            this.restartGame();
        }
    }

    restartGame() {
        this.game.restart();

        this.game = new Game(constants.POINTS_W, constants.POINTS_H);
        this.opponentMoves = [];

        this.setState({
            fieldMoves: this.getMoves(),
            fieldPoints: new Array(99).fill(constants.MAIN_COLOR),
            ballPosition: this.getBallPosition(this.game.cVertex),
            winner: '',
            cTurn: 0,
            moveToSend: null
        });
    }

    stopFinishSound() {
        this.finishAudio.pause();
        this.finishAudio.currentTime = 0;
    }

    render() {
        let multiplayer = (this.state.opponent === 'human' ? <Multiplayer opponentId={this.state.opponentId} moveToSend={this.state.moveToSend} onReceivedMove={move => this.onReceivedMove(move)}/> : '');
        
        return (
            <div className="game">
                <Header location={this.props.location} cTurn={this.state.cTurn} opponent={this.state.opponent} player={this.state.player}></Header>
                <Stage ref="stage" width={constants.FIELD_W} height={constants.FIELD_H + 30} className="field">
                    <Layer ref="layer">
                        <Group y={15}>
                            <Group>
                                <Line points={constants.BORDER_POINTS} stroke={constants.MAIN_COLOR} strokeWidth={constants.STROKE_W}/>
                                <Line points={[constants.FIELD_W / 2, 0, constants.FIELD_W / 2 , constants.FIELD_H]} stroke={constants.MAIN_COLOR} strokeWidth={constants.STROKE_W} opacity={0.3}/>
                            </Group>
                            <Group id="fieldMoves" x={constants.GATE_W}>
                                {this.state.fieldMoves}
                            </Group>                        
                            <Group x={constants.GATE_W} 
                                onMouseEnter = {this.onOverPoints.bind(this)} onMouseLeave = {this.onOutPoints.bind(this)} onClick = {this.onClickPoints.bind(this)}>
                                {this.getFieldPoints()}
                            </Group>
                            <Group id="ballGroup" x={constants.GATE_W + this.state.ballPosition.x} y={this.state.ballPosition.y}>
                                <Ball/>
                            </Group>
                        </Group>
                    </Layer>
                </Stage>
                <div className={this.state.winner !== '' ? 'show modal-overlay' : 'none'}>
                    <div className="winner-overlay">{this.state.winner}</div>
                    <LinkButton url="/" onClick={this.stopFinishSound.bind(this)}>Back to Menu</LinkButton>
                    <button onClick={this.onClickRematch.bind(this)} className="link-button">Rematch</button>
                </div>
                {multiplayer}          
            </div>
        )
    }
}

export default GameView;
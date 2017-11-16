import React, { Component } from 'react';
import {Layer, Line, Circle, Stage, Group, Text} from 'react-konva';
import Game from '../game/Game';
import Multiplayer from '../game/Multiplayer';
import Ball from '../components/Ball';
import Header from './Header';


import * as constants from 'utils/constants';

class GameView extends Component {
    constructor(props) {
        super(props);

        this.game = new Game(constants.POINTS_W, constants.POINTS_H);
        this.opponent = props.match.params.opponent;
        this.multiplayer = new Multiplayer(props.location.hash.substr(1));

        this.state = {
            fieldMoves: this.getMoves(),
            fieldPoints: new Array(99).fill(constants.MAIN_COLOR),
            ballPosition: this.getBallPosition(this.game.cVertex),
            winner: '',
            
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
                if (this.game.isPlayerMove(i, j)) {
                    let linePoints = this.getPoints(i, j),
                        color = constants.MOVES_COLOR[this.game.getPlayerFromMove(i, j)];

                    //this.changePointsColor(i, MOVES_COLOR[playerIndex]);
                    //this.changePointsColor(j, MOVES_COLOR[playerIndex]);
        
                    moves.push(<Line key={`move-${i}_${j}`} points={linePoints} stroke={color} strokeWidth={constants.STROKE_W}/>);
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
                    <Text key={`text-${index}`} text={`${index}`} fill={`${constants.MAIN_COLOR}`} fontSize={13} x={xpos - 7} y={ypos - 5} />
                    <Circle ref={`point-${index}`} id={`point-${index}`} key={`point-${index}`} radius={10} fill={this.state.fieldPoints[index]} x={xpos} y={ypos} opacity={0.4}/>
                </Group>
            )
        })
    }

    onOverPoints(e) {
        let circle = e.target,
            vertex = parseInt(circle.id().substr(6), 10);
        
        if (this.game.weCanMoveTo(vertex)) {
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

        if (this.game.weCanMoveTo(vertex)) {
            this.game.makeMoveTo(vertex);

            this.setState({
                fieldMoves: this.getMoves(),
                ballPosition: this.getBallPosition(vertex)
            });

            if (this.game.isGameOver) {
                this.setState({
                    winner: `Player ${this.game.winner} Wins!`
                });
            };

            if (this.game.playerTurn === 1) {
                this.multiplayer.sendMessage();
                //this.game.makeAIMove();
                
                this.setState({
                    fieldMoves: this.getMoves(),
                    ballPosition: this.getBallPosition(this.game.cVertex)
                });

                if (this.game.isGameOver) {
                    this.setState({
                        winner: `Player ${this.game.winner} Wins!`
                    });
                };
            }
        }
    }

    getBallPosition(vertex) {
        let indices = this.game.getVertexIndices(vertex);

        return {
            x: indices.j * constants.SPACE_BETWEEN_POINTS,
            y: indices.i * constants.SPACE_BETWEEN_POINTS
        }
    }

    render() {        
        return (
            <div className="game">
                <Header location={this.props.location}></Header>
                <Stage width={constants.FIELD_W} height={constants.FIELD_H + 30} className="field">
                    <Layer ref="layer">
                        <Group y={15}>
                            <Group>
                                <Line points={constants.BORDER_POINTS} stroke={constants.MAIN_COLOR} strokeWidth={constants.STROKE_W}/>
                                <Line points={[constants.FIELD_W / 2, 0, constants.FIELD_W / 2 , constants.FIELD_H]} stroke={constants.MAIN_COLOR} strokeWidth={constants.STROKE_W} opacity={0.3}/>
                            </Group>
                            <Group x={constants.GATE_W}>
                                {this.state.fieldMoves}
                            </Group>                        
                            <Group x={constants.GATE_W} 
                                onMouseEnter = {this.onOverPoints.bind(this)} onMouseLeave = {this.onOutPoints.bind(this)} onClick = {this.onClickPoints.bind(this)}>
                                {this.getFieldPoints()}
                            </Group>
                            <Group x={constants.GATE_W + this.state.ballPosition.x - constants.BALL_W / 2} y={this.state.ballPosition.y - constants.BALL_W / 2}>
                                <Ball/>
                            </Group>
                        </Group>
                    </Layer>
                </Stage>
                <div className={this.state.winner !== '' ? 'show modal-overlay' : 'none'}>
                    <div className="winner-overlay">{this.state.winner}</div>
                </div>
            </div>
        )
    }
}

export default GameView;
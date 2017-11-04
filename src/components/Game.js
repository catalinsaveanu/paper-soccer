import React, { Component } from 'react';
import {Layer, Line, Circle, Stage, Group, Text} from 'react-konva';
import GameLogic from '../game/GameLogic';

import {MAIN_COLOR, GATE_W, FIELD_W, FIELD_H, BORDER_POINTS, SPACE_BETWEEN_POINTS, STROKE_W, POINTS_W , POINTS_H, MOVES_COLOR} from 'utils/constants';

class Game extends Component {
    constructor(props) {
        super(props);

        this.gameLogic = new GameLogic(POINTS_W, POINTS_H);

        this.state = {
            fieldMoves: this.getMoves(),
            fieldPoints: new Array(99).fill(MAIN_COLOR),
            winner: ''
        }
    }


    getPointPosition(point) {
        return {
            x: point % this.gameLogic.width,
            y: Math.floor(point / this.gameLogic.width)
        }
    }

    getPoints(nodeA, nodeB) {
        let points = [
            ...Object.values(this.getPointPosition(nodeA)),
            ...Object.values(this.getPointPosition(nodeB))
        ];
        
        return points.map(point => point * SPACE_BETWEEN_POINTS);
    }

    getMoves() {
        var moves = [];

        for (let i = 0; i < this.gameLogic.totalVertices; i++) {
            for (let j = 0; j < this.gameLogic.totalVertices; j++) {
                if (this.gameLogic.isPlayerMove(i, j)) {
                    let linePoints = this.getPoints(i, j),
                        color = MOVES_COLOR[this.gameLogic.getPlayerFromMove(i, j)];

                    //this.changePointsColor(i, MOVES_COLOR[playerIndex]);
                    //this.changePointsColor(j, MOVES_COLOR[playerIndex]);
        
                    moves.push(<Line key={`move-${i}_${j}`} points={linePoints} stroke={color} strokeWidth={STROKE_W}/>);
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
        let points = new Array(this.gameLogic.totalVertices).fill(1);

        return points.map((value, index) => {
            const xpos = (index % this.gameLogic.width) * SPACE_BETWEEN_POINTS,
                  ypos = Math.floor(index / this.gameLogic.width) * SPACE_BETWEEN_POINTS;

            return (
                <Group key={`group-${index}`}>
                    <Text key={`text-${index}`} text={`${index}`} fill={`${MAIN_COLOR}`} fontSize={13} x={xpos - 7} y={ypos - 5} />
                    <Circle ref={`point-${index}`} id={`point-${index}`} key={`point-${index}`} radius={10} fill={this.state.fieldPoints[index]} x={xpos} y={ypos} opacity={0.4}/>
                </Group>
            )
        })
    }

    onOverPoints(e) {
        let circle = e.target,
            vertex = parseInt(circle.id().substr(6), 10);
        
        if (this.gameLogic.weCanMoveTo(vertex)) {
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

        if (this.gameLogic.weCanMoveTo(vertex)) {
            this.gameLogic.makeMoveTo(vertex);

            this.setState({
                fieldMoves: this.getMoves()
            });

            if (this.gameLogic.isGameOver) {
                this.setState({
                    winner: `Player ${this.gameLogic.winner} Wins!`
                });
            };
        }
    }

    render() {        
        return (
            /* this.props.match.params.opponent */
            <div className="game">
                <Stage width={FIELD_W} height={FIELD_H}>
                    <Layer ref="layer">
                        <Group>
                            <Line points={BORDER_POINTS} stroke={MAIN_COLOR} strokeWidth={STROKE_W}/>
                            <Line points={[FIELD_W / 2, 0, FIELD_W / 2 , FIELD_H]} stroke={MAIN_COLOR} strokeWidth={STROKE_W} opacity={0.3}/>
                        </Group>
                        <Group x={GATE_W}>
                            {this.state.fieldMoves}
                        </Group>                        
                        <Group x={GATE_W} clip = {{x: 0, y: 0, width: FIELD_W - 2 * GATE_W, height: FIELD_H}} 
                            onMouseEnter = {this.onOverPoints.bind(this)} onMouseLeave = {this.onOutPoints.bind(this)} onClick = {this.onClickPoints.bind(this)}>
                            {this.getFieldPoints()}
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

export default Game;
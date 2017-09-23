import React, { Component } from 'react';
import {Layer, Line, Circle, Stage, Group} from 'react-konva';

import {MAIN_COLOR, GATE_W, FIELD_W, FIELD_H, BORDER_POINTS, SPACE_BETWEEN_POINTS, STROKE_W, POINTS_W, MOVES_COLOR} from 'utils/constants';

class Game extends Component {
    state = {
        fieldPoints: new Array(99).fill(MAIN_COLOR),
        fieldMoves: [],
        cPoint: {
            x: 5,
            y: 4
        },
        moves: [
            {
                player: 1,
                from: [5, 4],
                to: [4, 4]
            },
            {
                player: 2,
                from: [4, 4],
                to: [5, 3]
            },
            {
                player: 2,
                from: [5, 3],
                to: [6, 4]
            },
            {
                player: 1,
                from: [6, 4],
                to: [5, 5]
            },
            {
                player: 1,
                from: [5, 5],
                to: [4, 4]
            },
            {
                player: 1,
                from: [4, 4],
                to: [3, 4]
            },
        ]
    }

    componentDidMount() {
        this.setState({
            fieldMoves: this.state.moves.map((move, index) => {
                const linePoints = [
                    ...move.from.map(point => point * SPACE_BETWEEN_POINTS),
                    ...move.to.map(point => point * SPACE_BETWEEN_POINTS)
                ];

                const fromIndex = move.from[1] * POINTS_W + move.from[0];
                const toIndex = move.to[1] * POINTS_W + move.to[0];

                this.changePointsColor(fromIndex, MOVES_COLOR[move.player - 1]);
                this.changePointsColor(toIndex, MOVES_COLOR[move.player - 1]);
        
                return <Line key={`move-${index}`} points={linePoints} stroke={MOVES_COLOR[move.player - 1]} strokeWidth={STROKE_W}/>
            })
        });
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
        return this.state.fieldPoints.map((color, index) => {
            const xpos = (index % POINTS_W) * SPACE_BETWEEN_POINTS,
                  ypos = Math.floor(index / POINTS_W) * SPACE_BETWEEN_POINTS;

            return <Circle key={`point-${index}`} radius={10} fill={color} x={xpos} y={ypos}/>
        })
    }

    /*enableNextMove(point) {
        for (let angle = 0; angle < 2 * Math.PI; angle += Math.PI/4) {
            let xSign = Math.sign(Math.cos(angle) + 10 - 10),
                ySign = Math.sign(Math.sin(angle) + 10 - 10),
                pos = (point.x + xSign) + (point.y + ySign) * this.state.wSize,
                pointField = document.getElementById(`point-${pos}`);

            if (pointField) {
                pointField.classList.add('enabled');
            }
        }
    }*/

    onClickedPoint(target, index) {
        if (!target.classList.contains('enabled')) return;

        var canvas = document.getElementById('moves'),
            ctx = canvas.getContext('2d'),
            field = document.getElementById('field'),
            pos = this.state.cPoint.x + this.state.cPoint.y * this.state.wSize,
            pointField = document.getElementById(`point-${pos}`);

        canvas.width = field.offsetWidth;
        canvas.height = field.offsetHeight;

        ctx.lineWidth = 11;
        ctx.strokeStyle = '#99fe00';
        ctx.beginPath();
        ctx.moveTo(pointField.offsetLeft + pointField.offsetWidth * 0.5, pointField.offsetTop + pointField.offsetHeight * 0.5);
        ctx.lineTo(target.offsetLeft + target.offsetWidth * 0.5, target.offsetTop + target.offsetHeight * 0.5);
        
        ctx.stroke();
    }

    onOverPoints(e) {
        let circle = e.target;
        circle.to({scaleX: 1.5, scaleY: 1.5, duration: 0.1});
    }

    onOutPoints(e) {
        let circle = e.target;
        circle.to({scaleX: 1, scaleY: 1, duration: 0.1});
    }

    render() {        
        return (
            /* this.props.match.params.opponent */
            <div className="game">
                <Stage width={FIELD_W} height={FIELD_H}>
                    <Layer>
                        <Group>
                            <Line points={BORDER_POINTS} stroke={MAIN_COLOR} strokeWidth={STROKE_W}/>
                            <Line points={[FIELD_W / 2, 0, FIELD_W / 2 , FIELD_H]} stroke={MAIN_COLOR} strokeWidth={STROKE_W}/>
                        </Group>
                        <Group x={GATE_W}>
                            {this.state.fieldMoves}
                        </Group>                        
                        <Group x={GATE_W} clip = {{x: 0, y: 0, width: FIELD_W - 2 * GATE_W, height: FIELD_H}} onMouseEnter = {this.onOverPoints.bind(this)} onMouseLeave = {this.onOutPoints.bind(this)}>
                            {this.getFieldPoints()}
                        </Group>
                    </Layer>
                </Stage>
            </div>
        )
    }
}

export default Game;
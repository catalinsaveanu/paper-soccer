import React, { Component } from 'react';
import {Layer, Line, Circle, Stage, Group} from 'react-konva';

import {MAIN_COLOR, GATE_W, FIELD_W, FIELD_H, BORDER_POINTS, SPACE_BETWEEN_POINTS, STROKE_W, POINTS_W} from 'utils/constants';

class Game extends Component {
    state = {
        fieldPoints: new Array(99).fill(0),
        cPoint: {
            x: 5,
            y: 4
        }
    }

    componentDidMount() {
        this.drawMoves([
            {
                player: 1,
                from: [4, 4],
                to: [3, 4]
            },
            {
                player: 2,
                from: [3, 4],
                to: [4, 3]
            }
        ])
    }

    getFieldPoints() {
        return this.state.fieldPoints.map((el, index) => {
            const xpos = (index % POINTS_W) * SPACE_BETWEEN_POINTS + GATE_W,
                  ypos = Math.floor(index / POINTS_W) * SPACE_BETWEEN_POINTS;

            return <Circle key={index} radius={10} fill={MAIN_COLOR} x={xpos} y={ypos}/>
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

    drawMoves(moves) {

    }

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
                            <Line points={BORDER_POINTS} stroke={MAIN_COLOR} strokeWidth={STROKE_W} lineCap='round' lineJoin='round'/>
                            <Line points={[FIELD_W / 2, 0, FIELD_W / 2 , FIELD_H]} stroke={MAIN_COLOR} strokeWidth={STROKE_W} lineCap='round' lineJoin='round'/>
                        </Group>
                        <Group clip = {{x: GATE_W, y: 0, width: FIELD_W - 2 * GATE_W, height: FIELD_H}} onMouseEnter = {this.onOverPoints.bind(this)} onMouseLeave = {this.onOutPoints.bind(this)}>
                            {this.getFieldPoints()}
                        </Group>
                    </Layer>
                </Stage>
            </div>
        )
    }
}

export default Game;
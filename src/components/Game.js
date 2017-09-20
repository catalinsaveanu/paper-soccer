import React, { Component } from 'react';

import BordersField from 'BordersField';
import Moves from 'Moves';
import FieldPoint from 'FieldPoint';
import Ball from 'Ball';

class Game extends Component {
    state = {
        wSize: 11,
        hSize: 9,
        fieldPoints: new Array(99).fill(0),
        cPoint: {
            x: 5,
            y: 4
        }
    }

    componentDidMount() {
        this.enableNextMove(this.state.cPoint);
    }

    enableNextMove(point) {
        for (let angle = 0; angle < 2 * Math.PI; angle += Math.PI/4) {
            let xSign = Math.sign(Math.cos(angle) + 10 - 10),
                ySign = Math.sign(Math.sin(angle) + 10 - 10),
                pos = (point.x + xSign) + (point.y + ySign) * this.state.wSize,
                pointField = document.getElementById(`point-${pos}`);

            if (pointField) {
                pointField.classList.add('enabled');
            }
        }
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

    render() {
        const points = this.state.fieldPoints.map((el, index) =>
            <FieldPoint key={index} index={index} clickedPoint={(target, index) => this.onClickedPoint(target, index)}></FieldPoint>
        );
        
        return (
            /* this.props.match.params.opponent */
            <div className="game">
                <div id="field" className="field">
                    <BordersField></BordersField>
                    <Moves></Moves>
                    <div className="field-points">
                        {points}
                    </div>
                    <Ball></Ball>
                </div>
            </div>
        )
    }
}

export default Game;
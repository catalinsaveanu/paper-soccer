import React, { Component } from 'react';
import {Layer, Line, Circle, Stage, Group} from 'react-konva';

import {MAIN_COLOR, GATE_W, FIELD_W, FIELD_H, BORDER_POINTS, SPACE_BETWEEN_POINTS, STROKE_W, POINTS_W, POINTS_H, MOVES_COLOR, INF, TOTAL_POINTS, P_WEIGHT} from 'utils/constants';

class Game extends Component {
    state = {
        fieldMoves: [],
        fieldPoints: new Array(99).fill(MAIN_COLOR)
    }

    edgeMatrix = [];
    vertexMatrix = [];
    turn = 0;
    cVertex = (TOTAL_POINTS - 1) / 2;

    initMoves() {
        let i = 0,
            j = 0,
            k = 0;

        for (i = 0; i < POINTS_H; i++) {
            this.vertexMatrix[i] = new Array(POINTS_W);
            for (j = 0; j < POINTS_W; j++) {
                this.vertexMatrix[i][j] = i * POINTS_W + j;
            }
        }

        console.table(this.vertexMatrix);

        for (i = 0; i < TOTAL_POINTS; i++) {
            this.edgeMatrix[i] = new Array(TOTAL_POINTS).fill(INF);
            this.edgeMatrix[i][i] = 0;
        }

        for (i = 1; i < POINTS_H - 1; i++) {
            for (j = 1; j < POINTS_W - 1; j++) {
                let nodeA = this.vertexMatrix[i][j],
                    nodeB;

                /* top and bottom */
                if (i === 1 || i === POINTS_H - 2) {
                    for (k = -1; k <= 1; k++) {
                        let direction = (i === 1) ? -1 : 1;
                        nodeB = this.vertexMatrix[i + direction][j + k];
                        this.edgeMatrix[nodeA][nodeB] = 0;
                    }
                }

                /* left and right */
                if (j === 1 || j === POINTS_W - 2) {
                    for (k = -1; k <= 1; k++) {
                        let direction = (j === 1) ? -1 : 1;
                        nodeB = this.vertexMatrix[i + k][j + direction];
                        this.edgeMatrix[nodeA][nodeB] = 0;
                    }                    
                }

                if (i > 1 && i < POINTS_H - 2 && j > 1 && j < POINTS_W - 2) {
                    for (let angle = 0; angle < 2 * Math.PI; angle += Math.PI/4) {
                        let xSign = Math.sign(Math.cos(angle) + 10 - 10),
                            ySign = Math.sign(Math.sin(angle) + 10 - 10);

                        nodeB = this.vertexMatrix[i + xSign][j + ySign];
                        this.edgeMatrix[nodeA][nodeB] = this.edgeMatrix[nodeB][nodeA] = 1;
                    }
                }
            }
        }
    }

    getVertexIndices(vertex) {
        return {
            i: Math.floor(vertex / POINTS_W),
            j: vertex % POINTS_W
        }
    }

    getPointPosition(point) {
        return {
            x: point % POINTS_W,
            y: Math.floor(point / POINTS_W)
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

        for (let i = 0; i < TOTAL_POINTS; i++) {
            for (let j = 0; j < TOTAL_POINTS; j++) {
                let d = this.edgeMatrix[i][j];

                if (d === P_WEIGHT || d === 2 * P_WEIGHT) {
                    let playerIndex = d / P_WEIGHT - 1,
                        linePoints = this.getPoints(i, j);

                    //this.changePointsColor(i, MOVES_COLOR[playerIndex]);
                    //this.changePointsColor(j, MOVES_COLOR[playerIndex]);
        
                    moves.push(<Line key={`move-${i}_${j}`} points={linePoints} stroke={MOVES_COLOR[playerIndex]} strokeWidth={STROKE_W}/>);
                }
            }
        }

        return moves;
    }

    componentDidMount() {
        this.initMoves();
        this.setState({
            fieldMoves: this.getMoves()
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
        let points = new Array(TOTAL_POINTS).fill(1);

        return points.map((value, index) => {
            const xpos = (index % POINTS_W) * SPACE_BETWEEN_POINTS,
                  ypos = Math.floor(index / POINTS_W) * SPACE_BETWEEN_POINTS;

            return <Circle ref={`point-${index}`} id={`point-${index}`} key={`point-${index}`} radius={10} fill={this.state.fieldPoints[index]} x={xpos} y={ypos}/>
        })
    }

    makeMove(from, to) {
        let initValue = this.edgeMatrix[from][to];

        this.edgeMatrix[from][to] = this.edgeMatrix[to][from] = (this.turn + 1) * P_WEIGHT;
        this.updateNeighbors(to);

        this.setState({
            fieldMoves: this.getMoves()
        });

        if (initValue !== 0) {
            this.changeTurn();
        }

        this.cVertex = to;
    }

    updateNeighbors(vertex) {
        let vertexIndices = this.getVertexIndices(vertex);

        for (let angle = 0; angle < 2 * Math.PI; angle += Math.PI/4) {
            let xSign = Math.sign(Math.cos(angle) + 10 - 10),
                ySign = Math.sign(Math.sin(angle) + 10 - 10);

            if ((vertexIndices.i + xSign) >= 0 && (vertexIndices.i + xSign) < POINTS_H) {
                let vertex2 = this.vertexMatrix[vertexIndices.i + xSign][vertexIndices.j + ySign];
                if (this.edgeMatrix[vertex][vertex2] === Infinity 
                    && vertexIndices.i + xSign > 0 && vertexIndices.i + xSign < POINTS_H - 1 
                    && vertexIndices.j + ySign > 0 && vertexIndices.j + ySign < POINTS_W - 1) {
                    this.edgeMatrix[vertex][vertex2] = this.edgeMatrix[vertex2][vertex] = 1;
                }
            }
        }   
    }

    changeTurn() {
        this.turn = (this.turn + 1) % 2;
    }

    weCanMove(from, to) {
        return (from !== to && (this.edgeMatrix[from][to] === 0 || this.edgeMatrix[from][to] === 1));
    }

    onOverPoints(e) {
        let circle = e.target,
            vertex = parseInt(circle.id().substr(6), 10);
        
        if (this.weCanMove(this.cVertex, vertex)) {
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

        if (this.weCanMove(this.cVertex, vertex)) {
            this.makeMove(this.cVertex, vertex);
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
                            <Circle ref={`point-1111`} radius={10} fill={MAIN_COLOR} x={20} y={20}/>
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
            </div>
        )
    }
}

export default Game;
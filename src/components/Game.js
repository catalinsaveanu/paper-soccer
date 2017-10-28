import React, { Component } from 'react';
import {Layer, Line, Circle, Stage, Group, Text} from 'react-konva';

import {MAIN_COLOR, GATE_W, FIELD_W, FIELD_H, BORDER_POINTS, SPACE_BETWEEN_POINTS, STROKE_W, POINTS_W, POINTS_H, MOVES_COLOR, INF, TOTAL_POINTS, P_WEIGHT} from 'utils/constants';

class Game extends Component {
    state = {
        fieldMoves: [],
        fieldPoints: new Array(99).fill(MAIN_COLOR),
        winner: ''
    }

    edgeMatrix = [];
    vertexMatrix = [];
    turn = 0;
    cVertex = (TOTAL_POINTS - 1) / 2;

    initMoves() {
        let i = 0,
            j = 0;

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

        for (i = 0; i < POINTS_H; i++) {
            for (j = 0; j < POINTS_W; j++) {
                let vertexA = this.vertexMatrix[i][j],
                    isBorderA = this.isBorder(vertexA);

                this.getVertexNeighbors(vertexA).forEach(vertexB => {
                    let isBorderB = this.isBorder(vertexB);

                    if (isBorderA && !isBorderB) {
                        this.edgeMatrix[vertexA][vertexB] = 1;
                    } else if (!isBorderA && isBorderB) {
                        this.edgeMatrix[vertexA][vertexB] = 0;
                    } else if (!isBorderA && !isBorderB) {
                        this.edgeMatrix[vertexA][vertexB] = 1;
                    } else if (isBorderA && isBorderB && Math.abs(vertexA - vertexB) >= 10) {
                        this.edgeMatrix[vertexA][vertexB] = 0;
                    }
                });
            }
        };

        console.table(this.edgeMatrix);
    }

    getVertexIndices(vertex) {
        return {
            i: Math.floor(vertex / POINTS_W),
            j: vertex % POINTS_W
        }
    }

    getVertexNeighbors(vertex) {
        let neighbors = [],
            vertexIndices = this.getVertexIndices(vertex);

        for (let angle = 0; angle < 2 * Math.PI; angle += Math.PI/4) {
            let xSign = Math.sign(Math.cos(angle) + 10 - 10),
                ySign = Math.sign(Math.sin(angle) + 10 - 10);

            if (vertexIndices.i + xSign > -1 && vertexIndices.i + xSign < POINTS_H && vertexIndices.j + ySign > -1 && vertexIndices.j + ySign < POINTS_W) {
                neighbors.push(this.vertexMatrix[vertexIndices.i + xSign][vertexIndices.j + ySign]);
            }
        }

        return neighbors;
    }

    getAvailableVertexNeighbors(vertex) {
        this.getVertexNeighbors(vertex).filter(vertexNeighbor => {
            return (this.edgeMatrix[vertex][vertexNeighbor] === 0 || this.edgeMatrix[vertex][vertexNeighbor] === 1)
        })
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

    isBorder(vertex) {
        let indices = this.getVertexIndices(vertex);
        
        return (indices.i === 0 || indices.j === 0);
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

            return (
                <Group key={`group-${index}`}>
                    <Text key={`text-${index}`} text={`${index}`} fill={`${MAIN_COLOR}`} fontSize={13} x={xpos - 7} y={ypos - 5} />
                    <Circle ref={`point-${index}`} id={`point-${index}`} key={`point-${index}`} radius={10} fill={this.state.fieldPoints[index]} x={xpos} y={ypos} opacity={0.4}/>
                </Group>
            )
        })
    }

    makeMove(fromVertex, toVertex) {
        let initValue = this.edgeMatrix[fromVertex][toVertex];

        this.edgeMatrix[fromVertex][toVertex] = this.edgeMatrix[toVertex][fromVertex] = (this.turn + 1) * P_WEIGHT;
        this.updateNeighbors(toVertex);

        this.setState({
            fieldMoves: this.getMoves()
        });

        if (initValue !== 0) {
            this.changeTurn();
        }

        this.cVertex = toVertex;

        this.checkIfGameIsOver(toVertex);

        this.logNeighbors(toVertex);
        console.table(this.edgeMatrix);
    }

    checkIfGameIsOver(vertex) {
        let isGameOver = (vertex === 44 || vertex === 54),
            winner = this.turn + 1;

        if (!isGameOver) {
            let weHaveMoves = this.getVertexNeighbors(vertex).some(vertexNeighbor => {
                return this.weCanMove(vertex, vertexNeighbor);
            });

            if (!weHaveMoves) {
                isGameOver = true;
                winner = (this.turn + 1) % 2;
            }   
            
        }

        if (isGameOver) {
            this.setState({
                winner: `Player ${winner + 1} Wins!`
            })
        }
    }

    updateNeighbors(vertex) {
        this.getVertexNeighbors(vertex).forEach(vertexNeighbor => {
            let isBorderNeighbor = this.isBorder(vertexNeighbor);

            if (!isBorderNeighbor && this.edgeMatrix[vertex][vertexNeighbor] === 1 && this.wasVisited(vertexNeighbor)) {
                this.edgeMatrix[vertex][vertexNeighbor] = this.edgeMatrix[vertexNeighbor][vertexNeighbor] = 0;
            }
        });
    }

    wasVisited(vertex) {
        return this.getVertexNeighbors(vertex).some(vertexNeighbor => {
            return this.edgeMatrix[vertex][vertexNeighbor] === P_WEIGHT || this.edgeMatrix[vertex][vertexNeighbor] === 2 * P_WEIGHT;
        });
    }

    changeTurn() {
        this.turn = (this.turn + 1) % 2;
    }

    weCanMove(fromVertex, toVertex) {
        return (fromVertex !== toVertex && (this.edgeMatrix[fromVertex][toVertex] === 0 || this.edgeMatrix[fromVertex][toVertex] === 1));
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

    logNeighbors(vertex) {
        let sortedNeighbors = this.getVertexNeighbors(vertex).sort((a, b) => a-b).map(vertexNeighbor => {
            return `${vertexNeighbor}->${this.edgeMatrix[vertex][vertexNeighbor]}`;
        });

        console.log('Vertex:', vertex);
        console.log('Neighbors:' + sortedNeighbors.join(','));
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
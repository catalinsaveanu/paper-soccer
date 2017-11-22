import Dijkstra from './Dijkstra';

const INF = Infinity,
      P_WEIGHT = 10000;

class Game {    
    constructor(width, height) {
        this._width = width;
        this._height = height;
        this._totalVertices = width * height;
        this._edgeMatrix = [];
        this._vertexMatrix = [];
        this._playerTurn = 0;
        this._cVertex = (this._totalVertices - 1) / 2;
        this._isGameOver = false;
        this._winner = '';

        this.initMatrixes();
        this.dumbAI = new Dijkstra();
    }

    get playerWeight() {
        return P_WEIGHT;
    }

    get width() {
        return this._width;
    }

    get height() {
        return this._height;
    }
    
    get totalVertices() {
        return this._totalVertices;
    }

    get playerTurn() {
        return this._playerTurn;
    }

    set playerTurn(player) {
        this._playerTurn = player;
    }

    get winner() {
        return this._winner;
    }

    get isGameOver() {
        return this._isGameOver;
    }

    get edgeMatrix() {
        return this._edgeMatrix;
    }

    get vertexMatrix() {
        return this._vertexMatrix;
    }

    get firstPlayerGoalVertex() {
        return Math.floor(this.height / 2) * this.width + this.width - 1;
    }

    get secondPlayerGoalVertex() {
        return Math.floor(this.height / 2) * this.width;
    }

    get cVertex() {
        return this._cVertex;
    }

    set cVertex(vertex) {
        this._cVertex = vertex;
    }

    
    initMatrixes() {
        let i = 0,
            j = 0;

        for (i = 0; i < this.height; i++) {
            this._vertexMatrix[i] = new Array(this.width);
            for (j = 0; j < this.width; j++) {
                this._vertexMatrix[i][j] = i * this.width + j;
            }
        }

        for (i = 0; i < this.totalVertices; i++) {
            this._edgeMatrix[i] = new Array(this.totalVertices).fill(INF);
            this._edgeMatrix[i][i] = 0;
        }

        for (i = 0; i < this.height; i++) {
            for (j = 0; j < this.width; j++) {
                let vertexA = this._vertexMatrix[i][j],
                    isBorderA = this.isBorder(vertexA),
                    neighbors = this.getVertexNeighbors(vertexA);

                for (let k = 0; k < neighbors.length; k++) {
                    let vertexB = neighbors[k],
                        isBorderB = this.isBorder(vertexB);

                    if (isBorderA && !isBorderB) {
                        this._edgeMatrix[vertexA][vertexB] = 1;
                    } else if (!isBorderA && isBorderB) {
                        this._edgeMatrix[vertexA][vertexB] = 0;
                    } else if (!isBorderA && !isBorderB) {
                        this._edgeMatrix[vertexA][vertexB] = 1;
                    } else if (isBorderA && isBorderB) {
                        let bIndices = this.getVertexIndices(vertexB);
                        if (Math.abs(i - bIndices.i) === 1 && Math.abs(j - bIndices.j) === 1)  {
                            this._edgeMatrix[vertexA][vertexB] = 0;
                        }
                    }
                };
            }
        };
    }

    isPlayerMove(i, j) {
        const d = this._edgeMatrix[i][j];

        return d === P_WEIGHT || d === 2 * P_WEIGHT;
    }

    isBorder(vertex) {
        if (vertex === this.firstPlayerGoalVertex || vertex === this.secondPlayerGoalVertex) {
            return false;
        }

        let indices = this.getVertexIndices(vertex);

        return (indices.i === 0 || indices.j === 0 || indices.i === this.height - 1 || indices.j === this.width - 1);
    }

    getPlayerFromMove(i, j) {
        const d = this._edgeMatrix[i][j];

        return d / P_WEIGHT - 1;
    }

    getVertexIndices(vertex) {
        return {
            i: Math.floor(vertex / this.width),
            j: vertex % this.width
        }
    }

    getVertexNeighbors(vertex) {
        let neighbors = [],
            vertexIndices = this.getVertexIndices(vertex);

        for (let angle = 0; angle < 2 * Math.PI; angle += Math.PI / 4) {
            let xSign = Math.sign(Math.cos(angle) + 10 - 10),
                ySign = Math.sign(Math.sin(angle) + 10 - 10);

            if (vertexIndices.i + xSign > -1 && vertexIndices.i + xSign < this.height && vertexIndices.j + ySign > -1 && vertexIndices.j + ySign < this.width) {
                neighbors.push(this._vertexMatrix[vertexIndices.i + xSign][vertexIndices.j + ySign]);
            }
        }

        return neighbors;
    }

    getAvailableVertexNeighbors(vertex) {
        this.getVertexNeighbors(vertex).filter(vertexNeighbor => {
            return (this._edgeMatrix[vertex][vertexNeighbor] === 0 || this._edgeMatrix[vertex][vertexNeighbor] === 1)
        })
    }

    makeMoveTo(toVertex) {
        this.makeMove(this.cVertex, toVertex);
    }

    makeMove(fromVertex, toVertex) {
        let initValue = this._edgeMatrix[fromVertex][toVertex];

        this._edgeMatrix[fromVertex][toVertex] = this._edgeMatrix[toVertex][fromVertex] = (this.playerTurn + 1) * P_WEIGHT;
        this.updateNeighbors(toVertex);
        this.checkIfGameIsOver(toVertex);
        
        if (initValue !== 0 && !this.isGameOver) {
            this.changeTurn();
        }

        this.cVertex = toVertex;

        //this.logNeighbors(toVertex);
    }

    getAIMoves() {
        return this.dumbAI.constructPath(this.edgeMatrix, this.totalVertices, this.cVertex, this.secondPlayerGoalVertex);
    }

    checkIfGameIsOver(vertex) {
        let isGameOver = (vertex === this.secondPlayerGoalVertex || vertex === this.firstPlayerGoalVertex);

        if (!isGameOver) {
            let weHaveMoves = this.getVertexNeighbors(vertex).some(vertexNeighbor => {
                return this.weCanMove(vertex, vertexNeighbor);
            });

            if (!weHaveMoves) {
                isGameOver = true;
                this.changeTurn();
            }
        }

        if (isGameOver) {
            this._winner = this.playerTurn;
        } else {
            this._winner = '';
        }

        this._isGameOver = isGameOver;
    }

    updateNeighbors(vertex) {
        this.getVertexNeighbors(vertex).forEach(vertexNeighbor => {
            let isBorderNeighbor = this.isBorder(vertexNeighbor);

            if (!isBorderNeighbor && this._edgeMatrix[vertex][vertexNeighbor] === 1 && this.wasVisited(vertexNeighbor)) {
                this._edgeMatrix[vertex][vertexNeighbor] = this._edgeMatrix[vertexNeighbor][vertexNeighbor] = 0;
            }
        });
    }

    wasVisited(vertex) {
        return this.getVertexNeighbors(vertex).some(vertexNeighbor => {
            return this._edgeMatrix[vertex][vertexNeighbor] === P_WEIGHT || this._edgeMatrix[vertex][vertexNeighbor] === 2 * P_WEIGHT;
        });
    }

    changeTurn() {
        this.playerTurn = (this.playerTurn + 1) % 2;
    }

    weCanMove(fromVertex, toVertex) {
        return (fromVertex !== toVertex && (this._edgeMatrix[fromVertex][toVertex] === 0 || this._edgeMatrix[fromVertex][toVertex] === 1));
    }

    weCanMoveTo(toVertex) {
        return this.weCanMove(this.cVertex, toVertex);
    }

    restart() {
        this._edgeMatrix = [];
        this._vertexMatrix = [];
        this._playerTurn = 0;
        this._cVertex = (this._totalVertices - 1) / 2;
        this._isGameOver = false;
        this._winner = '';

        this.initMatrixes();        
    }

    logNeighbors(vertex) {
        let sortedNeighbors = this.getVertexNeighbors(vertex).sort((a, b) => a - b).map(vertexNeighbor => {
            return `${vertexNeighbor}->${this._edgeMatrix[vertex][vertexNeighbor]}`;
        });

        console.log('Vertex:', vertex);
        console.log('Neighbors:' + sortedNeighbors.join(','));
    }
}

export default Game;
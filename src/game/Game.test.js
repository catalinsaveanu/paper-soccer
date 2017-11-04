import Game from './Game';

const width = 11;
const height = 9;

describe('Game constructor', () => {
    it('should initiate edgeMatrix with the width and height passed', () => {
        const game = new Game(width, height);

        expect(game.edgeMatrix).toHaveLength(width * height);
    })

    it('should initiate vertexMatrix with the width and height passed', () => {
        const game = new Game(width, height);

        expect(game.vertexMatrix).toHaveLength(height);
        game.vertexMatrix.forEach(el => {
            expect(el).toHaveLength(width);
        })
    })
})

describe('Game border detection', () => {
    const game = new Game(width, height);

    it('should detect if the vertex is in the border line', () => {
        let i;

        for (i = 0; i < width; i++) {
            expect(game.isBorder(i)).toBeTruthy();
            expect(game.isBorder(width * (height - 1) + i)).toBeTruthy();
        }

        for (i = 0; i < height; i++) {
            expect(game.isBorder(i * width)).toBeTruthy();
            expect(game.isBorder(i * width + width - 1)).toBeTruthy();
        }

    })
});

describe('Game moves', () => {
    it('should move from startVertex to endVertex', () => {
        const game = new Game(width, height);

        game.playerTurn = 0;
        game.makeMove(49, 48);
        expect(game.edgeMatrix[49][48]).toBe(game.playerWeight);
    });

    it ('should change player turn', () => {
        const game = new Game(width, height);

        game.playerTurn = 0;
        game.makeMove(49, 48);
        expect(game.playerTurn).toBe(1);
    });

    it('should not change player turn', () => {
        const game = new Game(width, height);

        game.playerTurn = 0;
        game.makeMove(82, 93);
        expect(game.playerTurn).toBe(0);
    });

    it ('should detect if we can move to the vertex', () => {
        const game = new Game(width, height);

        game.playerTurn = 0;
        expect(game.weCanMove(87, 76)).toBeFalsy();
    });
})
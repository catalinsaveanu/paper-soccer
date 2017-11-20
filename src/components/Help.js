import React, { PureComponent } from 'react';

class Help extends PureComponent {
    render() {
        return(
            <div className="help-modal">
                <div className="help">
                    <div className="help-title flex-0">
                        <h1 className="flex-1">Help</h1>
                        <button className="close-button" onClick={e => this.props.history.goBack()}>X</button>
                    </div>
                    <div className="help-container">
                        <h2>Paper Soccer</h2>
                        <p>This is a pencil - and - paper version of the game soccer.Two players compete to get the ball into the opposing player's goal, winning the game. There are two fields per page.</p>
                        <h2>How to play:</h2>
                        <p>The ball starts at the center of the field(marked by a small circle).</p>
                        <p>On your turn, draw a line segment from the ball's current position, along the edge or diagonal of a square to the next intersection. You may not draw along an edge or diagonal that has already been drawn. (You may, however, cross an existing diagonal).</p>
                        <p>If this is the first time the ball has reached that intersection, then the ball stops there, and the next player takes their turn.</p>
                        <p>If the ball has already been at that intersection, then the ball bounces—you must take another turn, drawing another line.The ball keeps bouncing until it reaches an intersection that it has never been at before.</p>
                        <p>If the ball reaches the opposing player's net, then you score a point.</p>
                        <h2>Special Rules:</h2>
                        <p>When the ball reaches the edge of the field, marked by a heavier line, it always bounces.You may not move along the edge of the field.</p>
                        <p>If you reach a position where you can't make a valid play, then the opposing player wins the game.</p>
                    </div>
                </div>
            </div>
        )
    }
}

export default Help;
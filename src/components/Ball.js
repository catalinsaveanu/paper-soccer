import React, {Component} from 'react';
import { Image } from 'react-konva';
import { BALL_W } from '../utils/constants';

class Ball extends Component{
    state = {
        image: null
    }
    componentDidMount() {
        const image = new window.Image();
        image.src = require('../images/ball.svg');
        image.onload = () => {
            this.setState({
                image: image
            });
        }
    }

    render() {
        return (
            <Image id="ballImg"
                width={BALL_W}
                height={BALL_W}
                image={this.state.image}
                offset={{x: BALL_W / 2, y: BALL_W / 2}}
            />
        );
    }
}

export default Ball;
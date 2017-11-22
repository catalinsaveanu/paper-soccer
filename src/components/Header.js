import React, { PureComponent } from 'react';
import LinkButton from './common/LinkButton';

class Header extends PureComponent {
    getHelpRoute() {
        return this.props.location.pathname + '/help' + this.props.location.hash;
    }

    getFirstPlayerName() {
        return (this.props.opponent === 'human' && this.props.player === 1 ? 'Opponent': 'Player');
    }

    getSecondPlayerName() {
        if (this.props.opponent !== 'human') {
            return 'Computer';
        }

        return (this.props.player === 0 ? 'Opponent' : 'Player');
    }

    render() {
        return (
            <div className="header">
                <div className="flex-1 middle-border">
                </div>
                <div className="flex-0">
                    <div className={`player-name player-1 ${this.props.cTurn === 0 ? 'active' : ''}`}>{this.getFirstPlayerName()}</div>
                    <div className="vs">vs</div>
                    <div className={`player-name player-2 ${this.props.cTurn === 1 ? 'active' : ''}`}>{this.getSecondPlayerName()}</div>
                </div>
                <div className="flex-1 middle-border header-right">
                    <LinkButton url='/'>Menu</LinkButton>
                    <LinkButton url={this.getHelpRoute()}>Help</LinkButton>
                </div>
            </div>
        )
    }
}

export default Header;
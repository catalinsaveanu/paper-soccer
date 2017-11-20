import React, { PureComponent } from 'react';
import LinkButton from './common/LinkButton';

class Header extends PureComponent {
    getHelpRoute() {
        return this.props.location.pathname + '/help' + this.props.location.hash;
    }

    render() {
        return (
            <div className="header">
                <div className="flex-1 middle-border">
                </div>
                <div className="flex-0">
                    <div className={`player-name player-1 ${this.props.cTurn === 0 ? 'active' : ''}`}>Player 1</div>
                    <div className="vs">vs</div>
                    <div className={`player-name player-2 ${this.props.cTurn === 1 ? 'active' : ''}`}>Player 2</div>
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
import React, {PureComponent} from 'react';
import {Link} from 'react-router-dom';

export default class LinkButton extends PureComponent {
    render() {
        return (
            <Link className="link-button" to={this.props.url} onClick={this.props.onClick}>
                {this.props.children}
            </Link>
        )
    }
}
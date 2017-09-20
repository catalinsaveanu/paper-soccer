import React, {PureComponent} from 'react';
import {Link} from 'react-router-dom';

export default class LinkButton extends PureComponent {
    render() {
        return (
            <Link className="link-button" to={this.props.url}>
                {this.props.children}
            </Link>
        )
    }
}
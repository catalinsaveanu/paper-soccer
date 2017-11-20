import React from 'react';
import LinkButton from './common/LinkButton';

const Home = () => {
    return (
        <div className="home">
            <LinkButton url="/game/dumb-ai">Play vs dumb ai</LinkButton>
            <LinkButton url="/game/human">Play vs human</LinkButton>
            <LinkButton url="/help">Help</LinkButton>
        </div>
    )
}

export default Home;
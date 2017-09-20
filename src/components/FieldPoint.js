import React from 'react';

const FieldPoint = (props) => {
    return (
        <div id={`point-${props.index}`} className="field-point" onClick={(e) => props.clickedPoint(e.target, props.index)}></div>
    )
}

export default FieldPoint;
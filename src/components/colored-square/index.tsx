import React from "react";
import { Color } from "../../app";

import "./index.scss";

const ColoredSquare: React.FC<{
    color: Color;
    default?: boolean;
    onRemoveColorCallback?: (color: string) => void;
}> = (props) => {
    function onRemoveClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        if (!props.onRemoveColorCallback) return;
        props.onRemoveColorCallback(props.color.color);
    }

    return (
        <div className="colored-square">
            <div className="square" style={{ backgroundColor: props.color.color }}></div>
            <div className="colored-square-footer">
                <h5 style={{ color: props.color.color }}>{props.color.color}</h5>
                {props.color.default ? null : (
                    <button className="delete-btn delete-btn-hover" onClick={onRemoveClick}>
                        x
                    </button>
                )}
            </div>
        </div>
    );
};

export default ColoredSquare;

import React, { useState, useEffect } from "react";

import Container from "./components/container";

export interface Color {
    color: string;
    default: boolean;
}
const COLORS_TAG = "COLORS";

function App() {
    const [colors, setColors] = useState<Color[]>([]);

    function onAddColor(color: string) {
        const currentColors = [...colors, { color, default: false }];
        setColors(currentColors);
        localStorage.setItem(COLORS_TAG, JSON.stringify(currentColors.map((c) => c.color)));
    }
    function onRemoveColor(color: string) {
        const currentColors = [...colors].filter((c) => c.color !== color);
        setColors(currentColors);
        localStorage.setItem(COLORS_TAG, JSON.stringify(currentColors.map((c) => c.color)));
    }

    useEffect(() => {
        const rawSavedColors = localStorage.getItem(COLORS_TAG);
        if (!rawSavedColors) {
            setColors([]);
        } else {
            const savedColors = JSON.parse(rawSavedColors);
            setColors(
                savedColors.map((c: string) => {
                    return { color: c, default: false };
                })
            );
        }
    }, []);

    return (
        <div className="App">
            <Container colors={colors} onAddColorCallback={onAddColor} onRemoveColorCallback={onRemoveColor} />
        </div>
    );
}

export default App;

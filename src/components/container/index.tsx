import React, { useState } from "react";
import ColoredSquare from "../colored-square";

import DefaultColors from "../../assets/default-colors";
import { Color } from "../../app";

import "./index.scss";
import { useEffect } from "react";

interface RGB {
    r: number;
    g: number;
    b: number;
}
interface HSL {
    h: number;
    s: number;
    l: number;
}

const Container: React.FC<{
    colors: Color[];
    onAddColorCallback: (color: string) => void;
    onRemoveColorCallback: (color: string) => void;
}> = (props) => {
    const [filteredColors, setFilteredColors] = useState<Color[]>([]);
    const [colorInput, setColorInput] = useState<string>("");
    const [filters, setFilters] = useState<{
        redgt50: number;
        greengt50: number;
        bluegt50: number;
        saturationgt50: number;
    }>({
        redgt50: 0,
        greengt50: 0,
        bluegt50: 0,
        saturationgt50: 0,
    });

    useEffect(() => {
        setFilteredColors(
            props.colors.concat(
                DefaultColors.map((c: string): Color => {
                    return { color: c, default: true };
                })
            )
        );
    }, [props.colors]);

    useEffect(() => {
        let currentFilteredColors = props.colors.concat(
            DefaultColors.map((c: string): Color => {
                return { color: c, default: true };
            })
        );

        if (filters.redgt50) {
            currentFilteredColors = currentFilteredColors.filter((c) => {
                const rgb = hexToRgb(c.color);
                if (!rgb) return false;
                if (rgb.r > 127) return true;
                return false;
            });
        }

        if (filters.bluegt50) {
            currentFilteredColors = currentFilteredColors.filter((c) => {
                const rgb = hexToRgb(c.color);
                if (!rgb) return false;
                if (rgb.b > 127) return true;
                return false;
            });
        }

        if (filters.saturationgt50) {
            currentFilteredColors = currentFilteredColors.filter((c) => {
                const rgb = hexToHSL(c.color);
                if (!rgb) return false;
                if (rgb.s > 50.0) return true;
                return false;
            });
        }

        setFilteredColors(currentFilteredColors);
    }, [filters]);

    function onColorInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        e.preventDefault();

        // BACKSPACE
        if (colorInput.length > e.target.value.length) {
            setColorInput(e.target.value);
            return;
        }

        // CHECK FIRST INPUT
        if (colorInput.length === 0 && e.target.value !== "#") {
            return;
        }

        // VALIDATE HEX
        if (colorInput.length > 0) {
            const inputWithoutHashtag = e.target.value.substring(1, e.target.value.length);
            if (!/^[0-9a-f]+$/.test(inputWithoutHashtag)) {
                return;
            }
        }

        if (e.target.value.length > 7) {
            return;
        }

        setColorInput(e.target.value);
    }
    function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (isColorValid(colorInput)) {
            props.onAddColorCallback(colorInput);
            setColorInput("");
        }
    }
    function isColorValid(color: string) {
        return /^#[0-9A-F]{6}$/i.test(color);
    }
    function onFilterChange(color: string, value: boolean) {
        if (color === "red") {
            setFilters({
                ...filters,
                redgt50: value ? 1 : 0,
            });
        }
        if (color === "green") {
            setFilters({
                ...filters,
                greengt50: value ? 1 : 0,
            });
        }
        if (color === "blue") {
            setFilters({
                ...filters,
                bluegt50: value ? 1 : 0,
            });
        }
        if (color === "saturation") {
            setFilters({
                ...filters,
                saturationgt50: value ? 1 : 0,
            });
        }
    }
    function hexToRgb(hexColor: string): RGB | null {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);
        return result
            ? {
                  r: parseInt(result[1], 16),
                  g: parseInt(result[2], 16),
                  b: parseInt(result[3], 16),
              }
            : null;
    }
    function hexToHSL(hexColor: string): HSL | null {
        const rgb = hexToRgb(hexColor);
        if (!rgb) return null;

        // RGB to HSL
        rgb.r /= 255;
        rgb.g /= 255;
        rgb.b /= 255;
        let cmin = Math.min(rgb.r, rgb.g, rgb.b),
            cmax = Math.max(rgb.r, rgb.g, rgb.b),
            delta = cmax - cmin,
            h = 0,
            s = 0,
            l = 0;

        if (delta === 0) h = 0;
        else if (cmax === rgb.r) h = ((rgb.g - rgb.b) / delta) % 6;
        else if (cmax === rgb.g) h = (rgb.b - rgb.r) / delta + 2;
        else h = (rgb.r - rgb.g) / delta + 4;

        h = Math.round(h * 60);

        if (h < 0) h += 360;

        l = (cmax + cmin) / 2;
        s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
        s = +(s * 100).toFixed(1);
        l = +(l * 100).toFixed(1);

        return { h, s, l };
    }

    return (
        <div id="main-container">
            <div id="main-container-header">
                <form className="input-color-form" onSubmit={onSubmit}>
                    <label>
                        Add new color <input type="text" value={colorInput} onChange={onColorInputChange} />
                    </label>
                    <button type="submit">Add</button>
                </form>
            </div>
            <div id="main-container-content">
                <div id="squares-filter-container">
                    <label className="container">
                        <input
                            type="checkbox"
                            value={filters.redgt50}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFilterChange("red", e.target.checked)}
                        />
                        <span className="checkmark"></span>
                        {"Red>50%"}
                    </label>
                    <label className="container">
                        <input
                            type="checkbox"
                            value={filters.greengt50}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFilterChange("green", e.target.checked)}
                        />
                        <span className="checkmark"></span>
                        {"Green>50%"}
                    </label>
                    <label className="container">
                        <input
                            type="checkbox"
                            value={filters.bluegt50}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFilterChange("blue", e.target.checked)}
                        />
                        <span className="checkmark"></span>
                        {"Blue>50%"}
                    </label>
                    <label className="container">
                        <input
                            type="checkbox"
                            value={filters.saturationgt50}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFilterChange("saturation", e.target.checked)}
                        />
                        <span className="checkmark"></span>
                        {"saturation > 50%"}
                    </label>
                </div>
                <div id="squares-container">
                    {filteredColors.map((c, i) => {
                        return <ColoredSquare key={i} color={c} default onRemoveColorCallback={props.onRemoveColorCallback} />;
                    })}
                </div>
            </div>
        </div>
    );
};

export default Container;

/** File to store random utility functions */

/** Calculate delta between 0 and 1 based on arbitrary min/max/current */
export function calculateDelta(min: number, max: number, value: number) {
    const area = max - min;
    return (value - min) / area;
}

export const MAIN_COLOR = '#00ffff';
export const PLAYER_COLOR = '#99fe00';
export const OPPONENT_COLOR = '#ff0065';
export const GATE_W = 60;
export const FIELD_W = 820;
export const FIELD_H = 560;
export const SPACE_BETWEEN_POINTS = 70;
export const STROKE_W = 4;
export const POINTS_W = 11;
export const POINTS_H = 9;

export const BORDER_POINTS = [
    GATE_W, STROKE_W / 2, 
    FIELD_W - GATE_W, STROKE_W /2,
    FIELD_W - GATE_W, FIELD_H / 2 - SPACE_BETWEEN_POINTS,
    FIELD_W - STROKE_W / 2, FIELD_H / 2 - SPACE_BETWEEN_POINTS,
    FIELD_W - STROKE_W / 2, FIELD_H / 2 + SPACE_BETWEEN_POINTS,
    FIELD_W - GATE_W, FIELD_H / 2 + SPACE_BETWEEN_POINTS,
    FIELD_W - GATE_W, FIELD_H - STROKE_W / 2,
    GATE_W, FIELD_H - STROKE_W / 2, 
    GATE_W, FIELD_H / 2 + SPACE_BETWEEN_POINTS, 
    STROKE_W / 2, FIELD_H / 2 + SPACE_BETWEEN_POINTS, 
    STROKE_W / 2, FIELD_H / 2 - SPACE_BETWEEN_POINTS, 
    GATE_W, FIELD_H / 2 - SPACE_BETWEEN_POINTS,
    GATE_W, STROKE_W / 2 
];
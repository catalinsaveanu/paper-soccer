export const MAIN_COLOR = '#53defb';
export const PLAYER_COLOR = '#99fe00';
export const OPPONENT_COLOR = '#ff0065';
export const MOVES_COLOR = [PLAYER_COLOR, OPPONENT_COLOR];
export const GATE_W = 60;
export const BALL_W = 32;
export const SPACE_BETWEEN_POINTS = 70;
export const STROKE_W = 4;
export const POINTS_W = 11;
export const POINTS_H = 9;
export const FIELD_W = (POINTS_W - 1) * SPACE_BETWEEN_POINTS + 2 * GATE_W;
export const FIELD_H = (POINTS_H - 1) * SPACE_BETWEEN_POINTS;
export const TOTAL_POINTS = POINTS_W * POINTS_H;
export const INF = Infinity;
export const P_WEIGHT = 10000;

export const BORDER_POINTS = [
    GATE_W, 0, 
    FIELD_W - GATE_W, 0,
    FIELD_W - GATE_W, FIELD_H / 2 - SPACE_BETWEEN_POINTS,
    FIELD_W - STROKE_W / 2, FIELD_H / 2 - SPACE_BETWEEN_POINTS,
    FIELD_W - STROKE_W / 2, FIELD_H / 2 + SPACE_BETWEEN_POINTS,
    FIELD_W - GATE_W, FIELD_H / 2 + SPACE_BETWEEN_POINTS,
    FIELD_W - GATE_W, FIELD_H,
    GATE_W, FIELD_H,
    GATE_W, FIELD_H / 2 + SPACE_BETWEEN_POINTS, 
    STROKE_W / 2, FIELD_H / 2 + SPACE_BETWEEN_POINTS, 
    STROKE_W / 2, FIELD_H / 2 - SPACE_BETWEEN_POINTS, 
    GATE_W, FIELD_H / 2 - SPACE_BETWEEN_POINTS,
    GATE_W, STROKE_W / 2 
];
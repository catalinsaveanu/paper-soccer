import {TIME_STAMP} from 'actions';

const timeReducer = (state = {}, action) => {
    switch (action.type) {
        case TIME_STAMP:
            return state;
        default:
            return state;
    }
}

export default timeReducer;
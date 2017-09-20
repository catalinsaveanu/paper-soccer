import { combineReducers } from 'redux';
import TimeReducer from 'TimeReducer';

const allReducers = combineReducers({
    timeStamp: TimeReducer
})

export default allReducers;
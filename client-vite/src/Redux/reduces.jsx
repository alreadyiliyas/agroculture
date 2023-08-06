import { SET_IS_AUTH, SET_USER, SET_USER_ROLE } from "./actions";

const initialState = {
    isAuth: false,
    user: {},
    userRole: '',
    id: 0,
    record: {},
};

export default function userReducer(state = initialState, action) {
    switch (action.type) {
        case SET_IS_AUTH:
            return {
                ...state,
                isAuth: action.payload,
            };
        case SET_USER:
            return {
                ...state,
                user: action.payload,
            };
        case SET_USER_ROLE:
            return {
                ...state,
                userRole: action.payload,
            }
        default:
            return state;
    }
}
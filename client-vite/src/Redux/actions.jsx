export const SET_IS_AUTH = "SET_IS_AUTH";
export const SET_USER = "SET_USER";
export const SET_USER_ROLE = "SET_USER_ROLE"
// action creators
export function setIsAuth(bool) {
    return {
        type: SET_IS_AUTH,
        payload: bool,
    };
}
export function setUser(user) {
    return { type: SET_USER, payload: user };
}

export function setUserRole(userRole){
    return { type: SET_USER_ROLE, payload: userRole}
}



const INITIAL_STATE = {
  authUser: null,
};

function sessionReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "AUTH_USER_SET":
      return { ...state, authUser: action.authUser };
    case "DELETE_AUTH_USER":
      return { ...state, authUser: null };
    default: return state;
  }
}

export default sessionReducer;
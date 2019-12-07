import axios from "axios";
// INITIAL STATE \\
const initialState = {
  isAdmin: false,
  userInfo: { results: [] },
  loading: false,
  username:''
};

// ACTION CONSTANTS \\
const SET_USERNAME = "SET_USERNAME";
// const RESET = "RESET";
const GET_USER = "GET_USER";
// ACTION BUILDERS \\
export const setUsername = username => {
  // console.log(username);
  
  return {
    type: SET_USERNAME,
    payload: username
  };
};

export function getUser(id) {
  let userPromise = axios.get(`/api/user/${id}`).then(res => {
    return (res.data, "hi");
  });
  console.log('hit', id);
  
  return {
    type: GET_USER,
    payload: userPromise
  };
}

// export function reSet() {
//   return {
//     type: RESET,
//     payload: initialState
//   };
// }
// REDUCER \\

function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_USERNAME:
      return { ...state, username: action.payload };
    // case reSet:
    //   return { ...initialState };
    case GET_USER + "_PENDING":
      return { ...state, loading: true };
    case GET_USER + "_REJECTED":
      return { ...state, loading: false };
    case GET_USER + "_FULFILLED":
      return { ...state, loading: false, userInfo: action.payload };
    default:
      return state;
  }
}

export default reducer;

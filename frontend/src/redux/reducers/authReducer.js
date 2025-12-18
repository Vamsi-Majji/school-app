const initialState = {
  token: localStorage.getItem('token') || null,
  user: JSON.parse(localStorage.getItem('user')) || null,
  isAuthenticated: !!(localStorage.getItem('token')),
  error: null,
  loading: false,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN_REQUEST':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      const token = action.payload.token || 'dummy-token';
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('token', token);
      return { ...state, loading: false, token, user: action.payload.user, isAuthenticated: true };
    case 'LOGIN_FAILURE':
      return { ...state, loading: false, error: typeof action.payload === 'string' ? action.payload : 'Login failed' };
    case 'LOGOUT':
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return { ...state, isAuthenticated: false, token: null, user: null };
    default:
      return state;
  }
};

export const loginRequest = (credentials) => ({ type: 'LOGIN_REQUEST', payload: credentials });
export const loginSuccess = (token) => ({ type: 'LOGIN_SUCCESS', payload: token });
export const loginFailure = (error) => ({ type: 'LOGIN_FAILURE', payload: error });

export default authReducer;

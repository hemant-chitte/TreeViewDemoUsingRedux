import {
  GET_REPOSITORIES,
  REPOSITORIES_ERROR,
  GET_PULL_REQUESTS,
  PULL_REQUESTS_ERROR,
  GET_COMMITS,
  COMMITS_ERROR
} from '../actions/types';

// initial state defined for all objects
const initialState = {
  repositories: [],
  pullRequets: {},
  commits: {},
  loading: true,
  error: {}
};

function repositoryReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_REPOSITORIES:
      return {
        ...state,
        repositories: payload,
        loading: false
      };
    case GET_PULL_REQUESTS:
      return {
        ...state,
        pullRequets: payload,
        loading:false
      };
      case GET_COMMITS:
      return {
        ...state,
        commits: payload,
        loading:false
      };
    case REPOSITORIES_ERROR:
      return {
        ...state,
        error: payload,
        repositories: [],
        loading:false
      };
      case PULL_REQUESTS_ERROR:
        return {
          ...state,
          error: payload,
          pullRequets: [],
          loading:false
        };
    case COMMITS_ERROR:
      return {
        ...state,
        error: payload,
        commits: [],
        loading:false
      };
    default:
      return state;
  }
}

export default repositoryReducer;

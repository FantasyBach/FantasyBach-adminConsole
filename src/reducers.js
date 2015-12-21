import _ from 'lodash'
import { combineReducers } from 'redux'
import update from 'react/lib/update'
import {
    FETCH_FB_ACCEESS_TOKEN, FETCH_FB_ACCEESS_TOKEN_STATUS,
    LOGIN, LOGIN_STATUS,
    FETCH_CONTESTANTS, FETCH_CONTESTANTS_STATUS,
    FETCH_CONTESTANT, FETCH_CONTESTANT_STATUS,
    FETCH_ROLES, FETCH_ROLES_STATUS,
    FETCH_ROUNDS, FETCH_ROUNDS_STATUS,
    FETCH_ROUND, FETCH_ROUND_STATUS,
    ADD_ROSE, ADD_ROSE_STATUS,
    UPDATE_ACTION, UPDATE_ACTION_STATUS,
    SELECT_ROUND,
    ELIMINATE_CONTESTANT, ELIMINATE_CONTESTANT_STATUS,
    PREPARE_ROUND, PREPARE_ROUND_STATUS,
    UPDATE_SCORES, UPDATE_SCORES_STATUS } from './actions'

function scores(state = { isUpdating : false }, action) {
    switch (action.type) {
        case UPDATE_SCORES:
            switch (action.status) {
                case UPDATE_SCORES_STATUS.UPDATING:
                    return Object.assign({}, state, {
                        isUpdating : true
                    });
                case UPDATE_SCORES_STATUS.UPDATED:
                    return Object.assign({}, state, {
                        isUpdating : false
                    });
                case UPDATE_SCORES_STATUS.ERROR:
                    return Object.assign({}, state, {
                        isUpdating : false,
                        error : action.error
                    });
            }
            return state;
        default:
            return state;
    }
}

function accessToken(state = { isFetchingSdk : false, isFetchingAccessToken : false, fetchedSdk : false, fetchedAccessToken : false }, action) {
    switch (action.type) {
        case FETCH_FB_ACCEESS_TOKEN:
            switch (action.status) {
                case FETCH_FB_ACCEESS_TOKEN_STATUS.FETCHING_SDK:
                    return Object.assign({}, state, {
                        isFetchingSdk : true
                    });
                case FETCH_FB_ACCEESS_TOKEN_STATUS.FETCHED_SDK:
                    return Object.assign({}, state, {
                        isFetchingSdk : false,
                        fetchedSdk : true
                    });
                case FETCH_FB_ACCEESS_TOKEN_STATUS.FETCHING_ACCESS_TOKEN:
                    return Object.assign({}, state, {
                        isFetchingAccessToken : true
                    });
                case FETCH_FB_ACCEESS_TOKEN_STATUS.FETCHED_ACCESS_TOKEN:
                    return Object.assign({}, state, {
                        isFetchingAccessToken : false,
                        fetchedAccessToken : true,
                        accessToken : action.accessToken
                    })
            }
            return state;
        default:
            return state;
    }
}

function login(state = { isLoggingIn : false, isLoggedIn : false }, action) {
    switch (action.type) {
        case LOGIN:
            switch (action.status) {
                case LOGIN_STATUS.LOGGING_IN:
                    return Object.assign({}, state, {
                        isLoggingIn : true
                    });
                case LOGIN_STATUS.LOGGED_IN:
                    return Object.assign({}, state, {
                        isLoggingIn : false,
                        isLoggedIn : true,
                        loginError : null,
                        userId : action.userId
                    });
                case LOGIN_STATUS.LOGIN_ERROR:
                    return Object.assign({}, state, {
                        isLoggingIn : false,
                        isLoggedIn : false,
                        loginError : action.error,
                        userId : null
                    });
            }
            return state;
        default:
            return state;
    }
}

function contestants(state = { isFetching : false, isFetched : false, contestants : [] }, action) {
    var contestantIndex;
    switch (action.type) {
        case FETCH_CONTESTANTS:
            switch (action.status) {
                case FETCH_CONTESTANTS_STATUS.FETCHING:
                    return Object.assign({}, state, {
                        isFetching : true
                    });
                case FETCH_CONTESTANTS_STATUS.FETCHED:
                    return Object.assign({}, state, {
                        isFetching : false,
                        isFetched : true,
                        loginError : null,
                        contestants : action.contestants
                    });
                case FETCH_CONTESTANTS_STATUS.ERROR:
                    return Object.assign({}, state, {
                        isFetching : false,
                        isFetched : false,
                        loginError : action.error,
                        contestants : null
                    });
            }
            return state;
        case FETCH_CONTESTANT:
            contestantIndex = _.findIndex(state.contestants, 'id', action.contestant.id);
            switch(action.status) {
                case FETCH_CONTESTANT_STATUS.FETCHING:
                    return update(state, {
                        contestants : {
                            [contestantIndex] : {
                                isFetching : { $set : true }
                            }
                        }
                    });
                case FETCH_CONTESTANT_STATUS.FETCHED:
                    return update(state, {
                        contestants : {
                            [contestantIndex] : {
                                $set : action.contestant
                            }
                        }
                    });
                case FETCH_CONTESTANT_STATUS.ERROR:
                    return update(state, {
                        contestants : {
                            [contestantIndex] : {
                                isFetching : { $set : false },
                                error : { $set : action.error }
                            }
                        }
                    });
            }
            return state;
        case ADD_ROSE:
            contestantIndex = _.findIndex(state.contestants, 'id', action.contestant.id);
            switch(action.status) {
                case ADD_ROSE_STATUS.ADDING:
                    return update(state, {
                        contestants : {
                            [contestantIndex] : {
                                isUpdating : { $set : true }
                            }
                        }
                    });
                case ADD_ROSE_STATUS.ADDED:
                    return update(state, {
                        contestants : {
                            [contestantIndex] : {
                                isUpdating : { $set : false }
                            }
                        }
                    });
                case ADD_ROSE_STATUS.ERROR:
                    return update(state, {
                        contestants : {
                            [contestantIndex] : {
                                isUpdating : { $set : false },
                                error : { $set : action.error }
                            }
                        }
                    });
            }
            return state;
        case UPDATE_ACTION:
            contestantIndex = _.findIndex(state.contestants, 'id', action.contestant.id);
            switch(action.status) {
                case UPDATE_ACTION_STATUS.UPDATING:
                    return update(state, {
                        contestants : {
                            [contestantIndex] : {
                                isUpdating : { $set : true }
                            }
                        }
                    });
                case UPDATE_ACTION_STATUS.UPDATED:
                    return update(state, {
                        contestants : {
                            [contestantIndex] : {
                                isUpdating : { $set : false }
                            }
                        }
                    });
                case UPDATE_ACTION_STATUS.ERROR:
                    return update(state, {
                        contestants : {
                            [contestantIndex] : {
                                isUpdating : { $set : false },
                                error : { $set : action.error }
                            }
                        }
                    });
            }
            return state;
        case ELIMINATE_CONTESTANT:
            contestantIndex = _.findIndex(state.contestants, 'id', action.contestant.id);
            switch(action.status) {
                case ELIMINATE_CONTESTANT_STATUS.ELIMINATING:
                    return update(state, {
                        contestants : {
                            [contestantIndex] : {
                                isUpdating : { $set : true }
                            }
                        }
                    });
                case ELIMINATE_CONTESTANT_STATUS.ELIMINATED:
                    return update(state, {
                        contestants : {
                            [contestantIndex] : {
                                isUpdating : { $set : false }
                            }
                        }
                    });
                case ELIMINATE_CONTESTANT_STATUS.ERROR:
                    return update(state, {
                        contestants : {
                            [contestantIndex] : {
                                isUpdating : { $set : false },
                                error : { $set : action.error }
                            }
                        }
                    });
            }
            return state;
        default:
            return state;
    }
}

function roles(state = { isFetching : false, isFetched : false, roles : [] }, action) {
    switch (action.type) {
        case FETCH_ROLES:
            switch (action.status) {
                case FETCH_ROLES_STATUS.FETCHING:
                    return Object.assign({}, state, {
                        isFetching : true
                    });
                case FETCH_ROLES_STATUS.FETCHED:
                    return Object.assign({}, state, {
                        isFetching : false,
                        isFetched : true,
                        loginError : null,
                        roles : action.roles
                    });
                case FETCH_ROLES_STATUS.ERROR:
                    return Object.assign({}, state, {
                        isFetching : false,
                        isFetched : false,
                        loginError : action.error,
                        roles : null
                    });
            }
            return state;
        default:
            return state;
    }
}

function rounds(state = { isFetching : false, isFetched : false, rounds : [] }, action) {
    switch (action.type) {
        case FETCH_ROUNDS:
            switch (action.status) {
                case FETCH_ROUNDS_STATUS.FETCHING:
                    return Object.assign({}, state, {
                        isFetching : true
                    });
                case FETCH_ROUNDS_STATUS.FETCHED:
                    return Object.assign({}, state, {
                        isFetching : false,
                        isFetched : true,
                        loginError : null,
                        rounds : action.rounds
                    });
                case FETCH_ROUNDS_STATUS.ERROR:
                    return Object.assign({}, state, {
                        isFetching : false,
                        isFetched : false,
                        loginError : action.error,
                        rounds : null
                    });
            }
            return state;
        case FETCH_ROUND:
            var roundIndex = _.findIndex(state.rounds, 'id', action.round.id);
            switch(action.status) {
                case FETCH_ROUND_STATUS.FETCHING:
                    return update(state, {
                        rounds : {
                            [roundIndex] : {
                                isFetching : { $set : true }
                            }
                        }
                    });
                case FETCH_ROUND_STATUS.FETCHED:
                    return update(state, {
                        rounds : {
                            [roundIndex] : {
                                $set : action.round
                            }
                        }
                    });
                case FETCH_ROUND_STATUS.ERROR:
                    return update(state, {
                        rounds : {
                            [roundIndex] : {
                                isFetching : { $set : false },
                                error : { $set : action.error }
                            }
                        }
                    });
            }
            return state;
        case PREPARE_ROUND:
            roundIndex = _.findIndex(state.rounds, 'id', action.round.id);
            switch (action.status) {
                case PREPARE_ROUND_STATUS.PREPARING:
                    return update(state, {
                        rounds : {
                            [roundIndex] : {
                                isUpdating : { $set : true }
                            }
                        }
                    });
                case PREPARE_ROUND_STATUS.PREPARED:
                    return update(state, {
                        rounds : {
                            [roundIndex] : {
                                isUpdating : { $set : false }
                            }
                        }
                    });
                case PREPARE_ROUND_STATUS.ERROR:
                    return update(state, {
                        rounds : {
                            [roundIndex] : {
                                isUpdating : { $set : false },
                                error : { $set : action.error }
                            }
                        }
                    });
            }
            return state;
        case SELECT_ROUND:
            return Object.assign({}, state, {
                selectedRoundId : action.round.id
            });
        default:
            return state;
    }
}

const rootReducer = combineReducers({
    accessToken,
    login,
    contestants,
    roles,
    rounds,
    scores
});

export default rootReducer
import $ from 'jquery';
import moment from 'moment';
import { FantasyBachSdk } from 'fantasybach-sdk';

var apigClient = new FantasyBachSdk();

export const FETCH_FB_ACCEESS_TOKEN = 'FETCH_FB_ACCESS_TOKEN';
export const FETCH_FB_ACCEESS_TOKEN_STATUS = {
    FETCHING_SDK : 'FETCHING_SDK',
    FETCHED_SDK : 'FETCHED_SDK',
    FETCHING_ACCESS_TOKEN : 'FETCHING_ACCESS_TOKEN',
    FETCHED_ACCESS_TOKEN : 'FETCHED_ACCESS_TOKEN'
};

export const LOGIN = 'LOGIN';
export const LOGIN_STATUS = {
    LOGGING_IN : 'LOGGING_IN',
    LOGGED_IN : 'LOGGED_IN',
    LOGIN_ERROR : 'LOGIN_ERROR'
};

export const FETCH_CONTESTANTS = 'FETCH_CONTESTANTS';
export const FETCH_CONTESTANTS_STATUS = {
    FETCHING : 'FETCHING',
    FETCHED : 'FETCHED',
    ERROR : 'ERROR'
};

export const FETCH_CONTESTANT = 'FETCH_CONTESTANT';
export const FETCH_CONTESTANT_STATUS = {
    FETCHING : 'FETCHING',
    FETCHED : 'FETCHED',
    ERROR : 'ERROR'
};

export const FETCH_ROLES = 'FETCH_ROLES';
export const FETCH_ROLES_STATUS = {
    FETCHING : 'FETCHING',
    FETCHED : 'FETCHED',
    ERROR : 'ERROR'
};

export const FETCH_ROUNDS = 'FETCH_ROUNDS';
export const FETCH_ROUNDS_STATUS = {
    FETCHING : 'FETCHING',
    FETCHED : 'FETCHED',
    ERROR : 'ERROR'
};

export const FETCH_ROUND = 'FETCH_ROUND';
export const FETCH_ROUND_STATUS = {
    FETCHING : 'FETCHING',
    FETCHED : 'FETCHED',
    ERROR : 'ERROR'
};

export const ADD_ROSE = 'ADD_ROSE';
export const ADD_ROSE_STATUS = {
    ADDING : 'ADDING',
    ADDED : 'ADDED',
    ERROR : 'ERROR'
};

export const UPDATE_ACTION = 'UPDATE_ACTION';
export const UPDATE_ACTION_STATUS = {
    UPDATING : 'UPDATING',
    UPDATED : 'UPDATED',
    ERROR : 'ERROR'
};

export const ELIMINATE_CONTESTANT = 'ELIMINATE_CONTESTANT';
export const ELIMINATE_CONTESTANT_STATUS = {
    ELIMINATING : 'ELIMINATING',
    ELIMINATED : 'ELIMINATED',
    ERROR : 'ERROR'
};

export const PREPARE_ROUND = 'PREPARE_ROUND';
export const PREPARE_ROUND_STATUS = {
    PREPARING : 'PREPARING',
    PREPARED : 'PREPARED',
    ERROR : 'ERROR'
};

export const UPDATE_SCORES = 'UPDATE_SCORES';
export const UPDATE_SCORES_STATUS = {
    UPDATING : 'UPDATING',
    UPDATED : 'UPDATED',
    ERROR : 'ERROR'
};

export const SELECT_ROUND = 'SELECT_ROUND';

const seasonId = 'season:NJWJTpZ8x';

export function fetchFbAccessToken() {
    return (dispatch, getState) => {
        var state = getState().accessToken;
        if (state.isFetchingSdk || state.isFetchingAccessToken) {
            return Promise.resolve();
        }
        if (!state.fetchedSdk) {
            return dispatch(fetchFbSdk());
        }
        return dispatch(fetchNewFbAccessToken());
    }
}

function fetchFbSdk() {
    return dispatch => {
        $.ajaxSetup({ cache: true });
        $.getScript('//connect.facebook.net/en_US/sdk.js', function() {
            FB.init({
                appId: '307416292730318',
                version: 'v2.5'
            });
            dispatch({ type : FETCH_FB_ACCEESS_TOKEN, status : FETCH_FB_ACCEESS_TOKEN_STATUS.FETCHED_SDK });
            dispatch(fetchNewFbAccessToken());
        });
        dispatch({ type : FETCH_FB_ACCEESS_TOKEN, status : FETCH_FB_ACCEESS_TOKEN_STATUS.FETCHING_SDK });
    }
}

function fetchNewFbAccessToken() {
    return dispatch => {
        FB.getLoginStatus(function(status) {
            dispatch({ type : FETCH_FB_ACCEESS_TOKEN, status : FETCH_FB_ACCEESS_TOKEN_STATUS.FETCHED_ACCESS_TOKEN, accessToken : status.authResponse.accessToken });
        });
        dispatch({ type : FETCH_FB_ACCEESS_TOKEN, status : FETCH_FB_ACCEESS_TOKEN_STATUS.FETCHING_ACCESS_TOKEN });
    }
}

export function login() {
    return (dispatch, getState) => {
        var accessToken = getState().accessToken.accessToken;
        apigClient.login({token : accessToken}).then(function(result) {
            dispatch({ type : LOGIN, status : LOGIN_STATUS.LOGGED_IN, userId : result.userId });
        }).catch(function(err) {
            dispatch({ type : LOGIN, status : LOGIN_STATUS.LOGIN_ERROR, error : err });
        });
        dispatch({ type : LOGIN, status : LOGIN_STATUS.LOGGING_IN });
    }
}

export function fetchContestants() {
    return dispatch => {
        apigClient.getContestants({seasonId : seasonId}).then(function(result) {
            dispatch({ type : FETCH_CONTESTANTS, status : FETCH_CONTESTANTS_STATUS.FETCHED, contestants : result });
        }).catch(function(err) {
            dispatch({ type : FETCH_CONTESTANTS, status : FETCH_CONTESTANTS_STATUS.ERROR, error : err });
        });
        dispatch({ type : FETCH_CONTESTANTS, status : FETCH_CONTESTANTS_STATUS.FETCHING });
    }
}

export function fetchRoles() {
    return dispatch => {
        apigClient.getRoles({seasonId : seasonId}).then(function(result) {
            dispatch({ type : FETCH_ROLES, status : FETCH_ROLES_STATUS.FETCHED, roles : result });
        }).catch(function(err) {
            dispatch({ type : FETCH_ROLES, status : FETCH_ROLES_STATUS.ERROR, error : err });
        });
        dispatch({ type : FETCH_ROLES, status : FETCH_ROLES_STATUS.FETCHING });
    }
}

export function fetchRounds() {
    return dispatch => {
        apigClient.getRounds({seasonId : seasonId}).then(function(result) {
            var rounds = result;
            dispatch({ type : FETCH_ROUNDS, status : FETCH_ROUNDS_STATUS.FETCHED, rounds : rounds });
            var currentRound = _.find(rounds, function(round) {
                return moment(round.roundEndLocalDateTime).diff(moment()) > 0 && moment(round.startVoteLocalDateTime).diff(moment()) < 0;
            }) || rounds[0];
            dispatch({ type : SELECT_ROUND, round : currentRound });
        }).catch(function(err) {
            dispatch({ type : FETCH_ROUNDS, status : FETCH_ROUNDS_STATUS.ERROR, error : err });
        });
        dispatch({ type : FETCH_ROUNDS, status : FETCH_ROUNDS_STATUS.FETCHING });
    }
}

export function fetchRound(round) {
    var responseBase = {
        type : FETCH_ROUND,
        round
    };
    return dispatch => {
        apigClient.getRoundById({seasonId : seasonId, id : round.id}).then(function(result) {
            dispatch(Object.assign({}, responseBase, { status : FETCH_ROUND_STATUS.FETCHED, round : result[0] }));
        }).catch(function(err) {
            dispatch(Object.assign({}, responseBase, { status : FETCH_ROUND_STATUS.ERROR, error : err }));
        });
        dispatch(Object.assign({}, responseBase, { status : FETCH_ROUND_STATUS.FETCHING }));
    }
}

export function fetchContestant(contestant) {
    var responseBase = {
        type : FETCH_CONTESTANT,
        contestant
    };
    return dispatch => {
        apigClient.getContestantById({seasonId : seasonId, id : contestant.id}).then(function(result) {
            dispatch(Object.assign({}, responseBase, { status : FETCH_CONTESTANT_STATUS.FETCHED, contestant : result[0] }));
        }).catch(function(err) {
            dispatch(Object.assign({}, responseBase, { status : FETCH_CONTESTANT_STATUS.ERROR, error : err }));
        });
        dispatch(Object.assign({}, responseBase, { status : FETCH_CONTESTANT_STATUS.FETCHING }));
    }
}

export function addRose(contestant, round) {
    var responseBase = {
        type : ADD_ROSE,
        contestant,
        round
    };
    return dispatch => {
        apigClient.postRose({seasonId : seasonId}, {
            contestantId : contestant.id,
            roundId : round.id,
            countDelta : 1
        }).then(function(result) {
            dispatch(fetchContestant(contestant));
            dispatch(Object.assign({}, responseBase, { status : ADD_ROSE_STATUS.ADDED, result : result }));
        }).catch(function(err) {
            dispatch(Object.assign({}, responseBase, { status : ADD_ROSE_STATUS.ERROR, error : err }));
        });
        dispatch(Object.assign({}, responseBase, { status : ADD_ROSE_STATUS.ADDING }));
    }
}

export function updateAction(contestant, round, role, countDelta) {
    var responseBase = {
        type : UPDATE_ACTION,
        contestant,
        round,
        role,
        countDelta
    };
    return dispatch => {
        apigClient.postAction({seasonId : seasonId}, {
            contestantId : contestant.id,
            roundId : round.id,
            roleId : role.id,
            countDelta
        }).then(function(result) {
            dispatch(fetchContestant(contestant));
            dispatch(Object.assign({}, responseBase, { status : UPDATE_ACTION_STATUS.UPDATED, result : result }));
        }).catch(function(err) {
            dispatch(Object.assign({}, responseBase, { status : UPDATE_ACTION_STATUS.ERROR, error : err }));
        });
        dispatch(Object.assign({}, responseBase, { status : UPDATE_ACTION_STATUS.UPDATING }));
    }
}

export function selectRound(round) {
    return {
        type : SELECT_ROUND,
        round
    };
}

export function eliminateContestant(contestant, round) {
    var responseBase = {
        type : ELIMINATE_CONTESTANT,
        contestant,
        round
    };
    return dispatch => {
        apigClient.postElimination({seasonId : seasonId}, {
            contestantId : contestant.id,
            roundId : round.id
        }).then(function(result) {
            dispatch(fetchRound(round));
            dispatch(Object.assign({}, responseBase, { status : ELIMINATE_CONTESTANT_STATUS.ELIMINATED, result : result }));
        }).catch(function(err) {
            dispatch(Object.assign({}, responseBase, { status : ELIMINATE_CONTESTANT_STATUS.ERROR, error : err }));
        });
        dispatch(Object.assign({}, responseBase, { status : ELIMINATE_CONTESTANT_STATUS.ELIMINATING }));
    }
}

export function prepareRound(round) {
    var responseBase = {
        type : PREPARE_ROUND,
        round
    };
    return dispatch => {
        apigClient.postPrepareRound({seasonId : seasonId}, {
            roundId : round.id
        }).then(function(result) {
            dispatch(fetchRound(round));
            dispatch(Object.assign({}, responseBase, { status : PREPARE_ROUND_STATUS.PREPARED, result : result }));
        }).catch(function(err) {
            dispatch(Object.assign({}, responseBase, { status : PREPARE_ROUND_STATUS.ERROR, error : err }));
        });
        dispatch(Object.assign({}, responseBase, { status : PREPARE_ROUND_STATUS.PREPARING }));
    }
}

export function updateScores() {
    var responseBase = {
        type : UPDATE_SCORES,
    };
    return dispatch => {
        apigClient.postUpdateScores({seasonId : seasonId}, {}).then(function(result) {
            dispatch(Object.assign({}, responseBase, { status : UPDATE_SCORES_STATUS.UPDATED, result : result }));
        }).catch(function(err) {
            dispatch(Object.assign({}, responseBase, { status : UPDATE_SCORES_STATUS.ERROR, error : err }));
        });
        dispatch(Object.assign({}, responseBase, { status : UPDATE_SCORES_STATUS.UPDATING }));
    }
}
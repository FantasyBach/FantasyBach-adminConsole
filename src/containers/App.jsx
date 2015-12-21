import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import AccessToken from './../components/AccessToken.jsx'
import UpdateScoresButton from './../components/UpdateScoresButton.jsx'
import ContestantsTable from './ContestantsTable.jsx'
import RoundsTable from './RoundsTable.jsx'
import { addRose, updateAction, selectRound, eliminateContestant, prepareRound, updateScores } from '../actions.js'

class App extends Component {

    render() {
        const { dispatch, accessToken, login, roles, rounds, contestants, scores } = this.props;
        var selectedRound = rounds.rounds && (_.find(rounds.rounds, 'id', rounds.selectedRoundId) || rounds.rounds[0]);
        return <div>
            <h1 className="title">Fantasy Bach Admin Console</h1>
            <AccessToken accessToken={accessToken} login={login} />
            <RoundsTable
                rounds={rounds.rounds}
                selectedRound={selectedRound}
                onRoundClick={round => dispatch(selectRound(round))}
                onPrepareRound={round => dispatch(prepareRound(round))} />
            <UpdateScoresButton
                isUpdating={scores.isUpdating}
                onClick={() => dispatch(updateScores())} />
            <ContestantsTable
                roles={roles.roles}
                round={selectedRound}
                contestants={contestants.contestants}
                onRoseClick={(contestant, round) => dispatch(addRose(contestant, round))}
                onActionClick={(contestant, round, role, countDelta) => dispatch(updateAction(contestant, round, role, countDelta))}
                onEliminateClick={(contestant, round) => dispatch(eliminateContestant(contestant, round))} />
        </div>
    }
}

function select(state) {
    return {
        accessToken : state.accessToken,
        login : state.login,
        roles : state.roles,
        rounds : state.rounds,
        contestants : state.contestants,
        scores : state.scores
    }
}

export default connect(select)(App)
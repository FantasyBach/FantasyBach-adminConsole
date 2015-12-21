import React, { Component } from 'react'
import _ from 'lodash'
import moment from 'moment'

const dateFormat = 'LTS L';

export default class RoundsTable extends Component {

    render() {
        let { rounds, selectedRound, onRoundClick, onPrepareRound } = this.props;

        if (!rounds || !rounds.length || !onRoundClick) {
            return <div className="roundsTable">
                <h2>Rounds</h2>
                <div className="loader"></div>
            </div>
        }

        rounds = _.sortBy(rounds, 'index');

        var headerCells = [];
        _.each(['Round', 'Roster Size', 'Vote Start', 'Vote End', 'Round End', 'Eligible', 'Eliminated'], function(item) {
            headerCells.push(<div className="headerCell tableRowItem" key={item}>{item}</div>);
        });
        var header = <div className="tableRow">{headerCells}</div>;

        var roundRows = [];
        _.each(rounds, function(round) {
            var roundCells = [
                <div className="bodyCell tableRowItem" key={round.name}>
                    <span className={round.isUpdating || round.isFetching ? 'dot loading' : ''}>{round === selectedRound ? '\u2022' : '' }</span>
                    {round.name}
                    <span className="tableSpacer"> </span>
                    <span className="button sort" onClick={(e) => { e.stopPropagation(); onPrepareRound(round)}}> </span>
                </div>
            ];
            _.each([
                round.rosterSize,
                moment(round.startVoteLocalDateTime).format(dateFormat),
                moment(round.endVoteLocalDateTime).format(dateFormat),
                moment(round.roundEndLocalDateTime).format(dateFormat),
                round.eligibleContestantIds.length,
                round.eliminatedContestantIds.length
            ], function(item) {
                roundCells.push(<div className="tableRowItem" key={item}>{item}</div>);
            });
            roundRows.push(<div className="tableRow clickable" onClick={() => {onRoundClick(round)}} key={round.id}>{roundCells}</div>);
        });

        return <div className="roundsTable">
            <h2>Rounds</h2>
            <div class="table">
                {header}
                {roundRows}
            </div>
        </div>
    }
}
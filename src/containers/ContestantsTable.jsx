import React, { Component } from 'react'
import _ from 'lodash'

export default class ContestantsTable extends Component {

    render() {
        let { roles, round, contestants, onRoseClick, onActionClick, onEliminateClick } = this.props;

        if (!roles || !roles.length || !round || !contestants || !contestants.length || !onRoseClick || !onActionClick || !onEliminateClick) {
            return <div className="contestantsTable">
                <h2>Contestants</h2>
                <div className="loader"></div>
            </div>
        }

        var activeContestants = _.filter(contestants, function(contestant) {
            return _.contains(round.eligibleContestantIds, contestant.id);
        });
        var inactiveContestants = _.difference(contestants, activeContestants);
        activeContestants = _.sortBy(activeContestants, 'name');
        inactiveContestants = _.sortBy(inactiveContestants, 'name');
        contestants = _.union(activeContestants, inactiveContestants);
        contestants = _.filter(contestants, function(contestant) {
            return !contestant.isPrimaryContestant
        });

        var headerCells = [ <div className="headerCell tableRowItem tableRowHeaderItem" key="contestant">Contestant</div> ];
        _.each(roles, function(role) {
            headerCells.push(<div className="headerCell tableRowItem" key={role.id}>{role.verbName}</div>);
        });
        var header = <div className="tableRow">{headerCells}</div>;

        var contestantRows = [];
        try {
            _.each(contestants, function (contestant) {
                var roses = (contestant.roses && contestant.roses[round.id]) || '';
                var pictureClassName = 'picture';
                if (contestant.isFetching || contestant.isUpdating) {
                    pictureClassName += ' loading';
                }
                var contestantCells = [
                    <div className="bodyCell tableRowItem tableRowHeaderItem" key={contestant.id + contestant.name}>
                        <img className={pictureClassName} src={contestant.images.head}/>
                        {contestant.name}
                        <span className="tableSpacer"> </span>
                        {roses}
                        { !_.contains(inactiveContestants, contestant) ? <span className="button rose"
                                                                               onClick={() => {onRoseClick(contestant, round)}}> </span> : ''}
                        { !_.contains(round.eliminatedContestantIds, contestant.id) && !_.contains(inactiveContestants, contestant) ?
                            <span className="button delete"
                                  onClick={() => {onEliminateClick(contestant, round)}}> </span> : ''}
                    </div>
                ];
                _.each(roles, function (role) {
                    var roundRoleResults = contestant.roundResults[round.id][role.id];
                    var occurrences = (roundRoleResults && roundRoleResults.occurrences) || 0;
                    contestantCells.push(
                        <div className="bodyCell tableRowItem" key={contestant.id + role.id}>
                            <span className="tableSpacer"> </span>
                            {occurrences}
                            { !_.contains(inactiveContestants, contestant) ? <span className="button add"
                                                                                   onClick={() => {onActionClick(contestant, round, role, 1)}}> </span> : ''}
                            { !_.contains(inactiveContestants, contestant) ? <span className="button minus"
                                                                                   onClick={() => {onActionClick(contestant, round, role, -1)}}> </span> : ''}
                        </div>
                    );
                });
                var rowClassName = 'tableRow';
                if (_.contains(inactiveContestants, contestant)) {
                    rowClassName += ' inactive';
                }
                contestantRows.push(<div className={rowClassName} key={contestant.id}>{contestantCells}</div>);
            });
        } catch (e) {
            console.log(e);
        }

        return <div className="contestantsTable">
            <h2>Contestants</h2>
            <div class="table">
                {header}
                {contestantRows}
            </div>
        </div>
    }
}
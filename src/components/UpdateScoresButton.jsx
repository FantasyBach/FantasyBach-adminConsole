import React, { Component } from 'react';

export default class UpdateScoresButton extends Component {

    render() {
        const { isUpdating, onClick } = this.props;

        if (isUpdating) {
            return <div className="updateScoresButton">
                <div className="loader small"></div>
            </div>;
        }

        return <div className="updateScoresButton clickable">
            <h2 onClick={() => onClick()}>Update Scores</h2>
        </div>;
    };
}
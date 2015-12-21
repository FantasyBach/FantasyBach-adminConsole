import React, { Component } from 'react';

export default class AccessToken extends Component {

    render() {
        const { isFetchingSdk, isFetchingAccessToken, accessToken } = this.props.accessToken || {};

        const { userId } = this.props.login || {};

        var status = 'Fetched Access Token';
        if (isFetchingSdk) {
            status = 'Fetching SDK';
        }
        if (isFetchingAccessToken) {
            status = 'Fetching Access Token'
        }

        var accessTokenField = accessToken ? <div>Access Token: <span>{ accessToken }</span></div> : <div></div>;

        var userIdField = userId ? <div>User Id: <span>{ userId }</span></div> : <div></div>;

        return <div className="accessToken">
            <h2>Access Token</h2>
            <div>Status: { status }</div>
            { accessTokenField }
            { userIdField }
        </div>;
    };
}
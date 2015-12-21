import React from 'react'
import { render } from 'react-dom';
import { Provider } from 'react-redux'
import configureStore from './store/configureStore';
import App from './containers/App.jsx'
import DevTools from './containers/DevTools.jsx'
import { fetchFbAccessToken, login, fetchContestants, fetchRoles, fetchRounds } from './actions.js'
import style from './css/app.css'
import loadingStyle from './css/loadingSpinner.css'

const store = configureStore();

let accessToken;
function lookForAccessToken() {
    let previousAccessToken = accessToken;
    accessToken = store.getState().accessToken.accessToken;
    if (previousAccessToken === accessToken) { return; }
    store.dispatch(login());
}
store.subscribe(lookForAccessToken);

let userId;
function lookForUserId() {
    let previousUserId = userId;
    userId = store.getState().login.userId;
    if (previousUserId === userId) { return; }
    store.dispatch(fetchContestants());
    store.dispatch(fetchRoles());
    store.dispatch(fetchRounds());
}
store.subscribe(lookForUserId);

store.dispatch(fetchFbAccessToken());

render(
    <div>
        <Provider store={store}>
            <div>
                <App />
                <DevTools />
            </div>
        </Provider>
    </div>
    , document.getElementById('app')
);
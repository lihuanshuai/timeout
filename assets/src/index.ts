import React from 'react';
import ReactDOM from 'react-dom';
import { BaseTask } from './types';
import App from "./App";
import { init, log } from './rpc';

interface AppRender {
    renderApp: (props: { tasks: BaseTask[] }) => void
}

(window as unknown as AppRender).renderApp = (props: { tasks: BaseTask[] }) => {
    try {
        ReactDOM.render(
            React.createElement(App, props, null),
            document.getElementById('app')
        );
    } catch (err) {
        log("error while rendering", props, "error:", err);
        throw err;
    }
};

window.onload = function () {
    log("init:", window.location.href);
    init();
};

(window as unknown as AppRender).renderApp({ tasks: [] });

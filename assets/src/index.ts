import React from 'react';
import ReactDOM from 'react-dom';
import { Task } from './types';
import App from "./App";
import { init, log } from './rpc';

(window as any).renderApp = (props: { tasks: Task[] }) => {
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

window.onload = function () { init(); };

(window as any).renderApp({ tasks: [] });

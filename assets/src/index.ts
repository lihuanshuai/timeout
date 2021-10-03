import React from 'react';
import ReactDOM from 'react-dom';
import { Task } from './types';
import App from "./App";
import { init } from './rpc';

(window as any).renderApp = (props: { tasks: Task[] }) => {
    ReactDOM.render(
        React.createElement(App, props, null),
        document.getElementById('app')
    );
};

window.onload = function () { init(); };

(window as any).renderApp({ tasks: [] });

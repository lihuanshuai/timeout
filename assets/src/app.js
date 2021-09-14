import React from 'react';
import ReactDOM from 'react-dom';
import App from "./App.tsx";

ReactDOM.render(
    React.createElement(App, {}, null),
    document.getElementById('app')
);

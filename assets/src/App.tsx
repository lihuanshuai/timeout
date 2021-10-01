import React, { Suspense } from 'react';
import TaskList from './components/TaskList';
import "./App.module.css";

const App: React.FC = () => {
    return (
        <div className="App">
            <Suspense fallback={<div>Loading...</div>}>
                <TaskList title="Progressing" />
            </Suspense>
        </div>
    );
};

export default App;

import React, { Suspense } from 'react';
import { Task } from './types';
import TaskList from './components/TaskList';
import "./App.module.css";

const App = ({ tasks }: { tasks: Task[] }) => {
    return (
        <div className="App">
            <Suspense fallback={<div>Loading...</div>}>
                <TaskList title="Progressing" tasks={tasks} />
            </Suspense>
        </div>
    );
};

export default App;

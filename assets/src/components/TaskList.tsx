import React, { useEffect, useReducer, useRef, useState } from 'react';
import isDeepEqual from 'fast-deep-equal/react';
import { addTask, delTask } from '../rpc';
import { BaseTask } from '../types';
import TaskItem from './TaskItem';
import TaskItemForm from './TaskItemForm';
import { Dispatch, reducer, initialState } from './TaskItemFormReducer';
import * as styles from './TaskList.module.css';


const TaskList = ({ title, tasks }: { title: string, tasks: BaseTask[] }): JSX.Element => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [taskLefts, setTaskLefts] = useState([]);
    const targetTimes = tasks.map((t) => t.create_time + t.duration);
    const targetTimesRef = useRef([]);
    if (!isDeepEqual(targetTimesRef.current, targetTimes)) {
        targetTimesRef.current = targetTimes;
    }
    useEffect(() => {
        const now = new Date().getTime() / 1000.0;
        setTaskLefts(targetTimesRef.current.map((t) => t - now));
        const intervalID = setInterval(() => {
            const now = new Date().getTime() / 1000.0;
            setTaskLefts(targetTimesRef.current.map((t) => t - now));
        }, 1000);
        return () => {
            clearInterval(intervalID);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [targetTimesRef.current]);
    const handleAppend = (title: string, duration: number) => {
        console.log('append task', title, duration);
        const t = new Date().getTime() / 1000.0;
        const task: BaseTask = { name: title, create_time: t, duration: duration };
        addTask(task);
    };
    const handleDelete = (title: string) => {
        console.log('delete task', title);
        delTask(title);
    };
    const fullTasks = tasks.map((t, i) => ({ ...t, left: taskLefts[i] }));
    fullTasks.sort(
        (a, b) => {
            const x = a.left;
            const y = b.left;
            if (x <= 0) {
                return y <= 0 ? (y - x) : 1;
            } else {
                return y > 0 ? (x - y) : -1;
            }
        }
    );
    const taskElements = fullTasks.map((task) => {
        return (
            <TaskItem key={task.name} task={task} onDelete={handleDelete} />
        );
    });
    return (
        <Dispatch.Provider value={dispatch}>
            <div className={styles.Tasks}>
                <h1>{title}</h1>
                {taskElements}
                <TaskItemForm title={state.title} duration={state.duration} onSubmit={handleAppend} />
            </div>
        </Dispatch.Provider>
    );
};
export default TaskList;

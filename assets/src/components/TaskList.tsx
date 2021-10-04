import React, { useEffect, useRef, useState } from 'react';
import isDeepEqual from 'fast-deep-equal/react';
import { addTask, delTask } from '../rpc';
import { Task } from '../types';
import * as styles from './TaskList.module.css';

const TaskItem = ({ task, left, onDelete }: {
    task: Task, left: number, onDelete: (string) => void
}) => {
    const durationStr = left >= 0 ? formatDuration(left) : formatDuration(-left);
    const comment = left >= 0 ? `left ${durationStr}` : `succeeded ${durationStr} ago`;
    const progress = left >= 0 ? (1.0 - left / task.duration) * 100 : 100;
    const handleClose = () => {
        onDelete(task.name);
    };

    return (
        <div className={styles.Item}>
            <div className={styles.Progress} style={{ width: `${progress}%` }}></div>
            <div className={styles.Content}>
                <div className={styles.Title}>
                    <h2>
                        {task.name}
                        <span>{comment}</span>
                    </h2>
                </div>
                <span className={styles.Close} onClick={handleClose}>
                    {'✕'}
                </span>
            </div>
        </div>
    );
};

const formatDuration = (d: number) => {
    const units = ['day', 'hour', 'minute', 'second'];
    const bases = [24 * 60 * 60, 60 * 60, 60, 1];
    const numbers = [];
    for (const base of bases) {
        numbers.push(Math.floor(d / base));
        d = d % base;
    }
    let isLeadingZero = true;
    let output = '';
    for (let idx = 0; idx < numbers.length; idx += 1) {
        const number = numbers[idx];
        const unit = units[idx];
        if (number == 0 && isLeadingZero) {
            continue;
        } else {
            const sep = output ? ' ' : '';
            const s = number >= 2 ? 's' : '';
            output += `${sep}${number} ${unit}${s}`;
            isLeadingZero = false;
        }
    }
    return output;
}

const parseDuration = (s: string) => {
    let duration = 0;
    const arr = s.trim().split(' ').filter((x) => x);
    const bases = [60, 60 * 60, 24 * 60 * 60];
    for (let idx = 0; idx < bases.length; idx += 1) {
        if (arr.length <= idx) {
            continue;
        }
        const n = parseInt(arr[arr.length - 1 - idx], 10);
        duration += n * bases[idx];
    }
    return duration;
};

const TaskItemForm = ({ onSubmit }: { onSubmit: (string, number) => void }) => {
    const [title, setTitle] = useState("");
    const [durationStr, setDurationStr] = useState("");
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const duration = parseDuration(durationStr);
        if (!title || !duration) {
            window.alert('title or duration should NOT be empty');
            return;
        }
        onSubmit(title, duration);
        setTitle("");
        setDurationStr("");
    };
    return (
        <div className={styles.Item}>
            <div className={styles.Progress} style={{ width: '0%' }}></div>
            <div className={styles.Content}>
                <form onSubmit={handleSubmit}>
                    <div className={styles.Title}>
                        <h2>
                            <input type="text" name="title" placeholder="title ..." style={{ width: "60%" }}
                                value={title} onChange={(evt) => setTitle(evt.target.value)}>
                            </input>
                            <span>
                                <input type="text" name="duration" placeholder="duration ..."
                                    value={durationStr} onChange={(evt) => setDurationStr(evt.target.value)}>
                                </input>
                            </span>
                        </h2>
                    </div>
                    <input type="submit" className={styles.Close} value="+">
                    </input>
                </form>
            </div >
        </div >
    );
};

const TaskList = ({ title, tasks }: { title: string, tasks: Task[] }) => {
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
    }, [targetTimesRef.current]);
    const handleAppend = (title: string, duration: number) => {
        console.log('append task', title, duration);
        const t = new Date().getTime() / 1000.0;
        const task: Task = { name: title, create_time: t, duration: duration };
        addTask(task);
    };
    const handleDelete = (title: string) => {
        console.log('delete task', title);
        delTask(title);
    };
    const taskRows = tasks.map((t, i) => [t, taskLefts[i]]).sort(
        (a, b) => {
            const x = a[1];
            const y = b[1];
            if (x <= 0) {
                return y <= 0 ? (y - x) : 1;
            } else {
                return y > 0 ? (x - y) : -1;
            }
        }
    );
    const taskElements = taskRows.map((entry) => {
        const task = entry[0];
        const left = entry[1];
        return (
            <TaskItem key={task.name} task={task} left={left} onDelete={handleDelete} />
        );
    });
    return (
        <div className={styles.Tasks}>
            <h1>{title}</h1>
            {taskElements}
            <TaskItemForm onSubmit={handleAppend} />
        </div>
    );
};
export default TaskList;

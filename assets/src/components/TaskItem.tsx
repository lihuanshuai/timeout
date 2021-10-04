import React from 'react';
import { Task } from '../types';
import * as styles from './TaskItem.module.css';

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
                        <span
                            onClick={() => {
                                // dispatch({ type: ActionType.SetTitle, title: task.name })
                            }}>
                            {task.name}
                        </span>
                        <span className={styles.Comment}>{comment}</span>
                    </h2>
                </div>
                <span className={styles.Close} onClick={handleClose}>
                    {'✕'}
                </span>
            </div>
        </div>
    );
};
export default TaskItem;

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
};

import React from 'react';
import styles from './TaskList.module.css';

interface Task {
    name: string;
    createTime: number;
    duration: number;
};

const TaskList = () => {
    const title = 'Repairing';
    const tasks: Task[] = [{
        name: 'kv', createTime: new Date().getTime(), duration: 100,
    }, {
        name: 'kv2', createTime: new Date().getTime(), duration: 100,
    }];
    const taskElements = tasks.map((task: Task) => {
        const now = new Date().getTime();
        const left = Math.round(now - task.createTime);
        const leftText = left >= 0 ? `left ${left} seconds` : `succeeded ${-left} seconds ago`;
        return (
            <div key={task.name} className={styles.Item}>
                <div className={styles.Progress} style={{ width: '50%' }}></div>
                <div className={styles.Content}>
                    <div className={styles.Title}>
                        <h2>
                            {task.name}
                            <span>{leftText}</span>
                        </h2>
                    </div>
                    <span className={styles.Close}>
                        {'x'}
                    </span>
                </div>
            </div>
        );
    });
    return (
        <div className={styles.Tasks}>
            <h1>{title}</h1>
            {taskElements}
        </div>
    );
};
export default TaskList;

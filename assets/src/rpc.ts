import { Task } from "./types";

const invoke = (arg) => {
    (window.external as any).invoke(JSON.stringify(arg));
}

export const init = () => {
    invoke({ cmd: 'init' });
};

export const log = (...args) => {
    let s = '';
    for (const arg of args) {
        s = s + JSON.stringify(arg);
    }
    invoke({ cmd: 'log', text: s });
};

export const addTask = (task: Task) => {
    invoke({
        cmd: 'addTask',
        name: task.name, create_time: task.create_time, duration: task.duration
    });
};

export const delTask = (name: string) => {
    invoke({ cmd: 'delTask', name });
};

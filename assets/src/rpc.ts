import { BaseTask } from "./types";

interface External {
    invoke: (string) => void
}

const invoke = (arg) => {
    const external = window.external as unknown as External;
    if (!external.invoke) {
        console.log('invoke', arg);
        return;
    }
    external.invoke(JSON.stringify(arg));
}

export const init = (): void => {
    invoke({ cmd: 'init' });
};

export const log = (...args: unknown[]): void => {
    let s = '';
    for (const arg of args) {
        s = s + ' ' + JSON.stringify(arg);
    }
    invoke({ cmd: 'log', text: s });
};

export const addTask = (task: BaseTask): void => {
    invoke({
        cmd: 'addTask',
        name: task.name, create_time: task.create_time, duration: task.duration
    });
};

export const delTask = (name: string): void => {
    invoke({ cmd: 'delTask', name });
};

export interface BaseTask {
    name: string;
    create_time: number;
    duration: number;
}

export interface Task extends BaseTask {
    left: number;
}


import React, { useState } from 'react';
import * as itemStyles from './TaskItem.module.css';

interface InitialState {
    title: string;
    duration: string;
}

const initialState: InitialState = {
    title: "",
    duration: "",
};

export enum ActionType {
    SetTitle = "TASK_ITEM_FORM/SET_TITLE",
    SetDuration = "TASK_ITEM_FORM/SET_DURATION",
}

const reducer = (state: InitialState, action: any) => {
    switch (action.type) {
        case ActionType.SetTitle:
            return { ...state, title: action.title };
        case ActionType.SetDuration:
            return { ...state, duration: action.duration };
        default:
            throw new Error();
    }
};

// export const Dispatch = React.createContext<React.Dispatch<any> | null>(null);

const TaskItemForm = ({ onSubmit }: { onSubmit: (string, number) => void }) => {
    const [title, setTitle] = useState('');
    const [durationStr, setDurationStr] = useState('');
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const duration = parseDuration(durationStr);
        if (!title || !durationStr) {
            window.alert('title or duration should NOT be empty');
            return;
        }
        onSubmit(title, duration);
        setTitle("");
        setDurationStr("");
    };
    return (
        // <Dispatch.Provider value={dispatch}>
        <div className={itemStyles.Item}>
            <div className={itemStyles.Progress} style={{ width: '0%' }}></div>
            <div className={itemStyles.Content}>
                <form onSubmit={handleSubmit}>
                    <div className={itemStyles.Title}>
                        <h2>
                            <input type="text" name="title" placeholder="title ..." style={{ width: "60%" }}
                                value={title} onChange={
                                    (evt) => setTitle(evt.target.value)
                                }>
                            </input>
                            <span className={itemStyles.Comment}>
                                <input type="text" name="duration" placeholder="duration ..."
                                    value={durationStr} onChange={
                                        (evt) => setDurationStr(evt.target.value)
                                    }>
                                </input>
                            </span>
                        </h2>
                    </div>
                    <input type="submit" className={itemStyles.Close} value="+">
                    </input>
                </form>
            </div >
        </div >
        // </Dispatch.Provider>
    );
};
export default TaskItemForm;

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

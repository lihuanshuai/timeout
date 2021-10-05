
import React, { useContext } from 'react';
import { log } from '../rpc';
import { ActionType, Dispatch } from './TaskItemFormReducer';
import * as itemStyles from './TaskItem.module.css';

function TaskItemForm({ title, duration, onSubmit }: {
    title: string, duration: string, onSubmit: (string, number) => void
}): JSX.Element {
    const dispatch = useContext(Dispatch);
    if (!dispatch) {
        throw new Error("unsupported dispatch");
    }
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        log("submit:", title, duration);
        event.preventDefault();
        const durationNum = parseDuration(duration);
        if (!title || !duration) {
            window.alert('title or duration should NOT be empty');
            return;
        }
        onSubmit(title, durationNum);
        dispatch({ type: ActionType.SetTitle, title: "" });
        dispatch({ type: ActionType.SetDuration, duration: "" });
    };
    return (
        <div className={itemStyles.Item}>
            <div className={itemStyles.Progress} style={{ width: '0%' }}></div>
            <div className={itemStyles.Content}>
                <form onSubmit={handleSubmit}>
                    <div className={itemStyles.Title}>
                        <h2>
                            <input type="text" name="title" placeholder="title ..." style={{ width: "60%" }}
                                value={title}
                                onChange={
                                    (evt) => {
                                        dispatch({ type: ActionType.SetTitle, title: evt.target.value });
                                    }
                                }>
                            </input>
                            <span className={itemStyles.Comment}>
                                <input type="text" name="duration" placeholder="duration ..."
                                    value={duration}
                                    onChange={
                                        (evt) => {
                                            dispatch({ type: ActionType.SetDuration, duration: evt.target.value });
                                        }
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
    );
}
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

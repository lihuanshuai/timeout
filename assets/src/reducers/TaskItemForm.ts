import React from "react";
import { log } from "../rpc";

interface InitialState {
    title: string;
    duration: string;
}

interface Action {
    type: string;
    title?: string;
    duration?: string;
}

export const initialState: InitialState = {
    title: "",
    duration: "",
};

export enum ActionType {
    SetTitle = "TASK_ITEM_FORM/SET_TITLE",
    SetDuration = "TASK_ITEM_FORM/SET_DURATION",
}

export const reducer = (state: InitialState, action: Action): InitialState => {
    log("reducer:", state, action);
    switch (action.type) {
        case ActionType.SetTitle:
            return { ...state, title: action.title };
        case ActionType.SetDuration:
            return { ...state, duration: action.duration };
        default:
            throw new Error();
    }
};

export const Dispatch = React.createContext<React.Dispatch<Action> | null>(null);

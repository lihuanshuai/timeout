import React, { useEffect, useState } from "react";

export function useLocalStorage<Type>(
    key: string, defaultValue: Type
): [Type, React.Dispatch<React.SetStateAction<Type>>] {
    const [state, setState] = useState(() => {
        let value: Type;
        try {
            value = JSON.parse(window.localStorage.getItem(key) || String(defaultValue));
        } catch {
            value = defaultValue;
        }
        return value;
    });
    useEffect(
        () => {
            window.localStorage.setItem(key, JSON.stringify(state));
        },
        [state],
    );
    return [state, setState];
}

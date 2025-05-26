import { useCallback, useRef } from "react"

export const useDebounce = (callBack, delay) => {
    const timeoutRef = useRef(null);

    return useCallback((...args) => {
        clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
            callBack(...args)
        }, delay);
    }, [callBack, delay])
};
import { EffectCallback, useEffect, useRef } from "react";

// as useEffect, but skips initial event
/* eslint-disable react-hooks/exhaustive-deps */
export function useEffectSkipInitial(effect: EffectCallback, deps?: Array<any>) {
    const firstRunRef = useRef(true)

    useEffect(() => {
        if (firstRunRef.current)
            firstRunRef.current = false
        else
            effect()
    }, deps)
}
/* eslint-enable react-hooks/exhaustive-deps */
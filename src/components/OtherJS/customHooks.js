// react imports
import {useEffect, useRef} from "react";

// exports and functions for the custom hooks

// hook to keep the previous state of the value
export function usePrevious(value) {
	const ref = useRef();

	useEffect(() => {
		ref.current = value;
	});

	return ref.current;
}

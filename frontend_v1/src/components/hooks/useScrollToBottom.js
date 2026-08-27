import { useEffect } from "react";
export function useScrollToBottomOnNewMessages(messages, ref, force = false) {
	useEffect(() => {
		const container = ref.current;
		if (!container) return;

		// If force is true, always scroll
		if (force) {
			container.scrollTo({
				top: container.scrollHeight,
				behavior: "smooth",
			});
			return;
		}

		// Otherwise, only scroll if near bottom
		const isAtBottom =
			container.scrollHeight - container.scrollTop - container.clientHeight < 50;

		if (isAtBottom) {
			container.scrollTo({
				top: container.scrollHeight,
				behavior: "smooth",
			});
		}
	}, [messages, force, ref]);
}


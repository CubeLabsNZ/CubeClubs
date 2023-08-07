export function clickOutside(node: HTMLElement) {
    function handleClick(event) {
        if (node && !node.contains(event.target) && !event.defaultPrevented) {
            node.dispatchEvent(
                new CustomEvent('click_outside', node)
            )
        }
    }

    document.addEventListener('click', handleClick, true);

    return {
        destroy() {
            document.removeEventListener('click', handleClick, true);
        }
    }
}

export function partition<T>(array: T[], filter: (e: T, idx: number, arr: T[]) => boolean): T[][] {
    const pass: T[] = [], fail: T[] = [];

    array.forEach((e: T, idx: number, arr: T[]) => (filter(e, idx, arr) ? pass : fail).push(e));
    return [pass, fail];
}

export function getRoundName(puzzleName: string, roundNumber: number, maxRound: number) {
    return `${puzzleName} — ${roundNumber == maxRound ? "Final Round" : `Round ${roundNumber}`}`
}

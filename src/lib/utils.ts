import { Format } from "@prisma/client";

export const DNF = 1e7;

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


export function formatTime(rawValue: number): string {
    if (rawValue === DNF) {
        return "DNF"
    }

    const minutes = Math.floor(rawValue / 60);
    const seconds = rawValue % 60

    if (minutes === 0) {
        return seconds.toFixed(2)
    } else {
        return `${minutes}:${seconds.toFixed(2).padStart(5, '0')}`
    }
}


export function calculateAverage(format: Format, data: number[]): number {
    switch (format) {
        case Format.AO5: {
            data = data as number[]

            const used = data.sort((t1, t2) => t1 - t2).slice(1, 4);
            if (used.includes(DNF)) { return DNF }

            return used.reduce((acc, cur) => acc + cur) / 3;
        }

        case Format.MO3: {
            data = data as number[]

            if (data.includes(DNF)) { return DNF}

            return data.reduce((acc, cur) => acc + cur) / 3;
        }

        case Format.BO1: {
            return data[0];
        }

        case Format.BO3: {
            return Math.min(...data as number[]);
        }
    }
}

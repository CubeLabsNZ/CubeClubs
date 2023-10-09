import { Format } from "@prisma/client";

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
    return `${puzzleName ? puzzleName + " " : ""}${roundNumber == maxRound ? "Final" : `Round ${roundNumber}`}`
}


export function formatTime(rawValue: number, mbld_score: number | undefined = undefined, mbld_total: number | undefined = undefined): string {
    if (mbld_score && mbld_total) {
        return `${(mbld_score+mbld_total)/2}/${mbld_total}`
    }
    if (rawValue === Infinity || rawValue === "Infinity") {
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

export function calulateMbldAverage(format: Format, data: {time: number, score: number, total_attempts: number}[]) {
    switch (format) {
        case format.BO3:
        case format.BO2:
            data.sort((a, z) => {
                const score_order = a.score - z.score
                const time_order = a.time - z.time
                return score_order || time_order
            })
        case format.BO1:
            return data[0]
    }
}


export function calculateAverage(format: Format, data: number[]): number {
    switch (format) {
        case format.AO5: {
            const used = data.sort((t1, t2) => t1 - t2).slice(1, 4);

            return used.reduce((acc, cur) => acc + cur) / 3;
        }

        case format.MO3: {
            return data.reduce((acc, cur) => acc + cur) / 3;
        }

        case format.BO1: {
            return data[0];
        }

        case format.BO3: {
            return Math.min(...data as number[]);
        }
    }
}

export function replaceMaoriCharacters(x: string): string {
    return x
        .replace("ā", "a")
        .replace("ē", "e")
        .replace("ī", "i")
        .replace("ō", "o")
        .replace("ū", "u")

        .replace("Ā", "A")
        .replace("Ē", "E")
        .replace("Ī", "I")
        .replace("Ō", "O")
        .replace("Ū", "U")
}

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

export function partition<Elem>(array: Elem[], filter: (e: Elem, idx: number, arr: Elem[]) => Boolean) {
    let pass: Elem[] = [], fail: Elem[] = [];
    array.forEach((e: Elem, idx: number, arr: Elem[]) => (filter(e, idx, arr) ? pass : fail).push(e));
    return [pass, fail];
}

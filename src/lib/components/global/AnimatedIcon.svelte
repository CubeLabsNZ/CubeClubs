<script lang="ts">
	import { onMount } from "svelte";

	let slot: HTMLDivElement;
	let startAnimates: NodeList | undefined;
	let endAnimates: NodeList | undefined;

	export let state: boolean;
	let oldState = state;

	$: {
		if (oldState != state) {
			if (state) {
				startAnimates?.forEach((e: SVGAnimateElement) =>
					e.beginElement()
				);
			} else {
				endAnimates?.forEach((e: SVGAnimateElement) =>
					e.beginElement()
				);
			}
		}
		oldState = state;
	}

	onMount(() => {
		startAnimates = slot.querySelectorAll(
			'animate[data-cubeclubs-animate="to"]'
		);
		endAnimates = slot.querySelectorAll(
			'animate[data-cubeclubs-animate="from"]'
		);
	});
</script>

<div bind:this={slot} style:display="contents">
	<slot />
</div>

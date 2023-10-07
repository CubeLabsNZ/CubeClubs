<script lang="ts">
    export let place: PodiumPlace;

    function getMedal(place: PodiumPlace): { placing: number, fill: string, stroke: string} {
        switch (place) {
            case PodiumPlace.Gold: {
                return { 
                    placing: 1,
                    fill: "#F9D953",
                    stroke: "#EFCC3A"
                }
            }
            
            case PodiumPlace.Silver: {
                return { 
                    placing: 2,
                    fill: "#D3D3D3",
                    stroke: "#C4C4C4"
                }
            }

            case PodiumPlace.Bronze: {
                return { 
                    placing: 3,
                    fill: "#F89656",
                    stroke: "#E47D43"
                }

            }
        }
    }

    const medal = getMedal(place);
</script>

<script lang="ts" context="module">
    export enum PodiumPlace {
        Bronze=2,
        Silver=1,
        Gold=0
    }
</script>

<div class="medal-container">
    <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" height=16 stroke-width=1.5 fill={medal.fill} stroke={medal.stroke}>
        <circle cx="8" cy="8" r="6.75" />
    </svg>

    <p class="medal-text">{medal.placing}</p>
</div>


<style>
    .medal-container {
        display: grid;
        align-items: center;
        justify-items: center;
        position: relative;
    }

    .medal-container * {
        user-select: none;
    }

    .medal-text {
        grid-area: 1/1;
        position: absolute;
        z-index: 2;
        font-weight: 600;
        font-size: 10px;
        color: white;
    }
</style>

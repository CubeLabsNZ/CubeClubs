import type { Region } from '@prisma/client'

const regions: {[key in Region]: {name: string, maori_name?: string}} = {
	NORTHLAND: { name: "Northland", maori_name: "Te Tai Tokerau" },
	AUCKLAND: { name: "Auckland", maori_name: "Tāmaki-makau-rau" },
	WAIKATO: { name: "Waikato" },
	BOP: { name: "Bay of Plenty", maori_name: "Te Moana-a-Toi" },
	GISBORNE: { name: "Gisborne", maori_name: "Te Tairāwhiti" },
	HAWKES_BAY: { name: "Hawke's Bay", maori_name: "Te Matau-a-Māui" },
	TARANAKI: { name: "Taranaki" },
	MANAWATU_WHANGANUI: { name: "Manawatū" },
	WELLINGTON: { name: "Wellington", maori_name: "Te Whanga-nui-a-Tara" },
	TASMAN: { name: "Tasman", maori_name: "Te Tai-o-Aorere" },
	NELSON: { name: "Nelson", maori_name: "Whakatū" },
	MARLBOROUGH: { name: "Marlborough", maori_name: "Te Tauihu-o-te-waka" },
	WEST_COAST: { name: "West Coast", maori_name: "Te Tai Poutini" },
	CANTERBURY: { name: "Canterbury", maori_name: "Waitaha" },
	OTAGO: { name: "Otago", maori_name: "Ōtākou" },
	SOUTHLAND: { name: "Southland", maori_name: "Murihiku" },

	VISITOR: { name: "Visitor" }
}

const regionKeys = Object.keys(regions)

export const northIslandRegions = regionKeys.slice(0,9);
export const southIslandRegions = regionKeys.slice(9);

// TODO: typescript change string type
export function islandRegions(region: string) {
	if (northIslandRegions.indexOf(region) != -1) return northIslandRegions
	if (southIslandRegions.indexOf(region) != -1) return southIslandRegions
}

export function regionToString(region: string) {
	let str = regions[region].name
	// const maori_name = regions[region].maori_name
	// if (maori_name) {
	// 	str += " (" + maori_name + ")"
	// }
	return str
}

export default regions

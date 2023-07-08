import type { Region } from '@prisma/client'


const regions: {[key in Region]: {name: string, maori_name?: string}} = {
	NORTHLAND: { name: "Northland", maori_name: "Te Tai Tokerau" },
	AUCKLAND: { name: "Auckland", maori_name: "Tāmaki-makau-rau" },
	WAIKATO: { name: "Waikato" },
	BOP: { name: "Bay of Plenty", maori_name: "Te Moana-a-Toi" },
	GISBORNE: { name: "Gisborne", maori_name: "Te Tairāwhiti" },
	HAWKES_BAY: { name: "Hawke's Bay", maori_name: "Te Matau-a-Māui" },
	TARANAKI: { name: "Taranaki" },
	MANGAWATU_WHANGANUI: { name: "Manawatū-Whanganui" },
	WELLINGTON: { name: "Wellington", maori_name: "Te Whanga-nui-a-Tara" },
	TASMAN: { name: "Tasman", maori_name: "Te Tai-o-Aorere" },
	NELSON: { name: "Nelson", maori_name: "Whakatū" },
	MALBOROUGH: { name: "Marlborough", maori_name: "Te Tauihu-o-te-waka" },
	WEST_COAST: { name: "West Coast", maori_name: "Te Tai Poutini" },
	CANTERBURY: { name: "Canterbury", maori_name: "Waitaha" },
	OTAGO: { name: "Otago", maori_name: "Ōtākou" },
	SOUTHLAND: { name: "Southland", maori_name: "Murihiku" },
}

export default regions

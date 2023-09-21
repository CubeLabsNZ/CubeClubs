export const region = {
    NORTHLAND: "NORTHLAND",
    AUCKLAND: "AUCKLAND",
    WAIKATO: "WAIKATO",
    BOP: "BOP",
    GISBORNE: "GISBORNE",
    HAWKES_BAY: "HAWKES_BAY",
    TARANAKI: "TARANAKI",
    MANAWATU_WHANGANUI: "MANAWATU_WHANGANUI",
    WELLINGTON: "WELLINGTON",
    TASMAN: "TASMAN",
    NELSON: "NELSON",
    MARLBOROUGH: "MARLBOROUGH",
    WEST_COAST: "WEST_COAST",
    CANTERBURY: "CANTERBURY",
    OTAGO: "OTAGO",
    SOUTHLAND: "SOUTHLAND",
    VISITOR: "VISITOR"
} as const;
export type region = (typeof region)[keyof typeof region];
export const puzzle = {
    THREE: "THREE",
    TWO: "TWO",
    FOUR: "FOUR",
    FIVE: "FIVE",
    SIX: "SIX",
    SEVEN: "SEVEN",
    SQ1: "SQ1",
    SKEWB: "SKEWB",
    PYRA: "PYRA",
    MEGA: "MEGA",
    OH: "OH",
    CLOCK: "CLOCK",
    FMC: "FMC",
    THREEBLD: "THREEBLD",
    MULTIBLD: "MULTIBLD",
    FOURBLD: "FOURBLD",
    FIVEBLD: "FIVEBLD"
} as const;
export type puzzle = (typeof puzzle)[keyof typeof puzzle];
export const format = {
    BO3: "BO3",
    BO1: "BO1",
    MO3: "MO3",
    AO5: "AO5"
} as const;
export type format = (typeof format)[keyof typeof format];

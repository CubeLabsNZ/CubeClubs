export const Region = {
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
export type Region = (typeof Region)[keyof typeof Region];
export const Puzzle = {
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
export type Puzzle = (typeof Puzzle)[keyof typeof Puzzle];
export const Format = {
    BO3: "BO3",
    BO2: "BO2",
    BO1: "BO1",
    MO3: "MO3",
    AO5: "AO5"
} as const;
export type Format = (typeof Format)[keyof typeof Format];

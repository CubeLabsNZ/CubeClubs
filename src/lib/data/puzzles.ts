import { format, puzzle } from "$lib/db/enums.ts"

import * as Icons from "$lib/assets/cube-icons/icons";

const puzzles: {[key in puzzle]: { name: string, icon: string, allowedFormats: format[] }} = {
    THREE:      { name: "3x3",                          icon: Icons.Icon3,      allowedFormats: [format.AO5]},
    TWO:        { name: "2x2",                          icon: Icons.Icon2,      allowedFormats: [format.AO5]},
    FOUR:       { name: "4x4",                          icon: Icons.Icon4,      allowedFormats: [format.AO5]},
    FIVE:       { name: "5x5",                          icon: Icons.Icon5,      allowedFormats: [format.AO5]},
    SIX:        { name: "6x6",                          icon: Icons.Icon6,      allowedFormats: [format.MO3]},
    SEVEN:      { name: "7x7",                          icon: Icons.Icon7,      allowedFormats: [format.MO3]},

    SQ1:        { name: "Square-1",                     icon: Icons.IconSq1,    allowedFormats: [format.AO5]},
    SKEWB:      { name: "Skewb",                        icon: Icons.IconSkewb,  allowedFormats: [format.AO5]},
    PYRA:       { name: "Pyraminx",                     icon: Icons.IconPyra,   allowedFormats: [format.AO5]},
    MEGA:       { name: "Megaminx",                     icon: Icons.IconMega,   allowedFormats: [format.AO5]},
    OH:         { name: "3x3 One-handed",               icon: Icons.IconOH,     allowedFormats: [format.AO5]},
    CLOCK:      { name: "Clock",                        icon: Icons.IconClock,  allowedFormats: [format.AO5]},

    FMC:        { name: "3x3 Fewest Moves",             icon: Icons.IconFMC,    allowedFormats: [format.MO3, format.BO1]},
    THREEBLD:   { name: "3x3 Blindfolded",              icon: Icons.Icon3bld,   allowedFormats: [format.BO3]},
    MULTIBLD:   { name: "3x3 Multiple Blindfolded",     icon: Icons.IconMbld,   allowedFormats: [format.BO1]},
    FOURBLD:    { name: "4x4 Blindfolded",              icon: Icons.Icon4bld,   allowedFormats: [format.BO3]},
    FIVEBLD:    { name: "5x5 Blindfolded",              icon: Icons.Icon5bld,   allowedFormats: [format.BO3]},
}

export default puzzles;

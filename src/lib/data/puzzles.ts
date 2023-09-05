import type { Puzzle } from '@prisma/client';
import { Format } from "@prisma/client";

import * as Icons from "$lib/assets/cube-icons/icons";

const puzzles: {[key in Puzzle]: { name: string, icon: string, allowedFormats: Format[] }} = {
    THREE:      { name: "3x3",                          icon: Icons.Icon3,      allowedFormats: [Format.AO5]},
    TWO:        { name: "2x2",                          icon: Icons.Icon2,      allowedFormats: [Format.AO5]},
    FOUR:       { name: "4x4",                          icon: Icons.Icon4,      allowedFormats: [Format.AO5]},
    FIVE:       { name: "5x5",                          icon: Icons.Icon5,      allowedFormats: [Format.AO5]},
    SIX:        { name: "6x6",                          icon: Icons.Icon6,      allowedFormats: [Format.MO3]},
    SEVEN:      { name: "7x7",                          icon: Icons.Icon7,      allowedFormats: [Format.MO3]},

    SQ1:        { name: "Square-1",                     icon: Icons.IconSq1,    allowedFormats: [Format.AO5]},
    SKEWB:      { name: "Skewb",                        icon: Icons.IconSkewb,  allowedFormats: [Format.AO5]},
    PYRA:       { name: "Pyraminx",                     icon: Icons.IconPyra,   allowedFormats: [Format.AO5]},
    MEGA:       { name: "Megaminx",                     icon: Icons.IconMega,   allowedFormats: [Format.AO5]},
    OH:         { name: "3x3 One-handed",               icon: Icons.IconOH,     allowedFormats: [Format.AO5]},
    CLOCK:      { name: "Clock",                        icon: Icons.IconClock,  allowedFormats: [Format.AO5]},

    FMC:        { name: "3x3 Fewest Moves",             icon: Icons.IconFMC,    allowedFormats: [Format.MO3, Format.BO1]},
    THREEBLD:   { name: "3x3 Blindfolded",              icon: Icons.Icon3bld,   allowedFormats: [Format.BO3]},
    MULTIBLD:   { name: "3x3 Multiple Blindfolded",     icon: Icons.IconMbld,   allowedFormats: [Format.BO1]},
    FOURBLD:    { name: "4x4 Blindfolded",              icon: Icons.Icon4bld,   allowedFormats: [Format.BO3]},
    FIVEBLD:    { name: "5x5 Blindfolded",              icon: Icons.Icon5bld,   allowedFormats: [Format.BO3]},
}

export default puzzles;

import type { Puzzle } from '@prisma/client';
import { Format } from "@prisma/client";

import * as Icons from "$lib/assets/cube-icons/icons";

// TODO: add icon name
const puzzles: {[key in Puzzle]: { name: string, icon: string, format: Format }} = {
    THREE: { name: "3x3", icon: Icons.Icon3, format: Format.AO5 },
    TWO: { name: "2x2", icon: Icons.Icon2, format: Format.AO5 },
    FOUR: { name: "4x4", icon: Icons.Icon4, format: Format.AO5 },
    FIVE: { name: "5x5", icon: Icons.Icon5, format: Format.AO5 },
    SIX: { name: "6x6", icon: Icons.Icon6, format: Format.MO3 },
    SEVEN: { name: "7x7", icon: Icons.Icon7, format: Format.MO3 },

    SQ1: { name: "Square-1", icon: Icons.IconSq1, format: Format.AO5 },
    SKEWB: { name: "Skewb", icon: Icons.IconSkewb, format: Format.AO5 },
    PYRA: { name: "Pyraminx", icon: Icons.IconPyra, format: Format.AO5 },
    MEGA: { name: "Megaminx", icon: Icons.IconMega, format: Format.AO5 },
    OH: { name: "3x3 One-handed", icon: Icons.IconOH, format: Format.AO5 },
    CLOCK: { name: "Clock", icon: Icons.IconClock, format: Format.AO5 },

    FMC: { name: "3x3 Fewest Moves", icon: Icons.IconFMC, format: Format.MO3 },
    THREEBLD: { name: "3x3 Blindfolded", icon: Icons.Icon3bld, format: Format.BO3 },
    MULTIBLD: { name: "3x3 Multiple Blindfolded", icon: Icons.IconMbld, format: Format.BO1 },
    FOURBLD: { name: "4x4 Blindfolded", icon: Icons.Icon4bld, format: Format.BO3 },
    FIVEBLD: { name: "5x5 Blindfolded", icon: Icons.Icon5bld, format: Format.BO3 },
}

export default puzzles;

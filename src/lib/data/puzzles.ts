import type { Puzzle } from '@prisma/client'

import * as Icons from "$lib/assets/cube-icons/icons";

// TODO: add icon name
const puzzles: {[key in Puzzle]: { name: string, icon: string }} = {
    THREE: { name: "3x3", icon: Icons.Icon3 },
    TWO: { name: "2x2", icon: Icons.Icon2 },
    FOUR: { name: "4x4", icon: Icons.Icon4 },
    FIVE: { name: "5x5", icon: Icons.Icon5 },
    SIX: { name: "6x6", icon: Icons.Icon6 },
    SEVEN: { name: "7x7", icon: Icons.Icon7 },

    SQ1: { name: "Square-1", icon: Icons.IconSq1 },
    SKEWB: { name: "Skewb", icon: Icons.IconSkewb },
    PYRA: { name: "Pyraminx", icon: Icons.IconPyra },
    MEGA: { name: "Megaminx", icon: Icons.IconMega },
    OH: { name: "3x3 One-handed", icon: Icons.IconOH },
    CLOCK: { name: "Clock", icon: Icons.IconClock },

    FMC: { name: "3x3 Fewest Moves", icon: Icons.IconFMC },
    THREEBLD: { name: "3x3 Blindfolded", icon: Icons.Icon3bld },
    MULTIBLD: { name: "3x3 Multiple Blindfolded", icon: Icons.IconMbld },
    FOURBLD: { name: "4x4 Blindfolded", icon: Icons.Icon4bld },
    FIVEBLD: { name: "5x5 Blindfolded", icon: Icons.Icon5bld },
}

export default puzzles;

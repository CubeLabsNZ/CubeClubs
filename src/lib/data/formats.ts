import type { Format } from '@prisma/client'


const formats: {[key in Format]: { name: string }} = {
    BO3: { name: "Best of 3" },
    BO1: { name: "Best of 1" },
    MO3: { name: "Mean of 3" },
    AO5: { name: "Average of 5" }
}

export default formats;


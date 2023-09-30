import type { Format } from '@prisma/client'


const formats: {[key in Format]: { name: string, count: number }} = {
    BO3: { name: "Best of 3", count: 3 },
    BO2: { name: "Best of 2", count: 2 },
    BO1: { name: "Best of 1", count: 1 },
    MO3: { name: "Mean of 3", count: 3 },
    AO5: { name: "Average of 5", count: 5 }
}

export default formats;


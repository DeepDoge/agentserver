import { Field } from "~/libs/database/Schema.ts";

export type VoidField = Field<void>;
export function VoidField(): VoidField {
    return {
        columns: () => [],
        toRow: () => ({}),
        fromRow: () => void 0,
    };
}

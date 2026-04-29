import { ColumnDataType } from "@kysely/kysely";
import { ShapeGeneric } from "~/libs/database/fields/StructField.ts";

export type Column = {
    name: string;
    type: ColumnDataType;
};

// deno-lint-ignore no-explicit-any
export type FieldGeneric = Field<any>;
export type Field<T> = {
    columns(name: string): Column[];
    toRow(name: string, value: T): Record<string, unknown>;
    fromRow(name: string, row: Record<string, unknown>): T;
};
export type FieldValue<T extends FieldGeneric> = T extends Field<infer U> ? U : never;

export type CollectionGeneric = Collection<ShapeGeneric>;
export type Collection<TShape extends ShapeGeneric> = {
    name: string;
    shape: TShape;
};
export type CollectionValue<T extends CollectionGeneric> = { [K in keyof T["shape"]]: FieldValue<T["shape"][K]> };

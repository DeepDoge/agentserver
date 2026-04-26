import { OptionalCodec, Str, StructCodec, UnionCodec, Void } from "@nomadshiba/codec";

const TemplateInput = new UnionCodec({
    default: Void,
});

export const AgentInput = new StructCodec({
    name: Str,
    template: TemplateInput,
});

export const AgentPartialInput = new StructCodec({
    name: new OptionalCodec(Str),
    template: new OptionalCodec(TemplateInput),
});
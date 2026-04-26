import { Codec } from "@nomadshiba/codec";
import { db } from "~/database/client.ts";
import { AgentOutput } from "~/handlers/agents/AgentOutput.ts";
import { router } from "~/router.ts";

router.registerHandler("GET /v1/agents", async () => {
    const rows = await db.selectFrom("agent")
        .selectAll("agent")
        .execute();

    const agents: Codec.InferInput<typeof AgentOutput>[] = [];
    for (const row of rows) {
        let template: Codec.InferInput<typeof AgentOutput>["template"] | undefined;
        if (row.template_kind === "default") {
            template = {
                kind: "default",
                value: null,
            };
        } else {
            return {
                status: "NotImplemented",
                message: `Template kind not implemented: ${row.template_kind}`,
            };
        }

        agents.push({
            id: row.id,
            name: row.name,
            template,
            created: row.created,
            updated: row.updated,
        });
    }

    return {
        status: "OK",
        data: agents,
    };
});
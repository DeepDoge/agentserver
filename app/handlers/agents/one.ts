import { Codec } from "@nomadshiba/codec";
import { db } from "~/database/client.ts";
import { AgentOutput } from "~/handlers/agents/AgentOutput.ts";
import { router } from "~/router.ts";

router.registerHandler("GET /v1/agents/:agentId", async ({ params }) => {
    const id = params.pathname.agentId;

    const agentRow = await db.selectFrom("agent")
        .where("agent.id", "=", id)
        .selectAll("agent")
        .executeTakeFirst();

    if (!agentRow) {
        return { status: "NotFound" };
    }

    let template: Codec.InferInput<typeof AgentOutput>["template"] | undefined;
    if (agentRow.template_kind === "default") {
        template = {
            kind: "default",
            value: null,
        };
    } else {
        return {
            status: "NotImplemented",
            message: `Template kind not implemented: ${agentRow.template_kind}`,
        };
    }

    return {
        status: "OK",
        data: {
            id: agentRow.id,
            name: agentRow.name,
            template,
            created: agentRow.created,
            updated: agentRow.updated,
        },
    };
});
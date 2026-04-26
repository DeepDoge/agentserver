import { Updateable } from "@kysely/kysely";
import { db } from "~/database/client.ts";
import { Agent } from "~/database/generated/types.ts";
import { RouteHandlerResult } from "~/libs/Router.ts";
import { router } from "~/router.ts";
import { RoutesSchema } from "~/routes.ts";

router.registerHandler("PATCH /v1/agents/:agentId", async ({ params, data }) => {
    const id = params.pathname.agentId;
    const now = Date.now();

    return await db.transaction().execute(async (tx): Promise<RouteHandlerResult<RoutesSchema, "PATCH /v1/agents/:agentId">> => {
        const agentValues: Updateable<Agent> = { updated: now };

        if (data.name) {
            agentValues.name = data.name;
        }

        if (data.template) {
            agentValues.template_kind = data.template.kind;

            if (data.template.kind === "default") {
                await tx.insertInto("agent_template_kind_default")
                    .values({ id })
                    .onConflict((oc) =>
                        oc.columns(["id"]).doNothing()
                    )
                    .executeTakeFirstOrThrow();
            } else {
                return {
                    status: "NotImplemented",
                    message: `Template not implemented: ${data.template.kind satisfies never}`,
                };
            }
        }

        const result = await tx.updateTable("agent")
            .set(agentValues)
            .where("agent.id", "=", id)
            .executeTakeFirstOrThrow();

        if (!result.numUpdatedRows) {
            return { status: "NotFound" };
        }

        return {
            status: "OK",
            data: null,
        };
    });
});
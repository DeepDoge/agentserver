import { db } from "~/database/client.ts";
import { router } from "~/router.ts";
import { RouteHandlerResult } from "~/libs/Router.ts";
import { RoutesSchema } from "~/routes.ts";

router.registerHandler("POST /v1/agents", async ({ data }) => {
    const id = crypto.randomUUID();
    const now = Date.now();

    return await db.transaction().execute(async (tx): Promise<RouteHandlerResult<RoutesSchema, "POST /v1/agents">> => {
        await tx.insertInto("agent")
            .values({
                id,
                name: data.name,
                template_kind: data.template.kind,
                created: now,
                updated: now,
            })
            .execute();

        if (data.template.kind === "default") {
            await tx.insertInto("agent_template_kind_default")
                .values({ id })
                .execute();
        } else {
            return {
                status: "NotImplemented",
                message: `Template not implemented: ${data.template.kind satisfies never}`,
            };
        }

        return {
            status: "OK",
            data: null,
        };
    });
});
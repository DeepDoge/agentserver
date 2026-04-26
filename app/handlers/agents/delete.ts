import { db } from "~/database/client.ts";
import { router } from "~/router.ts";

router.registerHandler("DELETE /v1/agents/:agentId", async ({ params }) => {
    const id = params.pathname.agentId;

    const result = await db.deleteFrom("agent")
        .where("agent.id", "=", id)
        .executeTakeFirstOrThrow();

    if (!result.numDeletedRows) {
        return { status: "NotFound" };
    }

    return { status: "OK", data: null };
});
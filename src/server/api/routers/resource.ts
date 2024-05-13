import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const resourceRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.resources.findMany({
      orderBy: {
        last_modified: "desc",
      },
    });
  }),

  // getAll: publicProcedure.query(({ ctx }) => {
  //   return ctx.db.resources.findMany();
  // }),

  update: publicProcedure
    .input(
      z.object({
        id_resources: z.number(),
        resource_key: z.string().min(1),
        resource_value: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return ctx.db.resources.update({
        where: {
          id_resources: input.id_resources,
        },
        data: {
          resource_key: input.resource_key,
          resource_value: input.resource_value,
        },
      });
    }),
});

import { createRouter } from "./context";
import { z } from "zod";
import { prisma } from '@/server/db/client';

export const exampleRouter = createRouter()
  .query("hello", {
    input: z
      .object({
        text: z.string().nullish(),
      })
      .nullish(),
    resolve({ input }) {
      return {
        greeting: `Hello ${input?.text ?? "world"}`,
      };
    },
  })
  .query("getPlayersInfoByIds", {
    input: z.object({
      playerIds: z.array(z.string())
    }).nullish(),
    async resolve({ input }) {
      const playersInfo = await prisma.player.findMany({
        where: {id: {in: input?.playerIds} }
      });
      const playersInfoById: {[playerId: string]: typeof playersInfo[0]} = playersInfo.reduce((acc, player) => {
        return {...acc, [player.id]: player};
      }, {})
      return playersInfoById;
    }
  });

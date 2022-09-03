import { createRouter } from "./context";
import { z } from "zod";
import { Readability } from "@mozilla/readability";
import axios from "axios";
import { JSDOM } from "jsdom";

export const articleRouter = createRouter()
  .query("getAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.article.findMany();
    },
  })
  .query("getFavorite", {
    async resolve({ ctx }) {
      return await ctx.prisma.article.findMany({
        where: {
          isFavorite: true,
        },
      });
    },
  })
  .query("getFilteredByName", {
    input: z.object({
      name: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.article.findMany({
        where: {
          title: {
            contains: input.name,
          },
        },
      });
    },
  })
  .mutation("create", {
    input: z.object({
      url: z.string(),
    }),
    async resolve({ ctx, input }) {
      const response = await axios.get(input.url);
      const doc = new JSDOM(response.data);
      const reader = new Readability(doc.window.document);
      const article = reader.parse();
      return await ctx.prisma.article.create({
        data: {
          title: article?.title || doc.window.document.title,
          urlDomain: input.url,
          isFavorite: false,
          tags: [],
        },
      });
    },
  });

import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const store = mutation({
  args: { key: v.string(), value: v.any() },
  handler: async (ctx, args) => {
    const { key, value } = args;
    await ctx.db.insert('memories', { key, value });
  },
});

export const get = query({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    const memory = await ctx.db
      .query('memories')
      .filter(q => q.eq(q.field('key'), args.key))
      .first();
    return memory?.value;
  },
});

export const update = mutation({
  args: { key: v.string(), value: v.any() },
  handler: async (ctx, args) => {
    const { key, value } = args;
    const existing = await ctx.db
      .query('memories')
      .filter(q => q.eq(q.field('key'), key))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, { value });
    } else {
      await ctx.db.insert('memories', { key, value });
    }
  },
});

export const delete = mutation({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('memories')
      .filter(q => q.eq(q.field('key'), args.key))
      .first();
    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query('memories').collect();
  },
});
import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    plan: v.union(v.literal('free'), v.literal('pro')),

    // free plan limit track
    projectsUsed: v.number(),
    exportsThisMonth: v.number(),

    createdAt: v.number(),
    lastActiveAt: v.number(),

    imageUrl: v.optional(v.string()),
    tokenIdentifier: v.string(),
  }).index('by_token', ['tokenIdentifier']),
})

import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  // ---
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

  projects: defineTable({
    // basic info
    title: v.string(),
    userId: v.id('users'),

    // canvas
    canvasState: v.any(),
    width: v.number(),
    height: v.number(),

    originalImageUrl: v.optional(v.string()),
    currentImageUrl: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),

    // imageKit state
    activeTransformations: v.optional(v.string()),
    backgroundRemoved: v.optional(v.boolean()),

    // organization
    folderId: v.optional(v.id('folders')),

    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_user_updated', ['userId', 'updatedAt'])
    .index('by_folder_id', ['folderId']),

  // ---
  folders: defineTable({
    name: v.string(),
    userId: v.id('users'), // owner
    createdAt: v.number(),
  }).index('by_user', ['userId']),
})

/*
  Plan limits:
    - Free: 3 projects, 20 exports/month, basic features
    - Pro: Unlimited projects/exports, all features
*/

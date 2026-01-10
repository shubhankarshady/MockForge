/** @type {import("drizzle-kit").Config} */

export default{
    schema : "./utils/schema.js",
    dialect: "postgresql",
    dbCredentials: {
    url:  'postgresql://neondb_owner:npg_CL79hWtlYgqT@ep-hidden-term-ah1lgydy-pooler.c-3.us-east-1.aws.neon.tech/Interview_Prep?sslmode=require&channel_binding=require',
  }
}
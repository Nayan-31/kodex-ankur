import Redis from "ioredis"
import config from "./config.js"

let redisClient

export function getRedisClient() {
    if (!redisClient) {
        redisClient = createRedisClient()
    }
    return redisClient
}

export function createRedisClient() {

    redisClient = new Redis(config.REDIS_URI)

    redisClient.on("connect", () => {
        console.log("Connected to Redis")
    })

    redisClient.on("error", (err) => {
        console.error("Redis error:", err)
    })

    return redisClient
}
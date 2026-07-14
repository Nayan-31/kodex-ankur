import request from 'supertest';
import app from "../app/app.js"




import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';


let mongoServer;


beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri())
})

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
    mongoServer = null;
})


describe("Testing Register API", () => {

    test("Should register new user", async () => {

        const response = await request(app)
            .post("/api/auth/register")
            .send({
                username: "testuser",
                email: "testuser@example.com",
                password: "password123"
            })

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty("message", "User registered successfully");
        expect(response.body).toHaveProperty("data.user.username", "testuser");
        expect(response.body).toHaveProperty("data.user.email", "testuser@example.com");

    })

    test("Should return 400 if username is missing", async () => {

        const response = await request(app)
            .post("/api/auth/register")
            .send({
                email: "test@gmail.com"
            })


        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty("errors", expect.arrayContaining([
            expect.objectContaining({
                msg: "Username is required",
                path: "username"
            })
        ]));

    })

    test("Should return 409 if username or email already exists", async () => {

        await request(app)
            .post("/api/auth/register")
            .send({
                username: "testuser",
                email: "test@gamil.com",
                password: "password123"
            })

        const response = await request(app)
            .post("/api/auth/register")
            .send({
                username: "testuser",
                email: "test@gmail.com",
                password: "password123"
            })

        expect(response.statusCode).toBe(409);
        expect(response.body).toHaveProperty("errors", expect.arrayContaining([
            expect.objectContaining({
                msg: "Username already exists",
                path: "username"
            })
        ]));

    })

})



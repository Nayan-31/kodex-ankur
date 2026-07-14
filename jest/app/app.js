import express from 'express';
import userModel from './models/user.model.js';


const app = express();

app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello World!');
});



app.post("/api/auth/register", async (req, res) => {

    const { username, email, password } = req.body;


    if (!username) {
        return res.status(400).json({
            errors: [
                {
                    msg: "Username is required",
                    path: "username"
                }
            ]
        })
    }

    const isUserExists = await userModel.findOne({ $or: [ { username }, { email } ] });

    if (isUserExists) {

        const errors = [];

        if (isUserExists.username === username) {
            errors.push({
                msg: "Username already exists",
                path: "username"
            })
        }

        if (isUserExists.email === email) {
            errors.push({
                msg: "Email already exists",
                path: "email"
            })
        }

        return res.status(409).json({
            errors
        })

    }

    const user = await userModel.create({
        username,
        email,
        password
    })

    res.status(201).json({
        message: "User registered successfully",
        data: {
            user: {
                username: user.username,
                email: user.email
            }
        }
    })
})

export default app;
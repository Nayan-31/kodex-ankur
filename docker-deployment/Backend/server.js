import express from "express";
import morgan from "morgan";


const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.static("public"));


app.get("/api", (req, res) => {
    res.status(200).json({ message: "Hello from the backend!" });
})

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})
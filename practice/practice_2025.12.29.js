const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Express server is running");
});

app.post("/chat", (req, res) => {
    const {question} = req.body;

    if (!question) {
        return res.status(400).json({error: "question is required"});
    };

    res.json({
        answer: `You asked: ${question}`,
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
});
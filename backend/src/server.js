import express from "express";
import { ENV } from "./config/env.js";
import { db } from "./config/db.js";
import { favoritesTable } from "./db/schema.js";

const app = express();
const PORT = ENV.PORT || 5001;

app.use(express.json());

app.get("/api/health", (req, res) => {
    res.status(200).json({success: true});});

app.post("/api/favorites", async (req, res) => {
    
    try{
        const { userId, recipeId, title, image, cookTime, servings } = req.body;
        
        if(!userId || !recipeId || !title) {
            return res.status(400).json({success: false, error: "Missing required fields"});
        }

        const newFavorite = await db.insert(favoritesTable).values({
            userId,
            recipeId,
            title,
            image,
            cookTime,
            servings
        })
        .returning();

        res.status(201).json(newFavorite[0]);
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, error: "Internal Server Error"});
    }    
});

app.listen(PORT, () => {
    console.log("Server started on PORT:", PORT);
});
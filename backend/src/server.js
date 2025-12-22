import express from "express";
import { ENV } from "./config/env.js";
import { db } from "./config/db.js";
import { favoritesTable } from "./db/schema.js";
import { eq, and } from "drizzle-orm";

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

app.delete("/api/favorites/:userId/:recipeId", async (req, res) => {
    try {
        const { userId, recipeId } = req.params;
        const deletedFavorite = await db.delete(favoritesTable).where(
            and(eq(favoritesTable.userId, userId), eq(favoritesTable.recipeId, recipeId)));
        res.status(200).json({message: "Favorite deleted successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, error: "Internal Server Error"});
    }
});

app.get("/api/favorites/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const favorites = await db.select().from(favoritesTable).where(eq(favoritesTable.userId, userId));
        res.status(200).json(favorites);
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, error: "Internal Server Error"});
    }
});

app.listen(PORT, () => {
    console.log("Server started on PORT:", PORT);
});
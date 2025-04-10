import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import { v4 as uuidv4 } from "uuid";
import { Request, Response } from "express";

// Firebase Admin 초기화
admin.initializeApp();

// Firestore 참조 생성
const db = admin.firestore();

// POST 요청으로 Firestore에 데이터 추가
export const insertBaristaBrewingRecipe = onRequest(
  async (req: Request, res: Response) => {
    try {
      if (req.method !== "POST") {
        res.status(405).send("Method Not Allowed");
        return;
      }

      const data = req.body;

      if (!data || !Array.isArray(data.steps)) {
        res.status(400).send("Invalid data");
        return;
      }

      const id = uuidv4().toUpperCase();
      const { steps, ...recipeData } = data;

      const recipeRef = db.collection("barista_brewing_recipes").doc(id);

      await recipeRef.set({
        id: id,
        ...recipeData,
        steps: steps,
      });

      const batch = db.batch();
      steps.forEach((step: any) => {
        const stepRef = recipeRef.collection("steps").doc();
        batch.set(stepRef, step);
      });
      await batch.commit();

      res.status(201).json({
        message: "Recipe and steps saved with custom ID",
        documentId: id,
      });

      logger.info("Recipe with steps created", { documentId: id });
    } catch (error) {
      logger.error("Error creating recipe with steps", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

// POST 요청으로 Firestore에 데이터 추가
export const insertBaristaBrewingRecipeTest = onRequest(
  async (req: Request, res: Response) => {
    try {
      if (req.method !== "POST") {
        res.status(405).send("Method Not Allowed");
        return;
      }

      const data = req.body;

      if (!data || !Array.isArray(data.steps)) {
        res.status(400).send("Invalid data");
        return;
      }

      const id = uuidv4().toUpperCase();
      const { steps, ...recipeData } = data;

      const recipeRef = db.collection("barista_brewing_recipes_test").doc(id);

      await recipeRef.set({
        id: id,
        ...recipeData,
        steps: steps,
      });

      const batch = db.batch();
      steps.forEach((step: any) => {
        const stepRef = recipeRef.collection("steps").doc();
        batch.set(stepRef, step);
      });
      await batch.commit();

      res.status(201).json({
        message: "Recipe and steps saved with custom ID",
        documentId: id,
      });

      logger.info("Recipe with steps created", { documentId: id });
    } catch (error) {
      logger.error("Error creating recipe with steps", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

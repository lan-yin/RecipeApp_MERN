import { RecipeModel } from "../models/Recipes.js";
import express from "express";
import { UserModel } from "../models/Users.js";
import { verifyToken } from "./users.js";

const router = express.Router();

// get return all of the recipes for Home page
router.get("/", async (req, res) => {
  try {
    const response = await RecipeModel.find({});
    return res.json(response);
  } catch (err) {
    return res.json(err);
  }
});

// create recipe
router.post("/", verifyToken, async (req, res) => {
  const recipe = new RecipeModel(req.body);
  try {
    await recipe.save();
    return res.json(recipe);
  } catch (err) {
    return res.json(err);
  }
});

// save recipe with login user
router.put("/", verifyToken, async (req, res) => {
  try {
    const recipe = await RecipeModel.findById(req.body.recipeID);
    const user = await UserModel.findById(req.body.userID);
    // console.log(recipe)
    user.savedRecipes.push(recipe);
    await user.save();
    return res.status(201).json({
      savedRecipes: user.savedRecipes,
    });
  } catch (err) {
    return res.status(500).json(err);
  }
});

// get the list of all recipe's ID => UserModel: type: mongoose.Schema.Types.ObjectId
router.get("/savedRecipes/ids/:userID", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userID);
    return res.json({ savedRecipes: user?.savedRecipes });
  } catch (err) {
    return res.json(err);
  }
});

// get saved recipes type of objects
router.get("/savedRecipes/:userID", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userID);
    const savedRecipes = await RecipeModel.find({
      _id: { $in: user.savedRecipes },
    });
    return res.json({ savedRecipes });
  } catch (err) {
    return res.json(err);
  }
});

// remove saved recipeID in user.savedRecipes
router.put("/removeRecipe", async (req, res) => {
  try {
    const recipeID = req.body.recipeID;
    const user = await UserModel.findById(req.body.userID);
    const oldSavedLength = user.savedRecipes.length;
    user.savedRecipes.pull(recipeID);
    await user.save();
    const newSavedLength = user.savedRecipes.length;
    if (oldSavedLength == newSavedLength) {
      return res.json({ message: "This recipe is not exist." });
    } else {
      return res.json({
        savedRecipes: user.savedRecipes,
      });
    }
  } catch (err) {
    return res.json(err);
  }
});

// delete recipe TODO
router.delete("/", async (req, res) => {
  try {
    await RecipeModel.findOneAndDelete({ _id: req.body.recipeID, userOwner: req.body.userID });
    await recipe.save();
    const result = await RecipeModel.find({}).select({ "userOwner": req.body.userID }).exec();
    console.log(result)
    return res.json(result);
  } catch (err) {
    return res.json(err);
  }
});

export { router as recipesRouter };

import { React, useState, useEffect } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";

const SavedRecipes = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const userID = useGetUserID();

  // CAN'T useEffect( async() => {}), so we declare a funciton inside useEffect
  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get(`https://eattodie-backend.vercel.app/recipes/savedRecipes/${userID}`);
        setSavedRecipes(response.data.savedRecipes);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSavedRecipes();
  }, []);

  const removeRecipe = async (recipeID) => {
    try {
      await axios.put("https://eattodie-backend.vercel.app/recipes/removeRecipe", { userID, recipeID });
      setSavedRecipes((oldValue) => {
        return oldValue.filter((recipeid) => recipeid._id !== recipeID);
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Saved Recipes</h1>
      <ul>
        {savedRecipes.map((recipe) => (
          <li key={recipe._id}>
            <div className="savedPageTitle">
              <h2>{recipe.name}</h2>
              <button onClick={() => removeRecipe(recipe._id)}>Remove</button>
            </div>
            <div className="instructions">
              <p>{recipe.instructions}</p>
            </div>
            <img src={recipe.imageUrl} alt={recipe.name} />
            <p> Cooking Time: {recipe.cookingTime} (minutes)</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SavedRecipes;

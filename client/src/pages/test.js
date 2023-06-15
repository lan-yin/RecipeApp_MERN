import { React, useState, useEffect } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";

const Test = () => {
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const userID = useGetUserID();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/recipes/savedRecipesObject/${userID}`);
        setRecipes(response.data.savedRecipes);
        // console.log(response.data.savedRecipes);
      } catch (err) {
        console.error(err);
      }
    };
    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/recipes/savedRecipes/${userID}`);
        setSavedRecipes(response.data.savedRecipes);
        // console.log(response.data.savedRecipes);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRecipes()
    fetchSavedRecipes();
  }, []);

    const removeRecipe = async (removeRecipeID) => {
      try {
        const response = await axios.put(`http://localhost:3001/recipes/removeRecipe/${removeRecipeID}`, { userID });
        console.log(response);
        setSavedRecipes((oldValue) => {
        //   console.log(oldValue);
          return oldValue.filter((recipeid) => recipeid._id !== removeRecipeID);
        });
      } catch (err) {
        console.error(err);
      }
    };

  return (
    <div>
      <h1>Hello Test</h1>
      <button
          onClick={() => {
            removeRecipe("647d4cc0a10a0fd92f61129f");
          }}
        >
          removeOne
        </button>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe._id}>
            <div className="savedPageTitle">
              <h2>{recipe.name}</h2>
              {/* <button onClick={() => removeRecipe(recipe._id)}>Remove</button> */}
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

export default Test;

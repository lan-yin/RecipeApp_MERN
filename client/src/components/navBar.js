import React from "react";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const [cookie, setCoolies] = useCookies(["access_token"]);
  const navigate = useNavigate();

  const logout = () => {
    setCoolies("access_token", "");
    window.localStorage.removeItem("userID");
    navigate("/auth");
  };

  return (
    <div className="navbar">
      <Link to="/">Home</Link>
      <Link to="/create-recipe">Create Recipe</Link>

      {!cookie.access_token ? (
        <Link to="/auth">Login/Register</Link>
      ) : (
        <>
          <Link to="/saved-recipes">Saved Recipes</Link>
            <button onClick={logout}>Logout</button>
        </>
      )}
    </div>
  );
};

export default NavBar;

import { Outlet, useLocation } from "react-router-dom"
import useAuth from "../hooks/useAuth";
import LoadingSpinner from "./LoadingSpinner";
import NavBar from "./NavBar";
import HomePage from "../../features/Home/HomePage";
import useTravel from "../hooks/useTravels";

function App() {
  const location = useLocation();
  const {loading, isLoggedIn} = useAuth();
  const {loadingTravels} = useTravel();
  if(loading && loadingTravels) {
    return (
      <LoadingSpinner/>
    )
  }
  return (
    <>
      {location.pathname === '/' ? <HomePage/> : (
        <>
        {isLoggedIn && <NavBar/>}
          <Outlet/>
        </>
      )}
    </>
  )
}

export default App

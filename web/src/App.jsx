import { Home } from "./Home";
import { Login } from "./Login";
import { useState } from "react"


export function App() {
  const [user, setUser] = useState()


  return (
    user ? <Home /> : <Login signInUser={setUser} />
  )
}
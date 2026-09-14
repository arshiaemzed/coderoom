import LoginScreen from "./pages/Login";
import { Route, Routes } from "react-router";
import Rooms from "./pages/Rooms";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginScreen />}></Route>
      <Route path="/rooms" element={<Rooms />}></Route>
    </Routes>
  );
}

export default App;

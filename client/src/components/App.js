import "./App.css";
import AppRouter from "./Router";
import { ToastContainer } from "react-toastify";
import { LoginProvider } from "../context/LoginContext";
function App() {
  return (
    <div>
      <LoginProvider>
        <AppRouter />
        <ToastContainer position="top-center"
  autoClose={3000}
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover />
      </LoginProvider>
    </div>
  );
}

export default App;

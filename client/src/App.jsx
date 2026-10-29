import { Routes, Route } from "react-router";
import { HomePage } from "./pages/HomePage";
import { SignupPage } from "./pages/SignupPage";
import { LoginPage } from "./pages/LoginPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { Sidebar } from "./components/common/Sidebar";
import { RightPanel } from "./components/common/RightPanel";
import { NotificationPage } from "./pages/NotificationPage";

function App() {
  return (
    <div className="flex max-w-6xl mx-auto">
      <Sidebar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/profile/:username" element={<></>} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <RightPanel />
    </div>
  );
}

export default App;

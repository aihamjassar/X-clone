import { Routes, Route, Navigate } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { SignupPage } from "./pages/SignupPage";
import { LoginPage } from "./pages/LoginPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { Sidebar } from "./components/common/Sidebar";
import { RightPanel } from "./components/common/RightPanel";
import { NotificationPage } from "./pages/NotificationPage";
import { ProfilePage } from "./pages/ProfilePage";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "./components/ui/spinner";

function App() {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await fetch(`/api/v1/auth/check-auth`, {
        credentials: "include",
      });
      const data = await res.json();

      if (data.error) return null;
      if (!res.ok) throw new Error(data?.error || "Something went wrong");
      return data;
    },
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Spinner className="size-10" />
      </div>
    );
  }

  return (
    <div className="flex max-w-6xl mx-auto">
      {authUser && <Sidebar />}
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignupPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/notifications"
          element={authUser ? <NotificationPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile/:username"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      {authUser && <RightPanel />}
    </div>
  );
}

export default App;

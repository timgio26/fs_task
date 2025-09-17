import { Outlet } from "react-router";
import { useAuth } from "../Utils/useAuth";
import { Toaster } from "react-hot-toast";

export function Layout() {
  const { token, setToken } = useAuth();

  return (
    <>
      <Toaster />
      <div className="flex flex-col h-dvh">
        <nav className="flex flex-row justify-between bg-gray-200">
          <div>My Task</div>
          <div>
            {token && <span onClick={() => setToken("")}>Log Out</span>}
          </div>
        </nav>
        <div className="grow overflow-auto">
          <Outlet />
        </div>
      </div>
    </>
  );
}

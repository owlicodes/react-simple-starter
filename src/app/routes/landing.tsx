import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useUser } from "@/lib/auth";
import { PATHS } from "./paths";

export const LandingRoute = () => {
  const user = useUser();
  const navigate = useNavigate();

  const handleStart = () => {
    if (user.data) {
      navigate(PATHS.app.root);
    } else {
      navigate(PATHS.auth.login);
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-4 text-gray-700 mt-4">
      <h1 className="text-2xl font-semibold">react-simple-starter</h1>
      <Button onClick={handleStart}>Get Started</Button>
    </div>
  );
};

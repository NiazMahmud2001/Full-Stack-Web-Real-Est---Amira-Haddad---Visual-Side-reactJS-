import { useCallback, useEffect, useState } from "react";
import { isVerifiedAdmin, signOut } from "./lib/adminAuth";
import LoginScreen from "./components/LoginScreen";
import Dashboard from "./components/Dashboard";

/**
 * The /admin page. It shows the two-step sign-in until the database confirms
 * this browser's login is a verified admin session, then the dashboard.
 * Setup steps are in src/admin/README.md.
 */
export default function AdminApp() {
  const [stage, setStage] = useState("checking"); // checking | sign-in | dashboard
  const [notice, setNotice] = useState("");

  useEffect(() => {
    document.title = "Admin · Dubai Property Explorer";
    let cancelled = false;

    isVerifiedAdmin().then(async (verified) => {
      // A sign-in that never finished step 2 isn't kept around.
      if (!verified) await signOut();
      if (!cancelled) setStage(verified ? "dashboard" : "sign-in");
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const leave = useCallback(async () => {
    await signOut();
    setNotice("");
    setStage("sign-in");
  }, []);

  const sessionEnded = useCallback(async () => {
    await signOut();
    setNotice("Your admin session has ended. Sign in again to continue.");
    setStage("sign-in");
  }, []);

  if (stage === "checking") {
    return (
      <div className="grid min-h-screen place-items-center bg-sand font-heading text-[10px] uppercase tracking-label text-ink/50">
        Checking your session…
      </div>
    );
  }

  if (stage === "sign-in") {
    return (
      <LoginScreen
        notice={notice}
        onSignedIn={() => {
          setNotice("");
          setStage("dashboard");
        }}
      />
    );
  }

  return <Dashboard onSignOut={leave} onSessionExpired={sessionEnded} />;
}

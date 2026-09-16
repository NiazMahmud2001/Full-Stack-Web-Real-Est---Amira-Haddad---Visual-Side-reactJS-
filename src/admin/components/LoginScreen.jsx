import { useEffect, useState } from "react";
import { checkPassword, sendCode, verifyCode } from "../lib/adminAuth";
import { BUTTON_OUTLINE, BUTTON_PRIMARY, INPUT, LABEL } from "./styles";

// Supabase lets you ask for a new code once a minute.
const RESEND_SECONDS = 60;

/**
 * Two-step admin sign-in.
 *   Step 1 — email and password. If they are right, a code is emailed.
 *   Step 2 — the code from that email.
 */
export default function LoginScreen({ onSignedIn, notice = "" }) {
  const [step, setStep] = useState("password"); // password | code
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);

  // Count down until "Send a new code" is allowed again.
  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const timer = setTimeout(() => setCooldown((seconds) => seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  // Runs one sign-in action and shows its error message if it fails.
  const run = async (action) => {
    setBusy(true);
    setError("");
    try {
      await action();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const submitPassword = (e) => {
    e.preventDefault();
    run(async () => {
      await checkPassword(email.trim(), password);
      await sendCode(email.trim());
      setCode("");
      setStep("code");
      setCooldown(RESEND_SECONDS);
    });
  };

  const submitCode = (e) => {
    e.preventDefault();
    run(async () => {
      await verifyCode(email.trim(), code, password);
      setPassword("");
      onSignedIn();
    });
  };

  const resend = () =>
    run(async () => {
      await sendCode(email.trim());
      setCooldown(RESEND_SECONDS);
    });

  const startOver = () => {
    setStep("password");
    setPassword("");
    setCode("");
    setError("");
  };

  const stepClass = (active) =>
    `rounded-full border px-3 py-2 text-center ${
      active ? "border-ink bg-ink text-sand" : "border-ink/15 text-ink/45"
    }`;

  return (
    <div className="flex min-h-screen items-center justify-center bg-sand px-5 py-12 text-ink">
      <div className="w-full max-w-md">
        <p className="text-center font-heading text-[10px] uppercase tracking-label text-brass-deep">
          Admin
        </p>
        <h1 className="mt-3 text-center font-display text-5xl leading-none">Sign in</h1>

        <ol className="mt-8 grid grid-cols-2 gap-2 font-heading text-[10px] uppercase tracking-label">
          <li className={stepClass(step === "password")}>1 · Password</li>
          <li className={stepClass(step === "code")}>2 · Email code</li>
        </ol>

        <div className="mt-6 rounded-[1.75rem] border border-ink/10 bg-sage p-6 sm:p-8">
          {notice && step === "password" && (
            <p className="mb-5 rounded-xl bg-brass/15 px-4 py-3 text-sm text-ink">{notice}</p>
          )}

          {step === "password" ? (
            <form onSubmit={submitPassword} className="space-y-5">
              <label className="block space-y-2">
                <span className={LABEL}>Email</span>
                <input
                  type="email"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={INPUT}
                />
              </label>
              <label className="block space-y-2">
                <span className={LABEL}>Password</span>
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={INPUT}
                />
              </label>
              <button type="submit" disabled={busy} className={`${BUTTON_PRIMARY} w-full py-3.5`}>
                {busy ? "Checking…" : "Continue"}
              </button>
            </form>
          ) : (
            <form onSubmit={submitCode} className="space-y-5">
              <p className="text-sm leading-relaxed text-ink-mute">
                We emailed a 6-digit code to <strong className="text-ink">{email}</strong>. It can take
                a minute to arrive — check your spam folder too.
              </p>
              <label className="block space-y-2">
                <span className={LABEL}>Code</span>
                <input
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  required
                  autoFocus
                  minLength={6}
                  maxLength={10}
                  pattern="[0-9]{6,10}"
                  placeholder="••••••"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  className={`${INPUT} h-14 text-center font-display text-3xl tracking-[0.4em]`}
                />
              </label>
              <button
                type="submit"
                disabled={busy || code.length < 6}
                className={`${BUTTON_PRIMARY} w-full py-3.5`}
              >
                {busy ? "Verifying…" : "Verify and sign in"}
              </button>
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={startOver}
                  disabled={busy}
                  className="font-heading text-[10px] uppercase tracking-label text-ink/50 transition-colors hover:text-ink"
                >
                  ← Start again
                </button>
                <button
                  type="button"
                  onClick={resend}
                  disabled={busy || cooldown > 0}
                  className={BUTTON_OUTLINE}
                >
                  {cooldown > 0 ? `New code in ${cooldown}s` : "Send a new code"}
                </button>
              </div>
            </form>
          )}

          {error && (
            <p role="alert" className="mt-5 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </p>
          )}
        </div>

        <p className="mt-6 text-center">
          <a
            href="/"
            className="font-heading text-[10px] uppercase tracking-label text-ink/45 transition-colors hover:text-ink"
          >
            ← Back to the website
          </a>
        </p>
      </div>
    </div>
  );
}

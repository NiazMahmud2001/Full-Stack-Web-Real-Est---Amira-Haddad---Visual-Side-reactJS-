import { supabase } from "../../lib/supabase";

// The two-step admin sign-in. The database enforces it (see admin-setup.sql):
// only a login that used the emailed code AND passed the password check may
// change listings or read enquiries.
//
//   1. checkPassword — Supabase checks the email and password.
//   2. sendCode      — Supabase emails a one-time code.
//   3. verifyCode    — the code signs you in, then the database checks the
//                      password again and marks this login as an admin session.

// What the admin_confirm_password database function's answers mean.
const REFUSED = {
  not_signed_in: "The code sign-in didn't finish. Please try again.",
  not_email_code_login: "Please sign in with the code from your email.",
  not_admin: "This account isn't an admin.",
  wrong_password: "The password didn't match. Please start again.",
  locked: "Too many wrong passwords for this sign-in. Please start again."
};

/**
 * Step 1: are the email and password right? Signs straight back out, because
 * a password on its own never gives admin access.
 */
export async function checkPassword(email, password) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error("That email and password don't match an admin account.");
  await supabase.auth.signOut({ scope: "local" });
}

/** Step 2: email a one-time code. It never creates a new account. */
export async function sendCode(email) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: false }
  });
  if (!error) return;

  const message = error.message || "";
  if (/not authorized/i.test(message)) {
    throw new Error(
      "Supabase's built-in email only sends to members of your Supabase organization. Sign in with that email address."
    );
  }
  if (/rate limit/i.test(message)) {
    throw new Error(
      "Supabase's built-in email sends at most 2 emails an hour. Please wait a while and try again."
    );
  }
  // e.g. "For security purposes, you can only request this after 42 seconds."
  throw new Error(`Could not send the code. ${message}`);
}

/**
 * Step 3: sign in with the code, then ask the database to check the password
 * for this new login. Throws a message the sign-in screen can show.
 */
export async function verifyCode(email, code, password) {
  const { error } = await supabase.auth.verifyOtp({ email, token: code, type: "email" });
  if (error) {
    throw new Error("That code is wrong or has expired. Use the newest email, or send a new code.");
  }

  const { data, error: checkError } = await supabase.rpc("admin_confirm_password", { password });
  if (checkError || data !== "ok") {
    await supabase.auth.signOut({ scope: "local" });
    throw new Error(
      checkError
        ? `Could not finish signing in: ${checkError.message}`
        : REFUSED[data] || "Could not finish signing in."
    );
  }
}

/** Is this browser's login a verified admin session? The database decides. */
export async function isVerifiedAdmin() {
  const { data } = await supabase.auth.getSession();
  if (!data.session) return false;
  const { data: verified, error } = await supabase.rpc("is_verified_admin");
  return !error && verified === true;
}

/** Sign out: remove this login's admin approval, then end the login. */
export async function signOut() {
  const { data } = await supabase.auth.getSession();
  const sessionId = data.session ? sessionIdOf(data.session) : null;
  if (sessionId) {
    await supabase.from("admin_sessions").delete().eq("session_id", sessionId);
  }
  await supabase.auth.signOut({ scope: "local" });
}

/** The login's id, read from the middle part of its access token. */
function sessionIdOf(session) {
  try {
    const payload = session.access_token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(payload)).session_id || null;
  } catch {
    return null;
  }
}

import { useState, type FormEvent } from "react";
import { apiBaseUrl } from "../../api/config";
import { AUTH_STORAGE_KEY } from "../../auth/storage";

type FormStatus = {
  state: "" | "error";
  message: string;
};

export default function LoginApp() {
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<FormStatus>({ state: "", message: "" });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const formData = new FormData(form);

    setSubmitting(true);
    setStatus({ state: "", message: "" });

    try {
      const response = await fetch(`${apiBaseUrl}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.get("username"),
          password: formData.get("password"),
        }),
      });
      const result = (await response.json()) as {
        error?: string;
        token?: string;
        user?: {
          username: string;
          name: string;
          email: string;
          phone_number: string;
        };
      };

      if (!response.ok || !result.user || !result.token) {
        throw new Error(result.error || "Login failed.");
      }

      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ ...result.user, token: result.token }));
      window.location.assign("/dashboard");
    } catch (error) {
      setStatus({
        state: "error",
        message:
          error instanceof Error
            ? error.message
            : "Could not log you in. Please try again.",
      });
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <header className="login-nav">
        <a className="login-logo" href="/" aria-label="Caplore home">
          Cap<span>lore</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="/">Home</a>
          <a href="/join">Join</a>
        </nav>
      </header>

      <main className="login-main">
        <section className="login-card-section" aria-labelledby="login-title">
          <form className="login-form" onSubmit={handleSubmit}>
            <span className="login-eyebrow">Welcome back</span>
            <h1 id="login-title">Log In to Caplore</h1>

            <div className="login-form-group">
              <label htmlFor="login-username">Username</label>
              <input
                id="login-username"
                name="username"
                type="text"
                placeholder="Enter your username"
                autoComplete="username"
                minLength={1}
                maxLength={40}
                required
              />
            </div>

            <div className="login-form-group">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                name="password"
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                minLength={1}
                maxLength={200}
                required
              />
            </div>

            <button className="login-submit" type="submit" disabled={submitting}>
              {submitting ? "Logging in…" : "Log In"}
            </button>
            <p
              className="login-form-status"
              data-state={status.state}
              role="status"
              aria-live="polite"
            >
              {status.message}
            </p>
          </form>
        </section>
      </main>
    </div>
  );
}

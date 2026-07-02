import { useState, type FormEvent } from "react";

const apiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL ??
  "https://caplore-backend-production.up.railway.app"
).replace(/\/$/, "");

type FormStatus = {
  state: "" | "success" | "error";
  message: string;
};

export default function JoinApp() {
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<FormStatus>({
    state: "",
    message: "",
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const formData = new FormData(form);
    const countryCode = String(formData.get("country-code") ?? "");
    const nationalPhone = String(formData.get("phone") ?? "");

    setSubmitting(true);
    setStatus({ state: "", message: "Submitting…" });

    try {
      const response = await fetch(`${apiBaseUrl}/api/submissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: `${countryCode}${nationalPhone}`,
        }),
      });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(result.error || "Submission failed.");
      }

      form.reset();
      setStatus({
        state: "success",
        message: "Thank you. Your details have been received.",
      });
    } catch (error) {
      setStatus({
        state: "error",
        message:
          error instanceof Error
            ? error.message
            : "Could not submit your details. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="join-page">
      <header className="join-nav">
        <a className="join-logo" href="/" aria-label="Caplore home">
          Cap<span>lore</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="/">Home</a>
          <a href="/about.html">About Us</a>
        </nav>
      </header>

      <main className="join-main">
        <section className="cta-section" aria-labelledby="premium-cta-title">
          <div className="cta-copy">
            <span className="cta-eyebrow">Caplore Premium</span>
            <h1 id="premium-cta-title">
              Ready to Operate at an Institutional Level?
            </h1>
            <p>
              Whether you are an investor seeking exclusive opportunities, or a
              founder seeking the right capital, Caplore is your operating
              system.
            </p>
          </div>

          <form
            className="premium-form"
            action={`${apiBaseUrl}/api/submissions`}
            method="post"
            onSubmit={handleSubmit}
          >
            <div className="premium-form-group">
              <label htmlFor="premium-name">Name</label>
              <input
                id="premium-name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                autoComplete="name"
                minLength={2}
                maxLength={80}
                pattern={String.raw`.*\S.*`}
                title="Please enter your name."
                required
              />
            </div>

            <div className="premium-form-group">
              <label htmlFor="premium-email">Email</label>
              <input
                id="premium-email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                autoComplete="email"
                maxLength={120}
                required
              />
            </div>

            <div className="premium-form-group">
              <label htmlFor="premium-phone">Phone Number</label>
              <div className="premium-phone-field">
                <select
                  name="country-code"
                  aria-label="Country code"
                  defaultValue="+91"
                  required
                >
                  <option value="+91">+91</option>
                  <option value="+1">+1</option>
                  <option value="+44">+44</option>
                  <option value="+65">+65</option>
                  <option value="+971">+971</option>
                </select>
                <input
                  id="premium-phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  autoComplete="tel-national"
                  inputMode="numeric"
                  minLength={7}
                  maxLength={15}
                  pattern="[0-9]{7,15}"
                  title="Enter 7 to 15 digits without spaces."
                  required
                />
              </div>
            </div>

            <button
              className="premium-submit"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Submitting…" : "Become Premium"}
            </button>
            <p
              className="premium-form-status"
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

import { StrictMode, type ComponentType } from "react";
import { createRoot } from "react-dom/client";

const route = window.location.pathname.replace(/\/+$/, "") || "/";

async function renderRoute() {
  let Page: ComponentType;

  if (
    (route === "/" || route === "/login") &&
    localStorage.getItem("caplore_auth")
  ) {
    window.location.replace("/dashboard");
    return;
  }

  if (route === "/dashboard") {
    const [{ default: DashboardHomeApp }] = await Promise.all([
      import("./DashboardHomeApp"),
      import("./dashboard-home.css"),
    ]);
    Page = DashboardHomeApp;
    document.title = "Dashboard · Caplore";
  } else if (
    route === "/deal-room/abc-engineering" ||
    route === "/opportunities"
  ) {
    const [{ default: DashboardApp }] = await Promise.all([
      import("./DashboardApp"),
      import("./dashboard.css"),
    ]);
    Page = DashboardApp;
    document.title = "ABC Engineering Ltd. — Pre-IPO Deal Room · Caplore";
  } else if (route === "/join") {
    const [{ default: JoinApp }] = await Promise.all([
      import("./JoinApp"),
      import("./join.css"),
    ]);
    Page = JoinApp;
    document.title = "Join Caplore Premium";
  } else if (route === "/login") {
    const [{ default: LoginApp }] = await Promise.all([
      import("./LoginApp"),
      import("./login.css"),
    ]);
    Page = LoginApp;
    document.title = "Log In · Caplore";
  } else {
    const [{ default: App }] = await Promise.all([
      import("./App"),
      import("./index.css"),
    ]);
    Page = App;
  }

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <Page />
    </StrictMode>,
  );
}

void renderRoute();

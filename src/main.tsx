import { StrictMode, type ComponentType } from "react";
import { createRoot } from "react-dom/client";

const route = window.location.pathname.replace(/\/+$/, "") || "/";

async function renderRoute() {
  let Page: ComponentType;

  if (route === "/dashboard") {
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
  } else if (route === "/" && localStorage.getItem("caplore_auth")) {
    const [{ default: HomeApp }] = await Promise.all([
      import("./HomeApp"),
      import("./home.css"),
    ]);
    Page = HomeApp;
    document.title = "Home · Caplore";
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

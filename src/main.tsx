import { StrictMode, type ComponentType } from "react";
import { createRoot } from "react-dom/client";

const route = window.location.pathname.replace(/\/+$/, "") || "/";

async function renderRoute() {
  let Page: ComponentType;

  if (route === "/join") {
    const [{ default: JoinApp }] = await Promise.all([
      import("./JoinApp"),
      import("./join.css"),
    ]);
    Page = JoinApp;
    document.title = "Join Caplore Premium";
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

import { StrictMode, type ComponentType } from "react";
import { createRoot } from "react-dom/client";
import "./app-topbar.css";
import "./app-sidebar.css";

const route = window.location.pathname.replace(/\/+$/, "") || "/";
const companyRoute = route.match(/^\/companies\/([a-z0-9-]+)$/);
const AUTH_STORAGE_KEY = "caplore_auth";

type StoredAuthUser = {
  username: string;
  name: string;
  email: string;
  phone_number: string;
};

function hasValidStoredUser(): boolean {
  try {
    const rawUser = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!rawUser) return false;

    const user = JSON.parse(rawUser) as Partial<StoredAuthUser> | null;
    return Boolean(
      user &&
        typeof user === "object" &&
        typeof user.username === "string" &&
        user.username.trim() &&
        typeof user.name === "string" &&
        typeof user.email === "string" &&
        typeof user.phone_number === "string",
    );
  } catch {
    return false;
  }
}

async function renderRoute() {
  let Page: ComponentType;
  const isAuthenticated = hasValidStoredUser();

  if ((route === "/" || route === "/login") && isAuthenticated) {
    window.location.replace("/dashboard");
    return;
  }

  if (route === "/opportunities") {
    window.location.replace("/companies");
    return;
  }

  if (route === "/dashboard") {
    if (!isAuthenticated) {
      window.location.replace("/login");
      return;
    }

    const [{ default: DashboardHomeApp }] = await Promise.all([
      import("./DashboardHomeApp"),
      import("./dashboard-home.css"),
    ]);
    Page = DashboardHomeApp;
    document.title = "Dashboard · Caplore";
  } else if (route === "/community") {
    if (!isAuthenticated) {
      window.location.replace("/login");
      return;
    }

    const [{ default: CommunityApp }] = await Promise.all([
      import("./CommunityApp"),
      import("./dashboard-home.css"),
      import("./community.css"),
    ]);
    Page = CommunityApp;
    document.title = "Community · Caplore";
  } else if (route === "/companies") {
    const [{ default: CompaniesApp }] = await Promise.all([
      import("./CompaniesApp"),
      import("./companies.css"),
    ]);
    Page = CompaniesApp;
    document.title = "Companies · Caplore";
  } else if (companyRoute) {
    const slug = companyRoute[1];
    const [{ default: CompanyApp }] = await Promise.all([
      import("./CompanyApp"),
      import("./company.css"),
    ]);
    Page = () => <CompanyApp slug={slug} />;
    document.title = "Company · Caplore";
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

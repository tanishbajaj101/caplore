import { StrictMode, type ComponentType } from "react";
import { createRoot } from "react-dom/client";
import { hasValidStoredUser } from "./auth/storage";
import "./global.css";
import "./components/navigation/app-topbar.css";
import "./components/navigation/app-sidebar.css";

const route = window.location.pathname.replace(/\/+$/, "") || "/";
const companyRoute = route.match(/^\/companies\/([a-z0-9-]+)$/);
const profileRoute = route.match(/^\/profile\/([^/]+)$/);

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
      import("./pages/dashboard/DashboardHomeApp"),
      import("./pages/dashboard/dashboard-home.css"),
    ]);
    Page = DashboardHomeApp;
    document.title = "Dashboard · Caplore";
  } else if (route === "/community") {
    if (!isAuthenticated) {
      window.location.replace("/login");
      return;
    }

    const [{ default: CommunityApp }] = await Promise.all([
      import("./pages/community/CommunityApp"),
      import("./pages/community/community.css"),
    ]);
    Page = CommunityApp;
    document.title = "Community · Caplore";
  } else if (route === "/companies") {
    const [{ default: CompaniesApp }] = await Promise.all([
      import("./pages/companies/CompaniesApp"),
      import("./pages/companies/companies.css"),
    ]);
    Page = CompaniesApp;
    document.title = "Companies · Caplore";
  } else if (companyRoute) {
    const slug = companyRoute[1];
    const [{ default: CompanyApp }] = await Promise.all([
      import("./pages/company/CompanyApp"),
      import("./pages/company/company.css"),
    ]);
    Page = () => <CompanyApp slug={slug} />;
    document.title = "Company · Caplore";
  } else if (profileRoute) {
    const username = profileRoute[1];
    const [{ default: PublicProfileApp }] = await Promise.all([
      import("./pages/public-profile/PublicProfileApp"),
      import("./pages/public-profile/public-profile.css"),
    ]);
    Page = () => <PublicProfileApp username={username} />;
  } else if (route === "/join") {
    const [{ default: JoinApp }] = await Promise.all([
      import("./pages/join/JoinApp"),
      import("./pages/join/join.css"),
    ]);
    Page = JoinApp;
    document.title = "Join Caplore Premium";
  } else if (route === "/login") {
    const [{ default: LoginApp }] = await Promise.all([
      import("./pages/login/LoginApp"),
      import("./pages/login/login.css"),
    ]);
    Page = LoginApp;
    document.title = "Log In · Caplore";
  } else {
    const [{ default: App }] = await Promise.all([
      import("./pages/landing/LandingPage"),
      import("./pages/landing/index.css"),
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

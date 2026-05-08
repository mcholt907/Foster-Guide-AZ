import type { TeenNavId } from "../components/TeenShell";

export function activeFromPathname(pathname: string, lang: string): TeenNavId {
  const tail =
    pathname.replace(`/${lang}`, "").replace(/^\/+/, "").split("/")[0] ?? "";

  if (tail === "") return "dashboard";
  if (tail === "ask") return "answers";
  if (
    tail === "case" ||
    tail === "team" ||
    tail === "wellness" ||
    tail === "rights" ||
    tail === "resources" ||
    tail === "future"
  ) {
    return tail;
  }
  return "dashboard";
}

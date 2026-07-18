export function initialsFor(name?: string, username?: string) {
  return (name || username || "Investor")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}


export function parseDatabaseUrl() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not defined in environment variables");

  const parsed = new URL(url);
  return {
    host: parsed.hostname,
    port: parseInt(parsed.port || "3306"),
    user: parsed.username,
    password: parsed.password,
    database: parsed.pathname.replace("/", ""),
    connectionLimit: 5,
  };
}

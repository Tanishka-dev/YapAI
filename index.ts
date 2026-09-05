import concurently from "concurrently";

concurently([
    {
        command: "bun run dev",
        name: "server",
        cwd: "packages/server",
        prefixColor: "green",
    },
    {
        command: "bun run dev",
        name: "client",
        cwd: "packages/client",
        prefixColor: "blue",
    },
])
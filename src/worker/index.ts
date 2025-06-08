import {Hono} from "hono";
import api from "./routes/api";

type Env = {
    DB: D1Database;
};

const app = new Hono<{ Bindings: Env }>();

// app.get("/api/", (c) => c.json({ name: "Cloudflare" }));

app.route('/api', api)


export default app;

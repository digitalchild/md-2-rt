import { Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import { richTextFromMarkdown } from "@contentful/rich-text-from-markdown";

const app = new Hono<{ Bindings: CloudflareBindings }>();

// Authentication middleware
const authMiddleware = (c: any, next: any) => {
  const auth = bearerAuth({
    token: c.env.API_KEY,
  });
  return auth(c, next);
};

app.post("/convert", authMiddleware, async (c) => {
  try {
    const body = await c.req.json();

    if (!body.markdown) {
      return c.json({
        success: false,
        error: "Missing markdown field in request body"
      }, 400);
    }

    const richText = await richTextFromMarkdown(body.markdown);

    return c.json({
      success: true,
      richText
    });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return c.json({
        success: false,
        error: "Invalid JSON in request body"
      }, 400);
    }

    return c.json({
      success: false,
      error: "Internal conversion error"
    }, 500);
  }
});

export default app;

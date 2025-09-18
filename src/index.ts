import { Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import { richTextFromMarkdown } from "@contentful/rich-text-from-markdown";

const app = new Hono<{ Bindings: CloudflareBindings }>();

// Add a simple health check endpoint
app.get("/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});


// Authentication middleware
const authMiddleware = (c: any, next: any) => {
  const auth = bearerAuth({
    token: c.env.API_KEY,
  });
  return auth(c, next);
};

app.post("/convert", authMiddleware, async (c) => {
  try {
    let body;

    try {
      body = await c.req.json();
    } catch (jsonError) {
      // If JSON parsing fails, try to get raw text and see if we can extract markdown
      const rawText = await c.req.text();
      console.log("Raw request body:", rawText);

      return c.json({
        success: false,
        error: "Invalid JSON in request body. Received: " + rawText.substring(0, 200)
      }, 400);
    }

    // Handle if body is nested (like n8n might send)
    let markdown;
    if (body.markdown) {
      markdown = body.markdown;
    } else if (body.body && body.body.markdown) {
      markdown = body.body.markdown;
    } else if (typeof body === "string") {
      // If the entire body is just a string, treat it as markdown
      markdown = body;
    } else {
      console.log("Received body structure:", JSON.stringify(body, null, 2));
      return c.json({
        success: false,
        error: "Missing markdown field in request body. Received structure: " + JSON.stringify(Object.keys(body))
      }, 400);
    }

    const richText = await richTextFromMarkdown(markdown);

    return c.json({
      success: true,
      richText
    });
  } catch (error) {
    console.error("Conversion error:", error);
    return c.json({
      success: false,
      error: "Internal conversion error: " + (error as Error).message
    }, 500);
  }
});

export default app;

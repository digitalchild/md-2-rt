# Markdown 2 Rich Text API

A Cloudflare Workers API service that converts Markdown content to Contentful Rich Text format, built with Hono framework and secured with header-based authentication.

## Features

- 🔄 Convert Markdown to Contentful Rich Text format
- 🔐 Secure API key authentication via Bearer tokens
- ⚡ Fast response times on Cloudflare's edge network
- 🛡️ Comprehensive error handling and validation
- 📝 TypeScript support with generated types

## Quick Start

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Cloudflare account (for deployment)

### Installation

1. Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd md-2-rt
npm install
```

2. Set up your API key for local development:

```bash
# Copy the example file and edit it with your API key
cp .dev.vars.example .dev.vars
# Edit .dev.vars and replace with your actual API key
```

Alternatively, set as an environment variable:

```bash
export API_KEY="your-secure-api-key-here"
```

### Local Development

1. Start the development server:

```bash
npm run dev
```

The API will be available at `http://localhost:8787`

2. Test the API endpoint:

```bash
# Valid request
curl -X POST http://localhost:8787/convert \
  -H "Authorization: Bearer your-secure-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{"markdown": "# Hello World\n\nThis is **bold** text with [link](https://example.com)"}'

# Expected response:
# {"success":true,"richText":{"nodeType":"document","data":{},"content":[...]}}
```

## Live API

The API is deployed and available at:

**Production endpoint:** https://api.nothingurl.com/convert

Example usage:
```bash
curl -X POST https://api.nothingurl.com/convert \
  -H "Authorization: Bearer YOUR_API_KEY_HERE" \
  -H "Content-Type: application/json" \
  -d '{"markdown": "# Hello World\n\nThis is **bold** text."}'
```

### Testing Authentication

Test that authentication is working correctly:

```bash
# Invalid API key (should return 401 Unauthorized)
curl -X POST https://api.nothingurl.com/convert \
  -H "Authorization: Bearer wrong-key" \
  -H "Content-Type: application/json" \
  -d '{"markdown": "# Test"}'

# Missing markdown field (should return 400 Bad Request)
curl -X POST https://api.nothingurl.com/convert \
  -H "Authorization: Bearer YOUR_API_KEY_HERE" \
  -H "Content-Type: application/json" \
  -d '{"invalid": "no markdown field"}'
```

## API Reference

### POST /convert

Converts Markdown content to Contentful Rich Text format.

**Headers:**
- `Authorization: Bearer <api-key>` (required)
- `Content-Type: application/json` (required)

**Request Body:**
```json
{
  "markdown": "# Your markdown content here"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "richText": {
    "nodeType": "document",
    "data": {},
    "content": [
      // Contentful Rich Text nodes
    ]
  }
}
```

**Error Responses:**

- **401 Unauthorized:** Invalid or missing API key
- **400 Bad Request:** Missing markdown field or invalid JSON
- **500 Internal Server Error:** Conversion errors

All error responses follow this format:
```json
{
  "success": false,
  "error": "Error description"
}
```

## Deployment

### Deploy to Cloudflare Workers

1. **Set up Wrangler CLI** (if not already done):

```bash
npm install -g wrangler
wrangler login
```

2. **Set your API key as a Wrangler secret** (recommended for production):

```bash
wrangler secret put API_KEY
# Enter your production API key when prompted
```

3. **Deploy the Worker**:

```bash
npm run deploy
```

4. **Test the deployed API**:

```bash
curl -X POST https://api.nothingurl.com/convert \
  -H "Authorization: Bearer your-production-api-key" \
  -H "Content-Type: application/json" \
  -d '{"markdown": "# Production Test"}'
```

## Integration with n8n

This API works seamlessly with n8n automation workflows:

1. **Add an HTTP Request node** to your n8n workflow
2. **Configure the request:**
   - Method: `POST`
   - URL: `https://api.nothingurl.com/convert`
   - Authentication: `Generic Credential Type` → `Bearer Auth`
   - Bearer Token: `YOUR_API_KEY_HERE`
   - Content Type: `application/json`
   - Body: `{"markdown": "Your markdown content here"}`

3. **The response** will contain the converted Rich Text in `richText` field:
   ```json
   {
     "success": true,
     "richText": {
       "nodeType": "document",
       "data": {},
       "content": [...]
     }
   }
   ```

### Environment Variables

**For Development:**
- Use `.dev.vars` file or environment variables
- `API_KEY`: Your secure API key for authentication

**For Production:**
- Use Wrangler secrets: `wrangler secret put API_KEY`
- Never commit API keys to version control

### TypeScript Types

Generate TypeScript types for Cloudflare bindings:

```bash
npm run cf-typegen
```

This updates `worker-configuration.d.ts` with the latest binding types.

## Development Commands

```bash
# Start local development server
npm run dev

# Deploy to Cloudflare Workers with minification
npm run deploy

# Generate TypeScript types for Cloudflare bindings
npm run cf-typegen
```

## Project Structure

```
├── src/
│   └── index.ts          # Main API implementation
├── public/
│   └── index.html        # Static assets (optional)
├── wrangler.jsonc        # Cloudflare Workers configuration
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── prd.md               # Product Requirements Document
├── implementation.md     # Implementation plan
└── CLAUDE.md            # Claude Code guidance
```

## Security Notes

- **Never commit API keys to git** - use `.dev.vars` for local development and Wrangler secrets for production
- Store API keys securely and rotate them regularly
- Use different API keys for development and production
- Consider implementing rate limiting for production use
- Monitor API usage through Cloudflare's dashboard
- Add `.dev.vars` to `.gitignore` (already included)

## Troubleshooting

### Common Issues

1. **"Unauthorized" response**: Check that your API key is set in `.dev.vars` or environment variables for local development
2. **TypeScript errors**: Run `npm run cf-typegen` to regenerate binding types
3. **Deployment fails**: Ensure you're logged into Wrangler with `wrangler login`

### Development Tips

- Use the Cloudflare Workers dashboard to monitor requests and errors
- Check the browser's developer tools for detailed error messages
- Logs are available in the Wrangler dev server output

## License

[Add your license information here]

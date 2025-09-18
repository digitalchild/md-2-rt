# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Cloudflare Workers API service that converts Markdown content to Contentful Rich Text format. Built with Hono framework and secured with header-based authentication.

## Technology Stack

- **Runtime**: Cloudflare Workers
- **Framework**: Hono (TypeScript web framework)
- **Build Tool**: Wrangler (Cloudflare Workers CLI)
- **Language**: TypeScript with ES modules
- **Core Package**: @contentful/rich-text-from-markdown

## Development Commands

```bash
# Start local development server
npm run dev

# Deploy to Cloudflare Workers
npm run deploy

# Generate TypeScript types for Cloudflare bindings
npm run cf-typegen
```

## API Endpoints

### POST /convert
Converts Markdown content to Contentful Rich Text format.

**Authentication**: Bearer token via Authorization header
**Content-Type**: application/json

**Request Body**:
```json
{
  "markdown": "# Hello World\n\nThis is **bold** text with [link](https://example.com)"
}
```

**Success Response** (200):
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

**Error Responses**:
- 401: Invalid/missing API key
- 400: Missing markdown field or invalid JSON
- 500: Conversion errors

## Configuration

- **API Key**:
  - **Development**: Set in `.dev.vars` file or environment variable
  - **Production**: Use `wrangler secret put API_KEY` (never commit to git)
- **Authentication**: Uses Hono's bearerAuth middleware
- **Static Assets**: Bound to `ASSETS` from `./public` directory
- **Compatibility Date**: 2025-09-18

## Architecture Notes

- Uses Hono's bearerAuth middleware for API key validation
- All responses follow consistent JSON structure with `success` field
- Comprehensive error handling for authentication, validation, and conversion errors
- TypeScript types generated from wrangler configuration

## Testing Locally

```bash
# Set up API key first (copy .dev.vars.example to .dev.vars and edit)
cp .dev.vars.example .dev.vars

# Valid request
curl -X POST http://localhost:8787/convert \
  -H "Authorization: Bearer your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{"markdown": "# Test"}'

# Invalid auth (should return 401)
curl -X POST http://localhost:8787/convert \
  -H "Authorization: Bearer wrong-key" \
  -H "Content-Type: application/json" \
  -d '{"markdown": "# Test"}'
```

## Important Files

- `src/index.ts` - Main API implementation with authentication and conversion logic
- `wrangler.jsonc` - Cloudflare Workers configuration
- `.dev.vars.example` - Template for local API key configuration
- `prd.md` - Product Requirements Document
- `implementation.md` - Detailed implementation plan and progress tracking
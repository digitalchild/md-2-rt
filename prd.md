# Product Requirements Document: Markdown 2 Rich Text API

## Overview

A Cloudflare Worker API service that converts Markdown content to Contentful Rich Text format, built with the Hono framework and secured with header-based authentication.

## Product Summary

- **Name**: Markdown 2 Rich Text API
- **Platform**: Cloudflare Workers
- **Framework**: Hono
- **Primary Function**: Convert Markdown to Contentful Rich Text format

## Functional Requirements

### Core Features

1. **Markdown Conversion**
   - Accept Markdown content via HTTP POST request
   - Convert Markdown to Contentful Rich Text using `@contentful/rich-text-from-markdown`
   - Return structured Rich Text JSON response

2. **Authentication**
   - Header-based authentication system
   - Validate API key from request headers
   - Return appropriate error responses for invalid/missing authentication

3. **API Endpoints**
   - `POST /convert` - Main conversion endpoint

### Request/Response Format

#### Request

```http
POST /convert
Authorization: Bearer <api-key>
Content-Type: application/json

{
  "markdown": "# Hello World\n\nThis is a **bold** text with [link](https://example.com)"
}
```

#### Success Response

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "richText": {
    "nodeType": "document",
    "data": {},
    "content": [...]
  }
}
```

#### Error Response

```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
  "success": false,
  "error": "Invalid or missing API key"
}
```

## Technical Requirements

### Dependencies

- **Runtime**: Cloudflare Workers
- **Framework**: Hono
- **Core Package**: `@contentful/rich-text-from-markdown`

### Authentication

- **Method**: Header-based (Authorization: Bearer token)
- **Storage**: Environment variables for API key validation
- **Security**: Validate API key on each request

### Error Handling

- Invalid/missing authentication (401)
- Malformed JSON (400)
- Invalid Markdown content (400)
- Conversion errors (500)
- Rate limiting (429) - if implemented

## Implementation Specifications

### Environment Variables

- `API_KEY` - Valid API key for authentication

### Request Validation

- Verify `Authorization` header presence
- Validate API key against environment variable
- Ensure request body contains valid JSON with `markdown` field

### Response Format

- Consistent JSON response structure
- Include `success` boolean field
- Provide meaningful error messages

## Success Criteria

- [x] Successfully converts Markdown to Rich Text format
- [x] Secure authentication via headers
- [x] Proper error handling and validation
- [x] Fast response times (<500ms)
- [x] Reliable deployment on Cloudflare Workers

## Future Considerations

- Rate limiting implementation
- Support for multiple API keys
- Batch conversion support
- Webhook integrations
- Logging and analytics

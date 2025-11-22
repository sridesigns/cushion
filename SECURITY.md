# Security Policy

## Security Measures

This application implements multiple security layers to protect user data and prevent common vulnerabilities.

### 1. Input Validation and Sanitization

All user inputs are validated and sanitized before being processed:

- **Amount Validation**: Ensures numeric values are within acceptable ranges (0.01 - 999,999,999.99)
- **String Sanitization**: Trims and limits length of all text inputs to prevent injection attacks
- **Date Validation**: Validates date formats before processing
- **Transaction Type Validation**: Ensures only valid transaction types (deposit/withdrawal) are accepted

Implementation: `lib/validation.ts`

### 2. Data Storage Security

- **LocalStorage Keys**: Centralized in `lib/constants.ts` to prevent key collision and ensure consistency
- **Data Sanitization**: All data is validated before being stored in localStorage
- **No Sensitive Data**: Authentication tokens are stored securely and can be easily cleared

### 3. API Security

#### Notion Integration API Routes

**OAuth Flow** (`/api/notion/callback`):
- Uses secure OAuth 2.0 authorization code flow
- Client secret is stored server-side only (not exposed to client)
- Validates authorization codes before exchanging for tokens
- Implements popup-based flow to prevent redirect vulnerabilities

**Data Sync** (`/api/notion/sync`):
- Validates and sanitizes all entries before syncing to Notion
- Filters out invalid entries to prevent malicious data transmission
- Implements proper error handling to prevent information leakage
- Validates access tokens before processing requests

### 4. XSS Prevention

- All user-generated content is properly escaped when rendered
- React's built-in XSS protection is utilized
- No use of `dangerouslySetInnerHTML`
- Input validation prevents script injection

### 5. Environment Variables

Sensitive configuration is stored in environment variables:
- `NEXT_PUBLIC_NOTION_CLIENT_ID`: Public client ID (safe to expose)
- `NOTION_CLIENT_SECRET`: Private secret (server-side only)

See `.env.example` for required environment variables.

### 6. Best Practices

- **No eval()**: No use of eval() or similar dangerous functions
- **Type Safety**: TypeScript ensures type safety throughout the application
- **Validation Constants**: All validation rules are centralized in constants
- **Error Handling**: Proper error handling prevents information disclosure

## Reporting Security Issues

If you discover a security vulnerability, please create a GitHub issue or contact the maintainers directly.

## Security Checklist for Deployment

Before deploying to production, ensure:

- [ ] Environment variables are properly configured
- [ ] HTTPS is enabled
- [ ] Notion integration redirect URIs include production domain
- [ ] All dependencies are up to date
- [ ] Content Security Policy headers are configured (if needed)
- [ ] Rate limiting is configured (if applicable)

## Limitations

This is a client-side application with the following security considerations:

1. **LocalStorage**: Data is stored in browser localStorage. While convenient, this is not encrypted at rest.
2. **Client-Side Token Storage**: Notion access tokens are stored in localStorage. For production use, consider implementing a backend proxy.
3. **No Rate Limiting**: The application does not implement rate limiting. Consider adding this for production deployments.

## Recommended Improvements for Production

For production deployments, consider:

1. Implementing a backend API to proxy Notion requests
2. Using secure HTTP-only cookies for token storage
3. Adding rate limiting to API routes
4. Implementing request signing to prevent replay attacks
5. Adding CSP headers to prevent XSS
6. Using a proper authentication system (e.g., NextAuth.js)

import { NextRequest } from 'next/server'

const NOTION_CLIENT_ID = process.env.NEXT_PUBLIC_NOTION_CLIENT_ID
const NOTION_CLIENT_SECRET = process.env.NOTION_CLIENT_SECRET

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error) {
    return new Response(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Notion OAuth Error</title>
        </head>
        <body>
          <script>
            window.opener.postMessage({ type: 'notion-oauth-error', error: '${error}' }, '*');
            window.close();
          </script>
        </body>
      </html>
      `,
      {
        headers: { 'Content-Type': 'text/html' },
      }
    )
  }

  if (!code) {
    return new Response('Missing authorization code', { status: 400 })
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://api.notion.com/v1/oauth/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${NOTION_CLIENT_ID}:${NOTION_CLIENT_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: `${request.nextUrl.origin}/api/notion/callback`,
      }),
    })

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token')
    }

    const tokenData = await tokenResponse.json()

    // Return HTML that posts message to parent window
    return new Response(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Notion Connected</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
            }
            .message {
              text-align: center;
              padding: 2rem;
              background: rgba(255, 255, 255, 0.1);
              border-radius: 1rem;
              backdrop-filter: blur(10px);
            }
            .checkmark {
              font-size: 4rem;
              margin-bottom: 1rem;
            }
          </style>
        </head>
        <body>
          <div class="message">
            <div class="checkmark">✓</div>
            <h1>Connected to Notion!</h1>
            <p>You can close this window.</p>
          </div>
          <script>
            window.opener.postMessage({
              type: 'notion-oauth-success',
              access_token: '${tokenData.access_token}',
              workspace_id: '${tokenData.workspace_id}'
            }, '*');
            setTimeout(() => window.close(), 1500);
          </script>
        </body>
      </html>
      `,
      {
        headers: { 'Content-Type': 'text/html' },
      }
    )
  } catch (error) {
    console.error('OAuth error:', error)
    return new Response(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Notion OAuth Error</title>
        </head>
        <body>
          <script>
            window.opener.postMessage({ type: 'notion-oauth-error', error: 'Failed to connect' }, '*');
            window.close();
          </script>
        </body>
      </html>
      `,
      {
        headers: { 'Content-Type': 'text/html' },
      }
    )
  }
}

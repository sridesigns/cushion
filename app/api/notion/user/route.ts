import { NextRequest, NextResponse } from 'next/server'

const NOTION_API_VERSION = '2022-06-28'

export async function POST(request: NextRequest) {
  try {
    const { access_token } = await request.json()

    if (!access_token) {
      return NextResponse.json({ error: 'Access token required' }, { status: 401 })
    }

    // Fetch user info from Notion API
    const response = await fetch('https://api.notion.com/v1/users/me', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Notion-Version': NOTION_API_VERSION,
      },
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch user info' }, { status: response.status })
    }

    const userData = await response.json()

    return NextResponse.json({
      name: userData.name || '',
      id: userData.id,
    })
  } catch (error) {
    console.error('Error fetching Notion user:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user info' },
      { status: 500 }
    )
  }
}

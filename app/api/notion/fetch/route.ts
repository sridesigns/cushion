import { NextRequest, NextResponse } from 'next/server'
import type { SavingsEntry } from '@/lib/types'

const NOTION_API_VERSION = '2022-06-28'

interface NotionFetchRequest {
  access_token: string
  database_id?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: NotionFetchRequest = await request.json()
    const { access_token, database_id } = body

    if (!access_token) {
      return NextResponse.json({ error: 'Access token required' }, { status: 401 })
    }

    let dbId: string | null = database_id || null

    // If no database ID provided, search for the Cushion database
    if (!dbId) {
      dbId = await findCushionDatabase(access_token)
      if (!dbId) {
        // No database found - user has no data yet
        return NextResponse.json({
          success: true,
          entries: [],
          database_id: null,
        })
      }
    }

    // Fetch all entries from the database
    const entries = await fetchEntriesFromDatabase(access_token, dbId)

    return NextResponse.json({
      success: true,
      entries,
      database_id: dbId,
    })
  } catch (error) {
    console.error('Fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch data from Notion' },
      { status: 500 }
    )
  }
}

async function findCushionDatabase(accessToken: string): Promise<string | null> {
  try {
    // Search for databases with the name "Cushion - Savings Tracker"
    const searchResponse: Response = await fetch('https://api.notion.com/v1/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Notion-Version': NOTION_API_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filter: {
          property: 'object',
          value: 'database'
        },
        query: 'Cushion - Savings Tracker',
      }),
    })

    if (!searchResponse.ok) {
      return null
    }

    const searchData: any = await searchResponse.json()

    // Find the first database that matches our name
    const database = searchData.results.find((db: any) => {
      const title = db.title?.[0]?.plain_text || ''
      return title === 'Cushion - Savings Tracker'
    })

    return database?.id || null
  } catch (error) {
    console.error('Error finding database:', error)
    return null
  }
}

async function fetchEntriesFromDatabase(
  accessToken: string,
  databaseId: string
): Promise<SavingsEntry[]> {
  const entries: SavingsEntry[] = []
  let hasMore = true
  let startCursor: string | undefined = undefined

  while (hasMore) {
    const queryResponse: Response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Notion-Version': NOTION_API_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        start_cursor: startCursor,
        page_size: 100,
      }),
    })

    if (!queryResponse.ok) {
      throw new Error('Failed to query database')
    }

    const queryData: any = await queryResponse.json()

    // Convert Notion pages to SavingsEntry format
    for (const page of queryData.results) {
      try {
        const props = page.properties

        // Extract data from Notion properties
        const type = props.Type?.select?.name?.toLowerCase() as 'deposit' | 'withdrawal'
        const amount = props.Amount?.number
        const category = props.Category?.select?.name
        const date = props.Date?.date?.start
        const description = props.Description?.rich_text?.[0]?.plain_text || ''

        // Only add valid entries
        if (type && amount && category && date) {
          entries.push({
            id: page.id, // Use Notion page ID as entry ID
            type,
            amount,
            category,
            date,
            description,
          })
        }
      } catch (error) {
        console.error('Error parsing entry:', error)
        // Skip invalid entries
      }
    }

    hasMore = queryData.has_more
    startCursor = queryData.next_cursor
  }

  return entries
}

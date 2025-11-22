import { NextRequest, NextResponse } from 'next/server'
import { validateAmount, validateCategory, validateDescription, validateDate, validateTransactionType } from '@/lib/validation'
import type { SavingsEntry } from '@/lib/types'

const NOTION_API_VERSION = '2022-06-28'

interface NotionSyncRequest {
  access_token: string
  entries: SavingsEntry[]
}

export async function POST(request: NextRequest) {
  try {
    const body: NotionSyncRequest = await request.json()
    const { access_token, entries } = body

    if (!access_token) {
      return NextResponse.json({ error: 'Access token required' }, { status: 401 })
    }

    // Validate and sanitize all entries
    const validatedEntries = entries
      .map(entry => {
        const validatedAmount = validateAmount(entry.amount)
        const validatedCategory = validateCategory(entry.category)
        const validatedDescription = validateDescription(entry.description || '')
        const validatedDate = validateDate(entry.date)
        const validatedType = validateTransactionType(entry.type)

        if (!validatedAmount || !validatedCategory || !validatedDate || !validatedType) {
          return null
        }

        return {
          ...entry,
          amount: validatedAmount,
          category: validatedCategory,
          description: validatedDescription,
          date: validatedDate,
          type: validatedType,
        }
      })
      .filter((entry): entry is SavingsEntry => entry !== null)

    if (validatedEntries.length === 0) {
      return NextResponse.json({ error: 'No valid entries to sync' }, { status: 400 })
    }

    // Check if database already exists
    let databaseId = null
    const storedDbId = request.headers.get('X-Notion-Database-Id')

    if (storedDbId) {
      databaseId = storedDbId
    } else {
      // Create a new database
      databaseId = await createNotionDatabase(access_token)
    }

    // Sync entries to database
    await syncEntriesToDatabase(access_token, databaseId, validatedEntries)

    return NextResponse.json({
      success: true,
      database_id: databaseId,
      synced_count: validatedEntries.length,
    })
  } catch (error) {
    console.error('Sync error:', error)
    return NextResponse.json(
      { error: 'Failed to sync data to Notion' },
      { status: 500 }
    )
  }
}

async function createNotionDatabase(accessToken: string): Promise<string> {
  // Search for parent page (use the first page in workspace)
  const searchResponse = await fetch('https://api.notion.com/v1/search', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Notion-Version': NOTION_API_VERSION,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      filter: { property: 'object', value: 'page' },
      page_size: 1,
    }),
  })

  const searchData = await searchResponse.json()
  const parentPageId = searchData.results[0]?.id

  if (!parentPageId) {
    throw new Error('No parent page found in workspace')
  }

  // Create database
  const createResponse = await fetch('https://api.notion.com/v1/databases', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Notion-Version': NOTION_API_VERSION,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      parent: { type: 'page_id', page_id: parentPageId },
      title: [
        {
          type: 'text',
          text: { content: 'Cushion - Savings Tracker' },
        },
      ],
      properties: {
        'Entry': {
          title: {},
        },
        'Type': {
          select: {
            options: [
              { name: 'Deposit', color: 'green' },
              { name: 'Withdrawal', color: 'red' },
            ],
          },
        },
        'Amount': {
          number: {
            format: 'number_with_commas',
          },
        },
        'Category': {
          select: {},
        },
        'Date': {
          date: {},
        },
        'Description': {
          rich_text: {},
        },
      },
    }),
  })

  if (!createResponse.ok) {
    throw new Error('Failed to create database')
  }

  const createData = await createResponse.json()
  return createData.id
}

async function syncEntriesToDatabase(
  accessToken: string,
  databaseId: string,
  entries: SavingsEntry[]
) {
  // Batch create pages (Notion API supports up to 100 pages per request)
  const batchSize = 100

  for (let i = 0; i < entries.length; i += batchSize) {
    const batch = entries.slice(i, i + batchSize)

    // Create pages in parallel
    await Promise.all(
      batch.map(entry =>
        fetch('https://api.notion.com/v1/pages', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Notion-Version': NOTION_API_VERSION,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            parent: { database_id: databaseId },
            properties: {
              'Entry': {
                title: [
                  {
                    text: {
                      content: `${entry.type === 'deposit' ? '+' : '-'}${entry.amount} - ${entry.category}`,
                    },
                  },
                ],
              },
              'Type': {
                select: {
                  name: entry.type === 'deposit' ? 'Deposit' : 'Withdrawal',
                },
              },
              'Amount': {
                number: entry.amount,
              },
              'Category': {
                select: {
                  name: entry.category,
                },
              },
              'Date': {
                date: {
                  start: entry.date,
                },
              },
              'Description': {
                rich_text: [
                  {
                    text: {
                      content: entry.description || '',
                    },
                  },
                ],
              },
            },
          }),
        })
      )
    )
  }
}

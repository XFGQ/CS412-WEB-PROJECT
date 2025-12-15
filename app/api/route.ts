import { type NextRequest } from 'next/server'
import { db } from '@/db/index'
import {users } from '@/db/schema'


export async function GET(request: NextRequest) {
  await db.insert(users).values({ username: 'furkan ' })
        return new Response('Hello, Next.js!', {
    status: 200,
  })
}
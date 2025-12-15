import { type NextRequest } from 'next/server'
import { db } from '@/db/index'
import { users } from '@/db/schema'


export async function GET(request: NextRequest) {
    await db.insert(users).values({ username: 'login furkan ' })
    return new Response('login.js!', {
        status: 200,
    })
}
import { NextResponse } from 'next/server';

export async function POST() {
     const response = NextResponse.json({ message: 'Logout Successful' }, { status: 200 });

     response.cookies.set({
        name: 'token',
        value: '', //we are clearing the cookie
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 0, // most impotrant to delete the cookie and log out the user
        path: '/',
    });

    return response;
}
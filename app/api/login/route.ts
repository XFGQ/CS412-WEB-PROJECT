import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db/index'
import { users } from '@/db/schema'
import { eq ,or} from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { signJWT } from '@/lib/auth'; //for token 24h


export async function POST(request: Request) {
    try {
        const body= await request.json();
        const {identifier,password}= body;
        //we are finding user on database
        if (!identifier || !password) {
             return new NextResponse(JSON.stringify({ message: 'Email or Username is missing!' }), { status: 400 });
         }
        const user_result=await db.select().from(users).where(
            or(
                eq(users.email,identifier), //the blank that user typed email or username ??
                eq(users.username,identifier)
            ));
        const user=user_result[0];   
 
            if (!user || !user.password) {
          return new NextResponse(JSON.stringify({ message: 'User not found or invalid email/username.' }), { status: 404 });
            }
            const isPasswordCorrect = await bcrypt.compare(password, user.password);        
        
            if(!isPasswordCorrect){

            return new NextResponse(JSON.stringify({message:'Password wrong'}),{status:401}); 
   }
   
        //token olusturuldu
        const token=await signJWT({userId:user.id,email:user.email});   
        const Response=NextResponse.json({message:'Login successful'},{status:200});

        //cookie settings
        //we use http for security
        Response.cookies.set ({
            name:'token',
            value:token,
            httpOnly:true, //for xss security can not be access by js
            secure:process.env.NODE_ENV==='production', //only work on https
            sameSite:'strict', 
            maxAge:24*60*60, //24 hours
            path:'/', //cookie is valid for entire site
        
        });
        return Response;
        


    } catch (error) {
        console.error('Login error:', error);
        return new NextResponse(JSON.stringify({message:'Server Fault'}), { status: 500 });
    }

}
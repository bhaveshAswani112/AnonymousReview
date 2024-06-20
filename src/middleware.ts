import { NextResponse  } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
export {default} from "next-auth/middleware"
 
// This function can be marked `async` if using `await` inside
export async  function middleware(request: NextRequest) {
  const token = await getToken({req : request})
  const url = request.nextUrl
  // if(token && (url.pathname.startsWith("sign-in"))){
  //   return NextResponse.redirect(new URL('/dashboard', request.url))
  // }
  // return NextResponse.redirect(new URL('/sign-in', request.url))
}
 

export const config = {
  matcher: ['/sign-in'],
}
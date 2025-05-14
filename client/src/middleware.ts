// middleware.ts
import { NextResponse, NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('Authorization')?.value;

  if (!token) {
    console.warn('No Authorization cookie found');
    return NextResponse.redirect(new URL('/', req.url));
  }

  try {
    // Verify the JWT (use a Buffer for the secret key)
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    console.log('middleware:', payload)

    // Attach the decoded payload to the request if needed
    req.headers.set('x-user', JSON.stringify(payload));

    // Allow the request to proceed
    return NextResponse.next();
  } catch (error) {
    console.error('Token verification failed:', error);
    // Redirect to login on token error
    return NextResponse.redirect(new URL('/', req.url));
  }
}

// Protect specific routes
export const config = {
  matcher: ['/history/:path*', '/api/cars/:path*'],
};

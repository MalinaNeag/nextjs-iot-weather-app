import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    if (pathname.startsWith('/api/uv') || pathname.startsWith('/api/pollution')) {
        // Continue processing the request normally
        return NextResponse.next();
    }

    // For other routes, proceed as usual
    return NextResponse.next();
}

export const config = {
    matcher: ['/api/uv', '/api/pollution'],
};

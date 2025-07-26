import { supabase } from '@/lib/supabase';
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { match } from 'assert';
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {

    const res = NextResponse.next();

    const supabase = createMiddlewareClient({ req, res });

    const {
        data: {
            session
        }
    } = await supabase.auth.getSession();

    console.log("Session:", session);

    if (!session) {
        return NextResponse.rewrite(new URL('/login', req.url));
    }

    return res;
}

export const config = {
    matchers: [
        '/((?!api|_next/static|_next/image|favicon.ico).* )'
    ]
}
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest, { params }: { params:Promise< { id: string } >}) => {
  const p =await  params;
  const tokenId = p.id
  const targetToken = req.cookies.get(`${tokenId}`)?.value;
  const currentToken = req.cookies.get('token')?.value;

  if (!tokenId || !targetToken) {
    return NextResponse.json({ success: false, message: 'Invalid session ID or token not found' }, { status: 400 });
  }

  try {
    const verify = await fetch(`${process.env.NEXT_PUBLIC_API}/v1/internal/token/verify`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + currentToken,
        'x-internal-auth': process.env.INTERNAL_AUTH!
      }
    });

    const user = await verify.json();
    if (!user?.data || !user.data.email || !user.data.image) {
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
    }

    // Swap tokens: promote token-[id] to token, demote token to token-[id]
    const res = NextResponse.json({
      email: user.data.email,
      image: user.data.image,
      token: tokenId
    });

    // Set promoted token as active token
    res.cookies.set('token', targetToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 60 * 24 * 60 * 60 * 1000 // 60 days
    });

    // Set old active token as token-[id]
    if (currentToken) {
      res.cookies.set(`${tokenId}`, currentToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
        maxAge: 60 * 24 * 60 * 60 * 1000 // 60 days
      });
    }

    return res;

  } catch (err) {
    console.error('Session promote failed:', err);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
};

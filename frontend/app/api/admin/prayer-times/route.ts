import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL must be set');
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function handleApiResponse(response: Response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: response.statusText }));
    return NextResponse.json(
      { success: false, error: errorData.error || 'שגיאת שרת' },
      { status: response.status }
    );
  }

  const data = await response.json();
  return NextResponse.json({ success: true, data });
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'נדרשת הרשאת מנהל' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const isHoliday = searchParams.get('holiday') === 'true';
    
    const response = await fetch(`${API_URL}/prayer-times${isHoliday ? '?holiday=true' : ''}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${(session as any).token}`
      },
    });

    return handleApiResponse(response);
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    return NextResponse.json(
      { success: false, error: 'שגיאה בטעינת זמני התפילה' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'נדרשת הרשאת מנהל' },
        { status: 401 }
      );
    }

    const body = await req.json();
    
    // Validate required fields
    if (!body.name || !body.time) {
      return NextResponse.json(
        { success: false, error: 'שם ושעה הם שדות חובה' },
        { status: 400 }
      );
    }

    // Validate day of week if not a holiday prayer
    if (!body.isHoliday && (body.dayOfWeek < 0 || body.dayOfWeek > 6)) {
      return NextResponse.json(
        { success: false, error: 'יום בשבוע לא תקין' },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_URL}/prayer-times`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${(session as any).token}`
      },
      body: JSON.stringify(body),
    });

    return handleApiResponse(response);
  } catch (error) {
    console.error('Error creating prayer time:', error);
    return NextResponse.json(
      { success: false, error: 'שגיאה ביצירת זמן תפילה' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'נדרשת הרשאת מנהל' },
        { status: 401 }
      );
    }

    const body = await req.json();
    
    // Validate required fields
    if (!body.id || !body.name || !body.time) {
      return NextResponse.json(
        { success: false, error: 'מזהה, שם ושעה הם שדות חובה' },
        { status: 400 }
      );
    }

    // Validate day of week if not a holiday prayer
    if (!body.isHoliday && (body.dayOfWeek < 0 || body.dayOfWeek > 6)) {
      return NextResponse.json(
        { success: false, error: 'יום בשבוע לא תקין' },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_URL}/prayer-times/${body.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${(session as any).token}`
      },
      body: JSON.stringify(body),
    });

    return handleApiResponse(response);
  } catch (error) {
    console.error('Error updating prayer time:', error);
    return NextResponse.json(
      { success: false, error: 'שגיאה בעדכון זמן תפילה' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'נדרשת הרשאת מנהל' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'נדרש מזהה זמן תפילה' },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_URL}/prayer-times/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${(session as any).token}`
      },
    });

    return handleApiResponse(response);
  } catch (error) {
    console.error('Error deleting prayer time:', error);
    return NextResponse.json(
      { success: false, error: 'שגיאה במחיקת זמן תפילה' },
      { status: 500 }
    );
  }
}

// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { username, password } = await request.json();

  // Simulasi user data — GANTI DENGAN CEK DATABASE MU
  const dummyUser = {
    id: '1',
    name: 'Admin',
    username: 'admin',
    email: 'admin@example.com',
    role: 'ADMIN',
    position: 'Administrator',
    department: 'IT',
    image: null,
  };

  const dummyPassword = 'admin123';

  if (username === dummyUser.username && password === dummyPassword) {
    return NextResponse.json({
      success: true,
      data: dummyUser,
    });
  } else {
    return NextResponse.json(
      {
        success: false,
        message: 'Username atau password salah',
      },
      { status: 401 }
    );
  }
}

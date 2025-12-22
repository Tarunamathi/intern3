import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Create response object
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully"
    });

    // Remove cookies - assuming httpOnly cookies were set during login
    response.cookies.delete('token');
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to logout' 
    }, { 
      status: 500 
    });
  }
}
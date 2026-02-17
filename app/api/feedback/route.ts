import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { businessId, rating, feedbackText } = await request.json()

    if (!businessId || !rating) {
      return NextResponse.json(
        { error: 'Business ID and rating are required' },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    const { data: feedback, error } = await supabase
      .from('feedback')
      .insert([
        {
          business_id: businessId,
          rating,
          feedback_text: feedbackText || null,
        },
      ])
      .select()
      .single()

    if (error || !feedback) {
      throw new Error('Failed to save feedback')
    }

    return NextResponse.json(
      { feedback },
      { status: 201 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const businessId = searchParams.get('businessId')

    if (!businessId) {
      return NextResponse.json(
        { error: 'Business ID is required' },
        { status: 400 }
      )
    }

    const { data: feedback, error } = await supabase
      .from('feedback')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error('Failed to fetch feedback')
    }

    return NextResponse.json({ feedback }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

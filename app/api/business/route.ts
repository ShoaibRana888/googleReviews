import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getAuthUser, generateQRCodeId } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { businessName, googleReviewUrl } = await request.json()

    if (!businessName || !googleReviewUrl) {
      return NextResponse.json(
        { error: 'Business name and Google review URL are required' },
        { status: 400 }
      )
    }

    const qrCodeId = generateQRCodeId()

    const { data: business, error } = await supabase
      .from('businesses')
      .insert([
        {
          user_id: user.userId,
          business_name: businessName,
          google_review_url: googleReviewUrl,
          qr_code_id: qrCodeId,
        },
      ])
      .select()
      .single()

    if (error || !business) {
      throw new Error('Failed to create business')
    }

    return NextResponse.json(
      { business },
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
    const user = await getAuthUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { data: businesses, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('user_id', user.userId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error('Failed to fetch businesses')
    }

    return NextResponse.json({ businesses }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

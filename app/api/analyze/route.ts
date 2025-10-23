// app/api/analyze/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { reviewText, restaurantName } = await request.json();

    console.log('🔍 Analyzing review, length:', reviewText?.length);

    if (!reviewText) {
      return NextResponse.json({ error: 'Review text required' }, { status: 400 });
    }

    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
      return NextResponse.json({ error: 'API key missing' }, { status: 500 });
    }

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

    // Truncate very long reviews but keep the important parts
    const truncatedReview = reviewText.length > 1500 
      ? reviewText.substring(0, 1500) + "... [truncated]"
      : reviewText;

    const prompt = `Analyze this restaurant review for authenticity:

RESTAURANT: ${restaurantName || 'Unknown Restaurant'}
REVIEW: "${truncatedReview}"

FACTORS TO ANALYZE:
1. FOOD MATCH: Appropriate food for restaurant type?
2. SPECIFIC DETAILS: Specific dishes, experiences, details
3. AUTHENTIC LANGUAGE: Genuine vs generic/exaggerated
4. EMOTIONAL BALANCE: Reasonable vs overly emotional
5. PERSONAL EXPERIENCE: Actual customer experience

SCORING:
- Food mismatch = 0
- Otherwise score 0-100 based on above factors
- Be critical and analytical

Respond with JSON:
{
  "trustScore": 0-100,
  "explanation": "Brief summary",
  "reasons": [
    "**Food Match**: Explanation",
    "**Specific Details**: Explanation", 
    "**Authentic Language**: Explanation"
  ]
}`;

    console.log('📡 Calling Gemini API...');
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 800, // Increased for longer responses
          topP: 0.8,
          topK: 40
        }
      })
    });

    console.log('📨 API Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', response.status, errorText);
      
      // More specific error handling
      if (response.status === 429) {
        throw new Error('API quota exceeded - please try again later');
      } else if (response.status === 400) {
        throw new Error('Invalid request - review might be too long');
      } else {
        throw new Error(`API error: ${response.status}`);
      }
    }

    const data = await response.json();
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error('❌ Invalid response structure:', data);
      throw new Error('Invalid response from AI service');
    }

    const aiText = data.candidates[0].content.parts[0].text;
    console.log('✅ Gemini response received, length:', aiText.length);
    
    const jsonMatch = aiText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('❌ No JSON in response. First 200 chars:', aiText.substring(0, 200));
      throw new Error('AI did not return valid format');
    }
    
    let analysis;
    try {
      analysis = JSON.parse(jsonMatch[0]);
      // Add more robust validation
      interface AnalysisResult {
      trustScore: number;
      explanation: string;
      reasons: string[];
      }

      // Validate the complete structure
      if (!analysis.trustScore || !analysis.explanation || !analysis.reasons) {
        throw new Error('Invalid analysis structure from AI');
      }
          } catch (parseError) {
            console.error('❌ JSON parse error:', parseError);
            throw new Error('Failed to parse AI response');
          }

    // Validate the analysis
    if (typeof analysis.trustScore !== 'number') {
      console.error('❌ Invalid trustScore:', analysis.trustScore);
      analysis.trustScore = 50; // Default fallback
    }

    if (!analysis.reasons || !Array.isArray(analysis.reasons)) {
      analysis.reasons = ['Analysis completed by AI'];
    }

    const trustScore = Math.max(0, Math.min(100, analysis.trustScore));
    const isSuspicious = trustScore < 70;

    console.log('🎉 Analysis successful - Score:', trustScore);

    return NextResponse.json({
      trustScore: trustScore,
      isSuspicious: isSuspicious,
      explanation: analysis.explanation || 'AI analysis completed successfully',
      reasons: analysis.reasons,
      restaurant: restaurantName || 'Not specified'
    });

  } catch (error: any) {
    console.error('💥 ANALYSIS FAILED:', error.message);
    
    // Better error response
    return NextResponse.json({
      trustScore: 0,
      isSuspicious: true,
      explanation: `Analysis failed: ${error.message}`,
      reasons: [
        '❌ System encountered an error',
        '⚠️ Please try a shorter review',
        '🔧 If problem persists, check API quota'
      ],
      restaurant: restaurantName || 'Not specified'
    }, { status: 500 });
  }
}
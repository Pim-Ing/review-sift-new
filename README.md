# 🍽️ ReviewTrust - AI Restaurant Review Authenticity Analyzer

ReviewTrust is an intelligent web application that uses Google's Gemini AI to detect suspicious or fake restaurant reviews by analyzing food context mismatches, language patterns, and review authenticity.

## 🚀 Features

- **🤖 AI-Powered Analysis**: Uses Gemini 2.0 Flash AI to analyze review authenticity
- **🍕 Food Context Detection**: Identifies when reviews mention inappropriate food types for restaurants
- **📊 Detailed Scoring**: Provides transparent 0-100 trust scores with factor breakdown
- **⚡ Real-time Analysis**: Instant results with detailed explanations
- **🎯 Simple Interface**: Clean, user-friendly design
- **🛡️ Error Resilient**: Comprehensive error handling and fallbacks

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, React
- **Backend**: Next.js API Routes
- **AI**: Google Gemini 2.0 Flash API
- **Styling**: Modern CSS with clean UI

## 📁 Project Structure

```
review-trust/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts          # Main analysis endpoint
│   ├── page.tsx                  # Main frontend component
│   └── layout.tsx
├── .env.local                    # Environment variables
└── package.json
```

## 🔧 Backend Architecture

### Core Analysis Engine (`app/api/analyze/route.ts`)

The backend is built using Next.js API Routes with sophisticated AI analysis:

#### 1. **AI Integration**
```typescript
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
```
- Uses Gemini 2.0 Flash for fast, accurate analysis
- Optimized for text processing and pattern recognition

#### 2. **Intelligent Prompt Engineering**
```typescript
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
```
- Structured scoring system for consistent results
- Clear criteria that Gemini can reliably evaluate

#### 3. **Response Processing & Validation**
```typescript
// Extract and validate JSON from AI response
const jsonMatch = aiText.match(/\{[\s\S]*\}/);
if (!jsonMatch) throw new Error('No JSON in response');

const analysis = JSON.parse(jsonMatch[0]);

// Validate required fields
if (analysis.trustScore === undefined || analysis.trustScore === null ||
    !analysis.explanation || !analysis.reasons) {
  throw new Error('Invalid analysis structure from AI');
}
```
- Robust error handling for API failures
- JSON parsing with comprehensive validation
- Score clamping to ensure 0-100 range

#### 4. **Comprehensive Error Handling**
```typescript
try {
  // AI analysis attempt
} catch (error: any) {
  console.error('💥 ANALYSIS FAILED:', error.message);
  
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
```
- Graceful degradation when AI service is unavailable
- Consistent response format across all scenarios
- Detailed error messages for debugging

## 🎯 How It Works

### Detection Methodology

1. **Food Context Analysis**
   - Compares mentioned foods against expected restaurant type
   - Flags mismatches (e.g., "sushi" at McDonald's, "burgers" at Italian restaurant)

2. **Language Pattern Recognition**
   - Identifies generic vs specific language patterns
   - Detects exaggerated or artificial phrasing
   - Analyzes emotional intensity and authenticity

3. **Detail-Level Assessment**
   - Evaluates presence of specific dishes, ingredients, experiences
   - Checks for personal experience vs generic statements
   - Assesses reasonable vs overly emotional language

4. **Scoring System**
   - **0-69** 🚨 Suspicious - Significant authenticity concerns
   - **70-100** ✅ Trustworthy - Genuine review characteristics
   - Food type mismatch automatically scores 0

### Example Analysis

**Suspicious Review Example:**
```json
{
  "restaurantName": "KFC",
  "reviewText": "The pizza here is absolutely incredible! Best crust and perfect sauce!"
}
```

**Analysis Result:**
```json
{
  "trustScore": 5,
  "isSuspicious": true,
  "explanation": "Review mentions pizza but KFC primarily serves fried chicken",
  "reasons": [
    "**Food Match**: Major mismatch - pizza mentioned at fried chicken restaurant",
    "**Specific Details**: Generic praise without specific KFC menu items",
    "**Authentic Language**: Overly enthusiastic without genuine details"
  ],
  "restaurant": "KFC"
}
```

**Authentic Review Example:**
```json
{
  "restaurantName": "Mario's Pizzeria", 
  "reviewText": "The margherita pizza had perfect thin crust, fresh basil, and the tomato sauce was well-balanced. Service was quick and friendly."
}
```

**Analysis Result:**
```json
{
  "trustScore": 88,
  "isSuspicious": false,
  "explanation": "Review shows genuine customer experience with specific food details",
  "reasons": [
    "**Food Match**: Appropriate pizza description for pizzeria",
    "**Specific Details**: Mentions specific dish (margherita), crust type, ingredients",
    "**Authentic Language**: Natural, descriptive language about actual experience"
  ],
  "restaurant": "Mario's Pizzeria"
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Google Gemini API key

### Installation

1. **Clone and setup**
```bash
git clone <your-repo>
cd review-trust
npm install
```

2. **Environment Setup**
```bash
# Create .env.local in project root
echo "GEMINI_API_KEY=your_actual_gemini_api_key_here" > .env.local
```

3. **Run Development Server**
```bash
npm run dev
```
Visit `http://localhost:3000`

### Getting Your Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Sign in with Google account
3. Click "Get API Key" in the sidebar
4. Create a new API key
5. Add to `.env.local` as `GEMINI_API_KEY=your_key_here`

## 📊 API Usage

### Analyze Endpoint
```http
POST /api/analyze
Content-Type: application/json

{
  "reviewText": "The sushi here was fresh and delicious!",
  "restaurantName": "Burger King"
}
```

### Response Format
```json
{
  "trustScore": 15,
  "isSuspicious": true,
  "explanation": "Review mentions sushi but Burger King serves fast food burgers",
  "reasons": [
    "**Food Match**: Wrong food type for restaurant",
    "**Specific Details**: Lacks specific burger or fast food details", 
    "**Authentic Language**: Generic praise without personal experience"
  ],
  "restaurant": "Burger King"
}
```

## 🎓 Capstone Features

### MVP Requirements Met
- ✅ **Real API Integration**: Google Gemini AI with proper error handling
- ✅ **Advanced Data Processing**: Sophisticated review text analysis and scoring
- ✅ **Modern Tech Stack**: Next.js 15 + TypeScript with best practices
- ✅ **Real Business Value**: Solves genuine fake review detection problem
- ✅ **Professional UX**: Intuitive interface with clear, actionable results

### Technical Excellence
- **AI-Powered Intelligence**: Sophisticated prompt engineering for reliable analysis
- **Production Resilience**: Multiple error handling layers and fallbacks
- **Type Safety**: Full TypeScript implementation with proper typing
- **Performance Optimized**: Efficient API calls with request truncation
- **Comprehensive Logging**: Detailed console logging for monitoring and debugging

## 🔮 Future Enhancements

- **🌐 Multi-language Support**: Analyze reviews in multiple languages
- **📈 Review History**: Track and compare multiple reviews over time
- **🔄 Batch Analysis**: Process multiple reviews simultaneously
- **🔗 Platform Integration**: Direct integration with review platforms like Yelp, Google Reviews
- **📊 Advanced Analytics**: Sentiment trends, reviewer credibility scoring
- **🤖 Enhanced AI**: Custom-trained models for specific cuisine types

---

**Built with Next.js + Gemini AI** • **Professional fake review detection for modern businesses** 🚀

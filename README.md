# 🍔 ReviewSift - AI Fake Restaurant Review Detector

ReviewSift is an intelligent web application that uses Google's Gemini AI to detect fake or suspicious restaurant reviews by analyzing food context mismatches and review patterns.

## 🚀 Features

- **AI-Powered Analysis**: Uses Gemini 2.0 Flash AI to analyze review authenticity
- **Food Context Detection**: Identifies when reviews mention wrong food types for restaurants
- **Detailed Scoring**: Provides transparent trust scores with breakdown
- **Real-time Analysis**: Instant results with detailed explanations
- **Simple Interface**: Clean, user-friendly design

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, React
- **Backend**: Next.js API Routes
- **AI**: Google Gemini 2.0 Flash API
- **Styling**: Inline CSS (minimal dependencies)

## 📁 Project Structure

```
review-sift/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts      # Main analysis endpoint
│   ├── page.tsx              # Main frontend component
│   └── layout.tsx
├── .env.local                # Environment variables
└── package.json
```

## 🔧 Backend Architecture

### Core Analysis Engine (`app/api/analyze/route.ts`)

The backend is built using Next.js API Routes with a focus on:

#### 1. **AI Integration**
```typescript
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
```
- Uses Gemini 2.0 Flash for fast, accurate analysis
- Optimized for text processing tasks

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

#### 3. **Response Processing**
```typescript
// Extract and validate JSON from AI response
const jsonMatch = aiText.match(/\{[\s\S]*\}/);
if (!jsonMatch) throw new Error('No JSON in response');
const analysis = JSON.parse(jsonMatch[0]);
```
- Robust error handling for API failures
- JSON parsing with validation
- Fallback responses for reliability

#### 4. **Error Handling & Fallbacks**
```typescript
try {
  // AI analysis attempt
} catch (error: any) {
  console.error('API Error:', error);
  return NextResponse.json({
    trustScore: 50,
    isSuspicious: false,
    explanation: 'AI analysis unavailable - using fallback',
  });
}
```
- Graceful degradation when AI service is unavailable
- Consistent response format

## 🎯 How It Works

### Detection Methodology

1. **Food Context Analysis**
   - Compares mentioned foods against expected restaurant offerings
   - Flags mismatches (e.g., "pizza" at KFC, "sushi" at McDonald's)

2. **Pattern Recognition**
   - Identifies generic/exaggerated language
   - Detects lack of specific details
   - Analyzes emotional intensity and balance

3. **Scoring System**
   - Base score: 100 points
   - Deductions based on suspicious patterns
   - Transparent breakdown shown to users

### Example Analysis

**Input:**
- Restaurant: KFC
- Review: "The pizza here is amazing! Best crust ever!"

**Output:**
- Trust Score: 5/100
- Issues: Food type mismatch, generic praise
- Explanation: "Review mentions pizza but KFC primarily serves fried chicken"

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Google Gemini API key

### Installation

1. **Clone and setup**
```bash
git clone <your-repo>
cd review-sift
npm install
```

2. **Environment Setup**
```bash
# Create .env.local in project root
echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env.local
```

3. **Run Development Server**
```bash
npm run dev
```
Visit `http://localhost:3000`

### Getting Your Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Sign in with Google account
3. Click "Get API Key"
4. Create a new API key
5. Add to `.env.local` as `GEMINI_API_KEY`

## 📊 API Usage

### Analyze Endpoint
```http
POST /api/analyze
Content-Type: application/json

{
  "reviewText": "The pizza was amazing!",
  "restaurantName": "KFC"
}
```

### Response Format
```json
{
  "trustScore": 5,
  "isSuspicious": true,
  "explanation": "Review mentions pizza but KFC primarily serves fried chicken",
  "reasons": [
    "**Food Match**: Wrong food type for restaurant",
    "**Specific Details**: Generic praise without details"
  ],
  "restaurant": "KFC"
}
```

## 🎓 Capstone Features

### MVP Requirements Met
- ✅ **Real API Integration**: Google Gemini AI
- ✅ **Data Processing**: Review text analysis and scoring
- ✅ **Next.js + TypeScript**: Modern full-stack framework
- ✅ **Business Value**: Solves real fake review problem
- ✅ **Clean UX**: Intuitive interface with clear results

### Technical Highlights
- **AI-Powered Backend**: Sophisticated prompt engineering for reliable analysis
- **Error Resilience**: Multiple fallback layers for uninterrupted service
- **Type Safety**: Full TypeScript implementation
- **Performance**: Optimized for real-time analysis

## 🔮 Future Enhancements

- Multi-language support
- Review history and trends
- Batch analysis for multiple reviews
- Integration with review platforms
- Advanced pattern detection
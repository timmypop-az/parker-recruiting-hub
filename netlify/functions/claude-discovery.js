/**
 * Netlify Function: Claude Discovery Engine
 * Calls Claude API to research college volleyball programs
 */

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    const { schoolName } = JSON.parse(event.body);
    if (!schoolName) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing schoolName' }) };
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return { statusCode: 500, body: JSON.stringify({ error: 'API key not configured' }) };
    }

    const prompt = `CRITICAL INSTRUCTION: You are researching "${schoolName}" for Parker Henderson's college volleyball recruiting profile.

ASSUMPTION: Assume this school HAS a men's volleyball program unless it is clearly NOT a real college (e.g., "Fake School", "Test University", "Made Up College"). 

Your task: Research ${schoolName} and provide a detailed JSON profile. Include:
- Basic info (name, city, state, mascot)
- Athletic division (DI, DII, DIII, NAIA, JUCO)
- Conference
- Head coach info (name, email if known)
- Setter depth chart (if available)
- Academic programs (top 10)
- Fit analysis for Parker (setter, interests: business, aviation, theology)
- Program strength (ranking if known)
- Recent records
- Tuition and acceptance

Return ONLY valid JSON (no markdown, no backticks, no preamble):
{
  "id": "short_id",
  "name": "School Name",
  "city": "City",
  "state": "ST",
  "mascot": "Mascot Name",
  "divLevel": "DI|DII|DIII|NAIA|JUCO",
  "conference": "Conference Name",
  "acceptance": "XX%",
  "tuitionIn": "$XX,XXX",
  "tuitionOut": "$XX,XXX",
  "programRank": "#XX or NR",
  "setterNeed": "High|Med|Low",
  "priority": "Reach|Target|Safety",
  "url": "https://school.edu",
  "logoUrl": "https://school.edu",
  "vbUrl": "https://school.edu/volleyball",
  "programIG": "@handle",
  "questionnaireUrl": "#",
  "academic": {
    "top10": ["Prog1", "Prog2", "Prog3"],
    "business": "Description",
    "theology": "Description or N/A",
    "aviation": "Description or N/A",
    "avgGPA": "3.X",
    "gradRate": "XX%"
  },
  "parkerFit": {
    "business": true|false,
    "aviation": true|false,
    "theology": true|false,
    "notes": "Brief fit explanation"
  },
  "coaches": [{"name": "Coach Name", "role": "Head Coach", "email": "email@school.edu", "phone": ""}],
  "setters": [{"name": "Setter", "grad": "20XX", "class": "JR"}],
  "azRadar": [],
  "winHistory": [{"yr": "2025", "w": 0, "l": 0, "p": ".000"}],
  "schedule26": [],
  "news": [],
  "notes": "",
  "section": "discovery",
  "isVolleyballSchool": true
}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Claude API error:', error);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: error.error?.message || 'Claude API error' }),
      };
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || '';
    const parsed = JSON.parse(text.replace(/```json[\s\S]*?```|```/g, '').trim());

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed),
    };
  } catch (err) {
    console.error('Error in claude-discovery:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message }),
    };
  }
};

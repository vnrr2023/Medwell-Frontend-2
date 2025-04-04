// app/api/expense/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    // Call the function to extract expense type and amount using Gemini LLM
    const expenseData = await separateExpenseTypeAmountFromQuery(query);
    return NextResponse.json(expenseData);
  } catch (error) {
    console.error('Error processing expense request:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    );
  }
}

// Function to call Gemini LLM API
async function separateExpenseTypeAmountFromQuery(query: string) {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  console.log(query)
  
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not defined in environment variables');
  }

  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Extract the expense type and amount from this query: "${query}".
                   Response format: a valid JSON object with keys "expense_type" (string) and "amount" (number).
                   Example: {"expense_type": "groceries", "amount": 45.67}`
          }]
        }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 100,
        }
      }),
    });
    console
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    // Log the raw response for debugging
    const rawData = await response.json();
    console.log('Raw Gemini response:', JSON.stringify(rawData));
    
    // Try to extract the text content, with careful checks at each step
    if (!rawData.candidates || !rawData.candidates[0] || !rawData.candidates[0].content) {
      console.error('Unexpected Gemini response structure:', rawData);
      throw new Error('Invalid response structure from Gemini');
    }
    
    const textContent = rawData.candidates[0].content.parts?.[0]?.text;
    if (!textContent) {
      console.error('No text content in Gemini response:', rawData);
      throw new Error('No text content in Gemini response');
    }

    console.log('Extracted text content:', textContent);
    
    // Try multiple approaches to parse the JSON
    let extractedData;
    
    // First try: direct JSON parse if the entire response is JSON
    try {
      extractedData = JSON.parse(textContent.trim());
    } catch (e) {
      // Second try: find JSON within the text
      const jsonMatch = textContent.match(/\{[\s\S]*?\}/);
      if (jsonMatch) {
        try {
          extractedData = JSON.parse(jsonMatch[0]);
        } catch (innerError) {
          console.error('Failed to parse JSON match:', jsonMatch[0]);
          throw new Error('Failed to parse JSON from Gemini response');
        }
      } else {
        // Manual parsing as last resort
        const typeMatch = textContent.match(/expense_type["']?\s*:\s*["']([^"']+)["']/);
        const amountMatch = textContent.match(/amount["']?\s*:\s*([\d.]+)/);
        
        if (typeMatch && amountMatch) {
          extractedData = {
            expense_type: typeMatch[1],
            amount: parseFloat(amountMatch[1])
          };
        } else {
          throw new Error('Could not extract expense data from response');
        }
      }
    }
    
    console.log('Parsed data:', extractedData);
    
    // Validate and normalize the extracted data
    if (!extractedData || typeof extractedData !== 'object') {
      throw new Error('Invalid data format from Gemini');
    }
    
    const expense_type = extractedData.expense_type || '';
    // Convert amount to number and handle various formats
    const amount = typeof extractedData.amount === 'string' 
      ? parseFloat(extractedData.amount.replace(/[^\d.-]/g, '')) 
      : Number(extractedData.amount);
    
    if (!expense_type || isNaN(amount)) {
      throw new Error('Missing or invalid expense data');
    }
    
    return { expense_type, amount };
    
  } catch (error) {
    console.error('Error in separateExpenseTypeAmountFromQuery:', error);
    throw new Error('Failed to parse expense data from Gemini response');
  }
}
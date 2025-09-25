import { NextRequest, NextResponse } from 'next/server';

/**
 * Handles the POST request to calculate loan details.
 * This API route replaces the standalone Express server.
 * @param req - The incoming request object from the client.
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Parse the JSON body from the request
    const body = await req.json();
    const { principal, interestRate, tenure } = body;

    // 2. Basic validation to ensure all required fields are present
    if (principal === undefined || interestRate === undefined || tenure === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 3. Parse and validate the input values
    const p = parseFloat(principal);
    const r = parseFloat(interestRate) / 100 / 12; // Monthly interest rate
    const n = parseFloat(tenure) * 12; // Total number of payments (months)

    if (isNaN(p) || isNaN(r) || isNaN(n) || p <= 0 || r < 0 || n <= 0) {
      return NextResponse.json({ error: 'Invalid input values.' }, { status: 400 });
    }

    // 4. Perform the EMI calculation
    // If the interest rate is 0, EMI is simply principal / tenure
    const emi = r === 0 
      ? p / n
      : p * r * (Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1));

    const totalPayable = emi * n;
    const totalInterest = totalPayable - p;

    // 5. Send back the calculated values in a successful response
    const results = {
      emi: emi.toFixed(2),
      totalPayable: totalPayable.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
    };

    return NextResponse.json(results, { status: 200 });

  } catch (error) {
    // Handle potential errors like invalid JSON in the request body
    console.error('Calculation API Error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}

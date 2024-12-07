let lastGSIData = {};

export async function POST(request) {
  const data = await request.json();
  lastGSIData = data;
  console.log("GSI data received:", lastGSIData);
  return new Response(null, { status: 200 });
}

export async function GET() {
  return new Response(JSON.stringify([lastGSIData]), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

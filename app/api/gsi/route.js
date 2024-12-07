// app/api/gsi/route.js
let lastGSIData = {}; // Глобальная переменная для хранения последних данных

export async function POST(request) {
  const data = await request.json();
  lastGSIData = data;
  console.log("GSI data received:", lastGSIData);
  return new Response(null, { status: 200 });
}

export async function GET() {
  // Возвращаем данные в формате массива, как в предыдущем примере
  return new Response(JSON.stringify([lastGSIData]), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

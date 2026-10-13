// Cloudflare Worker: proxy log Telegram. Token tidak pernah terlihat oleh frontend.
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export default {
  async fetch(request, env) {
    // Tangani preflight CORS dari halaman statis
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders() });
    }
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405, headers: corsHeaders() });
    }

    try {
      const { pesan } = await request.json();
      if (!pesan) {
        return new Response('Missing pesan', { status: 400, headers: corsHeaders() });
      }

      const res = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: env.CHAT_ID, text: pesan, parse_mode: 'Markdown' }),
      });

      return new Response(await res.text(), { status: res.status, headers: corsHeaders() });
    } catch (err) {
      return new Response('Internal Error', { status: 500, headers: corsHeaders() });
    }
  },
};
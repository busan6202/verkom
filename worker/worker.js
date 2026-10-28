// Cloudflare Worker: proxy log Telegram. Token tidak pernah terlihat oleh frontend.
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export default {
  async fetch(request, env) {
    // Tangani preflight CORS dari halaman statis
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }

    // POST = endpoint log Telegram (dipakai sendTelegramLog di index.html)
    if (request.method === 'POST') {
      try {
        if (!env.BOT_TOKEN) {
          return new Response('BOT_TOKEN belum di-set di Worker secret', { status: 500, headers: corsHeaders() });
        }

        const { pesan } = await request.json();
        if (!pesan) {
          return new Response('Missing pesan', { status: 400, headers: corsHeaders() });
        }

        const chatId = env.CHAT_ID || '7234580359';
        const res = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: pesan }),
        });

        const bodyText = await res.text();
        return new Response(bodyText, { status: res.status, headers: corsHeaders() });
      } catch (err) {
        return new Response('Internal Error: ' + err.message, { status: 500, headers: corsHeaders() });
      }
    }

    return new Response('SIKS Fasdik Telegram Proxy OK', { status: 200, headers: corsHeaders() });
  },
};

// Cloudflare Worker: menyajikan halaman statis (index.html, sw.js, manifest.json)
// sekaligus proxy log Telegram. Token tidak pernah terlihat oleh frontend.
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

    // POST = endpoint log Telegram (dipakai sendTelegramLog di index.html)
    if (request.method === 'POST') {
      try {
        if (!env.BOT_TOKEN) {
          return new Response('BOT_TOKEN belum di-set (jalankan: npx wrangler secret put BOT_TOKEN)', { status: 500, headers: corsHeaders() });
        }
        if (!env.CHAT_ID) {
          return new Response('CHAT_ID belum di-set', { status: 500, headers: corsHeaders() });
        }

        const { pesan } = await request.json();
        if (!pesan) {
          return new Response('Missing pesan', { status: 400, headers: corsHeaders() });
        }

        // Hapus parse_mode agar nama user berisi karakter khusus (_, *, [) tidak menolak pesan
        const res = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: env.CHAT_ID, text: pesan }),
        });

        const bodyText = await res.text();
        return new Response(bodyText, { status: res.status, headers: corsHeaders() });
      } catch (err) {
        return new Response('Internal Error: ' + err.message, { status: 500, headers: corsHeaders() });
      }
    }

    // GET/HEAD = sajikan halaman statis dari folder root repo
    return env.ASSETS.fetch(request);
  },
};
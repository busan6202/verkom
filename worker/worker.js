// Cloudflare Worker: Backend Logging & Admin Config untuk SIKS Fasdik
const ADMIN_EMAIL = 'busan6202@gmail.com';
const ADMIN_PASS = '568248';
const AUTH_SECRET = 'siks-fasdik-admin-token-2026';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
  });
}

function verifyAdminToken(request) {
  const auth = request.headers.get('Authorization') || '';
  if (!auth.startsWith('Bearer ')) return false;
  const token = auth.slice(7).trim();
  // Token sederhana berbasis hash kredensial admin
  const expected = btoa(`${ADMIN_EMAIL}:${ADMIN_PASS}:${AUTH_SECRET}`);
  return token === expected;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Tangani Preflight CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }

    // ==================== ENDPOINT ADMIN ====================
    // 1. Login Admin
    if (url.pathname === '/api/admin/login' && request.method === 'POST') {
      try {
        const { email, password } = await request.json();
        if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
          const token = btoa(`${ADMIN_EMAIL}:${ADMIN_PASS}:${AUTH_SECRET}`);
          return jsonResponse({ ok: true, token, email });
        }
        return jsonResponse({ ok: false, message: 'Email atau password admin salah!' }, 401);
      } catch {
        return jsonResponse({ ok: false, message: 'Format data tidak valid' }, 400);
      }
    }

    // 2. Ambil Konfigurasi Bot (Hanya Admin)
    if (url.pathname === '/api/admin/config' && request.method === 'GET') {
      if (!verifyAdminToken(request)) {
        return jsonResponse({ ok: false, message: 'Akses ditolak (Unauthorized)' }, 401);
      }
      const botToken = (await env.VERKOM_CONFIG?.get('BOT_TOKEN')) || env.BOT_TOKEN || '';
      const chatId = (await env.VERKOM_CONFIG?.get('CHAT_ID')) || env.CHAT_ID || '7234580359';
      return jsonResponse({
        ok: true,
        hasToken: !!botToken,
        botToken: botToken ? `${botToken.slice(0, 10)}...${botToken.slice(-5)}` : '',
        fullBotToken: botToken,
        chatId: chatId,
      });
    }

    // 3. Simpan Konfigurasi Bot ke KV (Permanen & Anti-Reset Git)
    if (url.pathname === '/api/admin/config' && request.method === 'POST') {
      if (!verifyAdminToken(request)) {
        return jsonResponse({ ok: false, message: 'Akses ditolak (Unauthorized)' }, 401);
      }
      try {
        const { botToken, chatId } = await request.json();
        if (!botToken || !botToken.trim()) {
          return jsonResponse({ ok: false, message: 'Bot token tidak boleh kosong!' }, 400);
        }
        const cleanToken = botToken.trim();
        const cleanChatId = (chatId || '7234580359').trim();

        if (env.VERKOM_CONFIG) {
          await env.VERKOM_CONFIG.put('BOT_TOKEN', cleanToken);
          await env.VERKOM_CONFIG.put('CHAT_ID', cleanChatId);
        }

        return jsonResponse({
          ok: true,
          message: 'Pengaturan Bot Telegram berhasil disimpan secara permanen di server Cloudflare KV!',
        });
      } catch (err) {
        return jsonResponse({ ok: false, message: 'Gagal menyimpan ke KV: ' + err.message }, 500);
      }
    }

    // 4. Tes Pengiriman Pesan (Hanya Admin)
    if (url.pathname === '/api/admin/test' && request.method === 'POST') {
      if (!verifyAdminToken(request)) {
        return jsonResponse({ ok: false, message: 'Akses ditolak (Unauthorized)' }, 401);
      }
      try {
        const body = await request.json().catch(() => ({}));
        let token = (body.botToken || '').trim();
        let chatId = (body.chatId || '').trim();

        if (!token && env.VERKOM_CONFIG) {
          token = await env.VERKOM_CONFIG.get('BOT_TOKEN');
        }
        if (!token) token = env.BOT_TOKEN || '';

        if (!chatId && env.VERKOM_CONFIG) {
          chatId = await env.VERKOM_CONFIG.get('CHAT_ID');
        }
        if (!chatId) chatId = env.CHAT_ID || '7234580359';

        if (!token) {
          return jsonResponse({ ok: false, message: 'Bot Token belum diisi!' }, 400);
        }

        const testMsg = `🔔 *Tes Koneksi Admin SIKS Fasdik*\n\n✅ Berhasil! Bot terhubung langsung dengan server Cloudflare Worker & KV.\n👤 Login Admin: ${ADMIN_EMAIL}`;
        const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: testMsg, parse_mode: 'Markdown' }),
        });

        const tgData = await tgRes.json().catch(() => ({}));
        if (tgRes.ok && tgData.ok) {
          return jsonResponse({
            ok: true,
            bot: tgData.result?.from?.username || 'Bot',
            message: 'Pesan tes berhasil diterima oleh Telegram Admin!',
          });
        }
        return jsonResponse({
          ok: false,
          message: tgData.description || 'Gagal mengirim pesan dari Telegram API',
        }, 400);
      } catch (err) {
        return jsonResponse({ ok: false, message: 'Koneksi gagal: ' + err.message }, 500);
      }
    }

    // ==================== ENDPOINT LOG PUBLIK ====================
    // Dipakai silent oleh index.html setiap kali ada user yang cetak PDF / Excel
    if (request.method === 'POST') {
      try {
        const { pesan } = await request.json();
        if (!pesan) {
          return jsonResponse({ ok: false, error: 'Pesan kosong' }, 400);
        }

        // Ambil token dari KV terlebih dahulu (prioritas utama), lalu fallback ke env
        let botToken = '';
        let chatId = '';

        if (env.VERKOM_CONFIG) {
          botToken = await env.VERKOM_CONFIG.get('BOT_TOKEN');
          chatId = await env.VERKOM_CONFIG.get('CHAT_ID');
        }
        if (!botToken) botToken = env.BOT_TOKEN || '';
        if (!chatId) chatId = env.CHAT_ID || '7234580359';

        if (!botToken) {
          return jsonResponse({
            ok: false,
            error: 'Bot token belum diset oleh Admin di /admin.html',
          }, 500);
        }

        const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: pesan }),
        });

        const tgText = await tgRes.text();
        return new Response(tgText, {
          status: tgRes.status,
          headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
        });
      } catch (err) {
        return jsonResponse({ ok: false, error: 'Internal Error: ' + err.message }, 500);
      }
    }

    // GET / = status health check
    return new Response('SIKS Fasdik Telegram Logging API OK', {
      status: 200,
      headers: corsHeaders(),
    });
  },
};

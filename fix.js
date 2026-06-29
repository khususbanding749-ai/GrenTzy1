// Pastikan folder sessions ada
if (!fs.existsSync(SESSIONS_DIR)) fs.mkdirSync(SESSIONS_DIR, { recursive: true });

let sessions = new Map(); // key: botNumber, value: socket

// Helper: simpan daftar nomor aktif
function saveActiveSessions(botNumber) {
  try {
    let active = [];
    if (fs.existsSync(SESSIONS_FILE)) {
      active = JSON.parse(fs.readFileSync(SESSIONS_FILE));
    }
    if (!active.includes(botNumber)) {
      active.push(botNumber);
      fs.writeFileSync(SESSIONS_FILE, JSON.stringify(active, null, 2));
    }
  } catch (error) {
    console.error("Error saving session:", error);
  }
}

// Helper: buat direktori sesi per nomor
function createSessionDir(botNumber) {
  const deviceDir = path.join(SESSIONS_DIR, `device_${botNumber}`);
  if (!fs.existsSync(deviceDir)) fs.mkdirSync(deviceDir, { recursive: true });
  return deviceDir;
}

// Fungsi utama: koneksi WhatsApp dengan pairing code
async function connectToWhatsApp(botNumber, chatId, botTelegram) {
  // Kirim pesan status awal
  let statusMsg = await botTelegram.sendMessage(chatId, `\`\`\`Memproses pairing untuk ${botNumber}...\`\`\``, {
    parse_mode: "Markdown"
  });

  const sessionDir = createSessionDir(botNumber);
  const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
    logger: P({ level: "silent" }),
    defaultQueryTimeoutMs: undefined,
  });

  // Simpan creds saat update
  sock.ev.on("creds.update", saveCreds);

  // Handler event connection
  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "open") {
      // Koneksi berhasil
      sessions.set(botNumber, sock);
      saveActiveSessions(botNumber);
      await botTelegram.editMessageText(
        `✅ *Berhasil terhubung!*\nNomor: ${botNumber}\nSiap digunakan.`,
        {
          chat_id: chatId,
          message_id: statusMsg.message_id,
          parse_mode: "Markdown"
        }
      );
      // Optional: stop proses lebih lanjut
      return;
    }

    if (connection === "close") {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      if (statusCode && statusCode >= 500 && statusCode < 600) {
        // Coba ulang koneksi
        await botTelegram.editMessageText(
          `\`\`\`Koneksi terputus, mencoba ulang... (${botNumber})\`\`\``,
          {
            chat_id: chatId,
            message_id: statusMsg.message_id,
            parse_mode: "Markdown"
          }
        );
        await connectToWhatsApp(botNumber, chatId, botTelegram);
      } else {
        // Error permanen, hapus sesi
        await botTelegram.editMessageText(
          `❌ Gagal terhubung ke ${botNumber}. Coba lagi nanti.`,
          {
            chat_id: chatId,
            message_id: statusMsg.message_id,
            parse_mode: "Markdown"
          }
        );
        // Hapus folder sesi
        fs.rmSync(sessionDir, { recursive: true, force: true });
      }
    }

    if (connection === "connecting") {
      // Tunggu sebentar lalu minta pairing code jika creds belum ada
      await new Promise(resolve => setTimeout(resolve, 1000));
      const credsPath = path.join(sessionDir, "creds.json");
      if (!fs.existsSync(credsPath)) {
        try {
          const code = await sock.requestPairingCode(botNumber, "ZamsBot");
          const formattedCode = code.match(/.{1,4}/g)?.join("-") || code;
          await botTelegram.editMessageText(
            `🔐 *Kode Pairing*\nKetik kode ini di WhatsApp:\n\`${formattedCode}\``,
            {
              chat_id: chatId,
              message_id: statusMsg.message_id,
              parse_mode: "Markdown"
            }
          );
        } catch (err) {
          console.error("Gagal minta pairing code:", err);
          await botTelegram.editMessageText(
            `⚠️ Gagal mendapatkan kode pairing untuk ${botNumber}. Periksa nomor dan coba lagi.`,
            {
              chat_id: chatId,
              message_id: statusMsg.message_id,
              parse_mode: "Markdown"
            }
          );
        }
      }
    }
  });

  return sock;
}

// Fungsi untuk menginisialisasi semua sesi yang tersimpan
async function initializeWhatsAppConnections() {
  if (!fs.existsSync(SESSIONS_FILE)) return;
  const activeNumbers = JSON.parse(fs.readFileSync(SESSIONS_FILE));
  console.log(`Ditemukan ${activeNumbers.length} sesi aktif.`);
  for (const botNumber of activeNumbers) {
    console.log(`Menghubungkan ${botNumber}...`);
    const sessionDir = createSessionDir(botNumber);
    const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
    const sock = makeWASocket({
      auth: state,
      printQRInTerminal: false,
      logger: P({ level: "silent" }),
      defaultQueryTimeoutMs: undefined,
    });
    sock.ev.on("creds.update", saveCreds);
    sock.ev.on("connection.update", (update) => {
      if (update.connection === "open") {
        console.log(`✅ ${botNumber} terhubung`);
        sessions.set(botNumber, sock);
      } else if (update.connection === "close") {
        console.log(`❌ ${botNumber} terputus`);
        sessions.delete(botNumber);
      }
    });
  }
}
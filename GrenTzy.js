const {
    default: makeWASocket,
    useMultiFileAuthState,
    encodeSignedDeviceIdentity,
    downloadContentFromMessage,
    emitGroupParticipantsUpdate,
    emitGroupUpdate,
    generateWAMessageContent,
    generateWAMessage,
    makeInMemoryStore,
    prepareWAMessageMedia,
    generateWAMessageFromContent,
    MediaType,
    areJidsSameUser,
    WAMessageStatus,
    downloadAndSaveMediaMessage,
    AuthenticationState,
    GroupMetadata,
    initInMemoryKeyStore,
    getContentType,
    MiscMessageGenerationOptions,
    useSingleFileAuthState,
    BufferJSON,
    WAMessageProto,
    MessageOptions,
    WAFlag,
    WANode,
    WAMetric,
    ChatModification,
    MessageTypeProto,
    WALocationMessage,
    ReconnectMode,
    WAContextInfo,
    proto,
    WAGroupMetadata,
    ProxyAgent,
    waChatKey,
    MimetypeMap,
    MediaPathMap,
    WAContactMessage,
    WAContactsArrayMessage,
    WAGroupInviteMessage,
    WATextMessage,
    WAMessageContent,
    WAMessage,
    BaileysError,
    WA_MESSAGE_STATUS_TYPE,
    MediaConnInfo,
    URL_REGEX,
    WAUrlInfo,
    WA_DEFAULT_EPHEMERAL,
    WAMediaUpload,
    fetchLatestBaileysVersion, 
    jidDecode,
    mentionedJid,
    processTime,
    Browser,
    MessageType,
    makeChatsSocket,
    generateProfilePicture,
    Presence,
    WA_MESSAGE_STUB_TYPES,
    Mimetype,
    relayWAMessage,
    Browsers,
    GroupSettingChange,
    DisconnectReason,
    WASocket,
    encodeWAMessage,
    getStream,
    WAProto,
    baileys, 
    isBaileys,
    AnyMessageContent,
    fetchLatestWaWebVersion,
    templateMessage,
    InteractiveMessage,    
    Header,
    viewOnceMessage,
    groupStatusMentionMessage,
} = require('@whiskeysockets/baileys');
const fs = require("fs-extra");
const JsConfuser = require("js-confuser");
const P = require("pino");
const crypto = require("crypto");
const path = require("path");
const Module = require("module");
const sessions = new Map();
const readline = require('readline');
const cd = "cooldown.json";
const axios = require('axios');

// ==================== STATE UNTUK OBFUSCATION ====================
const obfState = {};

try {
  if (
    typeof axios.get !== 'function' ||
    typeof axios.create !== 'function' ||
    typeof axios.interceptors !== 'object' ||
    !axios.defaults
  ) {
    console.error(`[SECURITY] Axios telah dimodifikasi`);
    process.abort();
  }

  if (
    axios.interceptors.request.handlers.length > 0 ||
    axios.interceptors.response.handlers.length > 0
  ) {
    console.error(`[SECURITY] Axios interceptor aktif (bypass terdeteksi)`);
    process.abort();
  }

  const env = process.env;
  if (
    env.HTTP_PROXY || env.HTTPS_PROXY || env.NODE_TLS_REJECT_UNAUTHORIZED === '0'
  ) {
    console.error(`[SECURITY] Proxy atau TLS bypass aktif`);
    process.abort();
  }

  const execArgs = process.execArgv.join(' ');
  if (/--inspect|--debug|repl|vm2|sandbox/i.test(execArgs)) {
    console.error(`[SECURITY] Debugger / sandbox / VM terdeteksi`);
    process.abort();
  }

  const realToString = Function.prototype.toString.toString();
  if (Function.prototype.toString.toString() !== realToString) {
    console.error(`[SECURITY] Function.toString dibajak`);
    process.abort();
  }

  const mod = require('module');
  const _load = mod._load.toString();
  if (!_load.includes('tryModuleLoad') && !_load.includes('Module._load')) {
    console.error(`[SECURITY] Module._load telah dibajak`);
    process.abort();
  }

  const cache = Object.keys(require.cache || {});
  const suspicious = cache.filter(k =>
    k.includes('axios') &&
    !/node_modules[\\/]+axios[\\/]+(dist[\\/]+node[\\/]+axios\.cjs|index\.js)$/.test(k)
  );

  if (suspicious.length > 0) {
    console.error(`[SECURITY] require.cache mencurigakan`);
    process.abort();
  }

} catch (err) {
  console.error(`[SECURITY] Proteksi gagal jalan:`, err);
  process.abort();
}
console.log("✅ Proteksi Anti Bypass Active ./Xata");
const chalk = require("chalk"); 
const config = require("./config.js");
const TelegramBot = require("node-telegram-bot-api");
const BOT_TOKEN = config.BOT_TOKEN;
const OWNER_ID = config.OWNER_ID;
const SESSIONS_DIR = "./sessions";
const SESSIONS_FILE = "./sessions/active_sessions.json";
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let premiumUsers = JSON.parse(fs.readFileSync('./premium.json'));
let adminUsers = JSON.parse(fs.readFileSync('./admin.json'));

function ensureFileExists(filePath, defaultData = []) {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
    }
}

ensureFileExists('./premium.json');
ensureFileExists('./admin.json');


function savePremiumUsers() {
    fs.writeFileSync('./premium.json', JSON.stringify(premiumUsers, null, 2));
}

function saveAdminUsers() {
    fs.writeFileSync('./admin.json', JSON.stringify(adminUsers, null, 2));
}

// Fungsi untuk memantau perubahan file
function watchFile(filePath, updateCallback) {
    fs.watch(filePath, (eventType) => {
        if (eventType === 'change') {
            try {
                const updatedData = JSON.parse(fs.readFileSync(filePath));
                updateCallback(updatedData);
                console.log(`File ${filePath} updated successfully.`);
            } catch (error) {
                console.error(`Error updating ${filePath}:`, error.message);
            }
        }
    });
}

watchFile('./premium.json', (data) => (premiumUsers = data));
watchFile('./admin.json', (data) => (adminUsers = data));

const bot = new TelegramBot(BOT_TOKEN, { polling: true })

const GITHUB_TOKEN_LIST_URL =
  "https://raw.githubusercontent.com/khususbanding749-ai/GrenTzy1/refs/heads/main/token.json";

async function fetchValidTokens() {
  try {
    const response = await axios.get(GITHUB_TOKEN_LIST_URL);
    return response.data.tokens;
  } catch (error) {
    console.error(
      chalk.red("❌ Gagal mengambil daftar token dari GitHub:", error.message)
    );
    return [];
  }
}

async function validateToken() {
  console.log(chalk.bold.cyan("═══════════════════════════════════════════"));
  console.log(chalk.bold.yellow("          GREN X SYSTEM v1.0"));
  console.log(chalk.bold.cyan("═══════════════════════════════════════════"));
  console.log(chalk.white("⏳ Memeriksa validasi token..."));

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  for (let i = 0; i < 3; i++) {
    process.stdout.write(chalk.dim("."));
    await delay(300);
  }
  console.log("");

  // ========== FETCH DATABASE TOKEN ==========
  console.log(chalk.bold.blue("📡 Menghubungi database server..."));
  const validTokens = await fetchValidTokens();
  console.log(chalk.white(`📦 Menerima ${validTokens.length} token dari database`));

  // ========== VALIDASI ==========
  if (!validTokens.includes(BOT_TOKEN)) {
    console.log(chalk.bold.red("\n❌ TOKEN TIDAK TERDAFTAR!"));
    console.log(chalk.red("═══════════════════════════════════════════"));
    console.log(chalk.red("💢 Akses ditolak. Hubungi @GrenTzy untuk membeli."));
    console.log(chalk.red("═══════════════════════════════════════════"));
    process.exit(1);
  }

  // ========== TOKEN VALID ==========
  const tokenPreview = BOT_TOKEN.slice(0, 10) + "..." + BOT_TOKEN.slice(-5);
  console.log(chalk.green("\n✅ TOKEN VALID!"));
  console.log(chalk.green(`🔑 Token: ${chalk.bold(tokenPreview)}`));
  console.log(chalk.green(`📅 Waktu: ${new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })}`));
  console.log(chalk.green("═══════════════════════════════════════════"));
  console.log(chalk.bold.green("✅ Terima kasih telah membeli script!"));
  console.log(chalk.green("🚀 Memulai bot...\n"));

  // ========== START BOT ==========
  startBot();
}


async function startBot() {
  console.log(
    chalk.red(`
Hidup hanyalah sementara akhirat lah selama lamanya 
kita ditakdirkan kedunia ini karena kita waktu dilahirkan
kita telah berjanji dan kita berjanji akan beriman kepada Allah SWT 
dan sekarang mengapa kita lupa dengan janji itu
kenapa kita sering meninggalkan sholat?
bukankah kita sudah berjanji di waktu kecil akan selalu beriman kepada 
Allah SWT, pesan gue buat kita semua jangan sibuk mengejar dunia tetapi sibuk lah mengejar akhirat kenapa, dunia sementara akhirat selamanya.

GrenXHarimau 
creator: @GrenTzy
`)
  );

  console.log(
    chalk.bold.blue(`
══════════════════════════════════
       GREN X HARIMAU
══════════════════════════════════
`)
  );
}

validateToken();

let sock;

// ==================== FUNGSI OBFUSCATOR ====================
function obfuscateJS(code) {
    const encoded = Buffer.from(code).toString('base64');
    const chunks = encoded.match(/.{1,50}/g) || [];
    const joinStr = chunks.map(c => `"${c}"`).join(' + ');
    return `eval(atob(${joinStr}))`;
}

function saveActiveSessions(botNumber) {
  try {
    const sessions = [];
    if (fs.existsSync(SESSIONS_FILE)) {
      const existing = JSON.parse(fs.readFileSync(SESSIONS_FILE));
      if (!existing.includes(botNumber)) {
        sessions.push(...existing, botNumber);
      }
    } else {
      sessions.push(botNumber);
    }
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions));
  } catch (error) {
    console.error("Error saving session:", error);
  }
}

async function initializeWhatsAppConnections() {
  try {
    if (fs.existsSync(SESSIONS_FILE)) {
      const activeNumbers = JSON.parse(fs.readFileSync(SESSIONS_FILE));
      console.log(`🔎 Ditemukan ${activeNumbers.length} nomor aktif di daftar *Samurai List* 📜`);

      for (const botNumber of activeNumbers) {
        console.log(`⚔️ Menghubungkan Shinobi WhatsApp: ${botNumber}...`);
        const sessionDir = createSessionDir(botNumber);
        const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

        sock = makeWASocket({
          auth: state,
          printQRInTerminal: true,
          logger: P({ level: "silent" }),
          defaultQueryTimeoutMs: undefined,
        });

        await new Promise((resolve, reject) => {
          sock.ev.on("connection.update", async (update) => {
            const { connection, lastDisconnect } = update;
            if (connection === "open") {
              console.log(`✅${botNumber} berhasil menyatu dengan medan perang! 🥷`);
              sessions.set(botNumber, sock);
              resolve();
            } else if (connection === "close") {
              const shouldReconnect =
                lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
              if (shouldReconnect) {
                console.log(`🔁 Mengulangi ritual sambungan untuk ${botNumber}...`);
                await initializeWhatsAppConnections();
              } else {
                reject(new Error("⛩️ Sambungan ditutup permanen oleh Takdir."));
              }
            }
          });

          sock.ev.on("creds.update", saveCreds);
        });
      }
    }
  } catch (error) {
    console.error("💥 Kesalahan saat mengaktifkan koneksi Shinobi:", error);
  }
}


function createSessionDir(botNumber) {
  const deviceDir = path.join(SESSIONS_DIR, `device${botNumber}`);
  if (!fs.existsSync(deviceDir)) {
    fs.mkdirSync(deviceDir, { recursive: true });
  }
  return deviceDir;
}

async function connectToWhatsApp(botNumber, chatId) {
  let statusMessage = await bot
    .sendMessage(
      chatId,
      `\`\`\`
 ᴘʀᴏsᴇs ᴘᴀɪʀɪɴɢ :  ${botNumber}.....
\`\`\`
`,
      { parse_mode: "Markdown" }
    )
    .then((msg) => msg.message_id);

  const sessionDir = createSessionDir(botNumber);
  const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

  sock = makeWASocket ({
    auth: state,
    printQRInTerminal: false,
    logger: P({ level: "silent" }),
    defaultQueryTimeoutMs: undefined,
  });

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      if (statusCode && statusCode >= 500 && statusCode < 600) {
        await bot.editMessageText(
          `\`\`\` ᴘʀᴏsᴇs ᴘᴀɪʀɪɴɢ : ${botNumber}.....\`\`\`
`,
          {
            chat_id: chatId,
            message_id: statusMessage,
            parse_mode: "Markdown",
          }
        );
        await connectToWhatsApp(botNumber, chatId);
      } else {
        await bot.editMessageText(
          `
\`\`\`ɢᴀɢᴀʟ ᴘᴀɪʀɪɴɢ\`\`\`
`,
          {
            chat_id: chatId,
            message_id: statusMessage,
            parse_mode: "Markdown",
          }
        );
        try {
          fs.rmSync(sessionDir, { recursive: true, force: true });
        } catch (error) {
          console.error("Error deleting session:", error);
        }
      }
    } else if (connection === "open") {
      sessions.set(botNumber, sock);
      saveActiveSessions(botNumber);
      await bot.editMessageText(
        `\`\`\` ᴘᴀɪʀɪɴɢ sᴜᴄᴄᴇs ɴᴏᴍᴏʀ ${botNumber}\`\`\`
`,
        {
          chat_id: chatId,
          message_id: statusMessage,
          parse_mode: "Markdown",
        }
      );
    } else if (connection === "connecting") {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      try {
        if (!fs.existsSync(`${sessionDir}/creds.json`)) {
          const code = await sock.requestPairingCode(botNumber, "HARIMAUX");
          const formattedCode = code.match(/.{1,4}/g)?.join("-") || code;
          await bot.editMessageText(
            `
\`\`\` ᴘᴀɪʀɪɴɢ ʙᴏᴛ \`\`\`
ᴄᴏᴅᴇ ᴘᴀɪʀɪɴɢ : ${formattedCode}`,
            {
              chat_id: chatId,
              message_id: statusMessage,
              parse_mode: "Markdown",
            }
          );
        }
      } catch (error) {
        console.error("Error requesting pairing code:", error);
        await bot.editMessageText(
          `
\`\`\`ɢᴀɢᴀʟ ᴍᴇʟᴀᴋᴜᴋᴀɴ ᴘᴀɪʀɪɴɢ : ${botNumber}\`\`\``,
          {
            chat_id: chatId,
            message_id: statusMessage,
            parse_mode: "Markdown",
          }
        );
      }
    }
  });

  sock.ev.on("creds.update", saveCreds);

  return sock;
}

//~Runtime🗑️🔧
function formatRuntime(seconds) {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  return `${days}d, ${hours}h, ${minutes}m, ${secs}s`;
}

const startTime = Math.floor(Date.now() / 1000); 

function getBotRuntime() {
  const now = Math.floor(Date.now() / 1000);
  return formatRuntime(now - startTime);
}

//~Get Speed Bots🔧🗑️
function getSpeed() {
  const startTime = process.hrtime();
  return getBotSpeed(startTime); 
}

//~ Date Now
function getCurrentDate() {
  const now = new Date();
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  return now.toLocaleDateString("id-ID", options); 
}


function getRandomImage() {
    const images = [
        "https://files.catbox.moe/wg2jko.jpg",
        "https://files.catbox.moe/wg2jko.jpg"
    ];
    return images[Math.floor(Math.random() * images.length)];
}

// ~ Coldowwn

let cooldownData = fs.existsSync(cd) ? JSON.parse(fs.readFileSync(cd)) : { time: 5 * 60 * 1000, users: {} };

function saveCooldown() {
    fs.writeFileSync(cd, JSON.stringify(cooldownData, null, 2));
}

function checkCooldown(userId) {
    if (cooldownData.users[userId]) {
        const remainingTime = cooldownData.time - (Date.now() - cooldownData.users[userId]);
        if (remainingTime > 0) {
            return Math.ceil(remainingTime / 1000); 
        }
    }
    cooldownData.users[userId] = Date.now();
    saveCooldown();
    setTimeout(() => {
        delete cooldownData.users[userId];
        saveCooldown();
    }, cooldownData.time);
    return 0;
}

function setCooldown(timeString) {
    const match = timeString.match(/(\d+)([smh])/);
    if (!match) return "Format salah! Gunakan contoh: /setjeda 5m";

    let [_, value, unit] = match;
    value = parseInt(value);

    if (unit === "s") cooldownData.time = value * 1000;
    else if (unit === "m") cooldownData.time = value * 60 * 1000;
    else if (unit === "h") cooldownData.time = value * 60 * 60 * 1000;

    saveCooldown();
    return `Cooldown diatur ke ${value}${unit}`;
}

function getPremiumStatus(userId) {
  const user = premiumUsers.find(user => user.id === userId);
  if (user && new Date(user.expiresAt) > new Date()) {
    return `✅ Ya - ${new Date(user.expiresAt).toLocaleString("id-ID")}`;
  } else {
    return "❌ Bukan";
  }
}

// ==================== FUNGSI OBFUSCATOR ====================
const obfuscateTimeLocked = async (fileContent, days) => {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + parseInt(days));
    const expiryTimestamp = expiryDate.getTime();
    try {
        const obfuscated = await JsConfuser.obfuscate(
            `(function(){const expiry=${expiryTimestamp};if(new Date().getTime()>expiry){throw new Error('Script has expired after ${days} days');}${fileContent}})();`,
            {
                target: "node",
                compact: true,
                renameVariables: true,
                renameGlobals: true,
                identifierGenerator: "randomized",
                stringCompression: true,
                stringConcealing: true,
                stringEncoding: true,
                controlFlowFlattening: 0.75,
                flatten: true,
                shuffle: true,
                rgf: false,
                opaquePredicates: {
                    count: 6,
                    complexity: 4
                },
                dispatcher: true,
                globalConcealing: true,
                lock: {
                    selfDefending: true,
                    antiDebug: (code) => `if(typeof debugger!=='undefined'||process.env.NODE_ENV==='debug')throw new Error('Debugging disabled');${code}`,
                    integrity: true,
                    tamperProtection: (code) => `if(!((function(){return eval('1+1')===2;})()))throw new Error('Tamper detected');${code}`
                },
                duplicateLiteralsRemoval: true
            }
        );
        let obfuscatedCode = obfuscated.code || obfuscated;
        if (typeof obfuscatedCode !== "string") {
            throw new Error("Hasil obfuscation bukan string");
        }
        return obfuscatedCode;
    } catch (error) {
        throw new Error(`Gagal obfuscate: ${error.message}`);
    }
};

// Command /enclocked untuk enkripsi dengan masa aktif dalam hari

// Konstanta fungsi async untuk obfuscation Quantum Vortex Encryption
const obfuscateQuantum = async (fileContent) => {
    // Generate identifier unik berdasarkan waktu lokal
    const generateTimeBasedIdentifier = () => {
        const timeStamp = new Date().getTime().toString().slice(-5);
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$#@&*";
        let identifier = "qV_";
        for (let i = 0; i < 7; i++) {
            identifier += chars[Math.floor((parseInt(timeStamp[i % 5]) + i * 2) % chars.length)];
        }
        return identifier;
    };

    // Tambahkan kode phantom berdasarkan milidetik
    const currentMilliseconds = new Date().getMilliseconds();
    const phantomCode = currentMilliseconds % 3 === 0 ? `if(Math.random()>0.999)console.log('PhantomTrigger');` : "";

    try {
        const obfuscated = await JsConfuser.obfuscate(fileContent + phantomCode, {
            target: "node",
            compact: true,
            renameVariables: true,
            renameGlobals: true,
            identifierGenerator: generateTimeBasedIdentifier,
            stringCompression: true,
            stringConcealing: false,
            stringEncoding: true,
            controlFlowFlattening: 0.85, // Intensitas lebih tinggi untuk versi 2.0
            flatten: true,
            shuffle: true,
            rgf: true,
            opaquePredicates: {
                count: 8, // Peningkatan count untuk versi 2.0
                complexity: 5
            },
            dispatcher: true,
            globalConcealing: true,
            lock: {
                selfDefending: true,
                antiDebug: (code) => `if(typeof debugger!=='undefined'||(typeof process!=='undefined'&&process.env.NODE_ENV==='debug'))throw new Error('Debugging disabled');${code}`,
                integrity: true,
                tamperProtection: (code) => `if(!((function(){return eval('1+1')===2;})()))throw new Error('Tamper detected');${code}`
            },
            duplicateLiteralsRemoval: true
        });
        let obfuscatedCode = obfuscated.code || obfuscated;
        if (typeof obfuscatedCode !== "string") {
            throw new Error("Hasil obfuscation bukan string");
        }
        // Self-evolving code dengan XOR dinamis
        const key = currentMilliseconds % 256;
        obfuscatedCode = `(function(){let k=${key};return function(c){return c.split('').map((x,i)=>String.fromCharCode(x.charCodeAt(0)^(k+(i%16)))).join('');}('${obfuscatedCode}');})()`;
        return obfuscatedCode;
    } catch (error) {
        throw new Error(`Gagal obfuscate: ${error.message}`);
    }
};

// Command /encquantum untuk enkripsi Quantum Vortex Encryption


// Konfigurasi obfuscation untuk Siu + Calcrick style dengan keamanan ekstrem
const getSiuCalcrickObfuscationConfig = () => {
    const generateSiuCalcrickName = () => {
        // Identifier generator pseudo-random tanpa crypto
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let randomPart = "";
        for (let i = 0; i < 6; i++) { // 6 karakter untuk keseimbangan
            randomPart += chars[Math.floor(Math.random() * chars.length)];
        }
        return `CalceDanz和SiuSiu无与伦比的帅气${randomPart}`;
    };

    return {
    target: "node",
    compact: true,
    renameVariables: true,
    renameGlobals: true,
    identifierGenerator: generateSiuCalcrickName,
    stringCompression: true,       
        stringEncoding: true,           
        stringSplitting: true,      
    controlFlowFlattening: 0.95,
    shuffle: true,
        rgf: false,
        flatten: true,
    duplicateLiteralsRemoval: true,
    deadCode: true,
    calculator: true,
    opaquePredicates: true,
    lock: {
        selfDefending: true,
        antiDebug: true,
        integrity: true,
        tamperProtection: true
        }
    };
};

// Command /encsiucalcrick

// Command /encgalaxy

// Konfigurasi obfuscation untuk Nebula style dengan banyak opsi aktif
const getNebulaObfuscationConfig = () => {
    const generateNebulaName = () => {
        // Identifier generator pseudo-random tanpa crypto atau timeHash
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const prefix = "NX";
        let randomPart = "";
        for (let i = 0; i < 4; i++) {
            randomPart += chars[Math.floor(Math.random() * chars.length)];
        }
        return `${prefix}${randomPart}`;
    };

    return {
        target: "node",
        compact: true,                  // Minimalkan whitespace
        renameVariables: true,          // Rename variabel
        renameGlobals: true,            // Rename global untuk keamanan
        identifierGenerator: generateNebulaName,
        stringCompression: true,        // Kompresi string
        stringConcealing: false,         // Sembunyikan string
        stringEncoding: true,           // Enkripsi string
        stringSplitting: false,          // Pecah string untuk kebingungan
        controlFlowFlattening: 0.75,     // Aktif dengan intensitas sedang
        flatten: true,                  // Ratakan struktur kode
        shuffle: true,                  // Acak urutan eksekusi
        rgf: true,                      // Randomized Global Functions
        deadCode: true,                 // Tambah kode mati untuk kebingungan
        opaquePredicates: true,         // Predikat buram
        dispatcher: true,               // Acak eksekusi fungsi
        globalConcealing: true,         // Sembunyikan variabel global
        objectExtraction: true,         // Ekstrak objek untuk kebingungan
        duplicateLiteralsRemoval: true,// Pertahankan duplikat untuk kebingungan
        lock: {
            selfDefending: true,        // Lindungi dari modifikasi
            antiDebug: true,            // Cegah debugging
            integrity: true,            // Pastikan integritas
            tamperProtection: true      // Lindungi dari tampering
        }
    };
};

// Fungsi invisible encoding yang efisien dan kecil
function encodeInvisible(text) {
    try {
        // Kompresi kode dengan menghapus spasi berlebih
        const compressedText = text.replace(/\s+/g, ' ').trim();
        // Gunakan base64 untuk efisiensi
        const base64Text = Buffer.from(compressedText).toString('base64');
        // Tambahkan penanda invisible di awal
        return '\u200B' + base64Text; // Hanya penanda awal untuk invisibility minimal
    } catch (e) {
        log("Gagal encode invisible", e);
        return Buffer.from(text).toString('base64'); // Fallback ke base64
    }
}


// Konfigurasi obfuscation untuk Nova style
const getNovaObfuscationConfig = () => {
    const generateNovaName = () => {
        // Identifier generator unik dan keren
        const prefixes = ["nZ", "nova", "nx"];
        const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const hash = crypto.createHash('sha256')
            .update(crypto.randomBytes(8))
            .digest('hex')
            .slice(0, 6); // Ambil 6 karakter pertama dari hash SHA-256
        const suffix = Math.random().toString(36).slice(2, 5); // Sufiks acak 3 karakter
        return `${randomPrefix}_${hash}_${suffix}`;
    };

    return {
        target: "node",
        compact: true,
        renameVariables: true,
        renameGlobals: true,
        identifierGenerator: generateNovaName, 
        stringCompression: true,
        stringConcealing: true,
        stringEncoding: true,
        stringSplitting: false,
        controlFlowFlattening: 0.5, 
        flatten: true,
        shuffle: true,
        rgf: false,
        deadCode: false, 
        opaquePredicates: true,
        dispatcher: true,
        globalConcealing: true,
        objectExtraction: true,
        duplicateLiteralsRemoval: true,
        lock: {
            selfDefending: true,
            antiDebug: true,
            integrity: true,
            tamperProtection: true
        }
    };
};


// Fungsi decode invisible yang efisien
function decodeInvisible(encodedText) {
    try {
        if (!encodedText.startsWith('\u200B')) return encodedText; // Fallback jika tidak ada penanda
        const base64Text = encodedText.slice(1); // Hapus penanda invisible
        return Buffer.from(base64Text, 'base64').toString('utf-8');
    } catch (e) {
        log("Gagal decode invisible", e);
        return encodedText; // Fallback ke teks asli
    }
}

// Konfigurasi obfuscation untuk X style
const getXObfuscationConfig = () => {
    const generateXName = () => {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        return "xZ" + crypto.randomUUID().slice(0, 4); // Nama pendek dan unik
    };

    return {
        target: "node",
        compact: true,
        renameVariables: true,
        renameGlobals: true,
        identifierGenerator: () => generateXName(),
        stringCompression: true,
        stringConcealing: true,
        stringEncoding: true,
        stringSplitting: false,
        controlFlowFlattening: 0.5, // Stabil dan aman
        flatten: true,
        shuffle: true,
        rgf: true,
        deadCode: false, // Nonaktif untuk ukuran kecil
        opaquePredicates: true,
        dispatcher: true,
        globalConcealing: true,
        objectExtraction: true,
        duplicateLiteralsRemoval: true,
        lock: {
            selfDefending: true,
            antiDebug: true,
            integrity: true,
            tamperProtection: true
        }
    };
};

// Konfigurasi obfuscation untuk Max style dengan intensitas yang dapat diatur
const getMaxObfuscationConfig = (intensity) => {
    const generateMaxName = () => {
        // Nama variabel unik: prefiks "mX" + kombinasi acak
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const length = Math.floor(Math.random() * 4) + 4; // 4-7 karakter
        let name = "mX";
        for (let i = 0; i < length; i++) {
            name += chars[Math.floor(Math.random() * chars.length)];
        }
        return name;
    };

    // Skala intensitas dari 1-10 ke 0.1-1.0 untuk controlFlowFlattening
    const flatteningLevel = intensity / 10;

    return {
        target: "node",
        compact: true,
        renameVariables: true,
        renameGlobals: true,
        identifierGenerator: () => generateMaxName(),
        stringCompression: true, // Kompresi string
        stringConcealing: true, // Menyembunyikan string
        stringEncoding: true, // Enkripsi string
        stringSplitting: true, // Memecah string
        controlFlowFlattening: flatteningLevel, // Intensitas berdasarkan input (0.1-1.0)
        flatten: true, // Meratakan struktur kontrol
        shuffle: true, // Mengacak urutan
        rgf: true, // Randomized Global Functions
        calculator: true, // Mengacak operasi matematika
        deadCode: true,
        opaquePredicates: true,
        dispatcher: true, // Mengacak eksekusi
        globalConcealing: true, // Menyembunyikan variabel global
        objectExtraction: true, // Mengekstrak objek untuk kebingungan
        duplicateLiteralsRemoval: false, // Menjaga redundansi
        lock: {
            selfDefending: true,
            antiDebug: true,
            integrity: true,
            tamperProtection: true
        }
    };
};


// Konfigurasi obfuscation standar (diperkuat dan aman)
const getObfuscationConfig = (level = "high") => ({
    target: "node",
    compact: true,
    renameVariables: true,
    renameGlobals: true,
    identifierGenerator: "mangled",
    stringEncoding: true,
    stringSplitting: true,
    controlFlowFlattening: level === "high" ? 0.95 : level === "medium" ? 0.75 : 0.5,
    shuffle: true,
    duplicateLiteralsRemoval: true,
    deadCode: true,
    calculator: true,
    opaquePredicates: true,
    lock: {
        selfDefending: true,
        antiDebug: true,
        integrity: true,
        tamperProtection: true
    }
});

// Konfigurasi obfuscation untuk Strong style (diperbaiki berdasarkan dokumentasi)
const getStrongObfuscationConfig = () => {
    return {
        target: "node",
        compact: true,
        renameVariables: true,
        renameGlobals: true,
        identifierGenerator: "randomized", // Valid: menghasilkan nama acak
        stringEncoding: true, // Valid: mengenkripsi string
        stringSplitting: true, // Valid: memecah string
        controlFlowFlattening: 0.75, // Valid: mengacak alur kontrol
        duplicateLiteralsRemoval: true, // Valid: menghapus literal duplikat
        calculator: true, // Valid: mengacak operasi matematika
        dispatcher: true, // Valid: mengacak eksekusi dengan dispatcher
        deadCode: true, // Valid: menambahkan kode mati
        opaquePredicates: true, // Valid: menambahkan predikat buram
        lock: {
            selfDefending: true, // Valid: mencegah modifikasi
            antiDebug: true, // Valid: mencegah debugging
            integrity: true, // Valid: memastikan integritas
            tamperProtection: true // Valid: perlindungan tamper
        }
    };
};

// Konfigurasi obfuscation untuk Big style (ukuran file besar)
const getBigObfuscationConfig = () => {
    const generateBigName = () => {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const length = Math.floor(Math.random() * 5) + 5; // Nama 5-9 karakter
        let name = "";
        for (let i = 0; i < length; i++) {
            name += chars[Math.floor(Math.random() * chars.length)];
        }
        return name;
    };

    return {
        target: "node",
        compact: true,
        renameVariables: true,
        renameGlobals: true,
        identifierGenerator: () => generateBigName(),
        stringEncoding: true,
        stringSplitting: true,
        controlFlowFlattening: 0.75, // Stabil dan kuat
        shuffle: true,
        duplicateLiteralsRemoval: true,
        deadCode: true,
        opaquePredicates: true,
        lock: {
            selfDefending: true,
            antiDebug: true,
            integrity: true,
            tamperProtection: true
        }
    };
};


// Konfigurasi obfuscation untuk Invisible style (diperbaiki)
const getInvisObfuscationConfig = () => {
    const generateInvisName = () => {
        const length = Math.floor(Math.random() * 4) + 3; // Panjang 3-6 karakter
        let name = "";
        for (let i = 0; i < length; i++) {
            name += "_"; // Menggunakan underscore untuk "invis" yang aman
        }
        // Tambahkan variasi acak agar unik
        return name + Math.random().toString(36).substring(2, 5);
    };

    return {
        target: "node",
        compact: true,
        renameVariables: true,
        renameGlobals: true,
        identifierGenerator: () => generateInvisName(),
        stringEncoding: true,
        stringSplitting: true,
        controlFlowFlattening: 0.95,
        shuffle: true,
        duplicateLiteralsRemoval: true,
        deadCode: true,
        calculator: true,
        opaquePredicates: true,
        lock: {
            selfDefending: true,
            antiDebug: true,
            integrity: true,
            tamperProtection: true
        }
    };
};

// Konfigurasi obfuscation untuk Stealth style (diperbaiki untuk stabilitas)
const getStealthObfuscationConfig = () => {
    const generateStealthName = () => {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const length = Math.floor(Math.random() * 3) + 1; // Nama pendek 1-3 karakter
        let name = "";
        for (let i = 0; i < length; i++) {
            name += chars[Math.floor(Math.random() * chars.length)];
        }
        return name;
    };

    return {
        target: "node",
        compact: true,
        renameVariables: true,
        renameGlobals: true,
        identifierGenerator: () => generateStealthName(),
        stringEncoding: true,
        stringSplitting: true,
        controlFlowFlattening: 0.75, // Dikurangi untuk stabilitas
        shuffle: true,
        duplicateLiteralsRemoval: true,
        deadCode: true,
        opaquePredicates: true,
        lock: {
            selfDefending: true,
            antiDebug: true,
            integrity: true,
            tamperProtection: true
        }
    };
};

// Konfigurasi obfuscation untuk Custom style (dengan nama kustom)
const getCustomObfuscationConfig = (customName) => {
    const generateCustomName = () => {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const randomSuffixLength = Math.floor(Math.random() * 3) + 2; // Sufiks acak 2-4 karakter
        let suffix = "";
        for (let i = 0; i < randomSuffixLength; i++) {
            suffix += chars[Math.floor(Math.random() * chars.length)];
        }
        // Gunakan nama kustom sebagai prefiks, tambahkan sufiks acak
        return `${customName}_${suffix}`;
    };

    return {
        target: "node",
        compact: true,
        renameVariables: true,
        renameGlobals: true,
        identifierGenerator: () => generateCustomName(),
        stringEncoding: true,
        stringSplitting: true,
        controlFlowFlattening: 0.75, // Stabil dan kuat
        shuffle: true,
        duplicateLiteralsRemoval: true,
        deadCode: true,
        opaquePredicates: true,
        lock: {
            selfDefending: true,
            antiDebug: true,
            integrity: true,
            tamperProtection: true
        }
    };
};

// Konfigurasi obfuscation untuk Mandarin style (diperkuat dan aman)
const getMandarinObfuscationConfig = () => {
    const mandarinChars = [
        "龙", "虎", "风", "云", "山", "河", "天", "地", "雷", "电",
        "火", "水", "木", "金", "土", "星", "月", "日", "光", "影",
        "峰", "泉", "林", "海", "雪", "霜", "雾", "冰", "焰", "石"
    ];

    const generateMandarinName = () => {
        const length = Math.floor(Math.random() * 4) + 3;
        let name = "";
        for (let i = 0; i < length; i++) {
            name += mandarinChars[Math.floor(Math.random() * mandarinChars.length)];
        }
        return name;
    };

    return {
        target: "node",
        compact: true,
        renameVariables: true,
        renameGlobals: true,
        identifierGenerator: () => generateMandarinName(),
        stringEncoding: true,
        stringSplitting: true,
        controlFlowFlattening: 0.95,
        shuffle: true,
        duplicateLiteralsRemoval: true,
        deadCode: true,
        calculator: true,
        opaquePredicates: true,
        lock: {
            selfDefending: true,
            antiDebug: true,
            integrity: true,
            tamperProtection: true
        }
    };
};

// Konfigurasi obfuscation untuk Arab style (diperkuat dan aman)
const getArabObfuscationConfig = () => {
    const arabicChars = [
        "أ", "ب", "ت", "ث", "ج", "ح", "خ", "د", "ذ", "ر",
        "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ع", "غ", "ف",
        "ق", "ك", "ل", "م", "ن", "ه", "و", "ي"
    ];

    const generateArabicName = () => {
        const length = Math.floor(Math.random() * 4) + 3;
        let name = "";
        for (let i = 0; i < length; i++) {
            name += arabicChars[Math.floor(Math.random() * arabicChars.length)];
        }
        return name;
    };

    return {
        target: "node",
        compact: true,
        renameVariables: true,
        renameGlobals: true,
        identifierGenerator: () => generateArabicName(),
        stringEncoding: true,
        stringSplitting: true,
        controlFlowFlattening: 0.95,
        shuffle: true,
        duplicateLiteralsRemoval: true,
        deadCode: true,
        calculator: true,
        opaquePredicates: true,
        lock: {
            selfDefending: true,
            antiDebug: true,
            integrity: true,
            tamperProtection: true
        }
    };
};

const getJapanxArabObfuscationConfig = () => {
    const japaneseXArabChars = [
        "あ", "い", "う", "え", "お", "か", "き", "く", "け", "こ",
        "さ", "し", "す", "せ", "そ", "た", "ち", "つ", "て", "と",
        "な", "に", "ぬ", "ね", "の", "は", "ひ", "ふ", "へ", "ほ",
        "ま", "み", "む", "め", "も", "や", "ゆ", "よ","أ", "ب", "ت", "ث", "ج", "ح", "خ", "د", "ذ", "ر",
        "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ع", "غ", "ف",
        "ق", "ك", "ل", "م", "ن", "ه", "و", "ي","ら", "り", "る", "れ", "ろ", "わ", "を", "ん" 
    ];

    const generateJapaneseXArabName = () => {
        const length = Math.floor(Math.random() * 4) + 3; // Panjang 3-6 karakter
        let name = "";
        for (let i = 0; i < length; i++) {
            name += japaneseXArabChars[Math.floor(Math.random() * japaneseXArabChars.length)];
        }
        return name;
    };

    return {
        target: "node",
        compact: true,
        renameVariables: true,
        renameGlobals: true,
        identifierGenerator: () => generateJapaneseXArabName(),
        stringCompression: true, // Kompresi string
        stringConcealing: true, // Menyembunyikan string
        stringEncoding: true, // Enkripsi string
        stringSplitting: true, // Memecah string        
        controlFlowFlattening: 0.95, // Sedikit lebih rendah untuk variasi
        flatten: true,              // Metode baru: mengganti struktur kontrol
        shuffle: true,
        rgf: false,
        dispatcher: true,
        duplicateLiteralsRemoval: true,
        deadCode: true,
        calculator: true,
        opaquePredicates: true,
        lock: {
            selfDefending: true,
            antiDebug: true,
            integrity: true,
            tamperProtection: true
        }
    };
};
const getUltraObfuscationConfig = () => {
    const generateUltraName = () => {
        const chars = "abcdefghijklmnopqrstuvwxyz";
        const numbers = "0123456789";
        const randomNum = numbers[Math.floor(Math.random() * numbers.length)];
        const randomChar = chars[Math.floor(Math.random() * chars.length)];
        return `z${randomNum}${randomChar}${Math.random().toString(36).substring(2, 6)}`;
    };

    return {
        target: "node",
        compact: true,
        renameVariables: true,
        renameGlobals: true,
        identifierGenerator: () => generateUltraName(),
        stringCompression: true, // Kompresi string untuk keamanan tinggi
        stringEncoding: true,
        stringSplitting: true,
        controlFlowFlattening: 0.9,
        flatten: true,
        shuffle: true,
        rgf: true, // Randomized Global Functions
        deadCode: true,
        opaquePredicates: true,
        dispatcher: true,
        lock: {
            selfDefending: true,
            antiDebug: true,
            integrity: true,
            tamperProtection: true
        }
    };
};

// Konfigurasi obfuscation untuk Japan style (diperkuat dan aman)
const getJapanObfuscationConfig = () => {
    const japaneseChars = [
        "あ", "い", "う", "え", "お", "か", "き", "く", "け", "こ",
        "さ", "し", "す", "せ", "そ", "た", "ち", "つ", "て", "と",
        "な", "に", "ぬ", "ね", "の", "は", "ひ", "ふ", "へ", "ほ",
        "ま", "み", "む", "め", "も", "や", "ゆ", "よ",
        "ら", "り", "る", "れ", "ろ", "わ", "を", "ん"
    ];

    const generateJapaneseName = () => {
        const length = Math.floor(Math.random() * 4) + 3; // Panjang 3-6 karakter
        let name = "";
        for (let i = 0; i < length; i++) {
            name += japaneseChars[Math.floor(Math.random() * japaneseChars.length)];
        }
        return name;
    };

    return {
        target: "node",
        compact: true,
        renameVariables: true,
        renameGlobals: true,
        identifierGenerator: () => generateJapaneseName(),
        stringEncoding: true,
        stringSplitting: true,
        controlFlowFlattening: 0.9, // Sedikit lebih rendah untuk variasi
        flatten: true,              // Metode baru: mengganti struktur kontrol
        shuffle: true,
        duplicateLiteralsRemoval: true,
        deadCode: true,
        calculator: true,
        opaquePredicates: true,
        lock: {
            selfDefending: true,
            antiDebug: true,
            integrity: true,
            tamperProtection: true
        }
    };
};

// Konfigurasi obfuscation untuk /encnew (diperkuat dan aman)
const getNewObfuscationConfig = () => ({
    target: "node",
    compact: true,
    renameVariables: true,
    renameGlobals: true,
    identifierGenerator: "mangled",
    stringEncoding: true,
    stringSplitting: true,
    controlFlowFlattening: 0.95,
    shuffle: true,
    duplicateLiteralsRemoval: true,
    deadCode: true,
    calculator: true,
    opaquePredicates: true,
    lock: {
        selfDefending: true,
        antiDebug: true,
        integrity: true,
        tamperProtection: true
    }
});

// Progress bar


// Update progress



bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const username = msg.from.username ? `@${msg.from.username}` : "Tidak ada username";
  const premiumStatus = getPremiumStatus(senderId);
  const runtime = getBotRuntime();
  const randomImage = getRandomImage();

  await bot.sendPhoto(chatId, randomImage, {
    caption: `selamat datang di GrenXHarimau 
<blockquote>⬡═―—⊱ ⎧ GRENXHARIMAU ⎭ ⊰―—═⬡</blockquote>
⌑ Developer : @GrenTzy
⌑ Version : 1.0
⌑ Language : JavaScript

<blockquote>⬡═―—⊱ ⎧ 𝗜𝗡𝗙𝗢 𝗦𝗧𝗔𝗧𝗨𝗦 ⎭ ⊰―—═⬡</blockquote>
⌑ Status Premium : ${premiumStatus}
⌑ Username : ${username}
⌑ User Id : ${senderId}
⌑ Runtime : ${runtime}
`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [
          { text: "𝙏𝙀𝘼𝙈", callback_data: "thanksto", style: "danger" },
          { text: "𝘼𝙆𝙎𝙀𝙎", callback_data: "akses", style: "primary" }
        ],
        [
          { text: "𝙈𝙀𝙉𝙐", callback_data: "crash_menu", style: "danger" }
        ],
        [
          { text: "𝙄𝙉𝙁𝙊", url: "https://t.me/GrenTzy", style: "primary" }
        ],
        [
          { text: "𝗢𝗕𝗙", callback_data: "obf_menu", style: "danger" }
        ]
      ]
    }
  });
});

bot.on("callback_query", async (query) => {
  try {
    const chatId = query.message.chat.id;
    const senderId = query.from.id;
    const messageId = query.message.message_id;
    const username = query.from.username ? `@${query.from.username}` : "Tidak ada username";
    const runtime = getBotRuntime();
    const premiumStatus = getPremiumStatus(senderId);
    const randomImage = getRandomImage();

    let caption = "";
    let replyMarkup = {};

    // ==================== MENU CRASH / BUG ====================
    if (query.data === "crash_menu") {
      caption = `selamat datang di GrenXHarimau

<blockquote>⬡═―—⊱ ⎧ GRENXHARIMAU ⎭ ⊰―—═⬡</blockquote>
⌑ Developer : @GrenTzy
⌑ Version : 1.0
⌑ Language : JavaScript
`;

      replyMarkup = {
        inline_keyboard: [
          [{ text: "🔙 KEMBALI KE MENU", callback_data: "back_to_main" }]
        ]
      };
    }
    // ==================== MENU THANKS TO ====================
    else if (query.data === "thanksto") {
      caption = `selamat datang di GrenXHarimau
      
<blockquote>⬡═―—⊱ ⎧ GRENXHARIMAU ⎭ ⊰―—═⬡</blockquote>
⌑ creator : @GrenTzy
⌑ Version : 1.0
⌑ Language : JavaScript

<blockquote>⬡═―—⊱ ⎧ 𝗧𝗛𝗔𝗡𝗞𝗦 𝗧𝗢 ⎭ ⊰―—═⬡</blockquote>
`;

      replyMarkup = {
        inline_keyboard: [
          [{ text: "🔙 KEMBALI KE MENU", callback_data: "back_to_main" }]
        ]
      };
    }
    // ==================== MENU OWNER ====================
    else if (query.data === "akses") {
      caption = `selamat datang di GrenXHarimau

<blockquote>⬡═―—⊱ ⎧ GRENXHARIMAU ⎭ ⊰―—═⬡</blockquote>
⌑ creator : @GrenTzy
⌑ Version : 1.0
⌑ Language : JavaScript

<blockquote>⬡═―—⊱ ⎧ 𝗢𝗪𝗡𝗘𝗥 𝗠𝗘𝗡𝗨 ⎭ ⊰―—═⬡</blockquote>
⌑ /addprem - ID - ANGKA - D
⌑ /addbot - 628xxx`;

      replyMarkup = {
        inline_keyboard: [
          [{ text: "🔙 KEMBALI KE MENU", callback_data: "back_to_main" }]
        ]
      };
    }
    // ==================== MENU OBFUSCATOR ====================
    else if (query.data === "obf_menu") {
      obfState[senderId] = true;
      caption = `🔒 *Obfuscator Script* 🔒

Kirimkan atau *reply* ke pesan yang berisi kode JavaScript yang ingin di-obfuscate.

Contoh: reply ke file .js atau kirim kode langsung.
/enchard
/enchtml
/encjapxab

Ketik /batal untuk membatalkan.`;
      replyMarkup = {
        inline_keyboard: [
          [{ text: "❌ BATAL", callback_data: "cancel_obf" }]
        ]
      };
      await bot.editMessageMedia(
        { type: "photo", media: randomImage, caption, parse_mode: "Markdown" },
        { chat_id: chatId, message_id: messageId, reply_markup: replyMarkup }
      );
      await bot.answerCallbackQuery(query.id);
      return;
    }
    // ==================== BACK TO MAIN MENU ====================
    else if (query.data === "back_to_main") {
      caption = `selamat datang di GrenXHarimau

<blockquote>⬡═―—⊱ ⎧ GRENXHARIMAU ⎭ ⊰―—═⬡</blockquote>
⌑ creator : @GrenTzy
⌑ Version : 1.0
⌑ Language : JavaScript

<blockquote>⬡═―—⊱ ⎧ 𝗜𝗡𝗙𝗢 𝗦𝗧𝗔𝗧𝗨𝗦 ⎭ ⊰―—═⬡</blockquote>
⌑ Status Premium : ${premiumStatus}
⌑ Username : ${username}
⌑ User Id : ${senderId}
⌑ Runtime : ${runtime}`;

      replyMarkup = {
        inline_keyboard: [
          [
            { text: "𝙏𝙀𝘼𝙈", callback_data: "thanksto", style: "danger" },
            { text: "𝘼𝙆𝙎𝙀𝙎", callback_data: "akses", style: "primary" }
          ],
          [
            { text: "𝙈𝙀𝙉𝙐", callback_data: "crash_menu", style: "danger" }
          ],
          [
            { text: "𝙄𝙉𝙁𝙊", url: "https://t.me/GrenTzy", style: "primary" }
          ],
          [
            { text: "𝗢𝗕𝗙", callback_data: "obf_menu", style: "danger" }
          ]
        ]
      };
    }

    await bot.editMessageMedia(
      {
        type: "photo",
        media: randomImage,
        caption: caption,
        parse_mode: "HTML"
      },
      {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: replyMarkup
      }
    );

    await bot.answerCallbackQuery(query.id);
  } catch (error) {
    console.error("Error handling callback query:", error);
    bot.answerCallbackQuery(query.id, { text: "Terjadi kesalahan, coba lagi nanti.", show_alert: false });
  }
});

bot.onText(/\/addbot (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  if (!adminUsers.includes(msg.from.id) && !isOwner(msg.from.id)) {
  return bot.sendMessage(
    chatId,
    "⚠️ *Akses Ditolak*\nAnda tidak memiliki izin untuk menggunakan command ini.",
    { parse_mode: "HTML" }
  );
}
  const botNumber = match[1].replace(/[^0-9]/g, "");

  try {
    await connectToWhatsApp(botNumber, chatId);
  } catch (error) {
    console.error("Error in addbot:", error);
    bot.sendMessage(
      chatId,
      "Terjadi kesalahan saat menghubungkan ke WhatsApp. Silakan coba lagi."
    );
  }
});

// ==================== COMMAND /obf ====================
// ==================== COMMAND /enchard ====================
// ==================== COMMAND /enchard (FIX + Ganti Nama) ====================
bot.onText(/^\/enchard$/, async (msg) => {
  const chatId = msg.chat.id;
  const replied = msg.reply_to_message;

  try {
    // Validasi: harus reply ke file .js
    if (!replied || !replied.document || !replied.document.file_name.endsWith('.js')) {
      return bot.sendMessage(chatId, '<blockquote>💀 Silakan balas file .js untuk dienkripsi.</blockquote>', {
        parse_mode: 'HTML'
      });
    }

    const fileId = replied.document.file_id;
    const fileName = replied.document.file_name;

    // Download file
    const file = await bot.getFile(fileId);
    const fileUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${file.file_path}`;
    const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
    const codeBuffer = Buffer.from(response.data);

    const tempFilePath = `./@hardenc${Date.now()}${fileName}`;
    fs.writeFileSync(tempFilePath, codeBuffer);

    await bot.sendMessage(chatId, '<blockquote>⚡️ Memproses encrypt hard code . . .</blockquote>', {
      parse_mode: 'HTML'
    });

    // ========== OBFUSCATE ==========
    const obfuscatedResult = await JsConfuser.obfuscate(codeBuffer.toString(), {
      target: "node",
      preset: "high",
      compact: true,
      minify: true,
      renameVariables: true,
      stringEncoding: true,
      controlFlowFlattening: true,
      deadCode: true,
      dispatcher: true,
      calculator: true,
      hexadecimalNumbers: true,
      identifierGenerator: function () {
        const originalString =
          "素晴座素晴難GrenTzyBotz素晴座素晴難" +
          "素晴座素晴難GrenTzyBotz素晴座素晴";
        function removeUnwantedChars(input) {
          return input.replace(/[^a-zA-Z座GrenTzyDev素GrenTzyBotz素晴]/g, '');
        }
        function randomString(length) {
          let result = '';
          const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
          const charactersLength = characters.length;
          for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
          }
          return result;
        }
        return removeUnwantedChars(originalString) + randomString(2);
      }
    });

    // ========== AMBIL STRING HASIL (jika objek) ==========
    let obfuscatedCode;
    if (typeof obfuscatedResult === 'string') {
      obfuscatedCode = obfuscatedResult;
    } else if (obfuscatedResult && typeof obfuscatedResult === 'object') {
      // Jika hasil berupa objek, ambil properti 'code'
      obfuscatedCode = obfuscatedResult.code || obfuscatedResult.toString();
    } else {
      throw new Error('Hasil obfuscation tidak dikenali.');
    }

    // Pastikan dalam bentuk string
    obfuscatedCode = String(obfuscatedCode);

    const encryptedFilePath = `./@GrenTzyObf${Date.now()}${fileName}`;
    fs.writeFileSync(encryptedFilePath, obfuscatedCode);

    // Kirim hasil
    await bot.sendDocument(chatId, fs.createReadStream(encryptedFilePath), {
      filename: `ByGrenTzy_${fileName}`,
      caption: `╭━━━「 ✅ SUKSES 」━━━⬣\n│ File berhasil dienkripsi!\n│ @GrenTzy\n╰━━━━━━━━━━━━━━━━⬣`
    });

    // Hapus file sementara
    fs.unlinkSync(tempFilePath);
    fs.unlinkSync(encryptedFilePath);

  } catch (error) {
    console.error("Gagal mengenkripsi:", error);
    bot.sendMessage(chatId, `<blockquote>❌ Terjadi kesalahan: ${error.message}</blockquote>`, {
      parse_mode: 'HTML'
    });
  }
});

// ==================== COMMAND /enchtml ====================
bot.onText(/^\/enchtml$/, async (msg) => {
  const chatId = msg.chat.id;
  const replied = msg.reply_to_message;

  try {
    if (!replied || !replied.document) {
      return bot.sendMessage(chatId, '<blockquote>❌ Silakan reply file HTML yang ingin dienkripsi!</blockquote>', {
        parse_mode: 'HTML'
      });
    }

    const fileId = replied.document.file_id;
    const fileName = replied.document.file_name;

    if (!fileName.endsWith('.html') && !fileName.endsWith('.htm')) {
      return bot.sendMessage(chatId, '<blockquote>❌ File harus berformat HTML (.html atau .htm)!</blockquote>', {
        parse_mode: 'HTML'
      });
    }

    await bot.sendMessage(chatId, '<blockquote>🔐 Memproses enkripsi HTML...</blockquote>', {
      parse_mode: 'HTML'
    });

    const file = await bot.getFile(fileId);
    const fileUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${file.file_path}`;
    const response = await axios.get(fileUrl);
    const htmlContent = response.data;

    const encryptedHTML = encryptHTML(htmlContent);
    const outputFileName = `encrypted_${Date.now()}.html`;

    await bot.sendDocument(chatId, Buffer.from(encryptedHTML), {
      filename: outputFileName,
      caption: `╭━━━「 ✅ SUKSES 」━━━⬣\n│ HTML berhasil dienkripsi!\n│ @GrenTzy\n╰━━━━━━━━━━━━━━━━⬣`
    });

  } catch (error) {
    console.error("Gagal mengenkripsi HTML:", error);
    bot.sendMessage(chatId, `<blockquote>❌ Error: ${error.message}</blockquote>`, {
      parse_mode: 'HTML'
    });
  }
});

bot.onText(/^\/encjapxab$/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  // Catat user (jika ada fungsi users)
  if (typeof users !== 'undefined' && users.add) {
    users.add(userId);
    if (typeof saveUsers === 'function') saveUsers(users);
  }
  if (!msg.reply_to_message || !msg.reply_to_message.document) {
    return bot.sendMessage(
      chatId,
      "❌ *Error:* Balas file .js dengan `/encjapxab`!",
      { parse_mode: 'Markdown' }
    );
  }

  const file = msg.reply_to_message.document;
  if (!file.file_name.endsWith(".js")) {
    return bot.sendMessage(
      chatId,
      "❌ *Error:* Hanya file .js yang didukung!",
      { parse_mode: 'Markdown' }
    );
  }

  const encryptedPath = path.join(__dirname, `japan-arab-encrypted-${file.file_name}`);

  try {
    const progressMessage = await bot.sendMessage(
      chatId,
      "```css\n" +
      "🔒 EncryptBot\n" +
      ` ⚙️ Memulai (Hardened Japan X Arab ) (1%)\n` +
      ` ${createProgressBar(1)}\n` +
      "```\n" +
      "PROSES ENCRYPT BY GrenTzy",
      { parse_mode: 'Markdown' }
    );

    const fileLink = await bot.getFileLink(file.file_id);
    log(`Mengunduh file untuk Japan X Arab  obfuscation: ${file.file_name}`);
    await updateProgress(chatId, progressMessage.message_id, 10, "Mengunduh");
    const response = await fetch(fileLink);
    let fileContent = await response.text();
    await updateProgress(chatId, progressMessage.message_id, 20, "Mengunduh Selesai");

    log(`Memvalidasi kode: ${file.file_name}`);
    await updateProgress(chatId, progressMessage.message_id, 30, "Memvalidasi Kode");
    try {
      new Function(fileContent);
    } catch (syntaxError) {
      throw new Error(`Kode tidak valid: ${syntaxError.message}`);
    }

    log(`Mengenkripsi file dengan gaya Japan X Arab  yang diperkuat`);
    await updateProgress(chatId, progressMessage.message_id, 40, "Inisialisasi Hardened Japan X Arab  Obfuscation");
    const obfuscated = await JsConfuser.obfuscate(fileContent, getJapanxArabObfuscationConfig());
    await updateProgress(chatId, progressMessage.message_id, 60, "Transformasi Kode");

    // Pastikan obfuscated.code ada
    const obfuscatedCode = typeof obfuscated === 'string' ? obfuscated : (obfuscated.code || String(obfuscated));
    await fs.writeFile(encryptedPath, obfuscatedCode);
    await updateProgress(chatId, progressMessage.message_id, 80, "Finalisasi Enkripsi");

    log(`Memvalidasi hasil obfuscation: ${file.file_name}`);
    try {
      new Function(obfuscatedCode);
    } catch (postObfuscationError) {
      throw new Error(`Hasil obfuscation tidak valid: ${postObfuscationError.message}`);
    }

    log(`Mengirim file terenkripsi gaya Japan X Arab : ${file.file_name}`);
    await bot.sendDocument(
      chatId,
      fs.createReadStream(encryptedPath),
      {
        filename: `japan-arab-encrypted-${file.file_name}`,
        caption: "✅ *File terenkripsi (Hardened Japan X Arab ) siap!*\nSUKSES ENCRYPT BY GrenTzy 🕊",
        parse_mode: "Markdown"
      }
    );
    await updateProgress(chatId, progressMessage.message_id, 100, "Hardened Japan X Arab  Obfuscation Selesai");

    if (await fs.pathExists(encryptedPath)) {
      await fs.unlink(encryptedPath);
      log(`File sementara dihapus: ${encryptedPath}`);
    }
  } catch (error) {
    log("Kesalahan saat Japan X Arab  obfuscation", error);
    await bot.sendMessage(
      chatId,
      `❌ *Kesalahan:* ${error.message || "Tidak diketahui"}\n_Coba lagi dengan kode Javascript yang valid!_`,
      { parse_mode: 'Markdown' }
    );
    if (await fs.pathExists(encryptedPath)) {
      await fs.unlink(encryptedPath);
      log(`File sementara dihapus setelah error: ${encryptedPath}`);
    }
  }
});

async function updateProgress(chatId, messageId, pct, status) {
  const filled = Math.floor(pct / 5);
  const bar = '█'.repeat(filled) + '░'.repeat(20 - filled);
  await bot.editMessageText(
    `\`\`\`css\n🔒 EncryptBot\n ⚙️ ${status} (${pct}%)\n [${bar}]\n\`\`\`\nPROSES ENCRYPT BY KUROZI`,
    {
      chat_id: chatId,
      message_id: messageId,
      parse_mode: 'Markdown'
    }
  ).catch(() => {});
}

function createProgressBar(pct) {
  const filled = Math.floor(pct / 5);
  return '█'.repeat(filled) + '░'.repeat(20 - filled);
}

// ==================== COMMAND /batal ====================
bot.onText(/^\/batal$/, async (msg) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id;
    if (obfState[senderId]) {
        delete obfState[senderId];
        await bot.sendMessage(chatId, '❌ Obfuscation dibatalkan.');
    } else {
        await bot.sendMessage(chatId, 'Tidak ada proses obfuscation aktif.');
    }
});
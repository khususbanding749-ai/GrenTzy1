bot.onText(/^\/deletefile(?:\s+(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;

  if (!isOwner(senderId)) {
    return bot.sendMessage(chatId, "❌ Hanya owner yang bisa menghapus file dari GitHub.");
  }

  const GITHUB_TOKEN = config.GITHUB_TOKEN || github?.token;
  if (!GITHUB_TOKEN) {
    return bot.sendMessage(chatId, "❌ Token GitHub tidak ditemukan. Periksa config.js");
  }
   
   
  const filePath = match[1]?.trim();
  if (!filePath) {
    return bot.sendMessage(chatId,
      "❌ Gunakan: /deletefile <path_file>\n" +
      "Contoh: /deletefile folder/file.js\n\n" +
      "📌 Untuk melihat daftar file, gunakan /listrepo"
    );
  }

  const repoOwner = "isi sendiri";
  const repoName = "isi sendiri";
  const branch = "main";
  const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${encodeURIComponent(filePath)}`;

  try {
    const statusMsg = await bot.sendMessage(chatId, `⏳ Mengecek file \`${filePath}\`...`, { parse_mode: 'Markdown' });

    let fileInfo;
    try {
      const checkRes = await axios.get(apiUrl, {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      fileInfo = checkRes.data;
    } catch (err) {
      if (err.response && err.response.status === 404) {
        return bot.editMessageText(`❌ File \`${filePath}\` tidak ditemukan di repository.`, {
          chat_id: chatId,
          message_id: statusMsg.message_id,
          parse_mode: 'Markdown'
        });
      }
      throw err;
    }

    if (Array.isArray(fileInfo)) {
      return bot.editMessageText(`❌ \`${filePath}\` adalah folder, bukan file. Gunakan path ke file spesifik.`, {
        chat_id: chatId,
        message_id: statusMsg.message_id,
        parse_mode: 'Markdown'
      });
    }

    const sha = fileInfo.sha;
    const fileName = fileInfo.name || filePath.split('/').pop();

    const confirmMsg = await bot.sendMessage(chatId,
      `⚠️ *Yakin ingin menghapus file ini?*\n\n` +
      `📄 File: \`${filePath}\`\n` +
      `📦 Ukuran: ${(fileInfo.size / 1024).toFixed(2)} KB\n` +
      `🔑 SHA: \`${sha.slice(0, 10)}...\`\n\n` +
      `Balas dengan \`ya\` untuk menghapus, atau \`tidak\` untuk membatalkan.`,
      { parse_mode: 'Markdown' }
    );

    const filter = (responseMsg) => {
      return responseMsg.chat.id === chatId &&
             responseMsg.reply_to_message &&
             responseMsg.reply_to_message.message_id === confirmMsg.message_id &&
             ['ya', 'tidak', 'yes', 'no'].includes(responseMsg.text?.toLowerCase());
    };

    try {
      const collected = await new Promise((resolve) => {
        bot.once('message', (responseMsg) => {
          if (filter(responseMsg)) {
            resolve(responseMsg);
          } else {
          
          }
        });
        setTimeout(() => resolve(null), 30000);
      });

      if (!collected) {
        return bot.sendMessage(chatId, "⏰ Waktu habis. Penghapusan dibatalkan.");
      }

      const answer = collected.text.toLowerCase();
      if (answer !== 'ya' && answer !== 'yes') {
        return bot.sendMessage(chatId, "❌ Penghapusan dibatalkan.");
      }

      await bot.editMessageText(`⏳ Menghapus \`${filePath}\`...`, {
        chat_id: chatId,
        message_id: statusMsg.message_id,
        parse_mode: 'Markdown'
      });

      await axios.delete(apiUrl, {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        },
        data: {
          message: `Delete file ${filePath} via bot`,
          sha: sha,
          branch: branch
        }
      });

      await bot.editMessageText(
        `✅ File \`${filePath}\` berhasil dihapus dari GitHub!\n` +
        `📄 Nama: ${fileName}\n` +
        `🔗 Repository: ${repoOwner}/${repoName}`,
        {
          chat_id: chatId,
          message_id: statusMsg.message_id,
          parse_mode: 'Markdown'
        }
      );

    } catch (timeoutError) {
    }

  } catch (error) {
    console.error('Delete file error:', error.message);
    let errorMsg = `❌ Gagal menghapus file: ${error.message}`;
    if (error.response?.status === 401) {
      errorMsg = "❌ Token GitHub tidak valid atau expired. Buat token baru dengan scope `repo`.";
    } else if (error.response?.status === 404) {
      errorMsg = `❌ File \`${filePath}\` tidak ditemukan.`;
    } else if (error.response?.data?.message) {
      errorMsg = `❌ GitHub error: ${error.response.data.message}`;
    }
    bot.sendMessage(chatId, errorMsg);
  }
});
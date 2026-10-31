export function generateUnfollowScript(
  usernames: string[],
  delaySeconds: number = 8
): string {
  const jsonUsernames = JSON.stringify(usernames);

  return `(function() {
  const targets = ${jsonUsernames};
  const baseDelay = ${delaySeconds} * 1000;
  
  if (!window.location.hostname.includes('instagram.com')) {
    alert('⚠️ Harap buka instagram.com dan pastikan Anda sudah login sebelum menjalankan script ini!');
    return;
  }

  // Remove existing widget if any
  const existing = document.getElementById('ig-unfollower-widget');
  if (existing) existing.remove();

  // Create UI Widget
  const widget = document.createElement('div');
  widget.id = 'ig-unfollower-widget';
  widget.style.cssText = 'position:fixed;bottom:24px;right:24px;width:380px;background:#18181b;color:#f4f4f5;border-radius:16px;box-shadow:0 20px 25px -5px rgba(0,0,0,0.6), 0 8px 10px -6px rgba(0,0,0,0.5);border:1px solid #27272a;z-index:9999999;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;padding:18px;font-size:14px;';
  
  widget.innerHTML = \`
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
      <div style="display:flex;align-items:center;gap:8px;">
        <span style="font-size:18px;">⚡</span>
        <strong style="font-size:15px;color:#fff;">IG Smart Unfollower</strong>
      </div>
      <button id="ig-btn-close" style="background:none;border:none;color:#a1a1aa;font-size:18px;cursor:pointer;padding:0 4px;">✕</button>
    </div>
    
    <div style="background:#09090b;padding:10px;border-radius:8px;border:1px solid #27272a;margin-bottom:12px;">
      <div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:12px;color:#a1a1aa;">
        <span>Progres: <strong id="ig-prog-text" style="color:#38bdf8;">0 / \${targets.length}</strong></span>
        <span id="ig-timer-text">Menunggu...</span>
      </div>
      <div style="width:100%;background:#27272a;height:6px;border-radius:999px;overflow:hidden;">
        <div id="ig-bar" style="width:0%;height:100%;background:linear-gradient(90deg,#ec4899,#8b5cf6);transition:width 0.3s;"></div>
      </div>
    </div>

    <div id="ig-status-box" style="font-size:12px;color:#94a3b8;margin-bottom:12px;line-height:1.4;min-height:48px;background:#09090b;padding:10px;border-radius:8px;border:1px solid #1f2937;">
      Menyiapkan proses unfollow untuk \${targets.length} akun...
    </div>

    <div style="display:flex;gap:8px;">
      <button id="ig-btn-pause" style="flex:1;background:#27272a;color:#f4f4f5;border:1px solid #3f3f46;border-radius:8px;padding:8px 12px;font-weight:600;font-size:13px;cursor:pointer;">Jeda</button>
      <button id="ig-btn-stop" style="flex:1;background:#dc2626;color:#ffffff;border:none;border-radius:8px;padding:8px 12px;font-weight:600;font-size:13px;cursor:pointer;">Hentikan</button>
    </div>
    <div id="ig-rate-warning" style="display:none;margin-top:10px;padding:8px;border-radius:6px;background:#450a0a;border:1px solid #991b1b;color:#fca5a5;font-size:11px;line-height:1.3;">
      🛑 <strong>Terkena Limit Instagram (HTTP 429)</strong>: Instagram membatasi aksi sementara. Script otomatis dijeda. Istirahat 30-60 menit sebelum melanjutkan agar akun tetap aman!
    </div>
    <div style="margin-top:10px;font-size:11px;color:#71717a;text-align:center;">
      🛡️ Jeda keamanan aktif untuk mencegah akun terblokir.
    </div>
  \`;

  document.body.appendChild(widget);

  const progText = document.getElementById('ig-prog-text');
  const timerText = document.getElementById('ig-timer-text');
  const bar = document.getElementById('ig-bar');
  const statusBox = document.getElementById('ig-status-box');
  const btnPause = document.getElementById('ig-btn-pause');
  const btnStop = document.getElementById('ig-btn-stop');
  const btnClose = document.getElementById('ig-btn-close');
  const rateWarning = document.getElementById('ig-rate-warning');

  let isPaused = false;
  let isStopped = false;
  let currentIndex = 0;
  let successCount = 0;

  btnClose.onclick = () => { isStopped = true; widget.remove(); };
  btnStop.onclick = () => { 
    isStopped = true; 
    statusBox.innerHTML = '<span style="color:#ef4444;">Proses dihentikan oleh pengguna.</span>';
    btnStop.disabled = true;
    btnPause.disabled = true;
  };
  btnPause.onclick = () => {
    isPaused = !isPaused;
    btnPause.innerText = isPaused ? 'Lanjutkan' : 'Jeda';
    if (!isPaused) {
      rateWarning.style.display = 'none';
      statusBox.innerHTML = 'Melanjutkan proses...';
    } else {
      statusBox.innerHTML = '<span style="color:#f59e0b;">Dijeda sementara. Klik Lanjutkan kapan saja.</span>';
    }
  };

  function getCookie(name) {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
    return "";
  }

  const csrfToken = getCookie('csrftoken');
  if (!csrfToken) {
    statusBox.innerHTML = '<span style="color:#ef4444;">Gagal mendeteksi sesi Instagram (csrftoken). Pastikan Anda sudah login di tab ini!</span>';
    return;
  }

  async function getUserId(username) {
    try {
      const res = await fetch(\`https://www.instagram.com/api/v1/users/web_profile_info/?username=\${username}\`, {
        headers: {
          'x-ig-app-id': '936619743392459',
          'x-asbd-id': '129477',
          'x-csrftoken': csrfToken,
          'x-requested-with': 'XMLHttpRequest'
        }
      });
      if (res.status === 429) {
        return { isRateLimited: true, id: null };
      }
      if (!res.ok) return { isRateLimited: false, id: null };
      const data = await res.json();
      return { isRateLimited: false, id: data?.data?.user?.id || null };
    } catch (e) {
      return { isRateLimited: false, id: null };
    }
  }

  async function unfollowUserId(userId) {
    try {
      const res = await fetch(\`https://www.instagram.com/api/v1/friendships/destroy/\${userId}/\`, {
        method: 'POST',
        headers: {
          'x-csrftoken': csrfToken,
          'x-ig-app-id': '936619743392459',
          'x-asbd-id': '129477',
          'x-requested-with': 'XMLHttpRequest',
          'content-type': 'application/x-www-form-urlencoded'
        }
      });
      if (res.status === 429) {
        return { success: false, isRateLimited: true };
      }
      return { success: res.ok, isRateLimited: false };
    } catch (e) {
      return { success: false, isRateLimited: false };
    }
  }

  function countdown(seconds) {
    return new Promise((resolve) => {
      let remaining = seconds;
      timerText.innerText = \`Tunggu \${remaining}s...\`;
      const interval = setInterval(() => {
        if (isStopped) {
          clearInterval(interval);
          resolve();
          return;
        }
        if (!isPaused) {
          remaining--;
          if (remaining <= 0) {
            clearInterval(interval);
            timerText.innerText = 'Memproses...';
            resolve();
          } else {
            timerText.innerText = \`Tunggu \${remaining}s...\`;
          }
        }
      }, 1000);
    });
  }

  async function run() {
    for (let i = 0; i < targets.length; i++) {
      if (isStopped) break;

      while (isPaused && !isStopped) {
        await new Promise((r) => setTimeout(r, 500));
      }

      const target = targets[i];
      currentIndex = i + 1;
      progText.innerText = \`\${currentIndex} / \${targets.length}\`;
      bar.style.width = \`\${(currentIndex / targets.length) * 100}%\`;
      statusBox.innerHTML = \`Mencari data akun: <strong style="color:#f43f5e;">@\${target}</strong>...\`;

      const result = await getUserId(target);

      if (result.isRateLimited) {
        // Automatically PAUSE when rate limited to save account
        isPaused = true;
        btnPause.innerText = 'Lanjutkan';
        rateWarning.style.display = 'block';
        statusBox.innerHTML = '<span style="color:#ef4444;">🛑 Terkena limit sementara (HTTP 429). Script otomatis dijeda untuk melindungi akun Anda. Istirahatlah 30-60 menit.</span>';
        timerText.innerText = 'Dijeda (Limit)';
        // Decrement i so that after resume we retry this target
        i--;
        continue;
      }

      const userId = result.id;
      if (!userId) {
        statusBox.innerHTML = \`⚠️ Gagal menemukan ID @\${target} (mungkin akun sudah dihapus/ganti nama). Melewati...\`;
      } else {
        statusBox.innerHTML = \`Mengirim permintaan unfollow untuk <strong style="color:#f43f5e;">@\${target}</strong>...\`;
        const unfollResult = await unfollowUserId(userId);

        if (unfollResult.isRateLimited) {
          isPaused = true;
          btnPause.innerText = 'Lanjutkan';
          rateWarning.style.display = 'block';
          statusBox.innerHTML = '<span style="color:#ef4444;">🛑 Terkena limit sementara unfollow (HTTP 429). Script otomatis dijeda untuk melindungi akun.</span>';
          timerText.innerText = 'Dijeda (Limit)';
          i--;
          continue;
        }

        if (unfollResult.success) {
          successCount++;
          statusBox.innerHTML = \`✅ Berhasil unfollow <strong style="color:#10b981;">@\${target}</strong>!\`;
        } else {
          statusBox.innerHTML = \`⚠️ Gagal unfollow @\${target}. Instagram mungkin membatasi aksi sementara.\`;
        }
      }

      if (i < targets.length - 1) {
        // Add random jitter 1-4 seconds to look natural
        const randomJitter = Math.floor(Math.random() * 4);
        const sleepTime = Math.round(baseDelay / 1000) + randomJitter;
        await countdown(sleepTime);
      }
    }

    if (!isStopped && !isPaused) {
      statusBox.innerHTML = \`🎉 <strong>Selesai!</strong> Berhasil unfollow \${successCount} dari \${targets.length} akun.\`;
      timerText.innerText = 'Selesai';
      btnPause.style.display = 'none';
      btnStop.innerText = 'Tutup';
      btnStop.style.background = '#10b981';
      btnStop.onclick = () => widget.remove();
    }
  }

  run();
})();`;
}

export function generateBookmarkletUrl(script: string): string {
  return 'javascript:' + encodeURIComponent(script.replace(/\n\s+/g, ' '));
}

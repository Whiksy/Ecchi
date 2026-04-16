const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const container = document.querySelector('.container');

const nameSection = document.getElementById('nameSection');
const buttonsSection = document.getElementById('buttonsSection');
const userNameInput = document.getElementById('userName');
const submitNameBtn = document.getElementById('submitNameBtn');
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');

let yesBtnSize = 1;
let clientName = "";

// Xử lý bật/tắt nhạc bằng Icon
let isMusicPlaying = false;
if (musicToggle) {
    musicToggle.addEventListener('click', () => {
        if (isMusicPlaying) {
            bgMusic.pause();
            musicToggle.innerText = '🔇';
        } else {
            bgMusic.play().catch(e => alert("Hãy tải file nhạc về và đặt tên là nhac.mp3 bỏ vào thư mục Views nhé!"));
            musicToggle.innerText = '🔊';
        }
        isMusicPlaying = !isMusicPlaying;
    });
}

// Xử lý nhập tên
submitNameBtn.addEventListener('click', () => {
    if (userNameInput.value.trim() === "") {
        return alert("Bé phải nhập tên trước cơ!");
    }
    clientName = userNameInput.value.trim();
    nameSection.style.display = "none";
    buttonsSection.style.display = "block";

    // Phát nhạc lãng mạn (Trình duyệt yêu cầu phải có tương tác click mới cho phát)
    bgMusic.play().then(() => {
        isMusicPlaying = true;
        if (musicToggle) musicToggle.innerText = '🔊';
    }).catch(e => console.log("Không thể tự động phát nhạc:", e));
});

// Hiệu ứng Troll: Nút "Hông" bỏ chạy khi hover chuột vào
noBtn.addEventListener('mouseover', () => {
    const x = Math.random() * (window.innerWidth - noBtn.offsetWidth - 50);
    const y = Math.random() * (window.innerHeight - noBtn.offsetHeight - 50);
    
    noBtn.style.position = 'fixed';
    noBtn.style.left = `${Math.max(10, x)}px`;
    noBtn.style.top = `${Math.max(10, y)}px`;
});

// Nếu bé nhanh tay bấm được chữ Hông thì nút Cóa vẫn to lên :>
noBtn.addEventListener('click', () => {
    yesBtnSize *= 1.25;
    yesBtn.style.transform = `scale(${yesBtnSize})`;
});

// Xử lý khi nhấn nút "Cóa!"
yesBtn.addEventListener('click', () => {
    container.innerHTML = `
        <h1>Gửi cho sốp iiiiiiii! 💖</h1>
        <div class="gif">
            <img id="statusGif" src="https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif" alt="Love gif">
        </div>
        <div class="upload-section">
            <label class="upload-area" for="mediaUpload">
                <div class="upload-icon">📁</div>
                <div class="upload-text">Nhấn để chọn ảnh/video</div>
                <input type="file" id="mediaUpload" accept="image/*,video/*">
                <div class="file-name" id="fileNameDisplay">Chưa có tệp nào nè...</div>
            </label>
            <button id="uploadBtn" class="btn-submit">Gửi cho Sốp 🚀</button>
            <p id="uploadStatus"></p>
        </div>
    `;
    
    const fileInput = document.getElementById('mediaUpload');
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    const statusGif = document.getElementById('statusGif');
    
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) fileNameDisplay.innerText = fileInput.files[0].name;
        else fileNameDisplay.innerText = "Chưa có tệp nào nè...";
    });

    document.getElementById('uploadBtn').addEventListener('click', async () => {
        const statusText = document.getElementById('uploadStatus');
        
        if (fileInput.files.length === 0) return alert("Bé chưa chọn ảnh hay video kìa!");

        const formData = new FormData();
        formData.append('media', fileInput.files[0]);
        formData.append('name', clientName);
        statusText.innerText = "Đang gửi đi nè... ⏳";
        
        try {
            const response = await fetch('/api/upload', { method: 'POST', body: formData });
            if (response.ok) {
                statusText.innerText = "Gửi thành công gòi nha! 💖🎉";
                statusGif.src = "https://media.giphy.com/media/11s7Ke7jcNxCHS/giphy.gif"; // Đổi gif ăn mừng
            } else {
                statusText.innerText = "Lỗi mất tiêu rồi 😢";
            }
        } catch (err) {
            statusText.innerText = "Không kết nối được với Server 😢";
        }
    });
});
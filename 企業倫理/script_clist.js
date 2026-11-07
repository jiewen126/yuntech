// ==========================================
// 1. 初始化與介面設定
// ==========================================
const urlParams = new URLSearchParams(window.location.search);
const CURRENT_SEMESTER = urlParams.get('semester') || "114-1";

const rowSemesterText = document.getElementById("row-semester-text");
if (rowSemesterText) rowSemesterText.innerText = CURRENT_SEMESTER;

const heroSemesterText = document.getElementById("hero-semester-text");
if (heroSemesterText) heroSemesterText.innerText = CURRENT_SEMESTER;

// ==========================================
// 2. Google Apps Script API 串接
// ==========================================
const API_URL = "https://script.google.com/macros/s/AKfycbzDalP5lEBupmQZwUNqDFBOMWkmQ0L01wcu29zTipipynIhaXewW7p4wMXzw8zGu641/exec?semester=" + CURRENT_SEMESTER; 

const container = document.getElementById("movie-list");
const searchInput = document.getElementById("search-input");
let movieDatabase = []; 

// ==========================================
// 3. 渲染影片卡片與 Uiverse 點讚按鈕
// ==========================================
function renderMovies(dataToRender) {
    let htmlContent = ""; 
    
    if (dataToRender.length === 0) {
        container.innerHTML = "<p style='color: black; padding: 20px; font-weight: bold;'>找不到符合的影片...</p>";
        return;
    }

    dataToRender.forEach(function(movie) {
        const ytImgUrl = `https://img.youtube.com/vi/${movie.id.trim()}/hqdefault.jpg`;
        const ytVideoUrl = `https://www.youtube.com/watch?v=${movie.id.trim()}`;
        
        let rankHtml = "";
        if (movie.rank === 1) rankHtml = `<img src="ranking01.png" class="rank-img">`;
        else if (movie.rank === 2) rankHtml = `<img src="ranking02.png" class="rank-img">`;
        else if (movie.rank === 3) rankHtml = `<img src="ranking03.png" class="rank-img">`;

        htmlContent += `
            <div class="movie-card">
                ${rankHtml}
                <a href="${ytVideoUrl}" target="_blank">
                    <div class="poster">
                        <img src="${ytImgUrl}" alt="${movie.title}" onerror="this.closest('.movie-card').style.display='none';">
                    </div>
                </a>
                
                <div class="movie-bottom">
                    <div class="movie-info">
                        <strong>${movie.title}</strong><br>
                        學生姓名: ${movie.student || "無"}<br>
                        指導老師: ${movie.teacher || "無"}
                    </div>
                    
                    <!-- Uiverse 點讚按鈕 -->
                    <button class="ui-like-button" onclick="likeMovie('${movie.id}', this)">
                        <div class="like-left">
                            <svg class="heart-icon" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                            <span>讚！</span>
                        </div>
                        <div class="like-right">
                            <span class="like-count">${movie.likes || 0}</span>
                        </div>
                    </button>
                </div>
            </div>
        `;
    });
    container.innerHTML = htmlContent;
}

// ==========================================
// 4. 設定首頁大看板 (Hero Section)
// ==========================================
function setRandomHero(movies) {
    if (movies.length === 0) return; 

    const randomIndex = Math.floor(Math.random() * movies.length);
    const randomMovie = movies[randomIndex];
    const cleanId = randomMovie.id.trim(); 

    const heroSection = document.getElementById("hero-section");
    if (heroSection) {
        heroSection.style.backgroundImage = `url('https://img.youtube.com/vi/${cleanId}/hqdefault.jpg')`;
    }

    if (document.getElementById("hero-title")) document.getElementById("hero-title").innerText = randomMovie.title;
    if (document.getElementById("hero-student")) document.getElementById("hero-student").innerText = randomMovie.student || "無";
    if (document.getElementById("hero-teacher")) document.getElementById("hero-teacher").innerText = randomMovie.teacher || "無";

    const playBtn = document.getElementById("hero-play-btn");
    if (playBtn) {
        playBtn.onclick = function() {
            window.open(`https://www.youtube.com/watch?v=${cleanId}`, "_blank");
        };
    }
} 

// ==========================================
// 5. 抓取資料庫與錯誤攔截
// ==========================================
container.innerHTML = "<p style='color: black; padding: 20px; font-weight: bold;'>影片資料載入中，請稍候...</p>";

fetch(API_URL)
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error("雲端資料庫發生錯誤:", data.error);
            if (container) container.innerHTML = `<p style='color: red; padding: 20px; font-weight: bold;'>後端錯誤: ${data.error}</p>`;
            return; 
        }

        console.log("成功抓到資料庫數據:", data); 
        movieDatabase = data; 
        renderMovies(movieDatabase); 
        setRandomHero(movieDatabase); 
    })
    .catch(error => {
        console.error("讀取資料庫失敗:", error);
        if (container) container.innerHTML = "<p style='color: red; padding: 20px; font-weight: bold;'>資料庫連線失敗，請檢查網址或網路。</p>";
    });

// ==========================================
// 6. 搜尋功能
// ==========================================
if (searchInput) {
    searchInput.addEventListener("input", function() {
        const keyword = searchInput.value.toLowerCase(); 
        
        const filteredMovies = movieDatabase.filter(function(movie) {
            const matchTitle = movie.title.toLowerCase().includes(keyword);
            const matchTeacher = movie.teacher && movie.teacher.toLowerCase().includes(keyword);
            const matchStudent = movie.student && movie.student.toLowerCase().includes(keyword);
            return matchTitle || matchTeacher || matchStudent;
        });
        
        renderMovies(filteredMovies);
    });
}

// ==========================================
// 7. 瀏覽其他作品按鈕動畫
// ==========================================
const browseBtn = document.querySelector(".boton-elegante");
if (browseBtn) {
    browseBtn.addEventListener("click", function() {
        window.scrollBy({ top: 600, left: 0, behavior: "smooth" });
    });
}

// ==========================================
// 8. 點讚互動邏輯 (前端動畫 + 背景 API 傳輸)
// ==========================================
function likeMovie(movieId, btnElement) {
    const countElement = btnElement.querySelector('.like-count');
    let currentCount = parseInt(countElement.innerText);
    
    // 如果已經按過讚，就不允許重複發送請求
    if (btnElement.classList.contains('liked')) return;

    // 1. 先樂觀更新 UI（讓使用者感覺反應很快）
    btnElement.classList.add('liked');
    countElement.innerText = currentCount + 1;

    // 2. 在背景發送 API 請求給 Google Apps Script 記錄讚數
    const baseUrl = API_URL.split('?')[0]; 
    const LIKE_API = `${baseUrl}?action=like&semester=${CURRENT_SEMESTER}&id=${movieId}`;

    fetch(LIKE_API)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error("按讚失敗:", data.error);
                // 發生錯誤則還原 UI
                btnElement.classList.remove('liked');
                countElement.innerText = currentCount;
            } else {
                console.log("按讚成功！", data);
            }
        })
        .catch(err => {
            console.error("網路錯誤:", err);
            // 發生錯誤則還原 UI
            btnElement.classList.remove('liked');
            countElement.innerText = currentCount;
        });
}
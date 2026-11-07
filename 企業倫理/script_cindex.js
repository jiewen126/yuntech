// 1. 定義你要顯示在首頁的學期清單（可隨時新增）
const semestersToFetch = ["114-2", "114-1"]; 
// ⚠️ 請換成你剛剛成功部署的真實 API 金鑰網址（不要加上 ?semester=）
const API_BASE = "https://script.google.com/macros/s/AKfycbzDalP5lEBupmQZwUNqDFBOMWkmQ0L01wcu29zTipipynIhaXewW7p4wMXzw8zGu641/exec?semester=";

const homeContainer = document.getElementById("homepage-top-movies");

// 2. 建立自動抓取與渲染的非同步函數
async function loadAllTopMovies() {
    if (!homeContainer) return;
    homeContainer.innerHTML = "<h2 style='color: black; text-align: center; padding: 50px;'>載入中...</h2>";
    
    let finalHtml = "";

    // 使用 for...of 依序抓取清單中的每一個學期
    for (const sem of semestersToFetch) {
        try {
            const response = await fetch(API_BASE + sem);
            const data = await response.json();
            
            // 如果後端報錯，跳過這個學期
            if (data.error) {
                console.error(`${sem} 讀取錯誤:`, data.error);
                continue; 
            }

            // 👉 核心邏輯：過濾出 rank 為 1~3 的影片，並依照名次 (1 -> 2 -> 3) 排序
            const top3Movies = data
                .filter(movie => movie.rank === 1 || movie.rank === 2 || movie.rank === 3)
                .sort((a, b) => a.rank - b.rank);

            // 如果這個學期有前三名資料，才產生 HTML
            if (top3Movies.length > 0) {
                finalHtml += `
                    <div class="row">
                        <h2>${sem} TOP3 微電影</h2>
                        <div class="netflix-row">
                `;
                
                // 產生卡片
                top3Movies.forEach(movie => {
                    const cleanId = movie.id.trim();
                    const ytImgUrl = `https://img.youtube.com/vi/${cleanId}/hqdefault.jpg`;
                    const ytVideoUrl = `https://www.youtube.com/watch?v=${cleanId}`;
                    
                    // 判斷名次圖片 (沿用你原本的設計)
                    let rankHtml = "";
                    if (movie.rank === 1) rankHtml = `<img src="ranking01.png" class="rank-img">`;
                    else if (movie.rank === 2) rankHtml = `<img src="ranking02.png" class="rank-img">`;
                    else if (movie.rank === 3) rankHtml = `<img src="ranking03.png" class="rank-img">`;

                    finalHtml += `
                        <div class="movie-card">
                            ${rankHtml}
                            <a href="${ytVideoUrl}" target="_blank">
                                <div class="poster">
                                    <img src="${ytImgUrl}" alt="${movie.title}" onerror="this.closest('.movie-card').style.display='none';">
                                </div>
                            </a>
                            <div class="movie-info">
                                <strong>${movie.title}</strong><br>
                                學生姓名: ${movie.student || "無"}<br>
                                指導老師: ${movie.teacher || "無"}
                            </div>
                        </div>
                    `;
                });
                
                finalHtml += `</div></div>`; // 關閉這個學期的 row 與 netflix-row
            }
        } catch (err) {
            console.error(`${sem} 連線失敗:`, err);
        }
    }
    
    // 把組合好的 HTML 一次性塞進首頁容器中
    homeContainer.innerHTML = finalHtml;
}

// 3. 啟動函數
loadAllTopMovies();

const browseBtn = document.querySelector(".boton-elegante");
if (browseBtn) {
    browseBtn.addEventListener("click", function() {
        window.scrollBy({ top: 600, left: 0, behavior: "smooth" });
    });
}
// 控制 Netflix 網頁開場動畫的腳本
document.addEventListener("DOMContentLoaded", function() {
    
    // 設定 3000 毫秒 (3 秒) 後隱藏開場畫面，時間必須與 CSS 的 holdAndZoom 動畫一致
    setTimeout(function() {
        const introScreen = document.getElementById("intro-screen");
        if (introScreen) {
            introScreen.style.display = "none";
        }
        
        // 恢復原本網頁的上下捲動功能
        document.body.style.overflow = "auto";
    }, 3000); 

});
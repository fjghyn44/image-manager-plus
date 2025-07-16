// ======= Firebase Config =======
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAnD_kB11ABikFB63bgRKESn96OnGZukgQ",
  authDomain: "pangchi-601af.firebaseapp.com",
  projectId: "pangchi-601af",
  storageBucket: "pangchi-601af.firebasestorage.app",
  messagingSenderId: "182335204496",
  appId: "1:182335204496:web:318c48e227691a14e2bc15",
  measurementId: "G-DPHW8WBSD1"
};

const storage = firebase.storage();
const database = firebase.database();
const DEL_PWD = "pangchi8";  // 刪除密碼

// 上傳 + 預覽
function uploadImage() {
  const file = document.getElementById("uploadInput").files[0];
  const page = document.getElementById("pageSelector").value;
  if (!file) return alert("請先選擇圖片");

  const fileName = file.name;
  const path = `${page}/${Date.now()}-${fileName}`;
  storage.ref(path).put(file)
    .then(() => storage.ref(path).getDownloadURL())
    .then(url => {
      const entry = { name: fileName, url };
      database.ref(page).push(entry);
      showImage(page, entry);
    });
}

// 顯示單張圖片
function showImage(page, { name, url }) {
  const ul = document.getElementById(`page-${page}`);
  const li = document.createElement("li");
  li.innerHTML = `
    <div class="image-entry">
      <img class="preview" src="${url}" alt="${name}" />
      <div>
        <div>${name}</div>
        <a href="${url}" download>下載</a>
      </div>
    </div>`;
  ul.appendChild(li);
}

// 清除流程
function confirmClear() {
  document.getElementById("overlay").style.display = "block";
  document.getElementById("confirmDialog").style.display = "block";
}
function cancelClear() {
  document.getElementById("overlay").style.display = "none";
  document.getElementById("confirmDialog").style.display = "none";
}
function clearImages() {
  const pwd = document.getElementById("pwdInput").value;
  if (pwd !== DEL_PWD) {
    return alert("密碼錯誤");
  }
  const page = document.getElementById("clearTarget").value;
  database.ref(page).remove().then(() => {
    document.getElementById(`page-${page}`).innerHTML = "";
    cancelClear();
    alert(`${page} 頁面已清除`);
  });
}

// 初次載入
["A","B","C"].forEach(page => {
  database.ref(page).on("child_added", snap => {
    showImage(page, snap.val());
  });
});

const board = document.getElementById("board");

/* ADD MODAL */
const modal = document.getElementById("modal").style.display = "block";

const openModal = document.getElementById("openModal");
const cancelBtn = document.getElementById("cancelBtn");
const submitBtn = document.getElementById("submitBtn");

/* DELETE MODAL */
const deleteModal = document.getElementById("deleteModal");

const deletePasswordInput = document.getElementById("deletePassword");
const deleteCancelBtn = document.getElementById("deleteCancelBtn");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

const messageInput = document.getElementById("messageInput");
const nameInput = document.getElementById("nameInput");
const anonCheck = document.getElementById("anonCheck");

const DELETE_PASSWORD = "5275";

let messages = JSON.parse(localStorage.getItem("messages")) || [];
let deleteIndex = null;

/* RENDER */
function displayMessages() {
  board.innerHTML = "";

  messages.slice().reverse().forEach((msg, index) => {
    const realIndex = messages.length - 1 - index;

    const card = document.createElement("div");
    card.className = "message";

    card.innerHTML = `
      <div class="author">${msg.author}</div>
      <p>${msg.text}</p>
      <div class="timestamp">${msg.time}</div>
      <div class="delete-zone">
        <button class="delete-btn">🗑</button>
      </div>
    `;

    // apply saved position if exists
    if (msg.left && msg.top) {
      card.style.position = "absolute";
      card.style.left = msg.left;
      card.style.top = msg.top;
    }

    // delete button logic
    card.querySelector(".delete-btn").onclick = () => {
      deleteIndex = realIndex;
      deletePasswordInput.value = "";
      deleteModal.style.display = "flex";
    };

    // drag logic
    card.onmousedown = function(event) {
    let shiftX = event.pageX - card.offsetLeft;
    let shiftY = event.pageY - card.offsetTop;

    card.style.position = "absolute";
    card.style.zIndex = 1000;

    function moveAt(pageX, pageY) {
        card.style.left = pageX - shiftX + "px";
        card.style.top = pageY - shiftY + "px";
    }

    moveAt(event.pageX, event.pageY);

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    document.addEventListener("mousemove", onMouseMove);

    document.onmouseup = function() {
        document.removeEventListener("mousemove", onMouseMove);
        document.onmouseup = null;

        // save position
        messages[realIndex].left = card.style.left;
        messages[realIndex].top = card.style.top;
        localStorage.setItem("messages", JSON.stringify(messages));
      };
    };


    card.ondragstart = () => false;

    board.appendChild(card);
  });
}

/* ADD MESSAGE */
openModal.onclick = () => modal.style.display = "flex";
cancelBtn.onclick = () => modal.style.display = "none";

submitBtn.onclick = () => {
    if (!messageInput.value.trim()) return;

    const author =
        anonCheck.checked || !nameInput.value.trim()
            ? "Anonymous"
            : nameInput.value.trim();

    const boardRect = board.getBoundingClientRect();

    messages.push({
        author,
        text: messageInput.value,
        time: new Date().toLocaleString(),
        left: boardRect.width / 2 - 120 + "px", // 120 ~ half card width 
        top: boardRect.height / 2 - 60 + "px" // 60 ~ half card height
    });

    localStorage.setItem("messages", JSON.stringify(messages));

    messageInput.value = "";
    nameInput.value = "";
    anonCheck.checked = false;
    modal.style.display = "none";

    displayMessages();
};

/* DELETE MESSAGE */
deleteCancelBtn.onclick = () => {
    deleteModal.style.display = "none";
    deleteIndex = null;
};

confirmDeleteBtn.onclick = () => {
    if (deletePasswordInput.value !== DELETE_PASSWORD) {
        alert("Incorrect password");
        return;
    }

    messages.splice(deleteIndex, 1);
    localStorage.setItem("messages", JSON.stringify(messages));

    deleteModal.style.display = "none";
    deleteIndex = null;

    displayMessages();
};

/* INIT */
displayMessages();

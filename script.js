const form = document.getElementById("messageForm");
const messageInput = document.getElementById("messageInput");
const nameInput = document.getElementById("nameInput");
const anonCheck = document.getElementById("anonCheck");
const board = document.getElementById("board");

let messages = JSON.parse(localStorage.getItem("messages")) || [];

function displayMessages() {
    board.innerHTML = "";

    messages.slice().reverse().forEach(msg => {
        const card = document.createElement("div");
        card.className = "message";

        card.innerHTML = `
            <div>
                <div class="author">${msg.author}</div>
                <p>${msg.text}</p>
            </div>
            <div class="timestamp">${msg.time}</div>
        `;

        board.appendChild(card);
    });
}

form.addEventListener("submit", e => {
    e.preventDefault();

    const author = anonCheck.checked || nameInput.value.trim() === ""
        ? "Anonymous"
        : nameInput.value.trim();

    const message = {
        author,
        text: messageInput.value,
        time: new Date().toLocaleString()
    };

    messages.push(message);
    localStorage.setItem("messages", JSON.stringify(messages));

    messageInput.value = "";
    nameInput.value = "";
    anonCheck.checked = false;

    displayMessages();
});

displayMessages();

const form = document.getElementById("messageForm");
const input = document.getElementById("messageInput");
const messagesDiv = document.getElementById("messages");

let messages = JSON.parse(localStorage.getItem("messages")) || [];

function displayMessages() {
    messagesDiv.innerHTML = "";
    messages.slice().reverse().forEach(msg => {
        const div = document.createElement("div");
        div.className = "message";
        div.innerHTML = `
            <p>${msg.text}</p>
            <div class="timestamp">${msg.time}</div>
        `;
        messagesDiv.appendChild(div);
    });
}

form.addEventListener("submit", e => {
    e.preventDefault();

    const message = {
        text: input.value,
        time: new Date().toLocaleString()
    };

    messages.push(message);
    localStorage.setItem("messages", JSON.stringify(messages));
    input.value = "";
    displayMessages();
});

displayMessages();

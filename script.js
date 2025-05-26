document.getElementById("betaForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const input = document.getElementById("instagram");
  const message = document.getElementById("message");
  const button = document.querySelector("button");
  const username = input.value.trim();
  const webhookUrl = "https://discord.com/api/webhooks/1376615121258020924/mN87WBjQl7LLhbFn0i9KB4dVg5a6v68oFM_iXnF7inlo3tr_6m9goiGui2rSHwArWxlH"; // ← Itt cseréld le

  const validRegex = /^[a-zA-Z0-9._]+$/;

  message.textContent = "";
  message.className = "message";

  // Ellenőrzés
  if (!username) {
    message.textContent = "⚠️ Add meg az Instagram neved!";
    message.classList.add("error");
    return;
  }

  if (!validRegex.test(username)) {
    message.textContent = "❌ Csak angol betűk, számok, pont és alsóvonal használható!";
    message.classList.add("error");
    return;
  }

  // Rate limit check (helyiStorage-ban tárolva)
  const lastSent = localStorage.getItem("lastSubmission");
  const now = Date.now();

  if (lastSent && now - parseInt(lastSent) < 60000) {
    const secondsLeft = Math.ceil((60000 - (now - parseInt(lastSent))) / 1000);
    message.textContent = `⏳ Várj ${secondsLeft} másodpercet mielőtt újra jelentkezel.`;
    message.classList.add("error");
    return;
  }

  const payload = {
    embeds: [
      {
        title: "📩 Új béta jelentkezés",
        description: `**Instagram név:** \`${username}\``,
        color: 5814783,
        footer: { text: "Béta Jelentkezés" },
        timestamp: new Date().toISOString()
      }
    ]
  };

  fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
    .then(res => {
      if (res.ok) {
        localStorage.setItem("lastSubmission", now.toString());
        message.textContent = "✅ Sikeres jelentkezés!";
        message.classList.add("success");
        input.value = "";

        // Gomb letiltása 60 másodpercre
        button.disabled = true;
        button.textContent = "Várj 60 mp...";

        let countdown = 60;
        const interval = setInterval(() => {
          countdown--;
          button.textContent = `Várj ${countdown} mp...`;
          if (countdown <= 0) {
            clearInterval(interval);
            button.disabled = false;
            button.textContent = "Jelentkezem";
          }
        }, 1000);

      } else {
        throw new Error("Hiba a küldés során.");
      }
    })
    .catch(err => {
      console.error(err);
      message.textContent = "❌ Nem sikerült elküldeni. Próbáld újra!";
      message.classList.add("error");
    });
});

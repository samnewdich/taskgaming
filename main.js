document.getElementById("taskDoneBtn").onclick = () => {
    // Ideally verify on server, here we just allow
    window.location.href = "game/game.html";
  };
  
  document.getElementById("payToPlayBtn").onclick = async () => {
    const success = await payToPlay(); // from evm.js
    if (success) window.location.href = "game/game.html";
  };
  
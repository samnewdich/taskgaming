async function payToPlay() {
    if (!window.ethereum) {
      alert("Please install MetaMask");
      return false;
    }
  
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    const sender = accounts[0];
  
    const tx = {
      from: sender,
      to: '0xYourWalletAddress', // Replace with your EVM address
      value: '0x2386F26FC10000' // 0.01 ETH in wei
    };
  
    try {
      await ethereum.request({ method: 'eth_sendTransaction', params: [tx] });
      return true;
    } catch (err) {
      alert("Payment failed: " + err.message);
      return false;
    }
  }
  
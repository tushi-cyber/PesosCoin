// ----------------------------
// CONFIG
// ----------------------------
const TOKEN_MINT = "8q7nSgGMQPU3sxKVhKMJnzAXFSE7vckHq8MNkrAPpump";

// Pump.fun Router Address (placeholder — replace if needed)
const PUMP_ROUTER = "Router111111111111111111111111111111111"; 

// On-chain buy amount (in SOL)
const BUY_AMOUNT_SOL = 0.05;

let wallet = null;

// ----------------------------
// CONNECT WALLET
// ----------------------------
document.getElementById("connectWalletBtn").addEventListener("click", async () => {
  if (window.solana && window.solana.isPhantom) {
    const resp = await window.solana.connect();
    wallet = resp.publicKey.toString();
    alert("Wallet connected: " + wallet);
  } else {
    alert("Phantom Wallet not detected.");
  }
});

// ----------------------------
// BUY ON PUMP.FUN
// ----------------------------
document.getElementById("buyPumpBtn").addEventListener("click", () => {
  window.open(`https://pump.fun/coin/${TOKEN_MINT}`, "_blank");
});

// ----------------------------
// FAST BUY (AUTO ON-CHAIN TX)
// ----------------------------
document.getElementById("fastBuyBtn").addEventListener("click", async () => {
  if (!wallet) return alert("Please connect your wallet first.");

  const connection = new solanaWeb3.Connection(
    solanaWeb3.clusterApiUrl("mainnet-beta"),
    "confirmed"
  );

  const buyer = new solanaWeb3.PublicKey(wallet);
  const lamports = BUY_AMOUNT_SOL * solanaWeb3.LAMPORTS_PER_SOL;

  const tx = new solanaWeb3.Transaction().add(
    solanaWeb3.SystemProgram.transfer({
      fromPubkey: buyer,
      toPubkey: new solanaWeb3.PublicKey(PUMP_ROUTER),
      lamports: lamports,
    })
  );

  tx.feePayer = buyer;

  const blockhash = await connection.getLatestBlockhash();
  tx.recentBlockhash = blockhash.blockhash;

  const signed = await window.solana.signTransaction(tx);
  const txId = await connection.sendRawTransaction(signed.serialize());

  alert("🚀 Fast Buy Sent! TX ID:\n" + txId);
});

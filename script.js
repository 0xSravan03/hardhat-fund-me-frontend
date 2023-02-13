import { ethers } from "./ethers.js";
import { abi, address } from "./constants.js";

const connectBtn = document.getElementById("connect");
const fundBtn = document.getElementById("fundBtn");
const balanceBtn = document.getElementById("balanceBtn");
const withdraw = document.getElementById("withdraw");
let connectionStatus;

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    console.log("Wallet Found!");
    try {
      connectionStatus = await ethereum.request({
        method: "eth_requestAccounts",
      });
      connectBtn.innerHTML = "Connected";
    } catch (e) {
      console.log(e.message);
    }
  } else {
    console.log("Please install MetaMask wallet");
    alert("Please install MetaMask wallet");
  }
}

async function fund(ethAmount) {
  console.log(`Funding with ${ethAmount} ETH...`);
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(address, abi, signer);

  // creating transactions
  const txResponse = await contract.fund({
    value: ethers.utils.parseEther(ethAmount),
  });

  const txReceipt = await txResponse.wait(1);

  const balance = await provider.getBalance(address);
  console.log(ethers.utils.formatEther(balance.toString()));
}

connectBtn.addEventListener("click", connect);

fundBtn.addEventListener("click", async () => {
  if (connectionStatus) {
    const ethAmount = document.getElementById("input").value;
    if (ethAmount) {
      await fund(ethAmount);
    } else {
      alert("Spend some ETH please!!!");
    }
  } else {
    alert("Connect your wallet first");
  }
});

balanceBtn.addEventListener("click", async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const balanceAmt = document.getElementById("balanceAmt");
  const balance = await provider.getBalance(address);
  balanceAmt.innerText = `${ethers.utils.formatEther(balance.toString())} ETH`;
});

withdraw.addEventListener("click", async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(address, abi, signer);

  try {
    const txResponse = await contract.withdraw();
    console.log("Withdrawing");
    await txResponse.wait(1);
  } catch (e) {
    console.log(e);
  }
});

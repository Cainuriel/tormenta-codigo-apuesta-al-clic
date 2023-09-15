// In browsers, use a <script> tag. In Node.js, uncomment the following line:
import xrpl from 'xrpl';

// Wrap code in an async function so we can use await
export default async function main() {

    // Define the network client
    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")
    await client.connect()

    // Create a wallet and fund it with the Testnet faucet:
    const fund_result = await client.fundWallet()
    // const test_wallet = fund_result.wallet
    //console.log("fund_result ",fund_result);
    // console.log("test wallet ",test_wallet);
    
    // a have a wallet
    //const test_wallet = xrpl.Wallet.fromSeed("sEdT4b6wKpWQRxpZR7X43cLEtB7Jm2i");
    // another wallet
    // const test_wallet = xrpl.Wallet.fromSecret("sngPYH22VNm9ppD5QmJSnP6zizENF");

    // Get info from the ledger about the address we just funded
    // const response = await client.request({
    //     "command": "account_info",
    //     "account": test_wallet.address,
    //     "ledger_index": "validated"
    // })

    // console.log(response);

    // to know balance
    //console.log(response.result.account_data.Balance);


    // Disconnect when done (If you omit this, Node.js won't end the process)
    client.disconnect();
    return fund_result
  }
  

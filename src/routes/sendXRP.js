// In browsers, use a <script> tag. In Node.js, uncomment the following line:
import xrpl from 'xrpl';

// Wrap code in an async function so we can use await
//@ts-ignore
export default async function send(seed, amount, beneficiary) {

    // Define the network client
    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233/")
    await client.connect();


    // sender account
    const wallet = xrpl.Wallet.fromSecret(seed);

    // Prepare transaction -------------------------------------------------------
    const prepared = await client.autofill({
        "TransactionType": "Payment",
        "Account": wallet.address,
        "Amount": xrpl.xrpToDrops(amount),
        "Destination": beneficiary
    });
    //@ts-ignore
    const max_ledger = prepared.LastLedgerSequence
    console.log("Prepared transaction instructions:", prepared);
    //@ts-ignore
    console.log("Transaction cost:", xrpl.dropsToXrp(prepared.Fee), "XRP")
    console.log("Transaction expires after ledger:", max_ledger);

    // Sign prepared instructions ------------------------------------------------
    const signed = wallet.sign(prepared)
    console.log("Identifying hash:", signed.hash)
    console.log("Signed blob:", signed.tx_blob)

    // Submit signed blob --------------------------------------------------------
    const tx = await client.submitAndWait(signed.tx_blob);
    console.log(`Submit signed blob transaction`, tx);

    // Check transaction results -------------------------------------------------
    //@ts-ignore
    console.log("Transaction result:", tx.result.meta.TransactionResult);
    client.disconnect()
    //@ts-ignore
    return tx.result.meta.TransactionResult;
    // console.log("Balance changes:", JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2));



   // Mis propias comprobacoines de saldo -------------------------------------------------
    // const walletOrigin = xrpl.Wallet.fromSecret(seed);


    // Get info from the ledger about the sender address 
    // const responseOrigin = await client.request({
    //     "command": "account_info",
    //     "account": walletOrigin.address,
    //     "ledger_index": "validated"
    // })

    // console.log("Balance de la cuenta destino: ",responseOrigin.result.account_data.Balance);

    // const responseOrigin = await client.request({
    //     "command": "account_info",
    //     "account": wallet.address,
    //     "ledger_index": "validated"
    // })

    // console.log("Saldo de la cuenta original",responseOrigin.result.account_data.Balance);



    // Disconnect when done (If you omit this, Node.js won't end the process)
    client.disconnect()
  }
  

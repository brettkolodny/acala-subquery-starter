import { SubstrateEvent } from "@subql/types";
import { Codec } from "@polkadot/types/types";
import { AccountBalance, Account, CurrencyTransfer } from "../types";
import { Balance } from "@polkadot/types/interfaces";

async function getAccountBalance(address: string, currency: string): Promise<AccountBalance> {

  let accountBalance = await AccountBalance.get(address + currency);
  // creates an account balance if it doesn't already exist
  if (!accountBalance) {
    accountBalance = new AccountBalance(address + currency);
    // init balance of 0 and assign currency
    accountBalance.accountId = address;
    accountBalance.balance = '0';
    accountBalance.currency = currency;

    await accountBalance.save();
  }

  return accountBalance;
}

async function getAccount(address: string): Promise<Account> {
  // Creates an account if it doesn't exist
  let account = await Account.get(address);
  if (!account) {
    account = new Account(address);
    await account.save();
  }
  return account;
}

async function update_balance(accountBalance: AccountBalance, to_from: string, amount: string, transferId: string): Promise<void> {
  // Generate transfer record
  const transferRecord = new CurrencyTransfer(`${transferId}-${to_from}`);
  transferRecord.accountBalanceId = accountBalance.id

  if (to_from == 'from') {
    accountBalance.balance = (parseFloat(accountBalance.balance) - parseFloat(amount)).toString();
    transferRecord.amount = (-1 * parseFloat(amount)).toString()
  } else {
    accountBalance.balance = (parseFloat(accountBalance.balance) + parseFloat(amount)).toString();
    transferRecord.amount = (parseFloat(amount)).toString()
  }
  
  await transferRecord.save()
  await accountBalance.save()

  return
}

function getToken(currencyId: Codec): string[] {
  const currencyJson = JSON.parse(currencyId.toString());

  if (currencyJson.token) return [currencyJson.token, currencyJson.token];
  if (currencyJson.dexShare) {
    const [tokenA, tokenB] = currencyJson.dexShare;
    return [tokenA, tokenB];
  }

  return [];
}

export async function handleAccountEvent(event: SubstrateEvent): Promise<void> {
  // Check if event is correct 
  if (event.event.section != "currencies" || event.event.method != "Transferred") {
    return;
  }

  // convert events
  const { 
    event: {
      data: [currency, from, to, amount],
    },
  } = event;

  const transferId = `${event.block.block.header.number.toNumber()}-${event.idx}`

  let [currencyFrom, currencyTo] = getToken(currency);

  let fromAccount = await getAccount(from.toString());
  let toAccount = await getAccount(to.toString());

  let fromAccountBalance = await getAccountBalance(from.toString(), currencyFrom);
  let toAccountBalance = await getAccountBalance(to.toString(), currencyTo);

  await update_balance(fromAccountBalance, 'from', amount.toString(), transferId);
  await update_balance(toAccountBalance, 'to', amount.toString(), transferId);

  await fromAccount.save();
  await toAccount.save();
}
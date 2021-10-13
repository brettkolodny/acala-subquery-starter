import { SubstrateEvent } from "@subql/types";
import { AccountBalance, Account } from "../types";
import { Codec } from "@polkadot/types/types";
import { Balance } from "@polkadot/types/interfaces";

async function getAccountBalance(address: string, currency: string): Promise<AccountBalance> {

  let accountBalance = await AccountBalance.get(address + currency);
  // creates an account balance if it doesn't already exist
  if (!accountBalance) {
    accountBalance = new AccountBalance(address + currency);
    // init balance of 0 and assign currency
    accountBalance.accountId = address;
    accountBalance.balance = BigInt(0);
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

async function update_balance(accountBalance: AccountBalance, to_from: string, amount: string): Promise<void> {
  if (to_from == 'from') {
    accountBalance.balance -= BigInt(amount);
  } else {
    accountBalance.balance += BigInt(amount);
  }
  
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

  let [currencyFrom, currencyTo] = getToken(currency);

  let fromAccount = await getAccount(from.toString());
  let toAccount = await getAccount(to.toString());

  let fromAccountBalance = await getAccountBalance(from.toString(), currencyFrom);
  let toAccountBalance = await getAccountBalance(to.toString(), currencyTo);

  await update_balance(fromAccountBalance, 'from', amount.toString());
  await update_balance(toAccountBalance, 'to', amount.toString());

  await fromAccount.save();
  await toAccount.save();
}
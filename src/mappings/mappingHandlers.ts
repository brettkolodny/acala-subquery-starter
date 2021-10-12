import { SubstrateEvent } from "@subql/types";
import { AccountBalance, Account } from "../types";
import { Balance } from "@polkadot/types/interfaces";

async function getAccountBalance(address: string, currency: string): Promise<AccountBalance> {

  let accountBalance = await AccountBalance.get(address + currency);
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

function update_balance(accountBalance: AccountBalance, to_from: string, amount: string): void {
  if (to_from == 'from') {
    accountBalance.balance -= BigInt(amount);
  } else {
    accountBalance.balance += BigInt(amount);
  }
  return
}

export async function handleAccountEvent(event: SubstrateEvent): Promise<void> {
  // Check if event is correct 
  if (event.event.section != "currencies" || event.event.method != "Transferred") {
    return;
  }

  const { 
    event: {
      data: [currency, from, to, amount],
    },
  } = event;

  // const currencyJson = JSON.parse(currency.toString());


  // function getToken(currencyId: Codec): string {
  //   const currencyJson = JSON.parse(currencyId.toString());
  
  //   if (currencyJson.token) return currencyJson.token;
  //   if (currencyJson.dexShare) {
  //     const [tokenA, tokenB] = currencyJson.dexShare;
  //     return `${tokenA.token}<>${tokenB.token} LP`;
  //   }
  
  //   return "??";
  // }


  let from_acc = await getAccount(from.toString());
  let to_acc = await getAccount(to.toString());

  let from_account = await getAccountBalance(from.toString(), currency.toString());
  let to_account = await getAccountBalance(to.toString(), currency.toString());

  update_balance(from_account, 'from', amount.toString());
  update_balance(to_account, 'to', amount.toString());

  await from_account.save();
  await to_account.save();
  await from_acc.save();
  await to_acc.save();

  // getAccountBalance(from.toString(), currency.toString())
  //   .then(account => update_balance(account, 'from', amount.toString()),
  //     e => console.log(e));

  // getAccountBalance(to.toString(), currency.toString())
  //   .then(account => update_balance(account, 'to', amount.toString()),
  //     e => console.log(e));
}
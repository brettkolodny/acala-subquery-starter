import { SubstrateEvent } from "@subql/types";
import { TokenTransfer } from "../types";
import { Balance } from "@polkadot/types/interfaces";

export async function handleCurrencyTransferEvent(event: SubstrateEvent): Promise<void> {
  const {
    event: {
      data: [token, from, to, amount],
    },
  } = event;
  //Retrieve the record by its ID
  const record = new TokenTransfer(
    `${event.block.block.header.number.toNumber()}-${event.idx}`
  );
  record.token = token.toString();
  record.from = from.toString();
  record.to = to.toString();
  record.amount = BigInt(amount.toString());
  await record.save();
}

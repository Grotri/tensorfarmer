import { SolanaFMParser, checkIfAccountParser, ParserType } from "@solanafm/explorer-kit";
import { getProgramIdl } from "@solanafm/explorer-kit-idls";

chrome.runtime.onMessageExternal.addListener(handleMessage);

function handleMessage(request, sender, sendResponse) {
  console.log(`content script sent a message: ${request}`);
  sendResponse({ response: decode(request) });
}

async function decode(msgData) {
  const programId = "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s";

  const SFMIdlItem = await getProgramIdl(programId);
  console.log(SFMIdlItem);

  // Account data have to be base-64 encoded
  // Stake Pool Account Data
  const accountData = msgData;

  const parser = new SolanaFMParser(SFMIdlItem);
  const eventParser = parser.createParser(ParserType.ACCOUNT);

  if (eventParser && checkIfAccountParser(eventParser)) {
    // Parse the transaction
    const decodedData = eventParser.parseAccount(accountData);
    console.log(decodedData);
    return decodedData;
  }
}

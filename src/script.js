//import { SolanaFMParser, checkIfAccountParser, ParserType } from "./node_modules/@solanafm/explorer-kit";

var currBidText = [];
var parsedBid = 0;
var currentBids;
var bidClosed;
var popupActive;
var bidPosition;
var positionNeedsUpdate = true;
var risk;
async function switchWorkingState() {
    if (document.getElementById("skips").value == "" || document.getElementById("skips").value == "0" || document.getElementById("skips").value.includes("e") || document.getElementById("skips").value.includes(".")) {
        console.log("Can't turn the script on. Please input correct number");
        document.getElementById("toggleSwitch").checked = !document.getElementById("toggleSwitch").checked;
    }

    else if (document.getElementById("toggleSwitch").checked == true) {
        console.log("Turning script on!");
        var bidButton = document.getElementsByClassName("chakra-tabs__tab css-1t81unm")[1];
        bidButton.click();
        currentBids = getCurrentBids();
        colorBids(currentBids);
        document.getElementById('skips').disabled = true;
        //await parseBid();
        //await watchBid();
      getBidTest("9BaoLcUwvPTPTckajR2de96vQS6Saxn9DmbwEKG1Yjb9");
    }

    else if (document.getElementById("toggleSwitch").checked == false) {
        console.log("Turning script off!");
        var currentBids = getCurrentBids();
        clearBidsColor(currentBids);
        document.getElementById('skips').disabled = false;
    };
    
}

async function getBidTest(hashPubkey) {
    var resp;
    const options = {
        method: 'POST',
        headers: { accept: 'application/json', 'content-type': 'application/json' },
        body: JSON.stringify({
            accountHashes: [hashPubkey],
            fields: ['onchain']
        })
    };

    await fetch('https://api.solana.fm/v0/accounts', options)
        .then(response => response.json())
        .then(data => {
            resp = data;
        })
        .catch(err => console.error(err));
    resp = resp.result;
    resp = resp['0'];
    resp = resp.onchain;
    resp = resp.data;
    resp = resp['0'];
    const sending = chrome.runtime.sendMessage("cgpmkkgmhennbclocecikfkbmgklhoio", resp);
    sending.then(handleResponse, handleError);
}

function handleResponse(message) {
    console.log(`background script sent a response: ${message.response}`);
}

function handleError(error) {
    console.log(`Error: ${error}`);
}

function reinitiateCurrentBids() {
    currentBids = getCurrentBids();
    colorBids(currentBids);
    getCurrentBidPricesText();
}

function getCurrentBids() {
    var currentBids = document.getElementsByClassName('css-1yb019s')[0];
    currentBids = currentBids.children[0];
    currentBids = currentBids.children[1];
    currentBids = currentBids.children[0];

    return currentBids.children;
}

function colorBids(currentBids) {
    clearBidsColor(currentBids);
    if (document.getElementById("toggleSwitch").checked == false) {
        return;
    }
    for (let i = 0; i < document.getElementById("skips").value; i++) {
        changeBackgroundColor(currentBids[i], "#963322");
    }
    setTimeout(() => colorBids(currentBids), 1000);
}

function clearBidsColor(currentBids) {
    for (const bid of currentBids) {
        changeBackgroundColor(bid, "linear-gradient(to right, rgb(12, 39, 27) 1%, rgb(17, 19, 20) 1%)");
    }
}

function changeBackgroundColor(el, color) {
    el.style.background = color;
}

function getCurrentBidPrices() {
    var currentBidPrices = document.getElementsByClassName("chakra-text css-f9slxq");
    return currentBidPrices;
}

function containsNumbers(str) {
    return /[a-zA-Z]/g.test(str);
}

async function getCurrentBidPricesText() {
    currBidText = [];
    var currentBidPrices = getCurrentBidPrices();
    await sleep(1000);
    for (const bidElem of currentBidPrices) {
        var bidText = bidElem.textContent;
        if (containsNumbers(bidText) == true || bidText.length <= 5) {

        }
        else {
            bidText = bidText.substring(0, 6);
            currBidText.push(bidText);
        }
    }
}

async function placeBid(bidPrice) {
    await sleep(1000);
    var table = document.getElementsByClassName("chakra-tabs__tab-panel css-1lac25p")[1];
    await setNftCount("1");
    await sleep(500);
    await setBidPrice(bidPrice);
    await sleep(500);
    setTimeout(() => pressPlaceBid(), 700);
    var trxButton = document.getElementsByClassName("chakra-button css-1exj9pc")[0];
    while (trxButton == undefined) {
        await sleep(1000);
        trxButton = document.getElementsByClassName("chakra-button css-1exj9pc")[0];
    }
    setTimeout(() => pressSendTrx(), 700);
    var trxCompletion = document.getElementsByClassName("chakra-text css-13i81pi")[0];
    var trxError = document.getElementsByClassName("chakra-button css-jz6p9v")[0];
    while (trxCompletion == undefined && trxError == undefined) {
        await sleep(1000);
        trxCompletion = document.getElementsByClassName("chakra-text css-13i81pi")[0];
        trxError = document.getElementsByClassName("chakra-button css-jz6p9v")[0];
    }
    if (trxCompletion != undefined) {
        console.log("Bid placed!");
        var closeButton = document.getElementsByClassName("chakra-modal__close-btn css-1me13n5")[0];
        closeButton.click();
        positionNeedsUpdate = true;
    }
    if (trxError != undefined) {
        console.log("Bid trx error. Trying again...");
        var closeButton = document.getElementsByClassName("chakra-modal__close-btn css-1me13n5")[0];
        retryPlaceBid();
    }
}

async function retryPlaceBid() {
    setTimeout(() => pressPlaceBid(), 700);
    var trxButton = document.getElementsByClassName("chakra-button css-1exj9pc")[0];
    while (trxButton == undefined) {
        await sleep(1000);
        trxButton = document.getElementsByClassName("chakra-button css-1exj9pc")[0];
    }
    setTimeout(() => pressSendTrx(), 700);
    var trxCompletion = document.getElementsByClassName("chakra-text css-13i81pi")[0];
    var trxError = document.getElementsByClassName("chakra-button css-jz6p9v")[0];
    while (trxCompletion == undefined && trxError == undefined) {
        await sleep(1000);
        trxCompletion = document.getElementsByClassName("chakra-text css-13i81pi")[0];
        trxError = document.getElementsByClassName("chakra-button css-jz6p9v")[0];
    }
    if (trxCompletion != undefined) {
        console.log("Bid placed!");
        var closeButton = document.getElementsByClassName("chakra-modal__close-btn css-1me13n5")[0];
        closeButton.click();
        positionNeedsUpdate = true;
    }
    if (trxError != undefined) {
        console.log("Bid trx error. Trying again...");
        var closeButton = document.getElementsByClassName("chakra-modal__close-btn css-1me13n5")[0];
        closeButton.click();
        retryPlaceBid();
    }
}

async function setNftCount(count) {
    var table = document.getElementsByClassName("chakra-tabs__tab-panel css-1lac25p")[1];
    var countInput = table.getElementsByClassName("chakra-numberinput__field css-9hzcv")[0];
    var countInputDiv = table.getElementsByClassName("chakra-numberinput css-15itn0e")[0];
    var sliderDiv = table.getElementsByClassName("chakra-slider css-1xr7642")[0];
    var countInt = parseInt(count);
    countInput.focus();
    await sleep(500);
    document.execCommand('selectAll', false);
    await sleep(500);
    document.execCommand('delete', false);
    await sleep(500);
    document.execCommand('insertText', false, countInt);
}

async function setBidPrice(bidPrice) {
    var table = document.getElementsByClassName("chakra-tabs__tab-panel css-1lac25p")[1];
    var bidPriceInput = table.getElementsByClassName("chakra-numberinput__field css-1t9lpwg")[0];
    bidPriceInput.focus();
    await sleep(500);
    document.execCommand('selectAll', false);
    await sleep(500);
    document.execCommand('delete', false);
    await sleep(500);
    console.log(bidPrice);
    document.execCommand('insertText', false, bidPrice);
}

function pressPlaceBid() {
    var bidButton = document.getElementsByClassName("chakra-button css-2y6lt")[0];
    bidButton.click();
}

function pressSendTrx() {
    var trxButton = document.getElementsByClassName("chakra-button css-1exj9pc")[0];
    trxButton.click();
}

async function removeBidFromYourList() {
    setTimeout(() => clickYourList(), 200);
    await sleep(1000);
    await proccessBidRemoval();
    popupActive = true;
    while (popupActive == true) {
        await sleep(1000);
        checkPopupWindowIsActive();
    }
    await sleep(700);
    setTimeout(() => clickYourList(), 300);
    await sleep(1000);
    setTimeout(() => reinitiateCurrentBids(), 500);
}

async function proccessBidRemoval() {
    var controlBidButtons = document.getElementsByClassName("chakra-button css-8rmfjo")[1];
    while (controlBidButtons == undefined) {
        await sleep(1000);
        controlBidButtons = document.getElementsByClassName("chakra-button css-8rmfjo")[1];
    }
    var removeButton = document.getElementsByClassName("chakra-button css-8rmfjo")[1];
    removeButton.click();
    await sleep(2000);
    var trxButton = document.getElementsByClassName("chakra-button css-1exj9pc")[0];
    if (trxButton != undefined) {
        pressSendTrx();
    }
    var trxCompletion = document.getElementsByClassName("chakra-text css-13i81pi")[0];
    var trxError = document.getElementsByClassName("chakra-button css-jz6p9v")[0];
    while (trxCompletion == undefined && trxError == undefined) {
        await sleep(1000);
        trxCompletion = document.getElementsByClassName("chakra-text css-13i81pi")[0];
        trxError = document.getElementsByClassName("chakra-button css-jz6p9v")[0];
    }
    if (trxCompletion != undefined) {
        console.log("Bid removed!");
        var closeButton = document.getElementsByClassName("chakra-modal__close-btn css-1me13n5")[0];
        closeButton.click();
    }
    if (trxError != undefined) {
        console.log("Bid trx error. Trying again...");
        var closeButton = document.getElementsByClassName("chakra-modal__close-btn css-1me13n5")[0];
        await sleep(1000);
        closeButton.click();
        proccessBidRemoval();
        return;
    }
}

function clickYourList() {
    var marketTab = document.getElementsByClassName("chakra-tabs css-5dc437")[0];
    var yourListCheck = marketTab.getElementsByClassName("chakra-checkbox__control css-fegtjq")[0];
    yourListCheck.click();
}

function removeBidFromAllList() {
    proccessBidRemoval();
}

function proccessBidDeactivation() {
    waitForElm('.css-8rmfjo').then((elm) => {
        var deactButton = document.getElementsByClassName("chakra-button css-8rmfjo")[0];
        deactButton.click();
        waitForElm('.css-dd3e5n').then((elm) => {
            var popupRedactBid = document.getElementsByClassName("chakra-modal__content css-dd3e5n")[0];
            var manageSolButton = popupRedactBid.getElementsByClassName("chakra-badge css-1sdl8ov")[1];
            manageSolButton.click();
            waitForElm('.css-opbb9y').then((elm) => {
                var manageSolMenu = popupRedactBid.getElementsByClassName("chakra-stack css-opbb9y")[0];
                var radiobuttonSolAmount = manageSolMenu.getElementsByClassName("chakra-radio__input")[1];
                radiobuttonSolAmount.click();
                waitForElm('.css-84zodg').then((elm) => {
                    var wifdrawButton = manageSolMenu.getElementsByClassName("chakra-button css-13386y9")[1];
                    wifdrawButton.click();
                    waitForElm('.css-g6xfo9').then((elm) => {
                        var wifdrawTrxButton = manageSolMenu.getElementsByClassName("chakra-badge css-g6xfo9")[0];
                        wifdrawTrxButton.click();
                        waitForElm('.css-13i81pi').then((elm) => {
                            var trxCompletionText = document.getElementsByClassName("chakra-text css-13i81pi")[0];
                            if (trxCompletionText.textContent == "Order complete!") {
                                console.log("Bid redacted!");
                                var closeButton = document.getElementsByClassName("chakra-modal__close-btn css-1me13n5")[0];
                                closeButton.click();
                                var closeButtonOnRedactPopup = document.getElementsByClassName("chakra-modal__close-btn css-425d6w")[0];
                                closeButtonOnRedactPopup.click();
                            }
                            else {

                            }
                        });
                    });
                });
            });
        });
    });
}

function checkPopupWindowIsActive() {
    var popupClose = document.getElementsByClassName("chakra-modal__close-btn css-1me13n5")[0];
    if (popupClose == null || popupClose == undefined) {
        console.log("Popup Window is closed successfully!");
        popupActive = false;
        return;
    }
    else {
        popupActive = true;
        return;
    }
}

async function getYourBidPosition() {
    if (positionNeedsUpdate == true) {
        clickYourList();
        var yourBid = document.getElementsByClassName('chakra-badge css-jc0f3e')[0];
        while (yourBid == undefined || yourBid == null) {
            await sleep(1000);
            yourBid = document.getElementsByClassName('chakra-badge css-jc0f3e')[0];
        }
        await sleep(750);
        clickYourList();
        positionNeedsUpdate = false;
    }
    await sleep(1000);
    reinitiateCurrentBids();
    currentBids = getCurrentBids();
    for (let i = 1; i <= currentBids.length; i++) {
        var myBid = currentBids[i - 1].getElementsByClassName('chakra-badge css-jc0f3e')[0];
        if (myBid != null && myBid != undefined) {
            bidPosition = i;
            return;
        }
        if (i == currentBids.length) {
            bidPosition = 0;
            return;
        }
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
/*
async function parseBid() {
    await sleep(500);
    await getCurrentBidPricesText();
    var skipsInitiated = document.getElementById("skips").value;
    var targetBid = currBidText[skipsInitiated];
    var parsedPrice = Number((targetBid - 0.00004).toFixed(9));
    for (let i = 0; i < 10; i++) {
        var checkTgChange = checkTargetChange(targetBid);
        if (checkTgChange == true) {
            console.log("Change detected!");
            parseBid();
            return;
        }
        
        await sleep(2000);
        await placeBid(parsedPrice);
        popupActive = true;
        while (popupActive == true) {
            await sleep(1000);
            checkPopupWindowIsActive();
        }

        await getYourBidPosition();
        console.log(bidPosition);
        var checkExact = await checkExactMatch();
        if (checkExact == true) {
            console.log("Bid parsed successfully!");
            bidClosed = parsedPrice;
            return;
        }

        if (bidPosition == 0) {
            console.log("Zero detected!");
            await removeBidFromYourList();
            popupActive = true;
            while (popupActive == true) {
                await sleep(1000);
                checkPopupWindowIsActive();
            }

            parsedPrice = Number((parsedPrice + 0.00001).toFixed(9));
        }

        var checkUnder = await checkUnderOnList();
        if (checkUnder == true) {
            console.log("Under detected!");
            await removeBidFromAllList();
            popupActive = true;
            while (popupActive == true) {
                await sleep(1000);
                checkPopupWindowIsActive();
            }

            parsedPrice = Number((parsedPrice + 0.00001).toFixed(9));
        }

        var checkDZ = checkDeadzone();
        if (checkDZ == true) {
            console.log("Deadzone detected!");
            await removeBidFromAllList();
            parsedPrice = Number((parsedPrice - 0.00001).toFixed(9));
            for (let i = 0; i < 10; i++) {
                var checkTgChange = await checkTargetChange(targetBid);
                if (checkTgChange == true) {
                    parseBid();
                    return;
                }

                await placeBid(parsedPrice);
                popupActive = true;
                while (popupActive == true) {
                    await sleep(1000);
                    checkPopupWindowIsActive();
                }

                await getYourBidPosition();
                var checkExact = await checkExactMatch();
                if (checkExact == true) {
                    console.log("Bid parsed successfully!");
                    bidClosed = parsedPrice;
                    return;
                }

                if (bidPosition == 0) {
                    await removeBidFromYourList();
                    popupActive = true;
                    while (popupActive == true) {
                        await sleep(1000);
                        checkPopupWindowIsActive();
                    }

                    parsedPrice = Number((parsedPrice + 0.000001).toFixed(7));
                }

                var checkUnder = await checkUnderOnList();
                if (checkUnder == true) {
                    await removeBidFromAllList();
                    popupActive = true;
                    while (popupActive == true) {
                        await sleep(1000);
                        checkPopupWindowIsActive();
                    }

                    parsedPrice = Number((parsedPrice + 0.000001).toFixed(7));
                }

                var checkDZ = checkDeadzone();
                if (checkDZ == true) {
                    await removeBidFromAllList();
                    popupActive = true;
                    while (popupActive == true) {
                        await sleep(1000);
                        checkPopupWindowIsActive();
                    }
                    await parseBid();
                    return;
                }
            }
        }
    }
} */

async function parseBid() {
    await sleep(500);
    await getCurrentBidPricesText();
    var skipsInitiated = document.getElementById("skips").value;
    var targetBid = currBidText[skipsInitiated];
    await getRiskWarning(targetBid);
    console.log(risk);
    if (risk == false) {
        var parsedPrice = Number((targetBid + 0.00001).toFixed(9));

        var checkTgChange = checkTargetChange(targetBid);
        if (checkTgChange == true) {
            console.log("Change detected!");
            parseBid();
            return;
        }

        await sleep(2000);
        await placeBid(parsedPrice);
        popupActive = true;
        while (popupActive == true) {
            await sleep(1000);
            checkPopupWindowIsActive();
        }

        await getYourBidPosition();
        console.log(bidPosition);

        var checkForPass = await checkPass();
        if (checkForPass == true) {
            console.log("Bid parsed! Starting to watch your bid...");
            bidClosed = targetBid;
            return;
        }


        var checkDZ = checkDeadzone();
        if (checkDZ == true) {
            console.log("Deadzone detected!");
            await removeBidFromAllList();
            parsedPrice = Number((targetBid - 0.00001).toFixed(9));
            await sleep(1000);

            var checkTgChange = checkTargetChange(targetBid);
            if (checkTgChange == true) {
                console.log("Change detected!");
                parseBid();
                return;
            }

            await sleep(2000);
            await placeBid(parsedPrice);
            popupActive = true;
            while (popupActive == true) {
                await sleep(1000);
                checkPopupWindowIsActive();
            }

            await getYourBidPosition();
            console.log(bidPosition);

            var checkForPass = await checkPass();
            if (checkForPass == true) {
                console.log("Bid parsed! Starting to watch your bid...");
                bidClosed = targetBid;
                return;
            }

            var checkDZ = checkDeadzone();
            if (checkDZ == true) {
                console.log("Deadzone detected!");
                await removeBidFromAllList();
                parsedPrice = Number((targetBid - 0.00004444).toFixed(9));
                await sleep(1000);

                var checkTgChange = checkTargetChange(targetBid);
                if (checkTgChange == true) {
                    console.log("Change detected!");
                    parseBid();
                    return;
                }

                await sleep(2000);
                await placeBid(parsedPrice);
                popupActive = true;
                while (popupActive == true) {
                    await sleep(1000);
                    checkPopupWindowIsActive();
                }

                await getYourBidPosition();
                console.log(bidPosition);

                var checkForPass = await checkPass();
                if (checkForPass == true) {
                    console.log("Bid parsed! Starting to watch your bid...");
                    bidClosed = targetBid;
                    return;
                }

                var checkDZ = checkDeadzone();
                if (checkDZ == true) {
                    console.log("Deadzone detected!");
                    await removeBidFromAllList();
                    await sleep(1000);

                    parseBid();
                    return;
                }
            }
        }
    }
    else if (risk == true) { // place bid on lowest price possible for targetBid and copy all checking mechanisms from above
        var parsedPrice = Number((targetBid - 0.00004444).toFixed(9));

        var checkTgChange = checkTargetChange(targetBid);
        if (checkTgChange == true) {
            console.log("Change detected!");
            parseBid();
            return;
        }

        await sleep(2000);
        await placeBid(parsedPrice);
        popupActive = true;
        while (popupActive == true) {
            await sleep(1000);
            checkPopupWindowIsActive();
        }

        await getYourBidPosition();
        console.log(bidPosition);

        var checkForPass = await checkPass();
        if (checkForPass == true) {
            console.log("Bid parsed! Starting to watch your bid...");
            bidClosed = targetBid;
            return;
        }

        var checkDZ = checkDeadzone();
        if (checkDZ == true) {
            console.log("Deadzone detected!");
            await removeBidFromAllList();
            await sleep(1000);

            parseBid();
            return;
        }
    }
}

async function checkPass() {
    if (bidPosition == 0) {
        return true;
    }
    if (bidPosition > document.getElementById("skips").value) {
        return true;
    }
    else {
        return false;
    }
}

async function getRiskWarning(targetBid) {
    var minLikeTargetBid;
    var maxLikeTargetBid;
    for (let i = 0; i < currBidText.length; i++) {
        if (currBidText[i] == targetBid) {
            if (i < minLikeTargetBid || minLikeTargetBid == undefined) {
                minLikeTargetBid = i;
            }
            if (i > maxLikeTargetBid || maxLikeTargetBid == undefined) {
                maxLikeTargetBid = i;
            }
        }
    }
    if (minLikeTargetBid <= 7) {
        risk = true;
        return;
    }
    else {
        risk = false;
        return;
    }
}
/*
async function checkExactMatch() {
    if (bidPosition != 0 && bidPosition > document.getElementById("skips").value && bidPosition < document.getElementById("skips").value + 11) {
        return true;
    }
    else {
        return false;
    }
}*/

async function checkDeadzone() {
    if (bidPosition <= document.getElementById("skips").value) {
        console.log(true);
        return true;
    }
    else {
        console.log(false);
        return false;
    }
}
/*
async function checkUnderOnList() {
    if (bidPosition >= document.getElementById("skips").value + 6) {
        return true;
    }
    else {
        return false;
    }
}*/

async function checkTargetChange(initTarget) {
    await sleep(1000);
    await getCurrentBidPricesText();
    var skipsInitiated = document.getElementById("skips").value;
    var targetBid = currBidText[skipsInitiated];

    if (initTarget != targetBid) {
        return true;
    }
    else {
        return false;
    }
}

async function watchBid() {
    while (document.getElementById("toggleSwitch").checked == true) {
        var checkChange = await checkTargetChange(bidClosed);
        while (bidPosition > document.getElementById("skips").value || checkChange == false) {
            await sleep(1000);
            getYourBidPosition();
            await sleep(500);
            checkChange = await checkTargetChange(bidClosed);
        }
        if (bidPosition > document.getElementById("skips").value || checkChange == false) {
            if (bidPosition == 0) {
                await removeBidFromAllList();
            }
            else {
                await removeBidFromYourList();
            }
            await sleep(2000);

            await parseBid();
        }
    }
}

async function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

import {handleButtonClick, disableButtons} from './actions.js';
import {
    getActualPotatoesInStorage,
    getChipsCutThisShift,
    getChipsFriedThisShift,
    getChipsFrying,
    getChipsWastedThisShift,
    getCurrentCash,
    getCustomersServed,
    getCustomersWaiting,
    getCustomersWaitingBeforeEndOfShift,
    getFryerCapacity,
    getOldCash,
    getOne,
    getPotatoesPeeledThisShift,
    getPotatoStorageQuantity,
    getPriceToAddStorageHeater,
    getPriceToEnableDoubleChipping,
    getPriceToEnableDoublePeeling,
    getPriceToImproveFryerCapacity,
    getPriceToImprovePotatoStorage,
    getShiftCounter,
    getSpudsToAddToShift,
    getStartingCash,
    getZero,
    getElements,
    popupContinueButton,
    endOfShiftPopup,
    popupOverlay,
    setCurrentCash,
    setDebugFlag,
    getPriceToImproveAutoPeeler,
    getPriceToImproveAutoChipper,
    getPriceToImproveAutoFryerWhenFryerEmptyAndChipsCut,
    getPriceToImproveAutoMoverFromFryerToStorage,
    getPriceToImproveAutoCustomerServer,
    getNextSpeedAutoCustomerServer,
    getCurrentSpeedAutoCustomerServer,
    getNextSpeedAutoStorageCollector,
    getCurrentSpeedAutoStorageCollector,
    getNextSpeedAutoFryer,
    getCurrentSpeedAutoFryer,
    getNextSpeedAutoChipper,
    getCurrentSpeedAutoChipper,
    getNextSpeedAutoPeeler,
    getCurrentSpeedAutoPeeler
} from './constantsAndGlobalVars.js';
import {gameInProgress, initialiseNewGame, setGameInProgress, updateVisibleButtons} from "./gameloop.js";

export function createTitleScreen() {
    const titleScreen = document.createElement('div');
    titleScreen.classList.add('title-screen');

    const title = document.createElement('h1');
    title.innerHTML = 'Counter Game';
    title.classList.add('title');

    const options = document.createElement('div');
    options.classList.add('options');
    options.id = 'optionsWindow';

    const debugs = document.createElement('div');
    debugs.classList.add('debugs');
    debugs.id = 'debugsWindow';

    // Define the option names and their initial colors
    const optionInfo = [
        { name: 'New Game', color: '#007bff' },    // Blue
        { name: 'Load Game', color: '#007bff' },   // Blue
        { name: 'Help', color: '#007bff' },        // Blue
        { name: 'Toggle Sound', color: '#00cc00' } // Green
    ];

    // Define the option names and their initial colors
    const debugInfo = [
        { name: 'Give $1000', color: 'Black' },    // Blue
    ];

    // Create and append clickable options
    for (let i = 0; i < optionInfo.length; i++) {
        const option = document.createElement('div');
        option.innerHTML = optionInfo[i].name;
        option.classList.add('option');
        option.style.backgroundColor = optionInfo[i].color;
        option.id = `option${i + 1}`;
        options.appendChild(option);
    }

    for (let i = 0; i < debugInfo.length; i++) {
        const debug = document.createElement('div');
        debug.innerHTML = debugInfo[i].name;
        debug.classList.add('debug');
        debug.id = `debug${i + 1}`;
        debugs.appendChild(debug);
    }

    titleScreen.appendChild(title);
    titleScreen.appendChild(options);
    titleScreen.appendChild(debugs);

    document.body.appendChild(titleScreen);
}

export function createGameWindow(titleScreenCreatedEvent) {
    const gameWindow = document.createElement('div');
    gameWindow.classList.add('game-window');
    gameWindow.id = "gameWindow";

    const topSection = document.createElement('div');
    topSection.classList.add('top-section');

    const topDivRow1 = document.createElement('div');
    topDivRow1.classList.add('top-div-row-1');

    for (let i = 1; i <= 3; i++) {
        const innerDiv = document.createElement('div');
        innerDiv.classList.add('inner-div-topDivRow1');
        innerDiv.id = `innerDiv${i}`;

        topDivRow1.appendChild(innerDiv);

        if (i === 1 || i === 3) {
            for (let j = 1; j <= 2; j++) {
                const subInnerDiv = document.createElement('div');
                subInnerDiv.classList.add('sub-inner-div-topDivRow1');
                subInnerDiv.id = `subInnerDiv${i}_${j}`;

                innerDiv.appendChild(subInnerDiv);
            }
        }
    }

    topSection.appendChild(topDivRow1);

    const topDivRowMid = document.createElement('div');
    topDivRowMid.classList.add('top-div-row-mid');

    for (let i = 1; i <= 3; i++) {
        const innerDiv = document.createElement('div');
        innerDiv.classList.add('inner-div-topDivRowMid');
        innerDiv.id = `innerDivRowMid${i}`;

        topDivRowMid.appendChild(innerDiv);

        if (i === 1 || i === 3) {
            for (let j = 1; j <= 2; j++) {
                const subInnerDivMid = document.createElement('div');
                subInnerDivMid.classList.add('sub-inner-div-topDivRowMid');
                subInnerDivMid.id = `subInnerDivMid${i}_${j}`;

                innerDiv.appendChild(subInnerDivMid);
            }
        }
    }

    topSection.appendChild(topDivRowMid);


    const topDivRow2 = document.createElement('div');
    topDivRow2.classList.add('top-div-row-2');

    const counterIds = ['peeledCount', 'cutCount', 'chuckedInFryerCount', 'readyToServeCount', 'customersWaitingCount'];

    for (let i = 0; i < counterIds.length; i++) {
        let valuesCounterRow = document.createElement('div');
        valuesCounterRow.classList.add('counter-columns');
        valuesCounterRow.innerHTML = '0';

        valuesCounterRow.id = counterIds[i];

        topDivRow2.appendChild(valuesCounterRow);
    }

    topSection.appendChild(topDivRow2);
    gameWindow.appendChild(topSection);

    const mainButtonContainer = document.createElement('div');
    mainButtonContainer.classList.add('main-button-container');

    const bottomButtonsContainer = document.createElement('div');
    bottomButtonsContainer.classList.add('bottom-buttons-container');

    const bottomRowContainer = document.createElement('div');
    bottomRowContainer.classList.add('bottom-row-container');

    const mainButtonDetails = [
        { id: 'peelPotatoButton', name: 'Peel Potato', upgrade: 'false', repeatableUpgrade: 'false' },
        { id: 'cutChipsButton', name: 'Cut Chips', upgrade: 'false', repeatableUpgrade: 'false' },
        { id: 'fryChipsButton', name: `Fry Chips<br> (Capacity: ${getFryerCapacity()})`, upgrade: 'false', repeatableUpgrade: 'false' },
        { id: 'servingStorageButton', name: 'Serving Storage', upgrade: 'false', repeatableUpgrade: 'false' },
        { id: 'serveCustomerButton', name: 'Serve Customer', upgrade: 'false', repeatableUpgrade: 'false' },
        { id: 'autoPeelerUpgradeButton', name: `Auto Peeler (${getCurrentSpeedAutoPeeler()})<br> Next: ${getNextSpeedAutoPeeler()}/s<br> ${formatToCashNotation(getPriceToImproveAutoPeeler())}`, upgrade: 'true', repeatableUpgrade: 'true' },
        { id: 'autoChipperUpgradeButton', name: `Auto Chipper (${getCurrentSpeedAutoChipper()})<br> Next: ${getNextSpeedAutoChipper()}/s<br> ${formatToCashNotation(getPriceToImproveAutoChipper())}`, upgrade: 'true', repeatableUpgrade: 'true' },
        { id: 'autoFryerUpgradeButton', name: `Auto Fryer (${getCurrentSpeedAutoFryer()})<br> Next: ${getNextSpeedAutoFryer()}s<br> ${formatToCashNotation(getPriceToImproveAutoFryerWhenFryerEmptyAndChipsCut())}`, upgrade: 'true', repeatableUpgrade: 'true' },
        { id: 'autoStorageCollectorUpgradeButton', name: `Auto Collector (${getCurrentSpeedAutoStorageCollector()})<br> Next: ${getNextSpeedAutoStorageCollector()}s<br> ${formatToCashNotation(getPriceToImproveAutoMoverFromFryerToStorage())}`, upgrade: 'true', repeatableUpgrade: 'true' },
        { id: 'autoCustomerServerUpgradeButton', name: `Auto Server (${getCurrentSpeedAutoCustomerServer()})<br> Next: ${getNextSpeedAutoCustomerServer()}s<br> ${formatToCashNotation(getPriceToImproveAutoCustomerServer())}`, upgrade: 'true', repeatableUpgrade: 'true' },
        { id: 'action11Button', name: 'Action 11', upgrade: 'false', repeatableUpgrade: 'false' },
        { id: 'action12Button', name: 'Action 12', upgrade: 'false', repeatableUpgrade: 'false' },
        { id: 'action13Button', name: 'Action 13', upgrade: 'false', repeatableUpgrade: 'false' },
        { id: 'action14Button', name: 'Action 14', upgrade: 'false', repeatableUpgrade: 'false' },
        { id: 'action15Button', name: 'Action 15', upgrade: 'false', repeatableUpgrade: 'false' },
        { id: 'improvePotatoStorageButton', name: `Increase Potato Cap. <br> ${formatToCashNotation(getPriceToEnableDoublePeeling())}`, upgrade: 'true', repeatableUpgrade: 'true' },
        { id: 'action17Button', name: 'Action 17', upgrade: 'false', repeatableUpgrade: 'false' },
        { id: 'action18Button', name: 'Action 18', upgrade: 'false', repeatableUpgrade: 'false' },
        { id: 'action19Button', name: 'Action 19', upgrade: 'false', repeatableUpgrade: 'false' },
        { id: 'action20Button', name: 'Action 20', upgrade: 'false', repeatableUpgrade: 'false' }
    ];

    const bottomButtonDetails = [
        { id: 'twoHandedPeelingButton', name: `Double Peeling Tool <br> ${formatToCashNotation(getPriceToEnableDoublePeeling())}`, upgrade: 'true', repeatableUpgrade: 'false' },
        { id: 'twoHandedChippingButton', name: `Double Chipping Tool <br> ${formatToCashNotation(getPriceToEnableDoubleChipping())}`, upgrade: 'true', repeatableUpgrade: 'false' },
        { id: 'improveFryerCapacityButton', name: `Improve Fryer Cap. <br> ${formatToCashNotation(getPriceToImproveFryerCapacity())}`, upgrade: 'true', repeatableUpgrade: 'false' },
        { id: 'addStorageHeaterButton', name: `Buy Storage Heater <br> ${formatToCashNotation(getPriceToAddStorageHeater())}`, upgrade: 'true', repeatableUpgrade: 'false' },
        { id: 'startShiftButton', name: 'Start Shift', upgrade: 'false', repeatableUpgrade: 'false' }
    ];

    for (let i = 0; i < mainButtonDetails.length; i++) {
        const button = document.createElement('button');
        button.id = mainButtonDetails[i].id;
        button.innerHTML = mainButtonDetails[i].name;
        button.classList.add('action-button-main');

        // Determine the class and height based on button position
        if (i < 5) {
            button.classList.add('first-row-main-buttons');
            button.style.height = '40px';
        } else if (i >= 5 && i < 10) {
            button.classList.add('second-row-main-buttons');
            button.style.height = '60px';
        } else if (i >= 10 && i < 15) {
            button.classList.add('third-row-main-buttons');
            button.style.height = '30px';
        } else if (i >= 15 && i < 20) {
            button.classList.add('fourth-row-main-buttons');
            button.style.height = '50px';
        }

        mainButtonContainer.appendChild(button);
    }

    for (let i = 0; i < bottomButtonDetails.length; i++) {
        const button = document.createElement('button');
        button.id = bottomButtonDetails[i].id;
        button.innerHTML = bottomButtonDetails[i].name;
        button.classList.add('action-button-bottom-row');
        bottomRowContainer.appendChild(button);
    }

    bottomButtonsContainer.appendChild(mainButtonContainer);
    bottomButtonsContainer.appendChild(bottomRowContainer);

    gameWindow.appendChild(bottomButtonsContainer);

    document.body.appendChild(gameWindow);

    hideUpgradeButtonsGameStart(bottomButtonsContainer);

    document.dispatchEvent(titleScreenCreatedEvent);
    disableButtons(true);

    createOptionScreenEventListeners();

    writeTextInSections(mainButtonDetails);

    handleButtonClick(getElements().startShiftButton.id, null);
    handleButtonClick(getElements().peelPotatoButton.id, getElements().peeledCount.id);
    handleButtonClick(getElements().cutChipsButton.id, getElements().cutCount.id);
    handleButtonClick(getElements().fryChipsButton.id, getElements().chuckedInFryerCount.id);
    handleButtonClick(getElements().servingStorageButton.id, getElements().readyToServeCount.id);
    handleButtonClick(getElements().serveCustomerButton.id, getElements().customersWaitingCount.id);
    handleButtonClick(getElements().improvePotatoStorageButton.id, getPriceToImprovePotatoStorage());
    handleButtonClick(getElements().twoHandedPeelingButton.id, getPriceToEnableDoublePeeling());
    handleButtonClick(getElements().twoHandedChippingButton.id, getPriceToEnableDoubleChipping());
    handleButtonClick(getElements().improveFryerCapacityButton.id, getPriceToImproveFryerCapacity());
    handleButtonClick(getElements().addStorageHeaterButton.id, getPriceToAddStorageHeater());
    handleButtonClick(getElements().autoPeelerUpgradeButton.id, getPriceToImproveAutoPeeler());
    handleButtonClick(getElements().autoChipperUpgradeButton.id, getPriceToImproveAutoChipper());
    handleButtonClick(getElements().autoFryerUpgradeButton.id, getPriceToImproveAutoFryerWhenFryerEmptyAndChipsCut());
    handleButtonClick(getElements().autoStorageCollectorUpgradeButton.id, getPriceToImproveAutoMoverFromFryerToStorage());
    handleButtonClick(getElements().autoCustomerServerUpgradeButton.id, getPriceToImproveAutoCustomerServer());
}

export function writeTextInSections(buttonDetails) {
    getElements().innerDiv2.innerHTML = 'Chip Shop Prepper';

    getElements().subInnerDiv1_1.innerHTML = 'Shift rem. (s):';
    getElements().subInnerDiv1_2.innerHTML = "Start Shift";

    getElements().subInnerDiv3_1.innerHTML = 'Served:';
    getElements().subInnerDiv3_2.innerHTML = "0";

    getElements().subInnerDivMid1_1.innerHTML = 'Potatoes:';
    getElements().subInnerDivMid1_2.innerHTML = "0/" + getPotatoStorageQuantity().toString();

    getElements().subInnerDivMid3_1.innerHTML = 'Money:';
    getElements().subInnerDivMid3_2.innerHTML = formatToCashNotation(getStartingCash());

    buttonDetails.forEach(buttonInfo => {
        const button = getElements()[buttonInfo.id];
        button.innerHTML = buttonInfo.name;
    });
}

export function hideUpgradeButtonsGameStart(bottomButtonsContainer) {
    bottomButtonsContainer.querySelectorAll('.action-button-main:nth-child(n+6)').forEach(button => {
        button.classList.add('hidden-button');
    });
    bottomButtonsContainer.querySelectorAll('.action-button-bottom-row:not(:last-child)').forEach(button => {
        button.classList.add('hidden-button');
    });
}

export function toggleSound() {
    const soundOption = getElements().option4;
    const isSoundOn = soundOption.style.backgroundColor === 'rgb(255, 0, 0)'; // Red color

    if (isSoundOn) {
        soundOption.style.backgroundColor = '#00cc00'; // Green
        // console.log('Sound turned on');
        // Call your "toggleSound(on)" function here
    } else {
        soundOption.style.backgroundColor = 'rgb(255, 0, 0)'; // Red
        // console.log('Sound turned off');
        // Call your "toggleSound(off)" function here
    }
}

export function formatToCashNotation(value) {
    return `$${value.toFixed(2)}`;
}

export function updateButtonStyle(buttonId, startStop) {
    const element = getElements()[buttonId];
    if (startStop === null) {
        switch (buttonId) {
            case getElements().fryChipsButton.id:
                if (getChipsFrying()) {
                    element.classList.add('cooking');
                    element.classList.remove('disabled');
                } else {
                    element.classList.remove('cooking');
                    element.classList.add('disabled');
                }
                break;
            default: //non repeatable upgrades
                element.classList.add('non-repeatable-upgrade-purchased');
                break;
        }
    }

    if (startStop !== null) {
        switch (startStop) {
            case getZero():
                element.classList.remove('action-button-main-disabled');
                element.classList.add('action-button-main-flashing');
                break;
            case getOne():
                element.classList.remove('action-button-main-flashing');
                element.classList.add('action-button-main-disabled');
                break;
        }
    }
}

export function createEndOfShiftPopup() {
    const popupContainer = document.createElement('div');
    popupContainer.classList.add('popup-container');

    const popupTitle = document.createElement('div');
    popupTitle.id = 'endOfShiftPopupTitle';
    popupTitle.classList.add('popup-row');
    popupTitle.classList.add('popup-row-1');
    popupTitle.innerHTML = `<div class="popup-title">test</div>`;

    const popupContent = document.createElement('div');
    popupContent.id = 'endOfShiftPopupContent';
    popupContent.classList.add('popup-row');
    popupContent.classList.add('popup-row-2');
    popupContent.innerHTML = '<div class="popup-content">test</div>';

    const popupRow3 = document.createElement('div');
    popupRow3.classList.add('popup-row');
    popupRow3.classList.add('popup-row-3');

    const continueButton = document.createElement('button');
    continueButton.innerHTML = 'Continue';
    continueButton.classList.add('popup-continue-button');
    popupRow3.appendChild(continueButton);
    popupContainer.style.display = "none";

    popupContainer.appendChild(popupTitle);
    popupContainer.appendChild(popupContent);
    popupContainer.appendChild(popupRow3);
    document.body.appendChild(popupContainer);

    return { popupContainer, continueButton };
}

export function createOverlay() {
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    overlay.id = 'overlay';
    overlay.style.display = "none";
    document.body.appendChild(overlay);

    return overlay;
}

export function toggleEndOfShiftPopup(popupContainer) {
    if (popupContainer.style.display === 'none') {
        popupContainer.style.display = 'block';
    } else {
        popupContainer.style.display = 'none';
    }
}

export function toggleOverlay(popupOverlay) {
    if (popupOverlay.style.display === 'none') {
        popupOverlay.style.display = 'block';
    } else {
        popupOverlay.style.display = 'none';
    }
}

export function writePopupText() {
    let walkOuts = getCustomersWaitingBeforeEndOfShift() - getCustomersWaiting();
    let shiftCounter = getShiftCounter();
    let currentPotatoes = getActualPotatoesInStorage();
    let spudsToAdd = getSpudsToAddToShift();
    let storageQuantity = getPotatoStorageQuantity();

    let totalPotatoes = currentPotatoes + spudsToAdd;
    let nextShiftPotatoes = Math.min(totalPotatoes, storageQuantity);
    const popupTitle = getElements().endOfShiftPopupTitle;
    const popupContent = getElements().endOfShiftPopupContent;

    popupTitle.innerHTML = `<div class="popup-title">End Of Shift ${shiftCounter}</div>`;
    let potatoesMessage = `Potatoes for next shift: ${currentPotatoes} + ${nextShiftPotatoes - currentPotatoes} to be delivered = ${nextShiftPotatoes}`;
    if (nextShiftPotatoes === storageQuantity) {
        potatoesMessage += " (due to max storage reached)";
    }

    popupContent.innerHTML = `
    <div class="popup-content">
        Your shift has ended!<br><br>
        Earnings: ${formatToCashNotation(getCurrentCash() - getOldCash())} this shift + ${formatToCashNotation(getOldCash())} in bank = ${formatToCashNotation(getCurrentCash())}<br><br>
        Customers Served: ${getCustomersServed()}<br>
        
        Potatoes Peeled: ${getPotatoesPeeledThisShift()}<br>
        Chips Cut: ${getChipsCutThisShift()}<br>
        Chips Fried: ${getChipsFriedThisShift()}<br>
        Chips Wasted This Shift: ${getChipsWastedThisShift()}<br><br>
        
        Customer Walkouts: ${walkOuts}<br>
        Customers Still Waiting: ${getCustomersWaiting()}<br><br>

        ${potatoesMessage}
    </div>`;

}

function createOptionScreenEventListeners() {
    getElements().option1.addEventListener('click', function () {
        setGameInProgress(initialiseNewGame(gameInProgress));
        //console.log("gameInProgress after clicking new game =" + gameInProgress);
        updateVisibleButtons(); //for debug if money given
    });
    getElements().option2.addEventListener('click', function () {
        // Add functionality for other options as needed
    });
    getElements().option3.addEventListener('click', function () {
        // Add functionality for other options as needed
    });
    getElements().option4.addEventListener('click', function () {
        toggleSound();
    });
    popupContinueButton.addEventListener('click', function() {
        toggleEndOfShiftPopup(endOfShiftPopup);
        toggleOverlay(popupOverlay);
    });

    //DEBUG
    getElements().debug1.addEventListener('click', function () {
        setDebugFlag(true);
        getElements().debug1.classList.add('debug-toggledOn');
        setCurrentCash(1000);
        getElements().subInnerDivMid3_2.innerHTML = formatToCashNotation(getCurrentCash());
        console.log("$1000 given (debug)");
    });
}
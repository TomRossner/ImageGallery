const buttons = document.querySelectorAll(".btn");
const playBtn = document.querySelector("#autoPlayBtn");
const templateImgsBtn = document.querySelector("#useTemplateImgs");
const uploadImages = document.querySelector("#addMore");
const playIcon = document.querySelector("#play.gg-play-button");
const stopIcon = document.querySelector("#stop.gg-play-stop");
turnOff(stopIcon);
const trashContainer = document.querySelector("#trashContainer");
const trashBtn = document.querySelector("#trashBtn");
const trashChevronDownIcon = document.querySelector("#trashChevronDownIcon");
const clearOptionsContainer = document.querySelector(".clear-options");
const clearCurrent = document.querySelector("#clearCurrent");
const clearAll = document.querySelector("#clearAll");
const imgContainer = document.querySelector(".img-container");
const chevronLeft = document.querySelector(".chevronBox.left");
const chevronRight = document.querySelector(".chevronBox.right");
const zoomIn = document.querySelector(".chevronBox.zoom-in");
const zoomOut = document.querySelector(".chevronBox.zoom-out");
disableButton(zoomOut);
const infoContainer = document.querySelector("#infoContainer");
const imgCount = document.querySelector("#imgCount");
let count = 0;
imgCount.innerHTML = `${count} images`;
const playingMsg = document.querySelector("#playing");
const imgContainerParagraph = document.querySelector("#imgContainerParagraph");
let imgArray = [];
// let templateImgs = [];
const setDelayBtn = document.querySelector("#setBtn");
const delayInput = document.querySelector("#delayInput");
const delayBtn = document.querySelector("#delayBtn");
turnOff(setDelayBtn);
turnOff(delayInput);
turnOff(delayBtn);
let delay = 5000;
let currentIndex = 0;
let autoPlayStatus = false;
let autoPlay = setInterval(function(){
    imgArray.push(imgArray.shift());
    for(let i = 0; i < imgArray.length; i++){
        turnOff(imgArray[i]);
        imgArray[0].style.display = "block";
        imgArray[0].style.animation = `${delay / 1000}s scale, fadeIn 2s`;
    }
    }, delay);

clearInterval(autoPlay);
collapseImgContainer(imgArray);
handleInfoMsgs(autoPlayStatus, count);
count === 0 ? turnOff(trashBtn) : turnOn(trashBtn);
count === 0 ? turnOff(playBtn) : turnOn(playBtn);


// EVENT LISTENERS

playBtn.addEventListener("click", () =>{
    canUseAutoPlay(imgArray);
    if(imgArray.length > 1){
        handleBtnContent(playIcon, stopIcon);
        if(autoPlayStatus === false){
            displayNone(chevronLeft);
            displayNone(chevronRight);
            autoPlay = function(){
                imgArray.push(imgArray.shift());
                for(let i = 0; i < imgArray.length; i++){
                    displayNone(imgArray[i]);
                    imgArray[0].style.display = "block";
                    imgArray[0].style.animation = `${delay / 1000}s scale, fadeIn 2s`;
                }
            };
            autoPlayStatus = true;
            if(clearOptionsContainer.classList.contains("open")){
                closeTrashOptions();
            }
            disableButton(trashBtn);
            removePointerEvents(trashBtn);
            handleInfoMsgs(autoPlayStatus, count);
            return autoPlay = setInterval(function(){
                imgArray.push(imgArray.shift());
                for(let i = 0; i < imgArray.length; i++){
                    displayNone(imgArray[i]);
                    imgArray[i].classList.remove("active");
                }
                displayImg(imgArray[currentIndex]);
                imgArray[currentIndex].style.animation = `${delay / 1000}s scale, fadeIn 2s`;
                }, delay);
        }
        if(autoPlayStatus === true){
            autoPlayStatus = false;
            enableButton(trashBtn);
            trashBtn.style.pointerEvents = "all";
            clearInterval(autoPlay);
            for(let i = 0; i < imgArray.length; i++){
                displayNone(imgArray[i]);
                imgArray[i].classList.remove("active");
                imgArray[i].style.animation = "";
            }
            displayImg(imgArray[currentIndex]);
            handleInfoMsgs(autoPlayStatus, count);
            chevronLeft.style.display = "";
            chevronRight.style.display = "";
        }
        return;
    }
    
});

uploadImages.addEventListener("change", () => {
    trashBtn.style.display = "flex";
    playBtn.style.display = "flex";
        for(let i = 0; i < imgArray.length; i++){
            imgArray[i].classList.remove("active");
        }
        for (let i = 0; i < uploadImages.files.length; i++){
            let img = document.createElement("img");
            img.src = URL.createObjectURL(uploadImages.files[i]);
            img.addEventListener("load", () => {
                URL.revokeObjectURL(this.src);
                imgContainer.appendChild(img);
                collapseImgContainer(imgArray);
            })
            displayNone(imgContainerParagraph);
            imgContainer.style.backgroundColor = "rgb(30, 30, 30)";
            imgArray.push(img);
        }
        for(let i = 0; i < imgArray.length; i++){
            displayNone(imgArray[i]);
            imgArray[i].classList.remove("active");
        }
        displayImg(imgArray[currentIndex]);
        enableButton(trashBtn);
        updateCountMsg(imgArray);
        handleInfoMsgs(status, count);
        count > 1 ? enableButton(playBtn) : disableButton(playBtn);
        count > 1 ? enableButton(delayBtn) : disableButton(delayBtn);
        count >= 1 ? turnOn(delayBtn) : turnOff(delayBtn);
})

chevronRight.addEventListener("click", () => {
    if(imgArray.length === 1){return;}
    for(let i = 0; i < imgArray.length; i++){
        displayNone(imgArray[i]);
        imgArray[i].classList.remove("active");
    }
    // Update current index
    currentIndex += 1;
    currentIndex = determineCurrentIndex(currentIndex, 0, imgArray.length-1);
   
    // Display Current image
    currentImage = imgArray[currentIndex];
    displayImg(currentImage);
    
})

chevronLeft.addEventListener("click", () => {
    if(imgArray.length === 1){return;}
    for(let i = 0; i < imgArray.length; i++){
        displayNone(imgArray[i]);
        imgArray[i].classList.remove("active");
    }
    // Update current index
    currentIndex -= 1;
    currentIndex = determineCurrentIndex(currentIndex, 0, imgArray.length-1);
  
    // Display Current image
    currentImage = imgArray[currentIndex];
    displayImg(currentImage);
});

zoomIn.addEventListener("click", () => {
    imgContainer.classList.toggle("expanded");
    infoContainer.classList.toggle("expanded");
    disableButton(zoomIn);
    enableButton(zoomOut);
})

zoomOut.addEventListener("click", () => {
    imgContainer.classList.toggle("expanded");
    infoContainer.classList.toggle("expanded");
    enableButton(zoomIn);
    disableButton(zoomOut);
})

clearAll.addEventListener("click", () => {

    disableButton(playBtn);
    disableButton(delayBtn);
    disableButton(trashBtn);
    closeTrashOptions();
    // disableButton(trashBtn);
    imgContainerParagraph.innerHTML = `Cleared  ${count} images.`;
    imgContainerParagraph.style.display = "block";
    imgContainerParagraph.style.color = "white";
    imgContainerParagraph.style.backgroundColor = "#c1121f";
    imgArray = clearArray(imgArray);
    count = imgArray.length;

    updateCountMsg(imgArray);
    handleInfoMsgs(status, count);
    collapseImgContainer(imgArray);
})

setDelayBtn.addEventListener("click", () => {
    delay = delayInput.value;
    playingMsg.style.opacity = 1;
    playingMsg.innerHTML = `Delay set to ${delay} seconds.`;
    if(delay < 2){
        delay = 5;
        playingMsg.innerHTML = `Delay invalid. Delay set to ${delay} seconds.`;
    }
    delay *= 1000;
    turnOff(setDelayBtn);
    turnOff(delayInput);
    turnOn(delayBtn);
    enableButton(playBtn);
    enableButton(trashBtn);
    clearInput(delayInput);
    return delay;
})

delayBtn.addEventListener("click", () => {
    if(count <= 1){
        disableButton(delayBtn);
        return;
    }else{
        turnOff(delayBtn);
        turnOn(setDelayBtn);
        turnOn(delayInput);
        
        autoPlayStatus = false;
        clearInterval(autoPlay);
        disableButton(playBtn);
        removePointerEvents(playBtn);
        turnOn(playIcon);
        turnOff(stopIcon);
        playBtn.innerHTML = `<i id="play" class="gg-play-button"></i><span>Play</span>`;
        enableButton(playingMsg);
        playingMsg.innerHTML = "Set a delay in seconds -- Default delay is set to 5 seconds, minimum delay is 2 seconds.";
        playingMsg.style.opacity = 1;
        disableButton(trashBtn);
        removePointerEvents(trashBtn);
        for(let i = 0; i < imgArray.length; i++){
            displayNone(imgArray[i]);
            imgArray[i].style.animation = "";
        }
        imgArray[0].style.display = "block";
        // handleInfoMsgs(autoPlayStatus, count);
        chevronLeft.style.display = "";
        chevronRight.style.display = "";
        if(clearOptionsContainer.classList.contains("open")){
            closeTrashOptions();
        }
    }
})

trashBtn.addEventListener("click", () => {
    if(count === 0){
        imgContainerParagraph.innerHTML = `No images to clear.`;
        imgContainerParagraph.style.display = "block";
        imgContainerParagraph.style.color = "white";
        imgContainerParagraph.style.backgroundColor = "#c1121f";
        turnOff(trashBtn);
        return;
    }
    trashBtn.classList.remove("off");
    clearOptionsContainer.classList.toggle("open");
    trashChevronDownIcon.classList.toggle("open");
})

clearCurrent.addEventListener("click", () => {
    // Delete current image from HTML
    currentImg = imgArray[currentIndex];
    currentImg.remove();
    
    // Remove current image from imgArray
    imgArray = clearIndex(imgArray, currentIndex);
    collapseImgContainer(imgArray);
    closeTrashOptions();

    // Update the current index
    currentIndex += 1;
    currentIndex = determineCurrentIndex(currentIndex, 0, imgArray.length-1);

    // Messages
    updateCountMsg(imgArray);
    handleInfoMsgs(status, count);
    if(count === 0){
        imgContainerParagraph.innerHTML = "No images.";
        imgContainerParagraph.style.display = "block";
        imgContainerParagraph.style.color = "white";
        imgContainerParagraph.style.backgroundColor = "#c1121f";
        disableButton(trashBtn);
        disableButton(playBtn);
        disableButton(delayBtn);
        return;
    }
    // Update the displayed image
    displayImg(imgArray[currentIndex]);
    
    function clearIndex(array, indexToClear){
        // Clears the the element in the array at current index.
        array.splice(indexToClear, 1);
        return array;
    }
})



// FUNCTIONS

function displayImg(image){
// Displays image and adds transition.
    image.style.display = "block";
    image.classList.add("active");
}

function canUseAutoPlay(array){
// Checks if the array's length is smaller or equal to 1. If it is, display error message.
// If greater than 1, removes error message if visible, and enables the play button.
    if (array.length <= 1){
        imgContainerParagraph.style.display = "block";
        imgContainerParagraph.style.color = "white";
        imgContainerParagraph.innerHTML = "You need at least 2 images to use autoplay.";
        imgContainerParagraph.style.backgroundColor = "#c1121f";
        disableButton(playBtn);
        return array.length;
    }else{
        displayNone(imgContainerParagraph);
        imgContainerParagraph.style.color = "rgb(30, 30, 30)";
        imgContainerParagraph.style.fontSize = "";
        imgContainerParagraph.innerHTML = "";
        imgContainerParagraph.style.backgroundColor = "";
        enableButton(playBtn);
    }
}

function handleBtnContent(icon1, icon2){
// Checks which icon is displayed on the play button, toggles between them.
    if(icon1.classList.contains("off")){
        turnOn(icon1);
        turnOff(icon2);
        playBtn.innerHTML = `<i id="play" class="gg-play-button"></i><span>Play</span>`;
    }
    else if(icon2.classList.contains("off")){
        turnOn(icon2);
        turnOff(icon1);
        playBtn.innerHTML = `<i id="stop" class="gg-play-stop"></i><span>Stop</span>`;
    }
}

function collapseImgContainer(array){
// Checks if the array is smaller than 1, if it is, collapses the image container, otherwise opens it.
    array.length < 1 ? displayNone(imgContainer) : imgContainer.style.display = "flex";
}

function updateCountMsg(array){
// Updates count message based on the array's length.
    count = array.length;
    count <= 1 ? imgCount.innerHTML = `${count} image` : imgCount.innerHTML = `${count} images`;
}

function handleInfoMsgs(status, count){
// Checks if the autoPlay function is on, displays playing message.
// Sets opacity to 0 if the image count is smaller than 1, otherwise sets opacity to 1. 
    status === true ? playingMsg.style.opacity = 1 : playingMsg.style.opacity = 0;
    status === true ? playingMsg.innerHTML = `Delay set to ${delay / 1000} seconds, playing...` : playingMsg.style.opacity = 0;
    count < 1 ? imgCount.style.opacity = 0 : imgCount.style.opacity = 1;
}

function clearArray(array){
// Checks if each array element is of type "object", removes it from the DOM if it is.
// Sets the array's length to 0 and updates count variable.
    for(let img of array){
        if(typeof img === "object"){
            img.remove();
        }
    }
    array = [];
    return array;
}

function clearInput(input){
// Clears input value.
    input.value = "";
}

function disableButton(button){
// Adds a class that disables a button.
    button.classList.add("disabled");
}

function removePointerEvents(button){
// Removes all pointer events from a button.
    button.style.pointerEvents = "none";
}

function enableButton(button){
// Removes the "disabled" class and adds all pointer events back.
    button.classList.remove("disabled");
    button.style.pointerEvents = "all";
}

function turnOff(element){
// Turns off element.
    element.classList.add("off");
}

function turnOn(element){
// Turns on element.
    element.classList.remove("off");
}

function displayNone(element){
// Sets display none to element.
    element.style.display = "none";
}

function determineCurrentIndex(index, smallestIndex, largestIndex){
// Checks if the index is smaller than 0, set to be the largest index.
    if(index < 0){
        index = largestIndex;
    } else if(index > largestIndex){
        index = smallestIndex;
    }
    return index;
}

function closeTrashOptions(){
    trashChevronDownIcon.classList.remove("open");
    clearOptionsContainer.classList.remove("open");
}

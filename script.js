const buttons = document.querySelectorAll(".btn");
const playBtn = document.querySelector("#autoPlayBtn");
const templateImgsBtn = document.querySelector("#useTemplateImgs");
const addMoreInput = document.querySelector("#addMore");
const playIcon = document.querySelector("#play.gg-play-button");
const stopIcon = document.querySelector("#stop.gg-play-stop");
turnOff(stopIcon);
const trashBtn = document.querySelector("#trashBtn");
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
        displayNone(imgArray[i]);
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
    checkArrayLength(imgArray);
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
            disableButton(trashBtn);
            removePointerEvents(trashBtn);
            handleInfoMsgs(autoPlayStatus, count);
            return autoPlay = setInterval(function(){
                imgArray.push(imgArray.shift());
                for(let i = 0; i < imgArray.length; i++){
                    displayNone(imgArray[i]);
                    imgArray[0].style.display = "block";
                    imgArray[0].style.animation = `${delay / 1000}s scale, fadeIn 2s`;
                }
                }, delay);
        }
        if(autoPlayStatus === true){
            autoPlayStatus = false;
            enableButton(trashBtn);
            trashBtn.style.pointerEvents = "all";
            clearInterval(autoPlay);
            for(let i = 0; i < imgArray.length; i++){
                displayNone(imgArray[i]);
                imgArray[i].style.animation = "";
            }
            imgArray[0].style.display = "block";
            handleInfoMsgs(autoPlayStatus, count);
            chevronLeft.style.display = "";
            chevronRight.style.display = "";
        }
        return;
    }
    
});

addMoreInput.addEventListener("change", () => {
    trashBtn.style.display = "flex";
    playBtn.style.display = "flex";
        for(let i = 0; i < imgArray.length; i++){
            turnOff(imgArray[i]);
            imgArray[i].classList.remove("active");
        }
        for (let i = 0; i < addMoreInput.files.length; i++){
            let img = document.createElement("img");
            img.src = URL.createObjectURL(addMoreInput.files[i]);
            img.onload = () => {
                URL.revokeObjectURL(this.src);
                imgContainer.appendChild(img);
                collapseImgContainer(imgArray);
            }
            displayNone(imgContainerParagraph);
            imgContainer.style.backgroundColor = "rgb(30, 30, 30)";
            imgArray.push(img);
        }
        for(let i = 0; i < imgArray.length; i++){
            displayNone(imgArray[i]);
            imgArray[i].classList.remove("active");
        }
        imgArray[0].style.display = "block";
        imgArray[0].classList.toggle("active");
        enableButton(trashBtn);
        updateCount(imgArray);
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
    displayImg(currentIndex + 1);
    
})

chevronLeft.addEventListener("click", () => {
    if(imgArray.length === 1){return;}
    for(let i = 0; i < imgArray.length; i++){
        displayNone(imgArray[i]);
        imgArray[i].classList.remove("active");
    }
    displayImg(currentIndex - 1);
})

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

trashBtn.addEventListener("click", () => {
    updateCount(imgArray);
    disableButton(playBtn);
    disableButton(delayBtn);
    disableButton(trashBtn);
    if(count === 0){
        imgContainerParagraph.innerHTML = "No images to clear.";
        imgContainerParagraph.style.display = "block";
        imgContainerParagraph.style.color = "white";
        imgContainerParagraph.style.backgroundColor = "#c1121f";
        disableButton(trashBtn);
        return;
    }
    clearArray(imgArray);
    updateCount(imgArray);
    handleInfoMsgs(status, count);
    collapseImgContainer(imgArray);
})

setDelayBtn.addEventListener("click", () => {
    delay = delayInput.value;
    delay < 2 ? delay = 2 : delay;
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
        disableButton(trashBtn);
        removePointerEvents(trashBtn);
        for(let i = 0; i < imgArray.length; i++){
            displayNone(imgArray[i]);
            imgArray[i].style.animation = "";
        }
        imgArray[0].style.display = "block";
        handleInfoMsgs(autoPlayStatus, count);
        chevronLeft.style.display = "";
        chevronRight.style.display = "";
    }
})


// FUNCTIONS

function displayImg(i){
    if(i >= imgArray.length){i = 0;}
    if(i < 0){i = imgArray.length - 1;}
    
    imgArray[currentIndex].classList.remove("active");
    displayNone(imgArray[currentIndex]);
    imgArray[i].style.display = "block";
    imgArray[i].classList.add("active");

    currentIndex = i;
}

function checkArrayLength(array){
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
    array.length < 1 ? displayNone(imgContainer) : imgContainer.style.display = "flex";
}

function updateCount(array){
    count = array.length;
    count <= 1 ? imgCount.innerHTML = `${count} image` : imgCount.innerHTML = `${count} images`;
}

function handleInfoMsgs(status, count){
    status === true ? playingMsg.style.opacity = 1 : playingMsg.style.opacity = 0;
    status === true ? playingMsg.innerHTML = `Delay set to ${delay / 1000} seconds, playing...` : playingMsg.style.opacity = 0;
    count < 1 ? imgCount.style.opacity = 0 : imgCount.style.opacity = 1;
}

function clearArray(array){
    for(let img of array){
        if(typeof img === "object"){
            img.remove();
        }
    }
    array.length = 0;
    count = array.length;
}

function clearInput(input){
    input.value = "";
}

function disableButton(button){
    button.classList.add("disabled");
}

function removePointerEvents(button){
    button.style.pointerEvents = "none";
}

function enableButton(button){
    button.classList.remove("disabled");
    button.style.pointerEvents = "all";
}

function turnOff(element){
    element.classList.add("off");
}

function turnOn(element){
    element.classList.remove("off");
}

function displayNone(element){
    element.style.display = "none";
}
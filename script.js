const buttons = document.querySelectorAll(".btn");
const playBtn = document.querySelector("#autoPlayBtn");
const templateImgsBtn = document.querySelector("#useTemplateImgs");
const addMoreInput = document.querySelector("#addMore");
const playIcon = document.querySelector("#play.gg-play-button");
const stopIcon = document.querySelector("#stop.gg-play-stop");
stopIcon.classList.add("off");
const trashBtn = document.querySelector("#trashBtn");
const imgContainer = document.querySelector(".img-container");
const chevronLeft = document.querySelector(".chevronBox.left");
const chevronRight = document.querySelector(".chevronBox.right");
const zoomIn = document.querySelector(".chevronBox.zoom-in");
const zoomOut = document.querySelector(".chevronBox.zoom-out");
zoomOut.classList.add("disabled");
const infoContainer = document.querySelector("#infoContainer");
const imgCount = document.querySelector("#imgCount");
let count = 0;
imgCount.innerHTML = `${count} images`;
const playingMsg = document.querySelector("#playing");
const imgContainerParagraph = document.querySelector("#imgContainerParagraph");
let imgArray = [];
// let templateImgs = [];
let currentIndex = 0;
let autoPlayStatus = false;
let autoPlay = setInterval(function(){
    imgArray.push(imgArray.shift());
    for(let i = 0; i < imgArray.length; i++){
        imgArray[i].style.display = "none";
        imgArray[0].style.display = "block";
        imgArray[0].style.animation = "5s scale, fadeIn 2s";
    }
    }, 5000);

clearInterval(autoPlay);
collapseImgContainer(imgArray);
handleInfoMsgs(autoPlayStatus, count);
count === 0 ? trashBtn.style.display = "none" : trashBtn.style.display = "flex";
count === 0 ? playBtn.style.display = "none" : playBtn.style.display = "flex";


    


// EVENT LISTENERS

playBtn.addEventListener("click", () =>{
    checkArrayLength(imgArray);
    if(imgArray.length > 1){
        handleBtnContent(playIcon, stopIcon);
        if(autoPlayStatus === false){
            chevronLeft.style.display = "none";
            chevronRight.style.display = "none";
            autoPlay = function(){
                imgArray.push(imgArray.shift());
                for(let i = 0; i < imgArray.length; i++){
                    imgArray[i].style.display = "none";
                    imgArray[0].style.display = "block";
                    imgArray[0].style.animation = "5s scale, fadeIn 2s";
                }
                };
            autoPlayStatus = true;
            handleInfoMsgs(autoPlayStatus, count);
            return autoPlay = setInterval(function(){
                imgArray.push(imgArray.shift());
                for(let i = 0; i < imgArray.length; i++){
                    imgArray[i].style.display = "none";
                    imgArray[0].style.display = "block";
                    imgArray[0].style.animation = "5s scale, fadeIn 2s";
                }
                }, 5000);
        }
        if(autoPlayStatus === true){
            autoPlayStatus = false;
            clearInterval(autoPlay);
            for(let i = 0; i < imgArray.length; i++){
                imgArray[i].style.display = "none";
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
            imgArray[i].style.display = "none";
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
            imgContainerParagraph.style.display = "none";
            imgContainer.style.backgroundColor = "rgb(30, 30, 30)";
            imgArray.push(img);
        }
        for(let i = 0; i < imgArray.length; i++){
            imgArray[i].style.display = "none";
            imgArray[i].classList.remove("active");
        }
        imgArray[0].style.display = "block";
        imgArray[0].classList.toggle("active");
        trashBtn.classList.remove("disabled");
        updateCount(imgArray);
        handleInfoMsgs(status, count);
        count > 1 ? playBtn.classList.remove("disabled") : playBtn.classList.add("disabled");
})

chevronRight.addEventListener("click", () => {
    if(imgArray.length === 1){return;}
    for(let i = 0; i < imgArray.length; i++){
        imgArray[i].style.display = "none";
        imgArray[i].classList.remove("active");
    }
    displayImg(currentIndex + 1);
    
})

chevronLeft.addEventListener("click", () => {
    if(imgArray.length === 1){return;}
    for(let i = 0; i < imgArray.length; i++){
        imgArray[i].style.display = "none";
        imgArray[i].classList.remove("active");
    }
    displayImg(currentIndex - 1);
})

zoomIn.addEventListener("click", () => {
    imgContainer.classList.toggle("expanded");
    infoContainer.classList.toggle("expanded");
    zoomIn.classList.add("disabled");
    zoomOut.classList.remove("disabled");
})

zoomOut.addEventListener("click", () => {
    imgContainer.classList.toggle("expanded");
    infoContainer.classList.toggle("expanded");
    zoomIn.classList.remove("disabled");
    zoomOut.classList.add("disabled");
})

trashBtn.addEventListener("click", () => {
    updateCount(imgArray);
    playBtn.classList.add("disabled");
    if(count === 0){
        imgContainerParagraph.innerHTML = "No images to clear.";
        imgContainerParagraph.style.display = "block";
        imgContainerParagraph.style.color = "white";
        imgContainerParagraph.style.backgroundColor = "#c1121f";
        trashBtn.classList.add("disabled");
        return;
    }
    clearArray(imgArray);
    updateCount(imgArray);
    handleInfoMsgs(status, count);
    collapseImgContainer(imgArray);
    count === 0 ? trashBtn.classList.add("disabled") : trashBtn.classList.remove("disabled");
    
})



// FUNCTIONS

function displayImg(i){
    if(i >= imgArray.length){i = 0;}
    if(i < 0){i = imgArray.length - 1;}
    
    imgArray[currentIndex].classList.remove("active");
    imgArray[currentIndex].style.display = "none";
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
        playBtn.classList.add("disabled");
        return array.length;
    }else{
        imgContainerParagraph.style.display = "none";
        imgContainerParagraph.style.color = "rgb(30, 30, 30)";
        imgContainerParagraph.style.fontSize = "";
        imgContainerParagraph.innerHTML = "";
        imgContainerParagraph.style.backgroundColor = "";
        playBtn.classList.remove("disabled");
    }
}

function handleBtnContent(icon1, icon2){
    if(icon1.classList.contains("off")){
        icon1.classList.remove("off");
        icon2.classList.add("off");
        playBtn.innerHTML = `<i id="play" class="gg-play-button"></i><span>Play</span>`;
    }
    else if(icon2.classList.contains("off")){
        icon2.classList.remove("off");
        icon1.classList.add("off");
        playBtn.innerHTML = `<i id="stop" class="gg-play-stop"></i><span>Stop</span>`;
    }
}

function collapseImgContainer(array){
    array.length < 1 ? imgContainer.style.display = "none" : imgContainer.style.display = "flex";
}

function updateCount(array){
    count = array.length;
    count <= 1 ? imgCount.innerHTML = `${count} image` : imgCount.innerHTML = `${count} images`;
}

function handleInfoMsgs(status, count){
    status === true ? playingMsg.style.opacity = 1 : playingMsg.style.opacity = 0;
    status === true ? playingMsg.innerHTML = "Playing..." : playingMsg.style.opacity = 0;
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
function toggleSidebar() {
    const sidebar = document.getElementById("mySidebar");
    const main = document.getElementById("main");
    const btn = document.getElementById("main");

    if (sidebar.style.width === "250px") {
        sidebar.style.width = "0";
        main.style.marginLeft = "0";
    }
    else{
        sidebar.style.width = "250px";
        main.style.marginLeft = "250px";
    }
    btn.addEventListener("click", () => {
    });
    btn.classList.toggle("sticky");
}

//step 1: get DOM
let nextDom = document.getElementById('next');
let prevDom = document.getElementById('prev');

let slideDom = document.querySelector('.slide');
let SliderDom = slideDom.querySelector('.slide .list');
let thumbnailBorderDom = document.querySelector('.slide .thumbnail');
let thumbnailItemsDom = thumbnailBorderDom.querySelectorAll('.item');
let timeDom = document.querySelector('.slide .time');

thumbnailBorderDom.appendChild(thumbnailItemsDom[0]);
let timeRunning = 3000;
let timeAutoNext = 7000;

nextDom.onclick = function () {
    showSlider('next');
}

prevDom.onclick = function () {
    showSlider('prev');
}

let runTimeOut;
let runNextAuto = setTimeout(() => { next.click(); }, timeAutoNext)

function showSlider(type) {
    let SliderItemsDom = SliderDom.querySelectorAll('.slide .list .item');
    let thumbnailItemsDom = document.querySelectorAll('.slide .thumbnail .item');

    if (type === 'next') {
        SliderDom.appendChild(SliderItemsDom[0]);
        thumbnailBorderDom.appendChild(thumbnailItemsDom[0]);
        slideDom.classList.add('next');
    } else {
        SliderDom.prepend(SliderItemsDom[SliderItemsDom.length - 1]);
        thumbnailBorderDom.prepend(thumbnailItemsDom[thumbnailItemsDom.length - 1]);
        slideDom.classList.add('prev');
    }
    clearTimeout(runTimeOut);
    runTimeOut = setTimeout(() => {
        slideDom.classList.remove('next');
        slideDom.classList.remove('prev');
    }, timeRunning);

    clearTimeout(runNextAuto);
    runNextAuto = setTimeout(() => {
        next.click();
    }, timeAutoNext)
}


// Code for gallery


function showGallery(type) {
    let gallery = document.getElementById("gallery");
    gallery.innerHTML = ""; // Clear old images

    let images = [];

    if (type === "classroom") {
        images = [
            "images/classroom1.jpg",
            "images/classroom2.jpg",
            "images/classroom3.jpg",
            "images/classroom4.jpg",
            "images/classroom5.jpg",
            "images/classroom6.jpg"
        ];
    } else if (type === "hostel") {
        images = [
            "images/hostel1.jpg",
            "images/hostel2.jpg",
            "images/hostel3.jpg",
            "images/hostel4.jpg",
            "images/hostel5.jpg",
            "images/hostel6.jpg"
        ];
    } else if (type === "playground") {
        images = [
            "images/playground1.jpg",
            "images/playground2.jpg",
            "images/playground3.jpg",
            "images/playground4.jpg",
            "images/playground5.jpg",
            "images/playground6.jpg"
        ];
    }
    else if (type === "labs") {
        images = [
            "images/labs1.jpg",
            "images/labs2.jpg",
            "images/labs3.jpg",
            "images/labs4.jpg",
            "images/labs5.jpg",
            "images/labs6.jpg"
        ];
    }
    else if (type === "events") {
        images = [
            "images/event1.jpg",
            "images/event2.jpg",
            "images/event3.jpg",
            "images/event4.jpg",
            "images/event5.jpg",
            "images/event6.jpg"
        ];
    }
    else if (type === "close") {
        text = [
            "Thank You"
        ]
    }

    // Add images to gallery
    images.forEach(img => {
        let imageElement = document.createElement("img");
        imageElement.src = img;
        gallery.appendChild(imageElement);
    });
}



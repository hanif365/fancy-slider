const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
// selected image 
let sliders = [];


// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

// show images 
const showImages = (images) => {
    imagesArea.style.display = 'block';
    gallery.innerHTML = '';
    // show gallery title
    galleryHeader.style.display = 'flex';
    images.forEach(image => {
        let div = document.createElement('div');
        div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
        div.innerHTML = ` <img id="image-select" class="img-fluid img-thumbnail" onclick="selectItem(event,'${image.webformatURL}')" src="${image.webformatURL}" alt="${image.tags}">`;
        gallery.appendChild(div);
    })

}

const getImages = (query) => {
    fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`)
        .then(response => response.json())
        .then(data => {
            // console.log(data);
            console.log(data.hits);
            // showImages(data.hitS); (1)Error occur here.
            showImages(data.hits);
        })
        .catch(err => console.log(err));
}

let slideIndex = 0;
const selectItem = (event, img) => {
    let element = event.target;
    element.classList.add('added');
    // element.classList.toggle('added');

    let item = sliders.indexOf(img);
    console.log(item);
    if (item === -1) {
        // sliders.push(img);
        sliders.push(img);
        // element.classList.add('added');

    } else {
        // alert('Hey, Already added !');
        // sliders.pop(img);
        sliders.pop(img);
        element.classList.remove('added');
    }


}
var timer;
const createSlider = () => {
    // check slider image length
    console.log(sliders.length);
    if (sliders.length < 2) {
        alert('Select at least 2 image.');
        return;
    }
    // create slider previous next area
    sliderContainer.innerHTML = '';
    const prevNext = document.createElement('div');
    prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
    prevNext.innerHTML = ` 
        <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
        <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
    `;

    sliderContainer.appendChild(prevNext);
    document.querySelector('.main').style.display = 'block';
    // hide image aria
    imagesArea.style.display = 'none';
    // const duration = document.getElementById('duration').value || 1000;     here we ignore negative value of duration using Math.abs(); (3) number error solved.  
    // const duration = Math.abs(document.getElementById('duration').value) || 1000;
    let duration;
    let time = document.getElementById('duration').value;
    if (time < 1000) {
        duration = 1000;        // Set minimum duration 1000ms. here we also ignore negative value of duration.
    }
    else {
        duration = time;        // If duration given more than 1000ms then it will be apply.
    }
    console.log(duration);
    sliders.forEach(slide => {
        let item = document.createElement('div')
        item.className = "slider-item";
        item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
        sliderContainer.appendChild(item)
    })
    changeSlide(0)
    timer = setInterval(function () {
        slideIndex++;
        changeSlide(slideIndex);
    }, duration);
}

// change slider index 
const changeItem = index => {
    changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

    const items = document.querySelectorAll('.slider-item');
    if (index < 0) {
        slideIndex = items.length - 1
        index = slideIndex;
    };

    if (index >= items.length) {
        index = 0;
        slideIndex = 0;
    }

    items.forEach(item => {
        item.style.display = "none"
    })

    items[index].style.display = "block"
}

searchBtn.addEventListener('click', function () {
    document.querySelector('.main').style.display = 'none';
    clearInterval(timer);
    // setInterval(timer);
    const search = document.getElementById('search');
    console.log('value',search.value);
    if(search.value == ""){
        errorControl2();
        // console.log("pleade enter a name");
    }
    else{
        getImages(search.value);
    }
    // getImages(search.value);
    sliders.length = 0;
})

sliderBtn.addEventListener('click', function () {
    createSlider()
})



// New code added


// Trigger the button's click event when the Enter key is pressed inside the text box.
document.getElementById('search').addEventListener("keypress", function (event) {
    if (event.key === 'Enter') {
        document.getElementById('search-btn').click();
    }
});

document.getElementById('duration').addEventListener("keypress", function (event) {
    if (event.key === 'Enter') {
        document.getElementById('create-slider').click();
    }
});


// Error handling

const errorControl2 = () => {  // Show error message(when input field is empty and search button clicked) which was hide using css.
    document.getElementById('error-message2').style.display = "block";
}

const errorClose = () => {        // Hide error message section when clicked close button.
    document.getElementById('error-message2').style.display = "none";
}




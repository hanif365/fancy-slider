const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');

let sliders = [];


const KEY = '15674931-a9d714b6e9d654524df198e00&q';     // API key

// show images 
const showImages = (images) => {
    imagesArea.style.display = 'block';     // hide image container.
    gallery.innerHTML = '';
    if (images == "") {                     // if search value is unavailable , then function call to show error message.
        document.getElementById('images-container').style.display = "none";  // if error occur then image container will hidden.
        errorControl1();
    }

    galleryHeader.style.display = 'flex';
    images.forEach(image => {
        let div = document.createElement('div');
        div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';     // add class in above div.
        div.innerHTML = ` <img id="image-select" class="img-fluid img-thumbnail" onclick="selectItem(event,'${image.webformatURL}')" src="${image.webformatURL}" alt="${image.tags}">`;     // when click these image another function call
        gallery.appendChild(div);
    })
    toggleSpinner();    // After loading data successfully searching spinner will hidden.

}

const getImages = (query) => {
    toggleSpinner();    // Function call to show loading spinner.

    fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`)      // fetch API to get data
        .then(response => response.json())      // to get data in JSON format
        .then(data => {
            showImages(data.hits);      // Function call for go to next step
        })
        .catch(err => errorControl1());
}

const toggleSpinner = (showSpinner) => {
    const spinner = document.getElementById('spinner');                     // spinner show in toggle way.
    const imagesContainer = document.getElementById('images-container');
    spinner.classList.toggle('d-none');                                     // add and remove d-none class and that's way
    imagesContainer.classList.toggle('d-none');                             // show and hidden spinner and images container
}                                                                           // when function call.

let slideIndex = 0;
const selectItem = (event, img) => {
    let element = event.target;
    let item = sliders.indexOf(img);

    if (item == -1) {                       // if value of item equal to -1 that means, it is not select for the slider  
        sliders.push(img);                  // still now  and then it will be add to the slider when clicked this image.
        element.classList.add('added');
    }
    else {                                  // if value of item is not equal to -1 that means, it is selected and when
        sliders.splice(item, 1);            // clicked this image again it will be deselect from the slider list.
        element.classList.remove('added');
    }
}

var timer;
const createSlider = () => {
    if (sliders.length < 2) {               // We consider, at list two images for create slider.
        alert('Select at least 2 image.'); // if slider length less then 2 then an alert show in the screen and return function.
        return;
    }

    sliderContainer.innerHTML = '';
    const prevNext = document.createElement('div');
    prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
    prevNext.innerHTML = ` 
        <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
        <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
    `;      // create previous and next arrow indicator using template string.

    sliderContainer.appendChild(prevNext);
    document.querySelector('.main').style.display = 'block';
    // hide image aria
    imagesArea.style.display = 'none';

    let duration;
    let time = document.getElementById('duration').value;
    if (time < 1000) {
        duration = 1000;        // Set minimum duration 1000ms. here we also ignore negative value of duration.
    }
    else {
        duration = time;        // If duration given more than 1000ms then it will be apply.
    }

    sliders.forEach(slide => {
        let item = document.createElement('div');
        item.className = "slider-item";
        item.innerHTML = `
            <div class = "slider-text">    
                <h1>Headline goes here</h1>
                <p>Some Dummy Text goes here</p>
            </div>
            <img class="w-100" src="${slide}" alt="image-show">
            
        `;          // Create slider image and text using template string.
        sliderContainer.appendChild(item);      // Append item to slider container.
    })
    changeSlide(0);                         // set time to change the slide.
    timer = setInterval(function () {
        slideIndex++;
        changeSlide(slideIndex);
    }, duration);
}

// change slider index 
const changeItem = index => {
    changeSlide(slideIndex += index);       //e.g.,  x+=1 equivalent to x = x + 1;
}

// change slide item
const changeSlide = (index) => {
    const items = document.querySelectorAll('.slider-item');
    if (index < 0) {
        slideIndex = items.length - 1       // if index less than 0 items.length will be decreased by 1.
        index = slideIndex;                 // Assign slideIndex to index.
    };

    if (index >= items.length) {
        index = 0;
        slideIndex = 0;
    }

    items.forEach(item => {                 // when one slide show then another slide hidden.
        item.style.display = "none"
    })

    items[index].style.display = "block"
}

searchBtn.addEventListener('click', function () {       // Get search field value when search button clicked.

    document.querySelector('.main').style.display = 'none';     // Slider container display hidden.
    clearInterval(timer);
    const search = document.getElementById('search');
    if (search.value == "") {                           // if search value empty then show an error message.
        document.getElementById('images-container').style.display = "none";
        errorControl2();                                // function call to show error message.
    }
    else {
        getImages(search.value);                        // if value is not empty then another function call
    }
    sliders.length = 0;

    document.getElementById('search').value = "";       // After clicked search button, value(text) of search field will empty.

    document.getElementById('search').addEventListener('click', function () {   // when clicked search button, slider container
        document.getElementById('slider-container').style.display = "none";     // section will be hidden.
    })
})

sliderBtn.addEventListener('click', function () {
    createSlider()
})

// Trigger the button's click event when the Enter key is pressed inside the text box and duration box.
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
const errorControl1 = () => {   // show error message (when search image is not found) which was hide using custom CSS.
    document.getElementById('error-message1').style.display = "block";
}

const errorControl2 = () => {  // Show error message(when input field is empty and search button clicked) which was hide using css.
    document.getElementById('error-message2').style.display = "block";
}

const errorClose = () => {        // Hide error message section when clicked close button.
    document.getElementById('error-message2').style.display = "none";
    document.getElementById('error-message1').style.display = "none";
}

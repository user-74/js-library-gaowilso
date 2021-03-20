// ----------------------------------------------------------------
// funloader.js for CSC309 individual project winter 2021
// by: Wilson Gao
// utorid/markus: gaowilso
// ----------------------------------------------------------------

// to log things easily
const log = console.log


// just a function to test if things work
function logDate(){
    log(
        (new Date().getDate()).toString() + "/" +
        (new Date().getMonth() + 1).toString() + "/" +
        (new Date().getFullYear()).toString()
    );
}

// loader function
function funLoader(){
    // code for loading screen

    // test that it's loaded in correctly, logs the current date.

    // code
}

// puts in a default loading bar
function basicLoadingBar(){
    log("starting basic loading bar")
    loadSomething();
}

// this is mostly just used for demonstration purposes
function loadSomething(){
    let progress_width = 25
    let percentage = 5

    let id = setInterval(() => {
        if (progress_width == 500 && percentage == 100){
            clearInterval(id)
        }
        progress_width += 5
        percentage += 1
        log(percentage + "% done")
    }, 100);
}
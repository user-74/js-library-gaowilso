// function to load a random image into the HTML DOM
function createRandomImage(progressBar, amount) {
  const imageBox = document.querySelector(".image-box");

  const image = document.createElement("img");
  image.onload = function () {
    addProgress(progressBar, amount);
  };
  image.src = "https://picsum.photos/200/300/?random&t=" + new Date().getTime();

  imageBox.appendChild(image);
}

// function that generates images and needs a loading bar
async function generateImages() {
  // if (document.querySelector(".progress-bar")) return

  const num = Number(document.querySelector(".textboxImages").value);
  const draggable = document.querySelector("#enableDrag").checked;
  const percent = 100 / num;

  // if the number of images is invalid, stop
  if (!Number.isInteger(num) || num <= 0) return;

  // get a loading bar an
  const progressBar = defaultProgressBar();
  const placement = document.querySelector(".loading-box");
  placement.appendChild(progressBar);

  // makes the loading bar draggable
  if (draggable) makeDraggable(progressBar);
  else {
    progressBar.style.margin = "auto";
    progressBar.style.marginTop = "10px";
  }

  // generate images with a second delay between images, to randomize images
  for (let i = 0; i < num; i++) {
    createRandomImage(progressBar, percent);
    await timer(1000);
  }
}

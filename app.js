const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const output = document.getElementById("barcodeValue");
const context = canvas.getContext("2d");

function startCamera() {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then(stream => {
            video.srcObject = stream;
            video.play();
            scanBarcode();
        })
        .catch(err => console.error("Error accessing camera:", err));
}

function scanBarcode() {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
            output.textContent = code.data;
        } else {
            requestAnimationFrame(scanBarcode);
        }
    } else {
        requestAnimationFrame(scanBarcode);
    }
}

window.addEventListener("load", startCamera);

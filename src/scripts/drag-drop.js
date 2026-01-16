

// Required: prevent browser from opening the image
["dragenter", "dragover"].forEach(event => {
  dropzone.addEventListener(event, e => {
    e.preventDefault();
    dropzone.classList.add("dragover");
  });
});

["dragleave", "drop"].forEach(event => {
  dropzone.addEventListener(event, e => {
    e.preventDefault();
    dropzone.classList.remove("dragover");
  });
});

dropzone.addEventListener("drop", e => {
  const file = e.dataTransfer.files[0];
  if (!file) return;

  // Validate
  if (!file.type.startsWith("image/")) {
    alert("Only images allowed");
    return;
  }
  // Preview
  const url = URL.createObjectURL(file);
  fileDrop = file;
  preview.querySelector("img").src = url;
  preview.querySelector("p").textContent = file.name;
  console.log("File dropped:", fileDrop);
});



function resetDropzone() {
  preview.querySelector("img").src = "";
  preview.querySelector("p").textContent = "";
}

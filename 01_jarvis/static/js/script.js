// 
document.addEventListener("DOMContentLoaded", async () => {
  const recordingIndicator = document.getElementById("recordingIndicator");
  const startButton = document.getElementById("startButton");
  const stopButton = document.getElementById("stopButton");
  const stopTranslationButton = document.getElementById(
    "stopTranslationButton"
  );

  let mediaRecorder;
  let recordedChunks = [];
  let translationInProgress = false;
  let abortController = new AbortController(); // Added to manage fetch requests

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) recordedChunks.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(recordedChunks, { type: "audio/webm" });
      const formData = new FormData();
      formData.append("audio", audioBlob);

      try {
        translationInProgress = true;
        stopTranslationButton.style.display = "block";

        const response = await fetch("/process-audio", {
          method: "POST",
          body: formData,
          signal: abortController.signal, // Connect the fetch request to the AbortController
        });

        if (response.ok) {
          console.log("Audio Uploaded Successfully");

          const returnedBlob = await response.blob();
          const returnedURL = URL.createObjectURL(returnedBlob);
          new Audio(returnedURL).play();
        } else {
          console.log("Server error:", response.statusText);
        }
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Translation process was aborted.");
        } else {
          console.log("Upload failed", error);
        }
      } finally {
        translationInProgress = false;
        stopTranslationButton.style.display = "none";
      }
    };

    startButton.addEventListener("click", () => {
      startButton.style.display = "none";
      stopButton.style.display = "block";
      if (mediaRecorder.state === "inactive") {
        mediaRecorder.start();
        recordingIndicator.style.display = "block";
        recordedChunks = [];
      }
    });

    stopButton.addEventListener("click", () => {
      stopButton.style.display = "none";
      startButton.style.display = "block";
      if (mediaRecorder.state === "recording") {
        mediaRecorder.stop();
        recordingIndicator.style.display = "none";
      }
    });

    stopTranslationButton.addEventListener("click", () => {
      if (translationInProgress) {
        abortController.abort(); // Abort the fetch request
        translationInProgress = false;
        stopTranslationButton.style.display = "none";
      }
    });
  } catch (error) {
    console.log("Failed to get media", error);
  }
});

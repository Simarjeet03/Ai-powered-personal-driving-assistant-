// Start webcam
let faceDetector, camera;
function startCamera() {
    const video = document.getElementById('video');
    const stopButton = document.getElementById('stopButton');

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;
            stopButton.style.display = 'inline'; // Show stop button
        })
        .catch(err => {
            console.error("Camera error:", err);
            alert("Unable to access camera.");
        });
}

// Stop webcam
function stopCamera() {
    const video = document.getElementById('video');
    const stopButton = document.getElementById('stopButton');

    const stream = video.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop()); // Stop all tracks

    video.srcObject = null; // Clear the video stream
    stopButton.style.display = 'none'; // Hide stop button
}
// Voice Assistant using Web Speech API
function speakInstructions() {
    const message = new SpeechSynthesisUtterance(
        "Alright...     Let's get you ready to drive like a pro. I'm right here with you, okay ? We'll take it step by step  no rush , no pressure . Just like a chill , helpful instructor sitting next to you . Here we go:"
        + " Step 1: Settle in — The Cockpit Drill Alright, hmm... First things first, let's get comfy. Adjust your seat so your legs can press the pedals without stretching. Done? Good. Now adjust the mirrors—rearview, then both sides. You should see a bit of your car and the road. Nice. Buckle up, of course. deep breath Alright, ready?"
        + " Step 2: Starting the Engine Insert the key... or press the button if it's push-start. Hmm, before that—make sure you're in neutral (for manual) or 'P' (park) if it's automatic. Now, press the brake... and start the car. There you go. That little hum of the engine? That's your new buddy."
        + " Step 3: Understanding the Controls Take a sec to feel the steering wheel... smooth, right? Check the indicators—left... and right. Try the wipers once. See how responsive your car is. Get a feel for it. You're in control here. calm exhale"
        + " Step 4: The Gear Shift If you're in a manual, let's get familiar with the gear stick. First gear is up and to the left. Try it out. If it's automatic, just remember 'D' for drive. Easy peasy. Now, let's practice shifting gears smoothly. No rush."
        + " Step 5: The Pedals Alright, let's talk pedals. Left is clutch (manual), middle is brake, and right is accelerator. Press the brake gently... feel that? Now, if you're in a manual, press the clutch too. Ready to move?"

    );
    message.lang = 'en-US';
    window.speechSynthesis.speak(message);
}
function stopInstruction() {
    // Cancels any ongoing speech
    if (window.speechSynthesis.speaking || window.speechSynthesis.paused) {
      window.speechSynthesis.cancel();
      console.log("Speech stopped.");
    }
  }
  let currentUtterance = null;

  function speakInstruction(text) {
    // Cancel if already speaking something else
    if (speechSynthesis.speaking || speechSynthesis.paused) {
      speechSynthesis.cancel();
    }
  
    currentUtterance = new SpeechSynthesisUtterance(text);
    currentUtterance.rate = 1;
    speechSynthesis.speak(currentUtterance);
  }
  
  function toggleInstruction() {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause(); // Pause if it's speaking
      console.log("Speech paused.");
    } else if (speechSynthesis.paused) {
      speechSynthesis.resume(); // Resume if it was paused
      console.log("Speech resumed.");
    }
  }
    
// chatbot
  function openVideo() {
    alert("You clicked the video icon!");
    // Or toggle a video/chat window here
  }

//levels
function completeLevel(level) {
    localStorage.setItem(`level${level}`, 'complete');
    updateLevels();
}

const TOTAL_LEVELS = 50;

function generateLevels() {
  const container = document.getElementById('levelContainer');
  container.innerHTML = '';

  for (let i = 1; i <= TOTAL_LEVELS; i++) {
    const levelDiv = document.createElement('div');
    levelDiv.className = 'level';
    levelDiv.id = `level${i}`;

    const title = document.createElement('p');
    title.innerText = `Level ${i}: Skill ${i}`;

    const button = document.createElement('button');
    button.innerText = 'Attempt Level';
    button.onclick = () => attemptLevel(i);

    levelDiv.appendChild(title);
    levelDiv.appendChild(button);
    container.appendChild(levelDiv);
  }

  updateLevels();
}

function updateLevels() {
    let allComplete = true;
  
    for (let i = 1; i <= TOTAL_LEVELS; i++) {
      const levelDiv = document.getElementById(`level${i}`);
      const status = localStorage.getItem(`level${i}`);
      const button = levelDiv.querySelector('button');
  
      if (status === 'complete') {
        levelDiv.classList.add('completed');
        button.innerText = 'Completed';
        button.disabled = true;
      } else {
        levelDiv.classList.remove('completed');
        button.disabled = i === 1 ? false : localStorage.getItem(`level${i - 1}`) !== 'complete';
        allComplete = false;
      }
    }
  
    document.getElementById('progressMessage').innerText = allComplete
      ? "🎉 All levels complete! You’re eligible for license registration."
      : "Complete all levels to qualify for your license.";
  }  



// Call update when page loads
window.onload = updateLevels;

// attemptLevel function to handle level attempts
let badAttempts = 0;

function attemptLevel(level) {
    if (level > 1 && localStorage.getItem(`level${level - 1}`) !== 'complete') {
        alert(`⚠️ You must complete Level ${level - 1} first.`);
        return;
    }

    // Simulate evaluation (can be replaced with real detection later)
    const passed = simulateEvaluation();

    if (passed) {
        completeLevel(level);
    } else {
        badAttempts++;
        if (badAttempts >= 2) {
            lockProgressAndRecommendSupport();
        } else {
            alert(`🚧 You didn’t meet the criteria for Level ${level}. Try again. 🚫 You've failed multiple levels. Please consider booking a human instructor for personalized help.`);
        }
    }
}

function simulateEvaluation() {
    // Simulate a pass/fail — 70% chance to pass
    return Math.random() > 0.3;
}

function lockProgressAndRecommendSupport() {
    document.querySelectorAll('.level button').forEach(btn => {
        btn.disabled = true;
    });
    document.getElementById("supportMessage").innerText =
        "🚫 You've failed multiple levels. Please consider booking a human instructor for personalized help.";
  }

//disclaimer acceptance
function acceptDisclaimer() {
    const checkbox = document.getElementById('acceptTerms');
    if (checkbox.checked) {
        localStorage.setItem('disclaimerAccepted', 'yes');
        document.getElementById('disclaimerModal').style.display = 'none';
    } else {
        alert("Please accept the terms to proceed.");
    }
}
window.onload = function () {
    updateLevels();
    if (localStorage.getItem('disclaimerAccepted') !== 'yes') {
        document.getElementById('disclaimerModal').style.display = 'flex';
    }
}

// charts
// --- Progress Chart (doughnut) ---
function drawProgressChart() {
    const ctx = document.getElementById('progressChart').getContext('2d');
    const completedCount = Array.from({ length: TOTAL_LEVELS }, (_, i) =>
      localStorage.getItem(`level${i+1}`) === 'complete'
    ).filter(Boolean).length;
    const remaining = TOTAL_LEVELS - completedCount;
  
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Completed', 'Remaining'],
        datasets: [{
          data: [completedCount, remaining],
          backgroundColor: ['#28a745', '#e0e0e0'],
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          title: {
            display: true,
            text: `You’ve completed ${completedCount} of ${TOTAL_LEVELS} levels`
          }
        }
      }
    });
  }
  
  // --- Wave Chart (line) ---
  function drawWaveChart() {
    const ctx = document.getElementById('waveChart').getContext('2d');
    const waveData = {
      labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'], // replace with real dates later
      datasets: [{
        label: 'Consistency Over Time',
        data: [20, 40, 30, 60, 80], // pull from your backend or localStorage as needed
        fill: true,
        tension: 0.4,
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor:   'rgba(153, 102, 255, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'white',
        pointBorderColor: 'rgba(153, 102, 255, 1)',
        pointRadius: 5,
      }]
    };
    new Chart(ctx, {
      type: 'line',
      data: waveData,
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: 'Focus & Accuracy (%)'
            }
          }
        },
        animations: {
          tension: {
            duration: 2000,
            easing: 'easeInOutBounce',
            from: 0.5,
            to: 0.3,
            loop: true
          }
        }
      }
    });
  }
  


// Booking form js
function toggleBookingForm() {
    const form = document.getElementById('bookingForm');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}
function submitBooking(event) {
    event.preventDefault(); // prevent page reload
    const name = document.getElementById('userName').value;
    const date = document.getElementById('bookingDate').value;
    const vehicle = document.getElementById('vehicleType').value;
    // Simulated booking message
    const message = `✅ Booking confirmed for ${name} on ${date} for a ${vehicle}. Our instructor will contact you soon.`;
    document.getElementById('bookingMessage').innerText = message;
    // Reset form
    document.getElementById('bookingForm').reset();
    document.getElementById('bookingForm').style.display = 'none';
}

window.onload = () => {
    updateLevels(); 
    drawProgressChart();
    drawWaveChart();
};

window.onload = function () {
    if (localStorage.getItem('disclaimerAccepted') !== 'yes') {
      document.getElementById('disclaimerModal').style.display = 'flex';
    }
    generateLevels();
    drawProgressChart();   // renders your new chart
    drawWaveChart();
  };
  
//
// Voice Control Module for AI Driving Assistant
// -----------------------------------------------

// 1. Setup Speech Recognition (hotword & command detection)
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.interimResults = false;
recognition.lang = 'en-US';

// 2. Utility: speak with modulation (rate & pitch)
function speak(text, { rate = 1, pitch = 1 } = {}) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate;
  utterance.pitch = pitch;
  utterance.lang = 'en-US';
  window.speechSynthesis.speak(utterance);
}

// 3. Query progress from localStorage
function getProgress() {
  const total = TOTAL_LEVELS;
  const completed = Array.from({ length: total }, (_, i) =>
    localStorage.getItem(`level${i + 1}`) === 'complete'
  ).filter(Boolean).length;
  return { completed, remaining: total - completed };
}

// 4. Handle recognized speech commands
recognition.onresult = event => {
  const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
  console.log('Heard:', transcript);

  // Hotword: "hello" -> greet and report progress
  if (transcript === 'hello') {
    const { completed, remaining } = getProgress();
    speak(
      `Hello sir ! , Good morning , nice to see you again , You have completed ${completed} out of ${TOTAL_LEVELS} levels. ` +
      (remaining > 0 ? `Only ${remaining} to go!` : `Congratulations on finishing all levels!`),
      { rate: 1.1, pitch: 1.2 }
    );
  }

  // Commands: open/close camera
  else if (transcript.includes('open camera') || transcript.includes('start camera')) {
    startCamera();
    speak('Camera started.', { rate: 1, pitch: 1 });
  } else if (transcript.includes('close camera') || transcript.includes('stop camera')) {
    stopCamera();
    speak('Camera stopped.', { rate: 1, pitch: 1 });
  }

  // Query level state: "what is my level" or "level status"
  else if (transcript.includes('level status') || transcript.includes('my level') || transcript.includes('status of level')) {
    // find first incomplete level
    let next = 1;
    while (next <= TOTAL_LEVELS && localStorage.getItem(`level${next}`) === 'complete') next++;
    if (next > TOTAL_LEVELS) {
      speak('All levels are complete. You are ready for license registration!', { rate: 1, pitch: 1 });
    } else {
      speak(`Your next level to complete is Level ${next}. Good luck!`, { rate: 1, pitch: 1 });
    }
  }

  // Commands: voice instructions control
  else if (transcript.includes('start instructions') || transcript.includes('play instructions')) {
    speak('Starting instructions.', { rate: 1, pitch: 1 });
    speakInstructions();
  } else if (transcript.includes('pause')) {
    toggleInstruction();
    speak('Instructions paused.', { rate: 1, pitch: 1 });
  } else if (transcript.includes('resume')) {
    toggleInstruction();
    speak('Resuming instructions.', { rate: 1, pitch: 1 });
  } else if (transcript.includes('stop instructions')) {
    stopInstruction();
    speak('Instructions stopped.', { rate: 1, pitch: 1 });
  }

  // Add more commands as needed
};

// 5. Restart recognition on end
recognition.onend = () => recognition.start();

// 6. Start listening on page load
document.addEventListener('DOMContentLoaded', () => {
  try {
    recognition.start();
    console.log('Voice recognition started');
  } catch (err) {
    console.error('Voice recognition error:', err);
  }
});

//map js
let map;
function initMap() {
  // Optional: try to center on the user's location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
        map = new google.maps.Map(document.getElementById("map"), {
          center: coords,
          zoom: 14
        });
        new google.maps.Marker({ position: coords, map });
      },
      () => createDefaultMap()
    );
  } else {
    createDefaultMap();
  }

  function createDefaultMap() {
    // fallback coords (e.g. New Delhi)
    const defaultCenter = { lat: 28.6139, lng: 77.2090 };
    map = new google.maps.Map(document.getElementById("map"), {
      center: defaultCenter,
      zoom: 12
    });
  }
}
// both camera and map
document.querySelector('a[href="#levels"]').addEventListener("click", () => {
  startCamera();  // your existing function
  // If Maps API is already loaded, initMap() will run; otherwise it will run as callback
  if (window.google && google.maps) initMap();
});
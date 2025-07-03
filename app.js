const axios = require("axios");
const cron = require("node-cron");
const fs = require("fs");
const path = require("path");

function loadSettings() {
  try {
    const settingsPath = path.join(__dirname, "settings.json");
    const settingsData = fs.readFileSync(settingsPath, "utf8");
    return JSON.parse(settingsData);
  } catch (error) {
    console.error("Failed to load settings:", error.message);
    console.log("Using default settings");
    return {
      services: {
        ntfy: {
          enabled: true,
          url: "https://ntfy.vblinden.dev/rest"
        },
        pushover: {
          enabled: false,
          token: "",
          user: ""
        }
      },
      schedule: {
        activeDays: [1, 2, 3, 4, 5],
        startHour: 9,
        endHour: 17
      }
    };
  }
}

const settings = loadSettings();

function shouldSendNotification() {
  const now = new Date();
  const currentDay = now.getDay();
  const currentHour = now.getHours();
  
  const schedule = settings.schedule || { activeDays: [1, 2, 3, 4, 5], startHour: 9, endHour: 17 };
  
  const isDayActive = schedule.activeDays.includes(currentDay);
  const isTimeActive = currentHour >= schedule.startHour && currentHour < schedule.endHour;
  
  return isDayActive && isTimeActive;
}

const exercises = [
  "10-15 bodyweight squats",
  "10 push ups",
  "30 second wall sit",
  "15-20 calf raises",
  "10-15 shoulder blade squeezes",
  "5 neck rolls in each direction",
];

async function sendNtfyNotification(message) {
  if (!settings.services.ntfy.enabled) return;
  
  try {
    await axios.post(settings.services.ntfy.url, message, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        Title: "Exercise Reminder",
        Priority: "default",
        Tags: "muscle,alarm_clock",
      },
    });
    console.log("Ntfy notification sent successfully");
  } catch (error) {
    console.error("Failed to send ntfy notification:", error.message);
  }
}

async function sendPushoverNotification(message) {
  if (!settings.services.pushover.enabled) return;
  
  try {
    const formData = new URLSearchParams();
    formData.append('token', settings.services.pushover.token);
    formData.append('user', settings.services.pushover.user);
    formData.append('message', message);
    formData.append('title', 'Exercise Reminder');
    formData.append('priority', '0');

    await axios.post('https://api.pushover.net/1/messages.json', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    console.log("Pushover notification sent successfully");
  } catch (error) {
    console.error("Failed to send pushover notification:", error.message);
  }
}

async function sendExerciseReminder() {
  try {
    if (!shouldSendNotification()) {
      console.log(`Skipping reminder - outside active schedule at ${new Date().toLocaleString()}`);
      return;
    }

    const message = `Time for your hourly exercise break! 💪\n\n${exercises.map((exercise) => `• ${exercise}`).join("\n")}`;

    await Promise.all([
      sendNtfyNotification(message),
      sendPushoverNotification(message)
    ]);

    console.log(`Exercise reminder sent at ${new Date().toLocaleString()}`);
  } catch (error) {
    console.error("Failed to send exercise reminder:", error.message);
  }
}

cron.schedule("0 * * * *", () => {
  console.log("Running hourly exercise reminder...");
  sendExerciseReminder();
});

console.log(
  "Exercise reminder service started! Reminders will be sent every hour.",
);
console.log("Press Ctrl+C to stop the service.");

sendExerciseReminder();


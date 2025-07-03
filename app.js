const axios = require("axios");
const cron = require("node-cron");

const NTFY_URL = "https://ntfy.vblinden.dev/rest";

const exercises = [
  "10-15 bodyweight squats",
  "10 push ups",
  "30 second wall sit",
  "15-20 calf raises",
  "10-15 shoulder blade squeezes",
  "5 neck rolls in each direction",
];

async function sendExerciseReminder() {
  try {
    const message = `Time for your hourly exercise break! 💪\n\n${exercises.map((exercise) => `• ${exercise}`).join("\n")}`;

    await axios.post(NTFY_URL, message, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        Title: "Exercise Reminder",
        Priority: "default",
        Tags: "muscle,alarm_clock",
      },
    });

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


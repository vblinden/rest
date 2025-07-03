# Rest - Hourly Exercise Reminder Service

> [!NOTE]
> This entire application was created by **Claude (Anthropic's AI assistant)** from scratch! From the initial concept and code implementation to the PM2 configuration and this very README you're reading. Just goes to show what's possible when you ask an AI to help solve a real health problem. Pretty cool, right? 🤖✨

A simple Node.js service that sends hourly exercise reminders to help combat the negative effects of prolonged sitting.

## Why This Was Made

If you're like most people who work at a desk all day, every day, you know how easy it is to get absorbed in your work and forget to move. Sitting for extended periods can lead to:

- Poor posture and back pain
- Reduced circulation
- Muscle stiffness and weakness
- Decreased productivity and focus
- Increased risk of various health issues

This service was created to solve that problem by sending gentle reminders every hour to take a quick exercise break. Just a few minutes of movement can make a significant difference in your physical and mental well-being throughout the day.

## What It Does

The service automatically sends push notifications via [ntfy](https://ntfy.sh/) or [Pushover](https://pushover.net/) every hour with a selection of simple desk exercises you can do right at your workspace:

- 10-15 bodyweight squats
- 10 push ups
- 30 second wall sit
- 15-20 calf raises
- 10-15 shoulder blade squeezes
- 5 neck rolls in each direction

These exercises are designed to be quick, require no equipment, and can be done in most office environments.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create your settings file:
   ```bash
   cp settings.example.json settings.json
   ```

3. Configure your notification services and schedule by editing `settings.json`:
   
   ### For ntfy:
   ```json
   {
     "services": {
       "ntfy": {
         "enabled": true,
         "url": "https://your-ntfy-server.com/your-topic"
       }
     },
     "schedule": {
       "activeDays": [1, 2, 3, 4, 5],
       "startHour": 9,
       "endHour": 17
     }
   }
   ```

   ### For Pushover:
   ```json
   {
     "services": {
       "pushover": {
         "enabled": true,
         "token": "your_app_token_here",
         "user": "your_user_key_here"
       }
     },
     "schedule": {
       "activeDays": [1, 2, 3, 4, 5],
       "startHour": 9,
       "endHour": 17
     }
   }
   ```

   > [!TIP]  
   > **Getting Pushover credentials:**  
   > - Get your app token from https://pushover.net/apps  
   > - Get your user key from your Pushover dashboard

   You can enable both services simultaneously or use just one.

   ### Schedule Configuration:
   - **activeDays**: Array of days when notifications should be sent (0=Sunday, 1=Monday, ..., 6=Saturday)
   - **startHour**: Hour to start sending notifications (24-hour format, e.g., 9 for 9 AM)
   - **endHour**: Hour to stop sending notifications (24-hour format, e.g., 17 for 5 PM)
   
   > [!NOTE]  
   > If no schedule is configured, the service defaults to weekdays (Monday-Friday) from 9 AM to 5 PM.

4. Run the service:
   ```bash
   npm start
   ```

## Running in Background

For continuous operation, use PM2:

```bash
# Install PM2 globally
npm install -g pm2

# Start the service
pm2 start app.js --name "exercise-reminder"

# Configure to start on system boot
pm2 startup
pm2 save
```

## Your Health Matters

Remember: your body is designed to move. Taking regular breaks to exercise isn't just good for your physical health—it can also boost your creativity, improve your mood, and increase your overall productivity. This little service is a simple reminder to take care of yourself while you work.

Stay healthy! 💪
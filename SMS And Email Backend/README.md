## SMS & Email Notification System

### Overview
This Node.js application allows sending **SMS and Email notifications** simultaneously. The frontend provides the recipient's **mobile number, email, and message**, which the backend processes to send notifications via Twilio (SMS) and Nodemailer (Email).

---
### File Structure
```
/sms_email_system
│── /controllers
│   └── notificationController.js  # Handles notification logic
│── /routes
│   └── notificationRoutes.js  # Defines API routes
│── /services
│   ├── emailService.js  # Handles email notifications
│   └── smsService.js  # Handles SMS notifications
│── .env  # Environment variables
│── index.js  # Entry point of the application
│── package.json  # Dependencies and scripts
```

---
### Installation & Setup
#### 1. Clone the repository
```sh
git clone <repository-url>
cd sms_email_system
```
#### 2. Install dependencies
```sh
npm install
```
#### 3. Configure Environment Variables
Create a `.env` file and add:
```
PORT=5000
MONGO_URI=<your_mongo_connection_string>
EMAIL_USER=<your_email>
EMAIL_PASS=<your_email_password>
TWILIO_ACCOUNT_SID=<your_twilio_account_sid>
TWILIO_AUTH_TOKEN=<your_twilio_auth_token>
TWILIO_PHONE_NUMBER=<your_twilio_phone_number>
```
#### 4. Start the server
```sh
node index.js
```

---
### API Endpoints
#### 1. Send Notification
**Endpoint:** `POST /notifications/send`

**Request Body:**
```json
{
  "email": "recipient@example.com",
  "mobile": "+1234567890",
  "message": "Hello, this is a test notification."
}
```
**Response:**
```json
{
  "success": true,
  "message": "Notifications sent successfully."
}
```

---

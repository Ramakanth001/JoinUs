# Problem Statement
Influencers need a direct way to engage their community. This project allows users to subscribe via email and receive updates, ensuring effective communication.

# Simple Feed Web Project

This is a simple web application built using **Node.js**, **Express.js**, **MySQL2**, **EJS**, and **CSS** for the frontend. The project allows users to input their email and see the user count update dynamically.

---

## 🚀 Technologies Used

- **Node.js** - JavaScript runtime used for server-side logic.
- **Express.js** - Framework for building the web server.
- **MySQL2** - Database to store and manage user data.
- **EJS** - Templating engine for rendering dynamic views.
- **CSS** - For styling the frontend.

---

## 💡 Features

- **User Input**: Users can submit their email address via a textbox.
- **Dynamic Count**: The user count updates dynamically every time an email is entered.
- **Responsive Design**: Built with responsive CSS for a user-friendly interface.
- **Secure Database Credentials**: Uses a `.env` file to securely store database credentials, ensuring sensitive data is not hard-coded into the application.

---

## ⚙️ Database Setup

1. **Create a MySQL Database**:
   - Make sure you have MySQL installed and running on your machine.
   - Create a database and table to store user data.

```sql
CREATE DATABASE feed_app;
USE feed_app;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL
);
```

2. **Set up environment variables**:
   - Create a `.env` file in the root directory of the project and add the following database credentials:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=<db_pwd>
DB_DATABASE=<db_name>
```

Make sure to replace `<db_pwd>` with your actual database password and `<db_name>` with the database name.

---

## 📋 Project Setup

Follow these steps to get the project up and running on your local machine.

### 1. Clone the repository

First, clone the project to your local machine:

```bash
git clone https://github.com/Ramakanth001/JoinUs.git
```

### 2. Install dependencies

Navigate to the root directory of the project and install the necessary dependencies:

```bash
cd <project_directory>
npm install
```

### 3. Run the project

Start the application using the following command:

```bash
node app.js
```

### 4. Access the app

Open your browser and go to:

```
http://localhost:8080
```

### 5. User Interaction

- Enter your email in the provided textbox.
- The user count will be updated and displayed on the page.

And that's it! You're good to go! 🎉

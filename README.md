<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>

<h1>Welcome to the Task Manager project!</h1>
<p>This project comprises both frontend and backend components developed using HTML, CSS, JavaScript, Node.js, Express.js, and MongoDB for database management.</p>

<h2>Setup Instructions:</h2>

<h3>Prerequisites:</h3>
<ul>
  <li>Node.js and npm installed on your system. You can download and install them from <a href="https://nodejs.org/">here</a>.</li>
  <li>MongoDB installed and running on your local machine. Download and installation instructions can be found <a href="https://www.mongodb.com/try/download/community">here</a>.</li>
</ul>

<h3>Steps to Setup:</h3>
<ol>
  <li><strong>Clone the Repository:</strong><br>
      Clone the project repository from GitHub using the following command:</li>
  <pre><code>git clone https://github.com/yourusername/task-manager.git</code></pre>

  <li><strong>Navigate to Project Directory:</strong><br>
      Move into the project directory using the following command:</li>
  <pre><code>cd task-manager</code></pre>

  <li><strong>Install Dependencies:</strong><br>
      Install project dependencies by running:</li>
  <pre><code>npm install</code></pre>

  <li><strong>Configure MongoDB:</strong><br>
      <ul>
        <li>Make sure MongoDB is up and running on your local machine.</li>
        <li>Configure the MongoDB connection URL in the <code>config.js</code> file located in the backend directory (<code>/backend/config.js</code>).</li>
      </ul>
  </li>

  <li><strong>Run the Backend Server:</strong><br>
      Start the backend server by running:</li>
  <pre><code>npm run server</code></pre>

  <li><strong>Run the Frontend:</strong><br>
      Open another terminal window, navigate to the project directory, and run:</li>
  <pre><code>npm start</code></pre>

  <li><strong>Access the Application:</strong><br>
      Once both the backend server and frontend are running, you can access the application by opening a web browser and navigating to:</li>
  <pre><code>http://localhost:3000</code></pre>
</ol>

<h3>Additional Notes:</h3>
<ul>
  <li><strong>Database Setup:</strong> Ensure MongoDB is running and the connection URL is correctly configured in the backend configuration file.</li>
  <li><strong>Customization:</strong> Feel free to customize any configuration settings as per your requirements.</li>
  <li><strong>Troubleshooting:</strong> Check the console logs for any errors encountered during setup or run.</li>
</ul>

<h3>Contact:</h3>
<p>If you encounter any issues or have any questions, please don't hesitate to reach out to the project maintainers.</p>

<p>Feel free to customize this README according to your project's specific requirements and any additional setup steps or configurations you might have. This should provide a clear guide for users to set up and run your "Task Manager" project on their local machines.</p>

</body>
</html>


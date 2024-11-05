
# Screenshot to Code
<img width="1469" alt="Screenshot 2024-11-05 at 7 45 45 PM" src="https://github.com/user-attachments/assets/4268013a-a20a-4ecf-a55e-b073104386f0">

## Overview
A React application that allows users to upload screenshots or record their screens to generate corresponding HTML/CSS/JavaScript code. The generated code is displayed in a VSCode-friendly format and can be copied to the clipboard for easy use in development.

## Features

- **Upload Screenshots**: Users can upload screenshots (PNG, JPG) to generate code.
- **Screen Recording**: Users can record their screens, and the application will generate code based on the recorded actions.
- **Video Upload**: Supports uploading MP4 videos to generate code based on video content.
- **Code Generation**: Automatically generates HTML/CSS/JavaScript code based on user input.
- **Preview Feature**: Live preview of the generated code within the application.
- **Copy to Clipboard**: Easily copy the generated code to the clipboard with one click.
- **Framework and Model Selection**: Choose from various frameworks (React, HTML, etc.) and models for code generation.

## Technologies Used

- **React**: Frontend framework for building the user interface.
- **Tailwind CSS**: Utility-first CSS framework for styling the application.
- **Axios**: Library for making HTTP requests to handle file uploads.
- **Lucide React**: Icon library for rendering icons in the application.

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/screenshot-to-code.git
   ```

2. **Navigate to the project directory**:

   ```bash
   cd screenshot-to-code
   ```

3. **Install dependencies**:

   ```bash
   npm install
   ```

4. **Run the application**:

   ```bash
   npm start
   ```

   Open your browser and go to `http://localhost:3000` to see the application in action.

## Usage

1. Upload a screenshot by dragging and dropping it into the upload area or clicking to select a file.
2. Record your screen by clicking the "Start Recording" button. Stop the recording to generate code based on the actions taken during the recording.
3. Optionally, upload a video file to generate code.
4. Select the desired framework and model from the dropdowns.
5. Click the "Generate Code" button to create the code.
6. Use the "Copy" button to copy the generated code to your clipboard for use in your projects.
7. View the live preview of the generated code in the application.

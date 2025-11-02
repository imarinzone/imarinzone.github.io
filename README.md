<div align="center">
  <img src="profile.svg" alt="Arindam Kumar Nath" width="200" style="border-radius: 50%; border: 4px solid #e69d00;" />
  <br>
  <small><em>Profile art available in <a href="src/profile.html">profile.html</a></em></small>
</div>

# Portfolio Website - Arindam Kumar Nath

A modern, responsive portfolio website showcasing professional experience and skills in backend development, cloud technologies, and software engineering.

## 🚀 Quick Start

### Option 1: Direct File Access
Simply open `index.html` in your web browser.

### Option 2: Local Server (Recommended)
```bash
# Using Python 3
python -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js (if you have it installed)
npx serve .

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000` in your browser.

## 📁 Project Structure

```
├── index.html          # Main HTML file with embedded resume data
├── styles.css          # CSS styling and responsive design
├── app.js             # JavaScript functionality and data binding
├── _config.yml        # Jekyll configuration (for GitHub Pages)
├── resume/
│   └── resume-data.json # Resume data in JSON format
└── README.md          # This file
```

## ✏️ Customization

### Update Content
- **Resume Data**: Edit the JSON object in `index.html` (id: `resume-data`) or update `resume/resume-data.json`
- **Featured Topics**: Modify the `topics` array in `app.js` to change the interactive cards
- **Styling**: Customize colors, fonts, and layout in `styles.css`

### Key Features
- 🌙 Dark/Light theme toggle
- 📱 Fully responsive design
- 🎯 Interactive topic cards with filtering
- 📊 Dynamic data binding from JSON
- ⚡ Fast loading with modern CSS and vanilla JavaScript

## 🛠️ Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Grid and Flexbox
- **Vanilla JavaScript** - No frameworks, pure JS for performance
- **Google Fonts** - Inter font family
- **GitHub Pages** - Hosting (via Jekyll)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

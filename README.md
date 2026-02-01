<div align="center">
  <img src="favicon.svg" alt="Arindam Kumar Nath" width="200" style="border-radius: 50%; border: 4px solid #e69d00;" />
  <br>
  <small><em>Profile art available in <a href="src/profile.html">profile.html</a></em></small>
</div>

# Portfolio Website - Arindam Kumar Nath

A modern, responsive portfolio website showcasing professional experience and skills in backend development, cloud technologies, and software engineering.

> **Note**: This portfolio is based on [rxresu.me](https://rxresu.me), an open-source resume builder. The resume data is exported from rxresu.me and dynamically loaded into this custom portfolio website.

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
├── index.html          # Main HTML file
├── styles.css          # CSS styling and responsive design
├── app.js              # JavaScript functionality and data binding
├── config.js           # Configuration file for customization
├── resume/
│   └── resume-data.json # Resume data in JSON format (source of truth)
├── src/
│   ├── profile.html    # Profile art HTML
│   └── *.jpg           # Background images
├── favicon.svg         # SVG favicon
├── favicon.ico         # ICO favicon fallback
└── README.md           # Documentation about the project
```

## ⚙️ Configuration

All configuration is centralized in `config.js` for easy customization:

### Section Visibility
Control which sections are displayed on the website:

```javascript
sections: {
  featured: true,      // Areas of Expertise section
  experience: true,    // Experience section
  projects: true,      // Projects section
  education: true,     // Education section
  skills: true,        // Skills section
  languages: true      // Languages section
}
```

Set any section to `false` to hide it from the page.

### Display Text
Customize headings and footer text:

```javascript
display: {
  headlineSuffix: ' — Backend & Cloud',
  featuredTitle: 'Areas of Expertise',
  footerText: {
    availability: 'Open to backend and platform roles',
    location: 'Kolkata, India • Remote friendly'
  }
}
```

### Theme Configuration
Adjust theme colors, icons, and palettes:

```javascript
theme: {
  colors: { dark: '#0b0f14', light: '#f8f9fa' },
  icons: { dark: '☾', light: '☀' },
  defaultPalette: 'default',
  palettes: ['default', 'blue', 'purple', 'green', 'red', 'orange']
}
```

### Featured Topics
Modify the interactive topic cards in `config.js`:

```javascript
topics: [
  {
    id: 'golang',
    title: 'Golang Microservices',
    meta: 'Latency-first APIs, clean architecture',
    body: '...',
    tags: ['Go', 'REST', 'gRPC', 'GraphQL'],
    details: '...'
  },
  // ... more topics
]
```

## ✏️ Customization

### Getting Resume Data from rxresu.me

This portfolio uses resume data exported from [rxresu.me](https://rxresu.me), an open-source resume builder. Follow these steps to get your resume data:

1. **Visit rxresu.me**
   - Go to [https://rxresu.me](https://rxresu.me)
   - Sign up or log in to your account

2. **Create or Import Your Resume**
   - Create a new resume or import an existing one
   - Fill in all your information (experience, education, skills, etc.)
   - Customize the layout and design as needed

3. **Export Your Resume Data**
   - Click on the **"Export"** or **"Download"** button
   - Select **"JSON"** format (not PDF or other formats)
   - Save the downloaded JSON file

4. **Update the Portfolio**
   - Replace the existing `resume/resume-data.json` file with your downloaded JSON
   - The file should be placed in the `resume/` directory
   - Make sure the filename is exactly `resume-data.json`

5. **Verify the Data**
   - Open `resume/resume-data.json` in a text editor
   - Ensure it's valid JSON (you can use a JSON validator)
   - The structure should match the expected format

**Alternative**: You can also manually edit `resume/resume-data.json` if you prefer, but using rxresu.me provides a better editing experience and ensures proper data structure.

### Update Resume Data
**Important**: All resume data is loaded from `resume/resume-data.json`. This is the single source of truth.

1. Export your resume from [rxresu.me](https://rxresu.me) as JSON (see steps above)
2. Replace `resume/resume-data.json` with your exported file
3. The website automatically loads and displays the data
4. No need to edit HTML or JavaScript files

The JSON structure from rxresu.me supports:
- Personal information (name, email, phone, location, website)
- Summary
- Experience (with company website links)
- Education
- Projects (with project links)
- Skills
- Languages
- Social profiles (GitHub, LinkedIn)
- Certifications, Awards, Publications (if included)

### Styling
Customize colors, fonts, and layout in `styles.css`. The site uses CSS variables for easy theming:
- `--bg`, `--bg-elev`, `--text`, `--primary` - Main colors
- `--border`, `--muted` - Secondary colors
- Theme variables change automatically based on dark/light mode

### Key Features
- 🌙 Dark/Light theme toggle with persistence
- 🎨 Multiple color palette options
- 📱 Fully responsive design
- 🎯 Interactive topic cards with filtering
- 📊 Dynamic data binding from JSON
- 🔗 Clickable company and project links
- 👁️ Section visibility controls
- ⚡ Fast loading with modern CSS and vanilla JavaScript
- 🧪 Unit tests for JSON processing

## 🧪 Testing

Run unit tests to verify JSON processing:

```bash
# Install dependencies (if needed)
npm install

# Run tests
npm test
```

Tests verify:
- JSON data loading and transformation
- Data structure validation
- Field mapping correctness
- Error handling

## 🛠️ Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Grid, Flexbox, and CSS Variables
- **Vanilla JavaScript** - No frameworks, pure JS for performance
- **Google Fonts** - Inter font family
- **GitHub Pages** - Hosting
- **[rxresu.me](https://rxresu.me)** - Open-source resume builder for data source

## 🙏 Credits

This portfolio website is built on top of data exported from [rxresu.me](https://rxresu.me), an excellent open-source resume builder. The JSON data structure follows rxresu.me's format, making it easy to maintain and update your resume using their intuitive interface.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

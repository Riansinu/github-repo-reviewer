# 🎯 AI GitHub Repository Reviewer

An AI-powered tool that analyzes GitHub repositories and provides honest, actionable feedback to students and early-career developers - like having a senior engineer review your code.
## 💡 Problem Statement

Students and early developers showcase their work on GitHub, but they don't know how their code looks from a recruiter or senior engineer's perspective. Large tech companies use automated code quality checks, but students don't have access to these systems.

## ✨ Solution

This tool analyzes any public GitHub repository and provides:
- **📊 Recruiter Confidence Score** (0-100%): How confident a recruiter would be in this code
- **🎓 Skill Level Assessment**: Beginner / Intermediate / Advanced
- **📋 Honest Summary**: What's working and what needs improvement
- **⭐ Next 3 Actions**: Specific, actionable improvements (not overwhelming advice)

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS, JavaScript (Vanilla JS)
- **AI Model**: Google Gemini 2.5 Flash Lite
- **APIs**: 
  - GitHub REST API (for repository analysis)
  - Gemini API (for intelligent feedback)
- **Deployment**: Static hosting (works locally or on any web server)

## 🎨 Features

### Core Features
1. **Automated Repository Analysis**
   - README quality and documentation
   - File structure and organization
   - Test coverage presence
   - Commit history and message quality
   - Tech stack detection

2. **AI-Powered Feedback**
   - Uses Gemini AI to interpret signals like a senior engineer
   - Provides context-aware, specific recommendations
   - Encouraging tone focused on growth

3. **User-Friendly Interface**
   - Simple one-click analysis
   - Animated confidence meter
   - Clear visual hierarchy
   - Mobile-responsive design

### What Makes It Special
- ✅ **Actionable over overwhelming**: Only 3 next steps, not 20
- ✅ **Honest but encouraging**: Like a mentor, not a judge
- ✅ **Confidence metric**: Unique "recruiter confidence" score
- ✅ **No authentication required**: Works with any public repo instantly

### Video demo:   https://drive.google.com/file/d/18Wptlw_hdSujIR6F3W9JhmidsH2PKaMQ/view?usp=drivesdk

## 📖 How It Works

### Analysis Pipeline
```
User Input (GitHub URL)
    ↓
GitHub API Fetch (repo metadata, commits, files, README)
    ↓
Data Analysis (structure, documentation, commit quality)
    ↓
AI Processing (Gemini interprets signals)
    ↓
Output (Score + Level + Summary + Actions)
```

### What Gets Analyzed
1. **Documentation Quality**
   - README existence and length
   - Installation instructions
   - Usage examples
   - Documentation folder

2. **Code Structure**
   - File organization
   - Presence of tests
   - Configuration files
   - License and .gitignore

3. **Commit History**
   - Commit message quality
   - Average message length
   - Commit frequency patterns

4. **Professional Indicators**
   - CI/CD setup
   - Package management
   - Community files (CONTRIBUTING, CODE_OF_CONDUCT)

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Gemini API key (free tier available)

### Installation

. **Download the project:**
   - Click the green "Code" button above
   - Select "Download ZIP"
   - Extract the ZIP file


2. **Get your Gemini API key**
   - Visit: https://makersuite.google.com/app/apikey
   - Click "Create API Key"
   - Copy the key

3. **Open the application**
   - Simply open `index.html` in your browser
   - Or use a local server:
```bash
   # Python
   python -m http.server 8000
   
   # Node.js
   npx http-server
```

4. **Use the tool**
   - Enter any public GitHub repository URL
   - Paste your Gemini API key
   - Click "Analyze Repository"
   - Get instant feedback!



## 🎯 Use Cases

- **Students**: Improve portfolios before job applications
- **Bootcamp Graduates**: Get honest feedback on projects
- **Self-Learners**: Understand what professional code looks like
- **Code Reviewers**: Quick initial assessment of repositories
- **Educators**: Teach students about code quality standards

## 🔮 Future Enhancements

- [ ] Code complexity analysis
- [ ] Security vulnerability detection
- [ ] Comparison with similar repositories
- [ ] Track improvements over time
- [ ] Browser extension
- [ ] Batch repository analysis
- [ ] Integration with GitHub Actions
- [ ] Detailed metrics breakdown

## 🏗️ Project Architecture
```
github-repo-reviewer/
├── index.html          # Main UI
├── style.css           # Styling and animations
├── app.js              # Core logic
│   ├── parseGitHubUrl()      # Extract owner/repo
│   ├── fetchRepoData()       # GitHub API calls
│   ├── analyzeRepoData()     # Data processing
│   ├── callGeminiAPI()       # AI analysis
│   └── displayResults()      # UI rendering
└── README.md           # This file
```

## 🤝 Contributing

This was built as a hackathon project in 2 hours! Contributions are welcome:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## ⚠️ Limitations

- Only works with **public** GitHub repositories
- Requires internet connection (API calls)
- GitHub API rate limit: 60 requests/hour (unauthenticated)
- AI feedback quality depends on repository data available
- API key must be provided by user (security consideration)


## 👨‍💻 Built By

**[Rian K Sinu]**
-
- LinkedIn: https://www.linkedin.com/in/rian-k-sinu/


## 🙏 Acknowledgments

- GitHub REST API for repository data
- Google Gemini AI for intelligent analysis
- Anthropic's Claude for development assistance
- The open-source community for inspiration

## 📞 Support

If you have any questions or issues:
- Open an issue on GitHub
- Email: riansinu3@gmail.com

---


**⭐ If this project helped you, please star the repository!**

Made with ❤️ for students, by students.
```


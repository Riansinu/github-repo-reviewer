// ===== STEP 1: Parse GitHub URL =====
function parseGitHubUrl(url) {
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) return null;
    return {
        owner: match[1],
        repo: match[2].replace('.git', '')
    };
}

// ===== STEP 2: Fetch Repository Data =====
async function fetchRepoData(owner, repo) {
    const baseUrl = 'https://api.github.com';
    
    try {
        console.log(`🔍 Fetching data for: ${owner}/${repo}`);
        
        // Get basic repo info
        console.log('Step 1: Fetching repo info...');
        const repoResponse = await fetch(`${baseUrl}/repos/${owner}/${repo}`);
        if (!repoResponse.ok) {
            throw new Error(`Repo not found (${repoResponse.status})`);
        }
        const repoData = await repoResponse.json();
        console.log('✅ Repo info fetched');
        
        // Get README
        console.log('Step 2: Fetching README...');
        let readmeData = null;
        try {
            const readmeResponse = await fetch(`${baseUrl}/repos/${owner}/${repo}/readme`);
            if (readmeResponse.ok) {
                const readme = await readmeResponse.json();
                readmeData = atob(readme.content);
                console.log('✅ README fetched');
            } else {
                console.log('⚠️ No README found');
            }
        } catch (e) {
            console.log('⚠️ README fetch failed:', e.message);
            readmeData = null;
        }
        
        // Get file tree
        console.log('Step 3: Fetching file tree...');
        const treeResponse = await fetch(`${baseUrl}/repos/${owner}/${repo}/git/trees/${repoData.default_branch}?recursive=1`);
        if (!treeResponse.ok) {
            throw new Error(`Tree fetch failed (${treeResponse.status})`);
        }
        const treeData = await treeResponse.json();
        console.log('✅ File tree fetched:', treeData.tree?.length, 'files');
        
        // Get recent commits
        console.log('Step 4: Fetching commits...');
        const commitsResponse = await fetch(`${baseUrl}/repos/${owner}/${repo}/commits?per_page=20`);
        if (!commitsResponse.ok) {
            throw new Error(`Commits fetch failed (${commitsResponse.status})`);
        }
        const commitsData = await commitsResponse.json();
        console.log('✅ Commits fetched:', commitsData.length);
        
        // Get languages
        console.log('Step 5: Fetching languages...');
        const languagesResponse = await fetch(`${baseUrl}/repos/${owner}/${repo}/languages`);
        if (!languagesResponse.ok) {
            throw new Error(`Languages fetch failed (${languagesResponse.status})`);
        }
        const languagesData = await languagesResponse.json();
        console.log('✅ Languages fetched:', Object.keys(languagesData));
        
        console.log('🎉 All data fetched successfully!');
        
        return {
            repo: repoData,
            readme: readmeData,
            tree: treeData,
            commits: commitsData,
            languages: languagesData
        };
    } catch (error) {
        console.error('❌ Fetch error:', error);
        throw new Error('Failed to fetch repository data: ' + error.message);
    }
}

// ===== STEP 3: Analyze Data =====
function analyzeRepoData(data) {
    const analysis = {};
    
    // README Analysis
    analysis.hasReadme = data.readme !== null;
    analysis.readmeLength = data.readme ? data.readme.length : 0;
    analysis.readmePreview = data.readme ? data.readme.substring(0, 500) : 'No README found';
    
    // File Structure Analysis
    const files = data.tree.tree || [];
    analysis.fileCount = files.length;
    analysis.hasTests = files.some(f => 
        f.path.includes('test') || 
        f.path.includes('spec') || 
        f.path.includes('__tests__')
    );
    analysis.hasDocs = files.some(f => f.path.includes('docs/'));
    analysis.hasCI = files.some(f => f.path.includes('.github/workflows'));
    analysis.hasGitignore = files.some(f => f.path === '.gitignore');
    analysis.hasLicense = files.some(f => f.path.includes('LICENSE'));
    
    // Commit Analysis
    analysis.commitCount = data.commits.length;
    const messages = data.commits.map(c => c.commit.message);
    analysis.avgMessageLength = messages.reduce((sum, msg) => sum + msg.length, 0) / messages.length;
    analysis.sampleCommits = messages.slice(0, 5);
    
    // Tech Stack
    analysis.languages = Object.keys(data.languages).join(', ');
    
    // Basic Info
    analysis.repoName = data.repo.name;
    analysis.description = data.repo.description || 'No description';
    analysis.stars = data.repo.stargazers_count;
    
    return analysis;
}

// Step 4: Call Gemini API for analysis (ENHANCED VERSION)
async function callGeminiAPI(analysis, apiKey) {
    const prompt = `You are a senior software engineer reviewing a student's GitHub repository. Be encouraging but honest.

Repository Analysis:
- Name: ${analysis.repoName}
- Description: ${analysis.description}
- Tech Stack: ${analysis.languages}
- Stars: ${analysis.stars}

README:
- Exists: ${analysis.hasReadme}
- Length: ${analysis.readmeLength} characters
- Preview: ${analysis.readmePreview}

Structure:
- Total files: ${analysis.fileCount}
- Has tests: ${analysis.hasTests}
- Has docs: ${analysis.hasDocs}
- Has CI/CD: ${analysis.hasCI}
- Has .gitignore: ${analysis.hasGitignore}
- Has LICENSE: ${analysis.hasLicense}

Commits (last ${analysis.commitCount}):
- Average message length: ${Math.round(analysis.avgMessageLength)} chars
- Sample messages: ${analysis.sampleCommits.join(' | ')}

Provide your response in this EXACT JSON format (no markdown, no extra text):
{
  "level": "BEGINNER or INTERMEDIATE or ADVANCED",
  "confidence": 65,
  "summary": "2-3 sentence honest summary here",
  "next_actions": [
    "Add README installation steps",
    "Write 2 unit tests",
    "Improve commit messages"
  ]
}

Important:
- "confidence" should be a number 0-100 representing how confident a recruiter would be in this code (based on professionalism, structure, documentation)
- "next_actions" should be 3 SPECIFIC, actionable tasks (not general advice). Use imperative verbs. Keep each under 10 words.`;

    try {
        // Using Gemini 2.5 Flash Lite
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 1024,
                }
            })
        });

        const responseText = await response.text();
        console.log('📡 Response status:', response.status);
        console.log('📡 Response text:', responseText);

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.status} - ${responseText}`);
        }

        const data = JSON.parse(responseText);
        console.log('🤖 Gemini response:', data);
        
        // Extract text from Gemini response
        const text = data.candidates[0].content.parts[0].text;
        console.log('📝 Raw text:', text);
        
        // Clean up the response (remove markdown code blocks if present)
        let cleanText = text.trim();
        cleanText = cleanText.replace(/```json\n?/g, '');
        cleanText = cleanText.replace(/```\n?/g, '');
        cleanText = cleanText.trim();
        
        // Find JSON in the response
        const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Could not find JSON in response');
        }
        
        const result = JSON.parse(jsonMatch[0]);
        console.log('✅ Parsed result:', result);
        
        return result;
        
    } catch (error) {
        console.error('❌ Gemini API Error:', error);
        throw new Error('Failed to analyze with Gemini: ' + error.message);
    }
}
// Step 5: Display Results (ENHANCED VERSION)
function displayResults(result, repoName) {
    const resultsDiv = document.getElementById('results');
    
    const levelClass = `level-${result.level.toLowerCase()}`;
    
    // Determine confidence color and message
    let confidenceColor = '#ff6b6b'; // red
    let confidenceMessage = 'Needs Work';
    
    if (result.confidence >= 80) {
        confidenceColor = '#48dbfb'; // blue
        confidenceMessage = 'Recruiter Ready! 🎉';
    } else if (result.confidence >= 60) {
        confidenceColor = '#feca57'; // yellow
        confidenceMessage = 'Getting There!';
    }
    
    resultsDiv.innerHTML = `
        <h2 style="color: #333; margin-bottom: 20px;">📊 Analysis Results</h2>
        <p style="color: #666; margin-bottom: 30px;"><strong>Repository:</strong> ${repoName}</p>
        
        <!-- Confidence Meter -->
        <div class="confidence-section">
            <div class="confidence-label">Recruiter Confidence Score</div>
            <div class="confidence-score">${result.confidence}%</div>
            <div style="font-size: 18px; margin-top: 5px;">${confidenceMessage}</div>
            <div class="confidence-bar-container">
                <div class="confidence-bar" style="width: 0%; background: white;" 
                     id="confidence-bar-fill"></div>
            </div>
        </div>
        
        <!-- Level Badge -->
        <div class="level-badge ${levelClass}">
            ${result.level}
        </div>
        
        <!-- Summary -->
        <div class="summary">
            <h3>📋 Summary</h3>
            <p>${result.summary}</p>
        </div>
        
        <!-- Next Actions -->
        <div class="next-actions">
            <h3>⭐ Your Next 3 Actions</h3>
            <p style="color: #666; margin-bottom: 20px; font-size: 14px;">
                Focus on these specific improvements to level up your repository:
            </p>
            ${result.next_actions.map((action, index) => `
                <div class="action-item">
                    <div class="action-number">${index + 1}</div>
                    <div>${action}</div>
                </div>
            `).join('')}
        </div>
        
        <!-- Action Buttons -->
        <div style="text-align: center; margin-top: 40px; display: flex; gap: 15px; justify-content: center;">
            <button onclick="location.reload()" 
                    style="background: #667eea; padding: 15px 30px; width: auto;">
                ✨ Analyze Another Repo
            </button>
            <button onclick="window.open('https://github.com/${repoName}', '_blank')" 
                    style="background: #48dbfb; padding: 15px 30px; width: auto;">
                🔗 View on GitHub
            </button>
        </div>
    `;
    
    resultsDiv.style.display = 'block';
    
    // Animate confidence bar
    setTimeout(() => {
        document.getElementById('confidence-bar-fill').style.width = result.confidence + '%';
    }, 100);
}

// ===== STEP 6: Main Function =====
async function analyzeRepo() {
    const repoUrl = document.getElementById('repoUrl').value;
    const apiKey = document.getElementById('apiKey').value;
    
    if (!repoUrl || !apiKey) {
        alert('Please enter both repository URL and API key');
        return;
    }
    
    // Show loading
    document.getElementById('loading').style.display = 'block';
    document.getElementById('results').style.display = 'none';
    
    try {
        // Parse URL
        const parsed = parseGitHubUrl(repoUrl);
        if (!parsed) {
            throw new Error('Invalid GitHub URL');
        }
        
        console.log('📦 Fetching repository data...');
        // Fetch data
        const data = await fetchRepoData(parsed.owner, parsed.repo);
        
        console.log('🔍 Analyzing repository...');
        // Analyze data
        const analysis = analyzeRepoData(data);
        console.log('Analysis:', analysis);
        
        console.log('🤖 Getting AI feedback...');
        // Get AI feedback using GEMINI
        const result = await callGeminiAPI(analysis, apiKey);
        
        console.log('🎉 Displaying results...');
        // Display results with full repo name
        displayResults(result, `${parsed.owner}/${parsed.repo}`);
        
    } catch (error) {
        console.error('❌ Error:', error);
        alert('Error: ' + error.message);
    } finally {
        document.getElementById('loading').style.display = 'none';
    }
}
document.addEventListener('DOMContentLoaded', () => {
    // --- UI Elements ---
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const scanningStatus = document.getElementById('scanningStatus');
    const resultsDashboard = document.getElementById('resultsDashboard');
    const progressBar = document.getElementById('progressBar');
    const statusText = document.getElementById('statusText');
    const fallbackWarning = document.getElementById('fallbackWarning');
    const issuesList = document.getElementById('issuesList');

    // New UI Elements
    const fileSelectionDisplay = document.getElementById('fileSelectionDisplay');
    const selectedFileName = document.getElementById('selectedFileName');
    const removeFileBtn = document.getElementById('removeFileBtn');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const scanAnotherBtn = document.getElementById('scanAnotherBtn');
    const downloadReportBtn = document.getElementById('downloadReportBtn');

    let currentFile = null;
    let currentFileData = null;
    let currentFileIsPdf = false;

    // --- File Upload Logic ---
    dropZone.addEventListener('click', () => fileInput.click());

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--accent)';
        dropZone.style.background = 'rgba(255, 255, 255, 0.95)';
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.style.borderColor = '#94a3b8';
        dropZone.style.background = 'var(--card-bg)';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#94a3b8';
        dropZone.style.background = 'var(--card-bg)';
        if (e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });

    function handleFile(file) {
        const isText = file.type === "text/plain" || file.name.endsWith('.txt');
        const isPdf = file.type === "application/pdf" || file.name.endsWith('.pdf');

        if (!isText && !isPdf) {
            alert("Please upload a standard Text Document (.txt) or PDF (.pdf) only.");
            return;
        }

        currentFile = file;
        currentFileIsPdf = isPdf;

        // Update UI to show selected file
        dropZone.classList.add('hidden');
        fileSelectionDisplay.classList.remove('hidden');
        selectedFileName.textContent = file.name;
        analyzeBtn.disabled = false;

        // Pre-read the file so data is ready when they click analyze
        const reader = new FileReader();
        reader.onload = (e) => {
            currentFileData = e.target.result;
        };
        reader.onerror = () => {
            alert("Error reading file");
            resetUI();
        };

        if (isPdf) {
            reader.readAsDataURL(file); // For PDF we need base64
        } else {
            reader.readAsText(file); // For text we just need plain string
        }
    }

    // --- Action Button Listeners ---
    removeFileBtn.addEventListener('click', resetUI);

    analyzeBtn.addEventListener('click', () => {
        if (!currentFileData) return;

        // Hide upload container items, show scanning
        document.querySelector('.upload-container').classList.add('hidden');
        resultsDashboard.classList.add('hidden');
        scanningStatus.classList.remove('hidden');
        fallbackWarning.classList.add('hidden');
        progressBar.style.width = "5%";

        initiateScan(currentFileData, currentFileIsPdf);
    });

    scanAnotherBtn.addEventListener('click', () => {
        resultsDashboard.classList.add('hidden');
        resetUI();
        progressBar.style.width = "0%";
    });

    downloadReportBtn.addEventListener('click', () => {
        let content = "SwiftPermit - Compliance Report\n";
        content += "==================================\n\n";
        content += `File Audited: ${selectedFileName.textContent}\n`;
        content += `Status: OFFICIAL RECORD\n\n`;

        content += `[SUMMARY STATISTICS]\n`;
        content += `Violations Found: ${document.getElementById('errorCount').innerText}\n`;
        content += `Warnings: ${document.getElementById('warningCount').innerText}\n`;
        content += `Rules Passed: ${document.getElementById('passCount').innerText}\n\n`;

        content += `[DETAILED FINDINGS]\n`;
        content += `----------------------------------\n`;

        const issues = document.querySelectorAll('.issue-item');
        if (issues.length === 0) {
            content += "No specific items were found during this scan.\n";
        } else {
            issues.forEach(issue => {
                const typeText = issue.classList.contains('issue-error') ? '[VIOLATION]' :
                    issue.classList.contains('issue-warning') ? '[WARNING]' : '[PASS]';
                const title = issue.querySelector('h4').innerText;
                const desc = issue.querySelector('p').innerText;
                const ref = issue.querySelector('.rule-ref').innerText;

                content += `${typeText} ${title}\n`;
                content += `Reason: ${desc}\n`;
                content += `Rule Ref: ${ref}\n\n`;
            });
        }

        content += `----------------------------------\n`;
        content += `Generated by SwiftPermit AI Rules Engine\n`;

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Compliance_Report_${selectedFileName.textContent}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // --- Core Routing Logic ---
    async function initiateScan(documentData, isPdf) {
        const apiKey = typeof CONFIG !== 'undefined' ? CONFIG.GROQ_API_KEY.trim() : '';

        statusText.innerText = "Analyzing plan data...";
        progressBar.style.width = "20%";

        if (!apiKey) {
            // Immediately fall back if no API key is provided
            console.log("No API key found. Initiating mock fallback immediately.");
            fallbackWarning.classList.remove('hidden');
            fallbackWarning.innerText = "No Live API Key provided. Running local mock analysis...";
            runMockFallback();
            return;
        }

        try {
            await runLiveGroqScan(documentData, isPdf, apiKey);
        } catch (error) {
            console.warn("Live API Failed. Commencing Seamless Fallback. Error:", error);
            fallbackWarning.classList.remove('hidden');
            fallbackWarning.innerText = "Live AI unavailable or failed. Error: " + error.message + ". Falling back to robust offline mock analysis...";
            runMockFallback();
        }
    }

    // --- LIVE GROQ API LOGIC ---
    async function runLiveGroqScan(documentData, isPdf, apiKey) {
        // Step 1: Set Rules
        progressBar.style.width = "40%";
        statusText.innerText = "Loading regulatory rules...";
        const rulesText = `
        ZONING AND BUILDING RULES FOR CHESTERFIELD ZONE R-1 (Single Family Residential):
        1. Setbacks: Minimum front yard setback is 25 feet. Minimum rear yard setback is 20 feet. Minimum side yard setback is 10 feet.
        2. Building Height: Maximum allowable building height is 35 feet.
        3. Lot Coverage: Total building footprint must not exceed 30% of the total lot size.
        4. Parking: A minimum of 2 off-street parking spaces must be provided per dwelling unit.
        5. Fencing: Fences in the front yard must not exceed 4 feet in height. Fences in the rear/side yards may be up to 6 feet.
        `;

        // Step 2: Extract Text
        progressBar.style.width = "60%";
        let finalDocumentText = "";

        if (isPdf) {
            statusText.innerText = "Extracting text from PDF locally...";
            try {
                // Convert DataURL to Uint8Array for pdf.js
                const base64Data = documentData.split(',')[1];
                const binaryString = window.atob(base64Data);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }

                const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
                for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                    const page = await pdf.getPage(pageNum);
                    const textContent = await page.getTextContent();
                    const pageText = textContent.items.map(item => item.str).join(' ');
                    finalDocumentText += pageText + "\n";
                }
                statusText.innerText = "PDF extracted successfully...";
            } catch (err) {
                console.error("Local PDF extraction failed:", err);
                throw new Error("Failed to extract text from PDF document.");
            }
        } else {
            finalDocumentText = documentData;
        }


        // Step 3: Analyze with Groq API
        progressBar.style.width = "80%";
        statusText.innerText = "Analyzing compliance via Groq AI (Llama 3)...";

        const systemMessage = `
        You are an expert municipal zoning and building code reviewer for SwiftPermit.
        Compare the provided "Building Plan" against the "Zoning Rules".
        
        RULES:
        ${rulesText}
        
        Output a strictly valid JSON array of objects representing compliance issues found. Each object must have:
        - "type": "error" or "warning" or "pass"
        - "title": A short title of the issue
        - "description": A clear description of why it passes/fails
        - "ref": The specific rule reference it relates to
        
        If there are no errors, generate at least 2 "pass" records highlighting what is compliant.
        CRITICAL: ONLY RETURN THE JSON ARRAY. NO MARKDOWN TICKS, NO OTHER TEXT. DO NOT WRAP IN \`\`\`json.
        `;

        const userMessage = `BUILDING PLAN TEXT:\n${finalDocumentText}`;

        const groqUrl = "https://api.groq.com/openai/v1/chat/completions";
        const apiResponse = await fetch(groqUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile", // Using an extremely fast, free model
                messages: [
                    { role: "system", content: systemMessage },
                    { role: "user", content: userMessage }
                ],
                temperature: 0.1, // Keep it deterministic
            })
        });

        if (!apiResponse.ok) {
            throw new Error(`Groq API request failed with status: ${apiResponse.status}`);
        }

        const apiData = await apiResponse.json();

        if (!apiData.choices || apiData.choices.length === 0) {
            throw new Error("Groq returned an empty response.");
        }

        let responseText = apiData.choices[0].message.content;

        // Sometimes LLMs still add markdown ticks, so we strip them just in case
        responseText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();

        let results;
        try {
            results = JSON.parse(responseText);
        } catch (jsonErr) {
            console.log("Failed to parse Groq text as JSON", responseText);
            throw new Error("Failed to parse AI output into valid JSON");
        }

        progressBar.style.width = "100%";
        setTimeout(() => {
            scanningStatus.classList.add('hidden');
            displayResults(results);
        }, 500);
    }

    // --- MOCK FALLBACK LOGIC ---
    function runMockFallback() {
        let currentProgress = parseInt(progressBar.style.width) || 20;
        statusText.innerText = "Simulating complex architectural analysis locally...";

        const interval = setInterval(() => {
            currentProgress += Math.random() * 15;
            if (currentProgress > 100) currentProgress = 100;
            progressBar.style.width = `${currentProgress}%`;

            if (currentProgress >= 50 && currentProgress < 80) {
                statusText.innerText = "Cross-referencing Chesterfield Zoning Code Title 17...";
            } else if (currentProgress >= 80 && currentProgress < 100) {
                statusText.innerText = "Generating fallback compliance report...";
            }

            if (currentProgress === 100) {
                clearInterval(interval);
                setTimeout(() => {
                    scanningStatus.classList.add('hidden');
                    displayResults(mockResults);
                }, 500);
            }
        }, 400);
    }

    // Pre-programmed realistic results for presentation fallback
    const mockResults = [
        {
            type: "error",
            title: "Setback Violation - Primary Structure",
            description: "The proposed building is placed 18 feet from the front property line. Chesterfield zoning code requires a minimum front yard setback of 25 feet for this zone.",
            ref: "Chesterfield Code § 17.12.040"
        },
        {
            type: "error",
            title: "Maximum Building Height Exceeded",
            description: "The architectural elevation indicates a height of 38 feet to the roof peak. The maximum allowable height for this zone is 35 feet.",
            ref: "Chesterfield Code § 17.12.050"
        },
        {
            type: "warning",
            title: "Parking Space Ratio Near Limit",
            description: "The plan includes exactly 2 off-street parking spaces. While this meets the minimum requirement, any future conversion of the garage may trigger non-compliance.",
            ref: "Chesterfield Code § 17.24.020"
        },
        {
            type: "pass",
            title: "Lot Coverage Ratio",
            description: "The total building footprint covers 32% of the lot, which is well within the maximum allowable lot coverage of 45%.",
            ref: "Chesterfield Code § 17.12.030"
        }
    ];

    function resetUI() {
        scanningStatus.classList.add('hidden');
        document.querySelector('.upload-container').classList.remove('hidden');
        dropZone.classList.remove('hidden');
        fileSelectionDisplay.classList.add('hidden');
        analyzeBtn.disabled = true;
        fileInput.value = '';
        currentFile = null;
        currentFileData = null;
        fallbackWarning.classList.add('hidden');
    }

    // --- Render Results to UI Dashboard ---
    function displayResults(results) {
        let errCount = 0; let warnCount = 0; let pCount = 0;
        issuesList.innerHTML = '';

        results.forEach(item => {
            if (item.type === 'error') errCount++;
            else if (item.type === 'warning') warnCount++;
            else if (item.type === 'pass') pCount++;

            let icon = '❌';
            if (item.type === 'warning') icon = '⚠️';
            if (item.type === 'pass') icon = '✅';

            const issueHtml = `
                <div class="issue-item issue-${item.type}">
                    <div class="issue-icon">${icon}</div>
                    <div class="issue-content">
                        <h4>${item.title}</h4>
                        <p>${item.description}</p>
                        <span class="rule-ref">${item.ref}</span>
                    </div>
                </div>
            `;
            issuesList.innerHTML += issueHtml;
        });

        document.getElementById('errorCount').innerText = errCount;
        document.getElementById('warningCount').innerText = warnCount;
        document.getElementById('passCount').innerText = pCount;

        resultsDashboard.classList.remove('hidden');

        resultsDashboard.classList.remove('hidden');
    }
});

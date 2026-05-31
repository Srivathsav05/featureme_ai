/* --- SCROLL REVEAL INTERSECTION OBSERVER --- */
const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(element => {
    revealObserver.observe(element);
});

/* --- GLOBAL STATE FOR FUTUREME --- */
let activeUserProfile = null;
let chatHistory = [];
const BACKEND_URL = ''; // Empty string means call origin host (e.g. http://localhost:5000)

/* --- TOAST CONTROLLER --- */
let toastTimeout;
function showToast(message, isSuccess = true) {
    const toast = document.getElementById('shareToast');
    const toastText = document.getElementById('toastText');
    const toastIcon = toast.querySelector('.toast-icon');

    toastText.innerText = message;
    
    if (isSuccess) {
        toastIcon.innerText = '✓';
        toastIcon.style.background = 'var(--glow-green)';
        toastIcon.style.color = '#ffffff';
    } else {
        toastIcon.innerText = '⚠️';
        toastIcon.style.background = 'var(--glow-red)';
        toastIcon.style.color = '#ffffff';
    }

    toast.classList.add('show');
    
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

/* --- SHARE ACTION --- */
function showShareToast() {
    if (activeUserProfile) {
        showToast("Your FutureMe coordinates are finalized! Link generated and saved to your console.");
        console.log("FutureMe Shareable Profile Info:", activeUserProfile);
    } else {
        showToast("Generate your FutureMe reflection card first before sharing.", false);
    }
}

/* --- RESET FORM STATE --- */
function resetFormState() {
    const form = document.getElementById('futureForm');
    const resultCard = document.getElementById('resultCard');
    const chatInput = document.getElementById('chatInput');
    const btnSendChat = document.getElementById('btnSendChat');
    const chatMessages = document.getElementById('chatMessages');

    // Reset Result UI
    resultCard.style.display = 'none';
    form.style.display = 'grid';
    
    // Clear states
    activeUserProfile = null;
    chatHistory = [];
    
    // Reset Chat UI
    chatInput.disabled = true;
    chatInput.placeholder = "Generate FutureMe to start talking...";
    btnSendChat.disabled = true;
    chatMessages.innerHTML = `
        <div class="chat-bubble chat-future">
            <span class="chat-label">FutureMe</span>
            Welcome. Generate your FutureMe report first, then we can talk about how we make it a reality.
        </div>
    `;

    // Scroll smoothly to form
    document.getElementById('create').scrollIntoView({ behavior: 'smooth' });
}

/* --- SCROLL TO CHAT --- */
function scrollToChatSection() {
    document.getElementById('chat').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
        document.getElementById('chatInput').focus();
    }, 800);
}

/* --- CLIENT-SIDE DETERMINISTIC SIMULATION ENGINE (FALLBACK) --- */
function runLocalSimulation(profile) {
    const { name, age, goal, struggle, oneYearVision, tone } = profile;
    let message = "";
    let moves = [];
    let habit = "";
    let warning = "";
    let mantra = "";
    
    if (tone === "Brutally Honest") {
        message = `Hey ${name}, let's stop hiding. I am the version of you who actually crossed the line into ${goal} because you finally stopped treating your excuses like profound insights. Right now you are stuck on "${struggle}" simply because you prefer the comfort of analyzing over the risk of shipping. In 1 year, we made it to: ${oneYearVision} — not by luck, but because you stopped negotiating your standards every single morning.`;
        moves = [
            `Ruthlessly eliminate the primary root cause of your struggle: "${struggle}".`,
            `Stop waiting for perfect clarity. Ship the messy version tomorrow.`,
            `Audit every single calendar block this week to force aggressive engineering velocity.`
        ];
        habit = `Block out the first 90 minutes of your day for absolute deep work on ${goal}. No exceptions.`;
        warning = `I saw you waste months tweaking designs instead of shipping code. Do not hide in low-risk tasks.`;
        mantra = `Daily code over comfortable planning.`;
    } else if (tone === "Motivational") {
        message = `Listen to me carefully, ${name}. I am the version of you who refused to back down when "${struggle}" felt overwhelming. The grand dream of ${goal} isn't a fantasy — it is our history. We reached our benchmark of "${oneYearVision}" precisely because you decided that the mission mattered more than temporary confusion. Keep moving.`;
        moves = [
            `Look directly past your immediate friction with "${struggle}" and remind yourself of the larger legacy.`,
            `Break down your grand benchmark of "${oneYearVision}" into micro daily sprints.`,
            `Consistently share your progress openly with the world to anchor your accountability.`
        ];
        habit = `Write down your absolute North Star target for ${goal} every morning before looking at a screen.`;
        warning = `Do not let a bad day convince you that a great future is out of reach. Maintain the faith.`;
        mantra = `Action conquers fear.`;
    } else if (tone === "CEO Mode") {
        message = `${name}, let's look at the operational reality. I'm executing at our 1-year target: ${oneYearVision}. Your current blocker — "${struggle}" — is simply an operational bottleneck that needs immediate optimization. To scale into ${goal}, we must transition from emotional reaction to raw systemization. Treat your life like a high-leverage product.`;
        moves = [
            `Build an explicit automated system or constraint to neutralize your current issue with "${struggle}".`,
            `Delegate, automate, or drop non-essential components that do not accelerate reaching ${oneYearVision}.`,
            `Establish unambiguous quantitative KPIs for your daily personal progress.`
        ];
        habit = `Conduct a rigorous 15-minute weekly retro every Sunday on your execution velocity.`;
        warning = `You can't scale a broken system. Stop applying manual fixes to processes that need systematic redesigns.`;
        mantra = `Standardize before you optimize.`;
    } else { // Calm Mentor
        message = `Breathe, ${name}. I am looking back at your current inflection point from a peaceful place. You are carrying a lot of unnecessary pressure regarding "${struggle}". The journey toward ${goal} is a gentle distillation process. By the time we unlocked "${oneYearVision}", we realized that clarity wasn't discovered; it was cultivated through quiet, steady intention.`;
        moves = [
            `Accept your struggle with "${struggle}" as standard growth friction rather than a personal structural failure.`,
            `Commit to a slower, deeply intentional cadence that prioritizes exceptional execution quality over frantic pace.`,
            `Protect your creative peace above everything else as you methodically construct ${oneYearVision}.`
        ];
        habit = `Dedicate 10 minutes of silent reflection at twilight to reset your cognitive slate.`;
        warning = `Hurry is the enemy of wisdom. Do not mistake frantic activity for meaningful progress.`;
        mantra = `Still water runs deep.`;
    }

    return {
        message,
        futureIdentity: `The ${tone} Variant (${parseInt(age) + 1}yo)`,
        nextMoves: moves,
        habit,
        warning,
        mantra
    };
}

/* --- CLIENT-SIDE CHAT SIMULATION (FALLBACK) --- */
function runLocalChatSimulation(question, tone, name) {
    const responses = {
        "Brutally Honest": [
            `Look at your question: "${question}". You're asking because you want a shortcut. I don't do shortcuts. Write down the single most important task you've been delaying, lock your door, and work on it for 3 hours. No phone, no tabs, no compromises.`,
            `Let's stop overcomplicating. You are still negotiating your standards. Stop planning what you'll do, and just start doing it. Now.`
        ],
        "Motivational": [
            `That's an important question, ${name}. Remember that every big outcome is built on small steps. Don't look at the entire mountain right now; just focus on the next step in front of you. You have everything inside you to pull this off!`,
            `I've been where you are right now. The doubt is real, but so is your potential. Take a breath, commit to one bold action today, and let the momentum carry you forward.`
        ],
        "CEO Mode": [
            `Analyzing the query regarding "${question}". The highest leverage move is to build a repeatable feedback loop. Quantify your inputs this week, eliminate bottlenecks, and ensure 80% of your energy is dedicated strictly to critical core features.`,
            `Focus on leverage. What is the one action you can take this week that makes all other tasks easier or unnecessary? Focus entirely on that.`
        ],
        "Calm Mentor": [
            `I hear the anxiety in your voice. It is perfectly okay to not know all the answers right now. The path forward will reveal itself as you take slow, deliberate steps. Be kind to yourself today.`,
            `Take a moment to step back from the details. True clarity comes from a quiet mind. Dedicate some space to rest, then return with clean energy.`
        ]
    };

    const toneResponses = responses[tone] || responses["Calm Mentor"];
    const index = Math.floor(Math.random() * toneResponses.length);
    return toneResponses[index];
}

/* --- FORM SUBMISSION CONTROLLER --- */
async function handleGenerateSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('userName').value.trim();
    const age = parseInt(document.getElementById('userAge').value);
    const goal = document.getElementById('userGoal').value.trim();
    const struggle = document.getElementById('userStruggle').value.trim();
    const timeline = document.getElementById('userTimeline').value.trim();
    const tone = document.getElementById('userTone').value;

    const formError = document.getElementById('formError');
    const submitBtn = document.getElementById('btnSubmitForm');
    const form = document.getElementById('futureForm');
    const loading = document.getElementById('loadingState');
    const loadingText = document.getElementById('loadingText');
    const resultCard = document.getElementById('resultCard');

    if (!name || !age || !goal || !struggle || !timeline) {
        formError.style.display = 'flex';
        document.getElementById('errorText').innerText = "Please fill out all required parameters.";
        return;
    }
    formError.style.display = 'none';

    // Disable double submission
    submitBtn.disabled = true;
    form.style.display = 'none';
    loading.style.display = 'flex';

    // Premium loading text sequences
    const loadingInterval = setInterval(() => {
        const phrases = [
            "Analyzing the coordinates of your dreams...",
            "Decrypting the friction points holding you back...",
            "Calculating your one-year spatial trajectory...",
            "Aligning consciousness with your future self...",
            "Writing the warning beacons...",
            "Finalizing your FutureMe report..."
        ];
        const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
        loadingText.innerText = randomPhrase;
    }, 1500);

    const profileData = {
        name,
        age: age.toString(),
        goal,
        struggle,
        oneYearVision: timeline,
        tone
    };

    try {
        const response = await fetch(`${BACKEND_URL}/api/generate-futureme`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profileData)
        });

        clearInterval(loadingInterval);
        
        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || 'Server error occurred.');
        }

        const resData = await response.json();
        
        if (resData.success && resData.data) {
            renderResultCard(resData.data, profileData, false);
        } else {
            throw new Error('Invalid server response format.');
        }

    } catch (error) {
        clearInterval(loadingInterval);
        console.warn("⚠️ API Call failed. Falling back to high-fidelity client simulation. Error details:", error.message);
        
        // Simulating loading a bit for a premium transition feel
        loadingText.innerText = "Running quantum simulation fallback...";
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Use high-fidelity fallback generator
        const simulatedData = runLocalSimulation(profileData);
        renderResultCard(simulatedData, profileData, true);
    } finally {
        submitBtn.disabled = false;
    }
}

/* --- RENDER CARD TO DOM --- */
function renderResultCard(data, profile, isFallback = false) {
    const loading = document.getElementById('loadingState');
    const resultCard = document.getElementById('resultCard');

    // Populate data
    document.getElementById('dynamicMessage').innerText = `“${data.message}”`;
    document.getElementById('dynamicIdentity').innerText = data.futureIdentity || `The ${profile.tone} Variant (${parseInt(profile.age) + 1}yo)`;
    
    // Clear & render moves
    const movesList = document.getElementById('dynamicMoves');
    movesList.innerHTML = '';
    if (Array.isArray(data.nextMoves)) {
        data.nextMoves.forEach(move => {
            const li = document.createElement('li');
            li.innerText = move;
            movesList.appendChild(li);
        });
    }

    document.getElementById('dynamicHabit').innerText = data.habit || "Practice daily consistency.";
    document.getElementById('dynamicWarning').innerHTML = `<strong>Warning:</strong> ${data.warning || "Don't fall into old paths."}`;
    document.getElementById('dynamicMantra').innerText = data.mantra ? `“${data.mantra}”` : `“Consistency beats intensity.”`;

    // Swap loading screen with Card
    loading.style.display = 'none';
    resultCard.style.display = 'block';

    // Update global state
    activeUserProfile = profile;
    
    // Enable Chat Section
    const chatInput = document.getElementById('chatInput');
    const btnSendChat = document.getElementById('btnSendChat');
    const chatMessages = document.getElementById('chatMessages');
    
    chatInput.disabled = false;
    chatInput.placeholder = "Ask your FutureMe anything...";
    btnSendChat.disabled = false;

    // Custom chat introduction depending on AI mode
    let welcomeMsg = `I am here, ${profile.name}. The roadmap to "${profile.oneYearVision}" is clear to me because I lived it. Ask me any question about your daily execution, your doubts, or the next step.`;
    if (isFallback) {
        welcomeMsg += ` (Running in high-fidelity offline mode)`;
    }

    chatMessages.innerHTML = `
        <div class="chat-bubble chat-future">
            <span class="chat-label">FutureMe</span>
            ${welcomeMsg}
        </div>
    `;

    // Log success
    if (isFallback) {
        showToast("FutureMe Report generated (Offline Mode)");
    } else {
        showToast("FutureMe report created successfully with Gemini.");
    }
}

/* --- COPY RESULTS REPORT --- */
function copyResultToClipboard() {
    if (!activeUserProfile) return;

    const message = document.getElementById('dynamicMessage').innerText;
    const identity = document.getElementById('dynamicIdentity').innerText;
    const habit = document.getElementById('dynamicHabit').innerText;
    const warning = document.getElementById('dynamicWarning').innerText;
    const mantra = document.getElementById('dynamicMantra').innerText;
    
    const moves = Array.from(document.querySelectorAll('#dynamicMoves li'))
        .map((li, index) => `${index + 1}. ${li.innerText}`)
        .join('\n');

    const copyText = `✨ FUTUREME PERSONAL CALIBRATION REPORT ✨\n` +
        `-----------------------------------------\n` +
        `Identity: ${identity}\n` +
        `Target: Build towards '${activeUserProfile.goal}'\n` +
        `Timeline Target (1 Year): ${activeUserProfile.oneYearVision}\n` +
        `Tone Paradigm: ${activeUserProfile.tone}\n\n` +
        `✉️ MESSAGE FROM YOUR FUTURE SELF:\n${message}\n\n` +
        `🚀 NEXT 3 CRITICAL MOVES:\n${moves}\n\n` +
        `⚡ ONE HABIT TO START TODAY:\n${habit}\n\n` +
        `⚠️ FUTUREME CAUTION:\n${warning}\n\n` +
        `🔮 DAILY MANTRA:\n${mantra}\n` +
        `-----------------------------------------\n` +
        `Generated via Nitish's Founder Labs.`;

    navigator.clipboard.writeText(copyText).then(() => {
        showToast("Report copied to clipboard!");
    }).catch(err => {
        console.error("Copy failed: ", err);
        showToast("Failed to copy report.", false);
    });
}

/* --- SEND CHAT MESSAGE --- */
async function sendChatMessage() {
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    const sendBtn = document.getElementById('btnSendChat');
    const question = chatInput.value.trim();

    if (!question || !activeUserProfile) return;

    // Render User message
    const userBubble = document.createElement('div');
    userBubble.className = 'chat-bubble chat-user';
    userBubble.innerHTML = `<span class="chat-label">You</span>${escapeHTML(question)}`;
    chatMessages.appendChild(userBubble);
    chatInput.value = '';

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Append to local state history
    chatHistory.push({ role: 'user', message: question });

    // Show Typing Indicator
    const typingBubble = document.createElement('div');
    typingBubble.className = 'typing-bubble';
    typingBubble.id = 'chatTypingIndicator';
    typingBubble.innerHTML = `
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
    `;
    chatMessages.appendChild(typingBubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Disable input while waiting
    chatInput.disabled = true;
    sendBtn.disabled = true;

    try {
        const response = await fetch(`${BACKEND_URL}/api/chat-futureme`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userProfile: activeUserProfile,
                chatHistory: chatHistory,
                question: question
            })
        });

        // Remove indicator
        const indicator = document.getElementById('chatTypingIndicator');
        if (indicator) indicator.remove();

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || 'Server returned an error.');
        }

        const resData = await response.json();
        
        if (resData.success && resData.reply) {
            renderFutureResponse(resData.reply);
        } else {
            throw new Error('Invalid format returned by server.');
        }

    } catch (error) {
        console.warn("⚠️ Chat API call failed. Falling back to offline client response.", error.message);
        
        // Keep typing indicator showing for a natural feel before fallback response
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const indicator = document.getElementById('chatTypingIndicator');
        if (indicator) indicator.remove();

        const fallbackReply = runLocalChatSimulation(question, activeUserProfile.tone, activeUserProfile.name);
        renderFutureResponse(fallbackReply);
    } finally {
        chatInput.disabled = false;
        sendBtn.disabled = false;
        chatInput.focus();
    }
}

/* --- RENDER FUTURE RESPONSE --- */
function renderFutureResponse(reply) {
    const chatMessages = document.getElementById('chatMessages');
    
    // Add character response bubble
    const futureBubble = document.createElement('div');
    futureBubble.className = 'chat-bubble chat-future';
    futureBubble.innerHTML = `<span class="chat-label">FutureMe</span>${escapeHTML(reply).replace(/\n/g, '<br>')}`;
    chatMessages.appendChild(futureBubble);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Append to local state history
    chatHistory.push({ role: 'futureme', message: reply });
}

/* --- CHAT INPUT TRIGGERS --- */
function handleChatKeydown(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

/* --- UTIL: ESCAPE HTML --- */
function escapeHTML(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

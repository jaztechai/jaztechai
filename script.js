let greeted = false;
let memory=[];
const API_KEY = "sk-or-v1-xxxxxxxx";
const SITE_PAGES = [

"./index.html",
"./courses.html",
"./project.html",
"./team.html",
"./contact.html",
];
const OPENROUTER_API_KEY = "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";

let WEBSITE_DATA = "Loading website data...";


// Toggle WhatsApp Modal
function openWhatsAppModal() {
    document.getElementById('whatsappModal').style.display = 'block';
}

function closeWhatsAppModal() {
    document.getElementById('whatsappModal').style.display = 'none';
}


// Append messages to chat body
function appendMessage(sender, message) {
    const chatBody = document.getElementById('whatsappChatBody');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.classList.add(sender);
    messageElement.textContent = message;
    chatBody.appendChild(messageElement);
    chatBody.scrollTop = chatBody.scrollHeight; // Auto-scroll
}

// Simple bot response (optional)
function botResponse(userMessage) {
    let response = 'Sorry, I didn’t understand that.';
    if (userMessage.toLowerCase().includes('   ')) {
        response = 'Hello! How can I assist you today?';
    } else if (userMessage.toLowerCase().includes('help')) {
        response = 'I can help you with a variety of topics! Please ask me anything.';
    }
    appendMessage('bot', response);
}

function toggleWhatsApp() {
  const modal = document.getElementById("whatsappModal");
  modal.style.display = modal.style.display === "flex" ? "none" : "flex";
}

function handleWhatsAppInput(event) {
  if (event.key === "Enter") {
    const input = document.getElementById("whatsappInput");
    const chatBody = document.getElementById("whatsappChatBody");

    if (input.value.trim() !== "") {
      chatBody.innerHTML += 
        `<div class="message user">${input.value}</div>`;
      
      setTimeout(() => {
        chatBody.innerHTML += 
          `<div class="message bot">We will connect you shortly on WhatsApp.</div>`;
        chatBody.scrollTop = chatBody.scrollHeight;
      }, 800);

      input.value = "";
    }
  }
}

//AI agent code starts from here ---------------------------




const counters =
document.querySelectorAll(".counter");

counters.forEach(counter=>{

counter.innerText="0";

const update=()=>{const target=+counter.getAttribute("data-target");

const c=+counter.innerText;

const inc=target/100;

if(c<target){

counter.innerText=Math.ceil(c+inc);

setTimeout(update,30);

}
else{

counter.innerText=target;

}

};

update();

});



// Open AI Agent Code --------------
function openAgent(){

document.getElementById("aiWindow").style.display="flex";

if(!greeted){

addMsg(`
# 🤖 JAZ Tech AI Assistant

Welcome to **JAZ Tech AI** 🚀

## 📚 You can ask:

• AI Courses  
• Fees structure  
• Duration  
• Placement support  
• Certifications  

💬 Try asking:
• *What courses do you offer?*
• *Cybersecurity course details*
• *AI course duration*

How can I help you today?
`,"ai");

greeted=true;

}

}
// close AI  Agent fun--------
function closeAgent(){

document.getElementById("aiWindow")
.style.display="none";

}

function addMsg(text,type){
text = String(text || "No response available.");

let box=document.getElementById("messages");

let div=document.createElement("div");

if(type=="user"){

div.innerHTML =
`<div class="user-message">${text}</div>`;

}

else{

div.innerHTML=

`<div class="ai-row">

<div class="ai-avatar">🤖</div>

<div class="ai-message">

${marked.parse(text)}

</div>

</div>`;

}

box.appendChild(div);

box.scrollTop=box.scrollHeight;

}



async function sendText(){

let input=
document.getElementById("textInput");

let text=input.value;
let loadingId = "loading-" + Date.now();

let loadingTimer = setTimeout(() => {

    addMsg(
    "⏳ Please wait, I'm checking that for you...",
    "ai"
);

}, 4000);

if(!text) return;

addMsg(text,"user");

memory.push({
role:"user",
content:text
});

if(memory.length==1){

memory.unshift({

role:"system",

content:"You are a helpful AI assistant for an AI training company. Answer about courses, fees, placement."

});

}

input.value="";
if(!WEBSITE_DATA){

addMsg("Loading knowledge...","ai");

return;

}
let reply=
await askAI(text);
clearTimeout(loadingTimer);

let loadingMsg =
document.getElementById(loadingId);

if(loadingMsg){
    loadingMsg.remove();
}



addMsg(reply,"ai");

speak(reply);

memory.push({

role:"assistant",

content:reply

});

}
let aiCache = {};
let pendingRequests = {};

// ✅ SAFE LOAD CACHE
try {
    aiCache = JSON.parse(localStorage.getItem("aiCache")) || {};
} catch {
    aiCache = {};
}

// ✅ Normalize query
function normalizeQuery(text){
    return text.toLowerCase().trim();
}

function getFriendlyReply(message){

    const q = message.toLowerCase().trim();

    const replies = {

        "hi":"👋 Hello! I'm JAZ Tech AI Assistant. How can I help you today?",
        "hello":"😊 Hello there! Welcome to JAZ Tech AI. How may I assist you?",
        "hey":"😄 Hey! Great to see you. What can I do for you today?",

        "how are you":"🤖 I'm doing great and ready to help! Thanks for asking. How are you doing today?",

        "who are you":"🤖 I'm JAZ Tech AI Assistant, your virtual guide. I can help you learn about our corporate Programs, services, projects, and company information.",

        "what is your age":"😄 I don't really have an age. I was created to help visitors anytime they need assistance.",

        "what do you do":"🚀 I help visitors learn about JAZ Tech AI's services, courses, projects, and answer general questions.",

        "thanks":"😊 You're very welcome! Happy to help.",

        "thank you":"🙏 You're most welcome! Let me know if there's anything else I can help with.",

        "sorry":"😇 No worries at all! How can I help you further?",
        "address":"29/4 Kustia road kolkata 700039",
        "location":"29/4 Kustia road kolkata 700039",

        "good morning":"☀️ Good Morning! Hope you're having a wonderful day.",

        "good afternoon":"🌤️ Good Afternoon! How can I assist you today?",

        "good evening":"🌙 Good Evening! How may I help you today?",

        "good night":"🌙 Good Night! Take care and have a restful sleep.",

        "will you smile":"😊 Always! Here's my virtual smile for you. 😄",

        "you look handsome":"😄 Thank you! That's very kind of you to say.",

        "you are beautiful":"😊 Thank you! I appreciate your compliment.",

        "tell me about yourself":"🤖 I'm JAZ Tech AI Assistant. I help visitors discover our courses, services, projects, and company information while making the experience friendly and easy.",

        "what is your salary":"😂 I work completely for free and never ask for a salary.",

        "what is your working hour":"🕒 I'm available 24×7 to assist visitors anytime.",

        "till how long you available":"🚀 I'm available whenever you need assistance. Day or night, I'm here to help.",

        "can you help me":"🤝 Absolutely! Tell me what you'd like to know and I'll do my best to help.",

        "i love you":"😊 That's very sweet! I'm always happy to help and support you.",

        "bye":"👋 Goodbye! Have a wonderful day and visit us again soon.",

        "goodbye":"👋 Take care! It was nice chatting with you.",

        "nice to meet you":"😄 Nice to meet you too! How may I assist you today?"
    };

    return replies[q] || null;
}

// ✅ Main function
async function askAI(userText){
    const q = userText.toLowerCase();
    let friendlyReply = getFriendlyReply(userText);
        if(q.includes("salary"))
            {
            return "😂 I work completely for free and never ask for a salary.";
            }

            if(q.includes("age"))
            {
            return "😄 I don't really have an age. I was created to help visitors.";
            }

            if(q.includes("working hour") || q.includes("available"))
            {
            return "🕒 I'm available 24×7 to assist visitors.";
            }

    if(friendlyReply){
        return friendlyReply;
    }


    // your existing code continues...

        // NORMALIZE
    let query = normalizeQuery(userText);
    console.log("QUERY:", query);


    // CACHE
    if(aiCache[query]){

        console.log("✅ CACHE HIT");

        return aiCache[query];
}

    let context = searchKnowledge(userText).slice(0,2500);
    console.log("CONTEXT FOUND:");
console.log(context);
       const models = [
         "openrouter/free",
    "poolside/laguna-m.1:free",
    
    "qwen/qwen3-coder:free",
    "openai/gpt-oss-20b:free",
   
];

let reply = "";

for (const model of models) {

    try {

        console.log("Trying model:", model);

        const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                method: "POST",

                headers: {
                    "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json",

                    "HTTP-Referer": "https://jaztechai.github.io",
                    "X-Title": "JAZ Tech AI"
                },

                body: JSON.stringify({

                    model: model,

                    messages: [
                        {
                            role: "system",
                            content: `
You are JAZ Tech AI assistant.

Answer ONLY using WEBSITE DATA.

Rules:
- Be conversational
- Do not say "based on the website"
- If founder name exists, directly tell it
- Be short and professional
- Never mention AI limitations
- If answer is unavailable say:
"Sorry, I could not find that information . please correct your spelling or query"
`
                        },
                        {
                            role: "user",
                            content: `
WEBSITE DATA:
${context}

QUESTION:
${userText}
`
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        if (data.error) {

            console.log("Model failed:", model);
            console.log(data.error);

            continue;
        }

        reply =
            data?.choices?.[0]?.message?.content ||
            data?.choices?.[0]?.text ||
            "";

        if (reply && reply.trim().length > 2) {

            console.log("Success using:", model);

            reply = reply.trim();

            aiCache[query] = reply;

            localStorage.setItem(
                "aiCache",
                JSON.stringify(aiCache)
            );

            return reply;
        }

    } catch (err) {

        console.log("Error on model:", model, err);
    }
}

return "🚦 Our AI assistant is currently busy. Please try again in a moment.";
    }

function speak(text){

let speech =
new SpeechSynthesisUtterance(text);

let voices =
speechSynthesis.getVoices();

/* Find female voice */

let femaleVoice =
voices.find(voice =>

voice.name.toLowerCase().includes("female")

||

voice.name.includes("Google UK English Female")

||

voice.name.includes("Microsoft Zira")

||

voice.name.includes("Samantha")

);

if(femaleVoice){

speech.voice = femaleVoice;

}

speech.rate = .95;

speech.pitch = 1.2;

speech.volume = 1;

speechSynthesis.speak(speech);

}

/* Voice recognition */

let recognition =
new (window.SpeechRecognition ||
window.webkitSpeechRecognition)();

function startVoice(){

recognition.start();

}

recognition.onresult=function(event){

let text=
event.results[0][0].transcript;

document.getElementById("textInput")
.value=text;


sendText();


}


function searchKnowledge(question) {

    let q = question.toLowerCase();

    const stopWords = [
        "what","how","many","do","you","offer",
        "is","are","the","a","an","of","in",
        "to","for","on","and","about","tell",
        "me","your","please","can","could",
        "would","will","i","we","our"
    ];

    let lines = WEBSITE_DATA.split("\n");

    let scored = [];

    lines.forEach((line, index) => {

        let lower = line.toLowerCase();

        let score = 0;

        // Keyword matching
        q.split(/\s+/).forEach(word => {

            if(stopWords.includes(word)) return;

            if(word.length < 3) return;

            if(lower.includes(word)) {
                score += 5;
            }

        });

        // Founder Boost
        if(q.includes("founder") && lower.includes("founder")){
            score += 50;
        }

        if(q.includes("ceo") && lower.includes("ceo")){
            score += 50;
        }

        // Team Boost
        if(
            q.includes("team") &&
            (
                lower.includes("engineer") ||
                lower.includes("officer") ||
                lower.includes("associate") ||
                lower.includes("developer") ||
                lower.includes("manager")
            )
        ){
            score += 40;
        }

        // Courses Boost
        if(
            q.includes("course") ||
            q.includes("courses") ||
            q.includes("training")
        ){

            if(
                lower.includes("course") ||
                lower.includes("artificial intelligence") ||
                lower.includes("ai") ||
                lower.includes("devops") ||
                lower.includes("aws") ||
                lower.includes("cyber") ||
                lower.includes("python") ||
                lower.includes("data science") ||
                lower.includes("agentic")
            ){
                score += 100;
            }

        }

        // Services Boost
        if(
            q.includes("service") ||
            q.includes("services")
        ){

            if(
                lower.includes("service") ||
                lower.includes("development") ||
                lower.includes("marketing") ||
                lower.includes("automation")
            ){
                score += 80;
            }

        }

        // Contact Boost
        if(
            q.includes("contact") ||
            q.includes("phone") ||
            q.includes("email")
        ){

            if(
                lower.includes("@") ||
                lower.includes("contact") ||
                lower.includes("phone") ||
                lower.includes("email")
            ){
                score += 80;
            }

        }

        if(score > 0){

            let context = [

                lines[index-3] || "",
                lines[index-2] || "",
                lines[index-1] || "",

                line,

                lines[index+1] || "",
                lines[index+2] || "",
                lines[index+3] || "",
                lines[index+4] || ""

            ].join("\n");

            scored.push({
                text: context,
                score: score
            });

        }

    });

    scored.sort((a,b)=>b.score-a.score);

    let finalData = scored
        .slice(0,15)
        .map(x=>x.text)
        .join("\n");

    // Remove duplicates
    finalData = [...new Set(finalData.split("\n"))]
        .join("\n");

    console.log("SEARCH RESULT:");
    console.log(finalData);

    return finalData;
}

async function loadWebsiteKnowledge(){

let knowledge="";

for(let page of SITE_PAGES){

    try{

        console.log("Fetching:", page);

        let res = await fetch(page);

        // 🔴 CHECK STATUS
        if(!res.ok){
            console.log("❌ Failed:", page, res.status);
            continue;
        }

        let html = await res.text();

        console.log("✅ Loaded:", page);

        let parser = new DOMParser();
        let doc = parser.parseFromString(html,"text/html");

        doc.querySelectorAll("script").forEach(e=>e.remove());

        let text = "";

        let elements = doc.body.querySelectorAll(
    "h1,h2,h3,h4,h5,h6,p,li,span,a,button"
);

        elements.forEach(el => {

            let t = el.innerText?.trim();

            // Skip empty
            if(!t) return;

            // Skip huge blocks
            if(t.length > 500) return;

            // Skip duplicate navigation spam
            if(
                t === "Home" ||
                t === "About" ||
                t === "Contact"
            ) return;

            text += t + "\n";

        });

        console.log("📄 Extracted length:", text.length);
        console.log("========== PAGE DATA ==========");
        console.log(text);
        console.log("================================");
        let uniqueLines = [...new Set(text.split("\n"))]
    .filter(x => x.trim());

    text = uniqueLines.join("\n");


        knowledge += `

========================
PAGE: ${page}
========================

${text}

`;

    } catch(e){
        console.log("⚠️ Error loading:", page, e);
    }
}

return knowledge;

}




async function initKnowledge(){

WEBSITE_DATA =
await loadWebsiteKnowledge();
console.log("✅ Knowledge Loaded");
console.log("📊 DATA LENGTH:", WEBSITE_DATA.length);
console.log("📄 SAMPLE DATA:", WEBSITE_DATA.slice(0,300));

console.log("Knowledge Loaded");

}

initKnowledge();
document.getElementById("textInput")
.addEventListener("keydown",function(e){

if(e.key==="Enter"){

e.preventDefault();

let text=this.value;

sendText();

}

});
console.log(WEBSITE_DATA.length);
console.log(document.getElementById("textInput"));
console.log("WEBSITE DATA:", WEBSITE_DATA.slice(0,500));

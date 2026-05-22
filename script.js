let greeted = false;
let memory=[];

const SITE_PAGES = [

"./index.html",
"./courses.html",
"./project.html",
"./team.html",
"./ai-course.html",
"./contact.html",



];
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

// ✅ Main function
async function askAI(userText){

        // NORMALIZE
    let query = normalizeQuery(userText);
    console.log("QUERY:", query);


    // CACHE
    if(aiCache[query]){

        console.log("✅ CACHE HIT");

        return aiCache[query];
}

    let context = searchKnowledge(userText).slice(0,1500);

    try{

        let response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                method:"POST",

                headers:{
                    "Authorization":"Bearer",
                    "Content-Type":"application/json",

                    // optional but recommended
                    "HTTP-Referer":"http://127.0.0.1:5501",
                    "X-Title":"JAZ Tech AI"
                },

                body: JSON.stringify({

                    model:"arcee-ai/trinity-large-thinking:free",

                    messages:[
                        {
                            role:"system",
                            content:`
You are JAZ Tech AI assistant.


Answer ONLY using WEBSITE DATA.

Rules:
- Be conversational
- Do not say "based on the website".
-If founder name exists, directly tell it.
- Be short and professional
- If answer exists in website data, answer clearly
- Never say "based on provided data"
- Never mention AI limitations
- If answer is unavailable, say:
"Sorry, I could not find that information on our website."

.

Use professional formatting.

Use:
# Headings
• Bullet points
Short clean answers
`
                        },

                        {
                            role:"user",
                            content:`
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

        let data = await response.json();

        console.log("OpenRouter:", data);

        // HANDLE API ERRORS
        if(data.error){

            console.log("❌ OpenRouter Error:", data.error);

            return data.error.message;
        }

        let reply =
        data?.choices?.[0]?.message?.content ||
        data?.choices?.[0]?.message?.reasoning ||
        data?.choices?.[0]?.text ||
        "";

        if(reply){

            reply = reply.trim();

            if(reply.length < 2){
                return "AI could not generate response.";
}

            aiCache[query] = reply;

            localStorage.setItem(
                "aiCache",
                JSON.stringify(aiCache)
            );

        return reply;
    }

    }
    catch(err){

        console.log(err);

        return "AI error";
    }
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


function searchKnowledge(question){

    let q = question.toLowerCase();

    let lines = WEBSITE_DATA.split("\n");

    let scored = [];

    lines.forEach((line, index)=>{

        let lower = line.toLowerCase();

        let score = 0;

        q.split(" ").forEach(word=>{

            if(lower.includes(word)){
                score += 3;
            }

        });

        // Important boosts
        if(q.includes("founder") && lower.includes("founder")){
            score += 20;
        }

        if(q.includes("ceo") && lower.includes("ceo")){
            score += 20;
        }

        if(q.includes("team") && (
            lower.includes("engineer") ||
            lower.includes("officer") ||
            lower.includes("associate")
        )){
            score += 15;
        }

        if(score > 0){

            // include nearby lines
            let context = [
                lines[index-1] || "",
                line,
                lines[index+1] || "",
                lines[index+2] || ""
            ].join("\n");

            scored.push({
                text: context,
                score
            });

        }

    });

    scored.sort((a,b)=>b.score-a.score);

    let finalData = scored
        .slice(0,10)
        .map(x=>x.text)
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

        let elements = doc.body.querySelectorAll("*");

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


        knowledge += text;

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

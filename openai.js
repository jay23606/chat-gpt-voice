//Interesting use-case of GPT helping me make this code more modular

/*
"identify non-local JS variables for this method: [openAiSend]"
==>
"I want to redesign this function to be more modular (perhaps as a class) given these non-locals will be passed in as options 
to the instance where name of the class/prototype is called AI and the method name is StreamCompletions:"
- `codeCbx` - if `system` key is passed in options object then we include a system message (value of key is string)
- `history` - if `history` key is passed then we construct the history array like this after the fetch (value of key is integer):
-- history.push({ role: 'user', content: input.value }, { role: 'assistant', content: output.textContent });
-- history.length > 4 && (history.shift(), history.shift());
- `enableVoice` - if `voice` key is passed and is true then we push to AI instance sentences array 
- `sIndex` - this is a private instance variable (integer) used to speak the sentences
- `stopStreaming` - this is a public property of the AI instance that when set to true causes the instance to stop streaming
- `timer` - an instance object that can enable and disable speaking that also exposes a cancelSpeaking method

"this is actually what we want not pushing this.history:

if (/[.;!?]$/.test(word.trimEnd())) { this.sentences.push(arr); arr = []; }

We do want to push to this.history once though when the method returns in (line === 'data: [DONE]') using what is contained in arr2.join('')"
==>FIXED

"the output is fine streaming to an element I guess however I'd like it to support elements that don't have a textContent property. 
I'd also like to check input and if it doesn't have a value property then we perhaps check other common properties otherwise if it is 
a string then we can just use the string as the input prompt"
==>INCLUDED but took out innerHTML

"is there a way to refactor this to make it shorter?
let prompt = "";
        if (typeof input === "string") prompt = input;
        else if (input && input.value) prompt = input.value;
        else if (input && input.textContent) prompt = input.textContent;"
==>const prompt = input?.value ?? input?.textContent ?? input ?? '';

"is there a way to refactor this to make it shorter?
                if (typeof output === "object" && output !== null) {
                    if (output.textContent) {
                        output.textContent = arr2.join('');
                    } else if (output.value !== undefined) {
                        output.value = arr2.join('');
                    }
                } else if (typeof output === "function") {
                    output(arr2.join(''));
                }"
==>
if (typeof output === "object" && output !== null) {
  output?.textContent ?? (output.value !== undefined && (output.value = arr2.join('')));
} else if (typeof output === "function") {
  output(arr2.join(''));
}

"this is my AI class, do you see any areas of improvement:"
==>
1. Consider breaking down the `StreamCompletions` method into smaller, more focused methods. For example, you could create a separate method for handling the API request, another method for parsing the response, and another method for updating the output. This can make the code more modular and easier to understand.
2. Consider using constants or variables to store magic numbers or strings, such as the GPT model name and the stream delimiter (`'[DONE]'`). This can make the code more readable and maintainable.
3. Consider using `const` instead of `let` for variables that don't change after initialization, such as `system` and `decoder`. This can make the code more readable and prevent accidental reassignment.
4. Consider handling errors more gracefully in the `StreamCompletions` method. For example, you can catch and log errors instead of simply setting an `onerror` handler on the reader object.
5. Consider using more descriptive variable names. For example, `arr` and `arr2` could be renamed to something more specific that reflects their purpose.
6. Consider validating the `input` and `output` parameters in the `StreamCompletions` method to prevent potential errors or unexpected behavior.
7. Consider using a linter and code formatter to enforce consistent code style and catch potential errors. This can improve the code's readability and maintainability.

"I somewhat disagree with these points but I would like to include model and temperature to the options, 
just print the new constructor that has current defaults"==>ADDED

"Is there a more terse way to create a constructor without all the `this`"
if you want to create a constructor without using `this`, you can use a factory function instead of a class constructor. Here's an example:
==>
function createAI(options) {
  const model = options.model || "gpt-3.5-turbo";
  const temperature = options.temperature || 0.8;
  const codeCbx = options.system || null;
  const enableSentences = options.enableSentences || false;
  const stopStreaming = false;
  const timer = options.timer || null;
  const history = [];
  const sentences = [];
  sentences.index = 0;
  function StreamCompletions(input, output, token) {
    // ...
  }
  return { model, temperature, codeCbx, enableSentences, stopStreaming, timer, history, sentences, StreamCompletions };
}

Could you write me a test page to test out my AI class which is written in openai.js so that it is instantiated twice and 
that when we enter 2 separate prompts into 2 separate textareas that the output is then streamed to 2 separate DIVs.
We can create the instances like this:
let ai1 = new AI();
ai1.StreamCompletions(textarea1, div1, localStorage.getItem('OPENAI_API_KEY'))
let ai2 = new AI();
ai2.StreamCompletions(textarea2, div2, localStorage.getItem('OPENAI_API_KEY'))
==>AVAILABLE UNDER gh-pages branch html/openaijs-test.html

USAGE:
const options = {
    system: "Write html only,no explanation.Put script tag in body.Use lamdas to save space",
    history: 2,
    enableSentences: true,
    voice: true,
    timer: myTimerInstance // replace with an actual timer instance fo
};
let ai = new AI();
*/
class AI {
    constructor(options) {
        this.model = options?.model ?? "gpt-3.5-turbo";
        this.temperature = options?.temperature ?? 0.8;
        this.system = options?.system ?? null;
        this.stopStreaming = false;
        this.enableSentences = options?.enableSentences ?? false;
        this.timer = options?.timer ?? null;
        this.history = [];
        this.sentences = [];
        this.sentences.index = 0;
    }
    async StreamCompletions(input, output, token) {
        let system = [];
        if (this.system) system.push({ "role": "system", "content": this.system });
        const prompt = input?.value ?? input?.textContent ?? input ?? '';
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ model: this.model, temperature: this.temperature, stream: true, messages: [...system, ...this.history, { role: "user", content: prompt }] })
        });
        let arr = [], arr2 = [], reader = response.body.getReader();
        reader.onerror = err => this.timer && this.timer.cancelSpeaking();
        this.timer && this.timer.enableSpeaking();
        for (; ;) {
            const { done, value } = await reader.read();
            if (done) return;
            const decoder = new TextDecoder(), chunk = decoder.decode(value, { stream: true }), lines = chunk.split('\n');
            for (const line of lines) {
                if (this.stopStreaming) return;
                if (line.length === 0 || line.startsWith(':')) continue;
                if (line === 'data: [DONE]') {
                    if (this.enableSentences) this.sentences.push(arr);
                    this.history.push({ role: 'user', content: prompt }, { role: 'assistant', content: arr2.join('') });
                    if (history.length > (options?.history ?? 2) << 1) (history.shift(), history.shift());
                    return;
                }
                const { choices } = JSON.parse(line.substring(6));
                if (!choices) continue;
                const word = choices[0].delta.content || '';
                arr.push(word); arr2.push(word);
                if (/[.;!?]$/.test(word.trimEnd())) { this.sentences.push(arr); arr = []; }
                if (typeof output === "object" && output !== null) output?.textContent ?? (output.value !== undefined && (output.value = arr2.join('')));
                else if (typeof output === "function") output(arr2.join(''));
            }
        }
    }
}
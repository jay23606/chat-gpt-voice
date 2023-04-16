class OpenAI {
    constructor(apiKey, opts = {}) {
        this.apiKey = apiKey;
        this.baseUrl = opts.baseUrl || 'https://api.openai.com/v1';
        this.headers = opts.headers || { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.apiKey}` };
        this.model = opts.model || 'gpt-3.5-turbo';
        this.stream = opts.stream !== undefined ? opts.stream : true;
        this.temp = opts.temp || 0.8;
        this.max_history = opts.max_history || 2;
        this.stopStreaming = opts.stopStreaming || false;
        this.enableSentences = opts.enableSentences || false;
        this.system = opts.system || [];
        this.history = [], this.sentences = [];
    }
    async models() {
        const response = await fetch(`${this.baseUrl}/models`, { method: 'GET', headers: this.headers });
        return await response.json().data
    }
    async chat(prompt, output = (text) => console.log(text)) {
        const body = JSON.stringify({
            model: this.model, temperature: this.temp, stream: this.stream,
            messages: [...this.system, ...this.history, { role: "user", content: prompt }]
        });
        const response = await fetch(`${this.baseUrl}/chat/completions`, {
            method: 'POST',
            headers: { ...this.headers, ...(this.stream ? { 'Transfer-Encoding': 'chunked' } : {}) },
            body: body
        });
        if (!this.stream) return await response.json().choices[0].text;
        let arr = [], arr2 = [], reader = response.body.getReader();
        reader.onerror = err => console.log(err);
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
                    if (this.history.length > this.max_history << 1) (this.history.shift(), this.history.shift());
                    return;
                }
                const { choices } = JSON.parse(line.substring(6));
                if (!choices) continue;
                const word = choices[0].delta.content || '';
                if (word == '') continue;
                if (this.enableSentences) arr.push(word);
                arr2.push(word);
                if (this.enableSentences && /[.;!?]$/.test(word.trimEnd())) { this.sentences.push(arr); arr = []; }
                this._resolveOutput(arr2.join(''), output);
            }
        }
    }
    async listen(btn, output) {
        const devices = navigator.mediaDevices;
        if (!devices.getUserMedia) return;
        let chunks = [];
        let onSuccess = async stream => {
            const recorder = new MediaRecorder(stream);
            btn.onclick = () => btn.textContent === 'Stop' ? (recorder.stop(), btn.textContent = 'Start') : (recorder.start(), btn.textContent = 'Stop');
            recorder.onstop = async e => {
                const data = new FormData();
                data.append('file', new Blob(chunks, { 'type': 'audio/webm' }), "listen.webm")
                data.append('model', 'whisper-1');
                const opts = { method: 'POST', headers: { 'Authorization': `Bearer ${this.apiKey}` }, body: data };
                chunks = [];
                try { this._resolveOutput((await (await fetch('https://api.openai.com/v1/audio/transcriptions', opts)).json()).text, output); }
                catch (err) { console.log(err) }
            }
            recorder.ondataavailable = e => chunks.push(e.data)
        }
        let onError = err => console.log('The following error occured: ' + err)
        devices.getUserMedia({ audio: true }).then(onSuccess, onError);
    }
    _resolveOutput = (text, output) => typeof output === 'function' ? output(text) : ((output && output.textContent !== undefined) ? output.textContent = text : (output && (output.value = text)));
}
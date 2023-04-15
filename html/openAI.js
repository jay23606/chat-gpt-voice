<!-- https://jay23606.github.io/chat-gpt-voice/html/openAI.js -->
javascript
class OpenAI {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.openai.com/v1/';
  }

  async generateText(prompt, model, maxTokens) {
    const endpoint = 'completions';
    const payload = {
      prompt: prompt,
      model: model,
      max_tokens: maxTokens
    };

    const response = await fetch(this.baseUrl + endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(payload)
    });

    const json = await response.json();
    return json.choices[0].text; // Return the generated text
  }

  async listModels() {
    const endpoint = 'models';

    const response = await fetch(this.baseUrl + endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      }
    });

    const json = await response.json();
    return json.data; // Return an array of available models
  }

  async search(model, query, documents) {
    const endpoint = 'search';
    const payload = {
      model: model,
      query: query,
      documents: documents
    };

    const response = await fetch(this.baseUrl + endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(payload)
    });

    const json = await response.json();
    return json.data; // Return search results
  }

  async generateStreamingText(prompt, model, maxTokens) {
    const endpoint = 'completions';
    const payload = {
      prompt: prompt,
      model: model,
      max_tokens: maxTokens
    };

    const response = await fetch(this.baseUrl + endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        'Transfer-Encoding': 'chunked'
      },
      body: JSON.stringify(payload)
    });

    const reader = response.body.getReader();
    let decoder = new TextDecoder();
    let result = '';

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      result += decoder.decode(value);
      console.log(result); // Log the generated text as it is streamed
    }
  }
}

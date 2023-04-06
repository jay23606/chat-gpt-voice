# chat-gpt-voice

Under 100 lines of vanilla JS code creates a voice bot using [ChatGPT](https://chat.openai.com "ChatGPT is an artificial-intelligence (AI) chatbot developed by OpenAI and launched in November 2022. It is built on top of OpenAI's GPT-3.5 and GPT-4 families of large language models (LLMs) and has been fine-tuned (an approach to transfer learning) using both supervised and reinforcement learning techniques.") [API](https://platform.openai.com/docs/api-reference/chat "gpt-3.5-turbo, is the same model used in the ChatGPT product. It is priced at $0.002 per 1k tokens, which is 10x cheaper than our existing GPT-3.5 models. It’s also our best model for many non-chat use cases—we’ve seen early testers migrate from text-davinci-003 to gpt-3.5-turbo with only a small amount of adjustment needed to their prompts.")

Employs [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API "The Web Speech API enables you to incorporate voice data into web apps. The Web Speech API has two parts: SpeechSynthesis (Text-to-Speech), and SpeechRecognition (Asynchronous Speech Recognition.)")'s interfaces for speech recognition and text synthesis, enabling speech-to-text and text-to-speech capabilities.

Simply tap/click on the body of the page to activate speech recognition

<strong>Live demo:</strong>

https://raw.githack.com/jay23606/chat-gpt-voice/main/chat.html (or tinyurl.com/gpt-voice)

I've also added a form of "tabs" using iframes and a way to toggle to vanilla-chatgpt

https://raw.githack.com/jay23606/chat-gpt-voice/main/tabs.html (or tinyurl.com/gpt-voice-tabs)

Requires entering in an [API key](https://platform.openai.com/account/api-keys) from [openai.com](https://chat.openai.com) which is stored in localStorage 

<strong>To get api key:</strong>

https://platform.openai.com/account/api-keys

A checkbox is included to enable or disable STT and TTS whose state is also stored in localStorage

I wrote it primarily so I could easily ping ChatGPT on my mobile device (Added PWA support using manifest.json)


<strong>Screenshot</strong>:


![screenshot](screenshot.png)

<strong>Inspiration:</strong>

https://github.com/casualwriter/vanilla-chatgpt

https://mdn.github.io/dom-examples/web-speech-api/speech-color-changer/




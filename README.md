# chat-gpt-voice

Under ~~100~~ 200 lines of plain HTML/CSS/JS code creates a voice bot using [ChatGPT](https://chat.openai.com "ChatGPT is an artificial-intelligence (AI) chatbot developed by OpenAI and launched in November 2022. It is built on top of OpenAI's GPT-3.5 and GPT-4 families of large language models (LLMs) and has been fine-tuned (an approach to transfer learning) using both supervised and reinforcement learning techniques.") [API](https://platform.openai.com/docs/api-reference/chat "gpt-3.5-turbo, is the same model used in the ChatGPT product. It is priced at $0.002 per 1k tokens, which is 10x cheaper than our existing GPT-3.5 models. It’s also our best model for many non-chat use cases—we’ve seen early testers migrate from text-davinci-003 to gpt-3.5-turbo with only a small amount of adjustment needed to their prompts.") and can also write its own code and push it to GitHub using [GitHub REST API](https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28#create-a-file).

I wrote it primarily so I could easily ping ChatGPT on my mobile device (Added [PWA](https://en.wikipedia.org/wiki/Progressive_web_app "A progressive web application (PWA), or progressive web app, is a type of application software delivered through the web, built using common web technologies including HTML, CSS, JavaScript, and WebAssembly. It is intended to work on any platform with a standards-compliant browser, including desktop and mobile devices.") support using manifest.json)

I then thought it would be neat if it could write it's own code just like [OpenAI Codex playground](https://dev.to/bhagvank/open-ai-codex-playground-5ebk) but also optionally publish to github instead of [JSBin](https://jsbin.com/?html,output). I looked into publishing to JSBin but I didn't see a way to [POST the data there](https://jsbin.com/help/experimental-features/) without a paid subscription although it may be possible with other online JS editors. I did enable [contenteditable](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/contenteditable) while Code is checked and turned off spellcheck so that modifications to the output can be made easily and pushed again.

Employs [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API "The Web Speech API enables you to incorporate voice data into web apps. The Web Speech API has two parts: SpeechSynthesis (Text-to-Speech), and SpeechRecognition (Asynchronous Speech Recognition.)")'s interfaces for speech recognition and text synthesis, enabling speech-to-text and text-to-speech capabilities.

Simply tap/click on the body of the page to activate speech recognition

<strong>Live demo:</strong>

https://raw.githack.com/jay23606/chat-gpt-voice/main/chat.html (or tinyurl.com/gpt-voice)

I've also added a form of "tabs" using iframes and a way to toggle to vanilla-chatgpt

https://raw.githack.com/jay23606/chat-gpt-voice/main/tabs.html (or tinyurl.com/gpt-voice-tabs)

Added example of using [Whisper](https://platform.openai.com/docs/api-reference/audio) endpoint for speech-to-text:

https://raw.githack.com/jay23606/chat-gpt-voice/main/record.html

Requires entering in an [API key](https://platform.openai.com/account/api-keys "An API key is a unique code generated by a service provider that allows access to their application programming interface (API). It is essentially a secret access code that helps the API provider identify and authenticate the user or application making the API request. It is commonly used by developers to access and use services and data provided by web-based applications and services. The API key is usually required to be included in the header or query string of the API request to allow access to the requested API resources.") from [openai.com](https://chat.openai.com "Navigate to ChatGPT") which is stored in localStorage 

<strong>To get api key(s):</strong>

https://platform.openai.com/account/api-keys

https://github.com/settings/tokens

A checkbox is included to enable or disable STT and TTS whose state is also stored in localStorage

<strong>Screenshots</strong>:


![screenshot](screenshot.png)

You can now instruct it to write runnable and editable JS apps and it can also push it to GitHub Pages and provide a link (requires GitHub API PAT with repo access-also stored in localStorage):

![screenshot](screenshot2.png)

If you look under the html folder in the gh-pages branch you will find some apps this app has written

<strong>Inspiration:</strong>

https://github.com/casualwriter/vanilla-chatgpt

https://mdn.github.io/dom-examples/web-speech-api/speech-color-changer/

<i>Speech recognition does not work in [Firefox](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API#browser_compatibility) but should be possible to get working using the whisper example</i>

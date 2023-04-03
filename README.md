# chat-gpt-voice
A voice chatbot that uses ChatGPT 3.5 completions endpoint written in vanilla JavaScript that is under 100 lines of fairly legible code

Uses Web Speech API's SpeechRecognition and SpeechSynthesisUtterance interfaces for voice-to-text and text-to-voice 

Simply tap/click on the body of the page to activate speech recognition

Live demo:

https://jabdal.w3spaces.com/voice.html

Requires entering in an API key from openai.com which is stored in localStorage 

A checkbox was added enable or disable Voice and the state is also stored in localStorage

I wrote it primarily so I could ping ChatGPT more easily on my mobile device

To get api key:

https://platform.openai.com/account/api-keys

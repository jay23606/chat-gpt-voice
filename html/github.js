<!-- https://jay23606.github.io/chat-gpt-voice/html/github.js -->
javascript
class GitHub{
  constructor(token, owner, repo) {
    this.token = token;
    this.owner = owner;
    this.repo = repo;
    this.baseUrl = `https://api.github.com/repos/${owner}/${repo}/contents/`;
  }

  async getFile(path) {
    const endpoint = `${path}`;

    const response = await fetch(this.baseUrl + endpoint, {
      headers: {
        'Authorization': `Token ${this.token}`
      }
    });

    const json = await response.json();
    return json.content; // Return the file content as a base64-encoded string
  }

  async createOrUpdateFile(path, message, content) {
    const endpoint = `${path}`;

    const response = await fetch(this.baseUrl + endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${this.token}`
      },
      body: JSON.stringify({
        message: message,
        content: content
      })
    });

    const json = await response.json();
    return json.content; // Return the file content as a base64-encoded string
  }

  async deleteFile(path, message) {
    const endpoint = `${path}`;

    const response = await fetch(this.baseUrl + endpoint, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${this.token}`
      },
      body: JSON.stringify({
        message: message
      })
    });

    const json = await response.json();
    return json.content; // Return the file content as a base64-encoded string
  }
}

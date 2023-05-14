class GitHub {
    constructor(token, owner, repo, branch = "gh-pages") {
        this.token = token, this.owner = owner, this.repo = repo, this.branch = branch;
        this.baseUrl = `https://api.github.com/repos/${owner}/${repo}/contents/`;
        this.headers = { 'Content-Type': 'application/json', 'Authorization': `Token ${this.token}` };
    }
    async getFile(path, method = 'GET') {
        const response = await fetch(this.baseUrl + path, { headers: this.headers, method: method });
        return response;
    }
    async createOrUpdateFile(path, content, message = "") {
        let response = await this.getFile(`${path}?ref=${this.branch}`, 'HEAD');
        const etag = response.status === 404 ? null : response.headers.get('etag');
        let body = { message: message, content: this._convertToUtf8Base64(content), branch: this.branch };
        if (etag) body.sha = etag.substring(3, etag.length - 1);
        response = await fetch(this.baseUrl + path, { method: 'PUT', headers: this.headers, body: JSON.stringify(body) });
        return response;
    }
    async deleteFile(path, message = "") {
        let response = await this.getFile(`${path}?ref=${this.branch}`, 'HEAD');
        const etag = response.status === 404 ? null : response.headers.get('etag');
        let body = { message: message, branch: this.branch }
        if (etag) body.sha = etag.substring(3, etag.length - 1);
        response = await fetch(this.baseUrl + path, {
            method: 'DELETE',
            headers: this.headers,
            body: JSON.stringify(body)
        });
        return response;
    }
    _convertToUtf8Base64(str) {
        const codePoints = Array.from(str).map((char) => char.codePointAt(0)), arr = new Uint8Array(codePoints.length * 4);
        let i = 0;
        codePoints.forEach((p) => {
            if (p <= 0x7f) arr[i++] = p;
            else if (p <= 0x7ff) (arr[i++] = 0xc0 | (p >> 6), arr[i++] = 0x80 | (p & 0x3f));
            else if (p <= 0xffff) (arr[i++] = 0xe0 | (p >> 12), arr[i++] = 0x80 | ((p >> 6) & 0x3f), arr[i++] = 0x80 | (p & 0x3f));
            else (arr[i++] = 0xf0 | (p >> 18), arr[i++] = 0x80 | ((p >> 12) & 0x3f), arr[i++] = 0x80 | ((p >> 6) & 0x3f), arr[i++] = 0x80 | (p & 0x3f));
        });
        return btoa(String.fromCharCode.apply(null, arr.slice(0, i)));
    }
}
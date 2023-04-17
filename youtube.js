//My custom solution for showing search-related youtube videos without api access
//Usage:
//const youtube = new YouTube('.videos', 5);
//document.getElementById('searchButton').addEventListener('click', () => {
//    youtube.search(document.getElementById('searchQuery').value);
//});
class YouTube {

    constructor(videosSelector, numVideos) {
        this.videosSelector = videosSelector || '';
        this.numVideos = numVideos || 5;
        this.search = this.search.bind(this);
        this.renderVideos = this.renderVideos.bind(this);
        this.isMobile = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
    }
    //these seem to work but may create my own proxy
    //cors.zme.ink, cors-anywhere.herokuapp.com
    search(searchQuery, done) {
        let url = "https://cors.zme.ink/https://www.youtube.com/results?search_query=";
        if (isMobile) url = "https://cors.zme.ink/https://m.youtube.com/results?search_query="
        fetch(`https://cors.zme.ink/https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`)
            .then(response => response.text())
            .then(data => {
                // Extract the video IDs from the search results using regex
                const videoIds = [];
                let regex = /"videoId":"([^"]+)"/g;
                if (isMobile) //regex = /\\x22videoId\\x22:\\x22([^\\x22]+)\\x22/g;
                    regex = /\\x22videoId\\x22:\\x22(\w+)\\x22/g;
                let match, count = 0;
                while (match = regex.exec(data)) {
                    // Add the video ID to the array if it doesn't already exist,
                    // and skip the first video ID
                    if (!videoIds.includes(match[1])) {
                        count++;
                        if (count > 1) videoIds.push(match[1]); // 1st video might be trash??
                    }
                    if (videoIds.length >= this.numVideos) break;
                }
                this.renderVideos(videoIds);
                if (done) done();
            })
            .catch(error => { console.log('Error:', error) });
    }

    renderVideos(videoIds) {
        const videosDiv = document.querySelector(this.videosSelector);
        videosDiv.innerHTML = '';
        for (const videoId of videoIds) {
            const videoDiv = document.createElement('div');
            videoDiv.classList.add('video');
            const oEmbedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
            fetch(oEmbedUrl)
                .then(response => response.json())
                .then(data => videoDiv.innerHTML = data.html)
                .catch(error => console.error(error));
            videosDiv.appendChild(videoDiv);
        }
    }
}
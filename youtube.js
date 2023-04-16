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
    }
    //possible alternatives
    //cors.zme.ink, cors-anywhere.herokuapp.com
    search(searchQuery, done) {
        fetch(`https://cors.zme.ink/https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`)
            .then(response => response.text())
            .then(data => {
                // Extract the video IDs from the search results using regex
                const videoIds = [];
                const regex = /"videoId":"([^"]+)"/g;
                let match, count = 0;
                while (match = regex.exec(data)) {
                    // Add the video ID to the array if it doesn't already exist,
                    // and skip the first video ID
                    if (!videoIds.includes(match[1])) {
                        count++;
                        if (count > 1) videoIds.push(match[1]); // 1st video might be trash
                    }
                    if (videoIds.length >= this.numVideos) break;
                }
                this.renderVideos(videoIds);
                if (done) done();
            })
            .catch(error => { console.log('Error:', error) });
    }

    renderVideos(videoIds) {
        // Embed the videos horizontally in the div
        const videosDiv = document.querySelector(this.videosSelector);
        videosDiv.innerHTML = '';
        for (const videoId of videoIds) {
            const videoDiv = document.createElement('div');
            videoDiv.classList.add('video');
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube.com/embed/${videoId}`;
            iframe.frameborder = '0';
            //iframe.allowfullscreen = 'true';
            iframe.setAttribute('allowfullscreen', 'true');
            videoDiv.appendChild(iframe);
            videosDiv.appendChild(videoDiv);
        }
    }
}
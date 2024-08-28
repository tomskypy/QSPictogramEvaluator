export class SVGService {
    constructor(db, storage) {
        this.db = db;
        this.storage = storage;
        this.svgList = [];
        this.svgCache = {};
    }

    loadSVGs() {
        return this.db.ref('svgs').once('value')
            .then(snapshot => {
                this.svgList = Object.entries(JSON.parse(snapshot.val()));
            })
            .catch(error => {
                console.error('Error fetching SVGs:', error);
            });
    }

    getRandomPair() {
        const max = this.svgList.length;
        return [this.svgList[Math.floor(Math.random() * max)], this.svgList[Math.floor(Math.random() * max)]];
    }

    getSVGURL(index) {
        return this.svgList[index][1];
    }

    getSVGName(index) {
        return this.svgList[index][0];
    }
}

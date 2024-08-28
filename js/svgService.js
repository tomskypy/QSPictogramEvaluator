export class SVGService {
    constructor(storage) {
        this.storage = storage;
        this.svgList = [];
        this.svgCache = {};
        this.categories = [];
    }

    loadCategories() {
        return this.storage.ref('pictogram-categories.json').getDownloadURL()
            .then(url => fetch(url))
            .then(response => response.json())
            .then(data => {
                this.categories = data;
                return this.categories;
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });
    }

    async loadSVGs(categoryName) {
        const category = this.categories.find(cat => cat.name === categoryName);
        if (!category) {
            return Promise.reject('Category not found');
        }

        this.svgList = [];
        const fetchSVGPromises = [];

        for (let i = 1; i <= 100; i++) {
            const svgName = `${category.name}_${i}`;
            const svgURL = `${category.urlFormat}${i}.svg?alt=media`;

            if (this.svgCache[svgName]) {
                // If SVG is already cached, use it
                this.svgList.push([svgName, this.svgCache[svgName]]);
            } else {
                // Fetch SVG data and cache it
                const fetchPromise = fetch(svgURL)
                    .then(response => response.text())
                    .then(svgData => {
                        this.svgCache[svgName] = svgData; // Cache the SVG data
                        this.svgList.push([svgName, svgData]);
                    });
                fetchSVGPromises.push(fetchPromise);
            }
        }

        // Wait for all SVGs to be fetched and cached
        await Promise.all(fetchSVGPromises);
        return this.svgList;
    }

    getRandomPair() {
        const max = this.svgList.length;
        return [
            this.svgList[Math.floor(Math.random() * max)],
            this.svgList[Math.floor(Math.random() * max)]
        ];
    }

    getSVGData(index) {
        return this.svgList[index][1];
    }

    getSVGName(index) {
        return this.svgList[index][0];
    }
}

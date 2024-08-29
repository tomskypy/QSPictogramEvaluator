export class SVGService {
    constructor(storage) {
        this.storage = storage;
        this.svgList = [];
        this.svgCache = {};
        this.categories = [];
        this.differenceSize = 20;
        this.nameToIndex = {};
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
                this.svgList.push([svgName, this.svgCache[svgName]]);
            } else {
                const fetchPromise = fetch(svgURL)
                    .then(response => response.text())
                    .then(svgData => {
                        this.svgCache[svgName] = svgData;
                        this.svgList.push([svgName, svgData]);
                    });
                fetchSVGPromises.push(fetchPromise);
            }
        }

        await Promise.all(fetchSVGPromises);
        this.updateNameToIndex();
        return this.svgList;
    }

    updateNameToIndex() {
        this.nameToIndex = this.svgList.reduce((acc, [name, data], index) => {
            const numberPart = parseInt(name.split('_').pop(), 10);
            acc[numberPart] = index;
            return acc;
        }, {});
    }

    setDifferenceSize(size) {
        this.differenceSize = size;
    }

    getRandomPair() {
        const max = this.svgList.length - 1;
        const index1 = Math.floor(Math.random() * max);
        const index2 = index1 - this.differenceSize + Math.floor(Math.random() * this.differenceSize * 2) % max;
        return [
            this.svgList[this.nameToIndex[index1]],
            this.svgList[this.nameToIndex[index2]]
        ];
    }

    getSVGData(index) {
        return this.svgList[index][1];
    }

    getSVGName(index) {
        return this.svgList[index][0];
    }
}

let svgList = [];
let showTime = null;

function loadSVGs() {
    db.ref('svgs').once('value')
        .then(snapshot => {
            svgList = Object.entries(JSON.parse(snapshot.val()));
            displayRandomPair();
        })
        .catch(error => {
            console.error('Error fetching SVGs:', error);
        });
}

function displayRandomPair() {
    if (svgList.length < 2) return;

    const [index1, index2] = getRandomPair(svgList.length);
    updateSVGs(index1, index2);
    showTime = new Date();
}

function updateSVGs(index1, index2) {
    document.getElementById('svg1').src = svgList[index1][1];
    document.getElementById('svg2').src = svgList[index2][1];
    document.getElementById('svg1').dataset.name = svgList[index1][0];
    document.getElementById('svg2').dataset.name = svgList[index2][0];
}

function getRandomPair(max) {
    return [Math.floor(Math.random() * max), Math.floor(Math.random() * max)];
}

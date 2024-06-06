document.getElementById('setCount').addEventListener('click', function() {
    const inputCount = parseInt(document.getElementById('inputCount').value);
    const inputGroup = document.querySelector('.inp-group');
    const hitungButton = document.getElementById('hitung');
    const kembaliButton = document.getElementById('kembali');

    inputGroup.innerHTML = ''; // Clear existing inputs

    for (let i = 0; i < inputCount; i++) {
        const flex = document.createElement('div');
        flex.className = 'flex';

        const itemNumberLabel = document.createElement('label');
        itemNumberLabel.textContent = `Input ke-${i + 1}`;

        const name = document.createElement('input');
        name.type = 'text';
        name.placeholder = 'Masukkan Nama Barang';

        const weight = document.createElement('input');
        weight.type = 'number';
        weight.placeholder = 'Masukkan Berat Barang';

        const profit = document.createElement('input');
        profit.type = 'number';
        profit.placeholder = 'Masukkan Profit Barang';

        flex.appendChild(itemNumberLabel);
        flex.appendChild(name);
        flex.appendChild(weight);
        flex.appendChild(profit);

        inputGroup.appendChild(flex);
    }

    // Munculkan tombol Hitung dan Kembali
    hitungButton.style.display = 'block';
    kembaliButton.style.display = 'block';
});

document.getElementById('kembali').addEventListener('click', function() {
    window.location.href = 'home.html';
});

document.getElementById('hitung').addEventListener('click', function() {
    const items = [];
    const inputs = document.querySelectorAll('.flex');

    inputs.forEach((input, index) => {
        const name = input.children[1].value;
        const weight = parseFloat(input.children[2].value);
        const profit = parseFloat(input.children[3].value);
        const density = profit / weight;
        items.push({ name: name, profit: profit, weight: weight, density: density });
    });

    const maxWeight = 300;

    // Fungsi brute force
    function bruteforce(items, maxWeight) {
        const n = items.length;
        let maxProfit = 0;
        let bestCombination = [];
        
        function* combinations(array, r) {
            const data = new Array(r);
            function* combHelper(start, depth) {
                if (depth === r) {
                    yield data.slice();
                    return;
                }
                for (let i = start; i <= array.length + depth - r; i++) {
                    data[depth] = array[i];
                    yield* combHelper(i + 1, depth + 1);
                }
            }
            yield* combHelper(0, 0);
        }
        
        for (let r = 1; r <= n; r++) {
            for (let subset of combinations(items, r)) {
                const totalWeight = subset.reduce((sum, item) => sum + item.weight, 0);
                const totalProfit = subset.reduce((sum, item) => sum + item.profit, 0);
                if (totalWeight <= maxWeight && totalProfit > maxProfit) {
                    maxProfit = totalProfit;
                    bestCombination = subset;
                }
            }
        }
        
        return { maxProfit, bestCombination };
    }

    // Fungsi greedy by density
    function greedybydensity(items, maxWeight) {
        items.sort((a, b) => b.density - a.density);

        let totalWeight = 0;
        let totalProfit = 0;
        let selectedItems = [];

        for (let item of items) {
            if (totalWeight + item.weight <= maxWeight) {
                selectedItems.push(item);
                totalWeight += item.weight;
                totalProfit += item.profit;
            }
        }

        return { totalProfit, selectedItems };
    }

    // Mengukur waktu mulai untuk brute force
    const startBruteForce = performance.now();
    const resultBruteForce = bruteforce(items, maxWeight);
    const endBruteForce = performance.now();

    // Mengukur waktu mulai untuk greedy by density
    const startGreedy = performance.now();
    const resultGreedy = greedybydensity(items, maxWeight);
    const endGreedy = performance.now();

    // Menampilkan data yang sudah diinputkan
    let inputDataHtml = '<h2>Data yang Diinputkan</h2>';
    inputDataHtml += '<table style="width: 100%; border-collapse: collapse;">';
    inputDataHtml += '<tr style="background-color: #1E94FD; color: white;"><th>No</th><th>Nama Barang</th><th>Profit Barang</th><th>Berat Barang</th><th>Density Barang</th></tr>';
    items.forEach((item, index) => {
        inputDataHtml += `<tr style="background-color: #e4f2ff;"><td>${index + 1}</td><td>${item.name}</td><td>${item.profit}</td><td>${item.weight}</td><td>${item.density.toFixed(2)}</td></tr>`;
    });
    inputDataHtml += '</table>';

    // Menampilkan hasil brute force dalam tabel
    let bruteForceHtml = '<h2>Brute Force Algorithm</h2>';
    bruteForceHtml += '<table style="width: 100%; border-collapse: collapse;">';
    bruteForceHtml += '<tr style="background-color: #1E94FD; color: white;"><th>Nama Barang</th><th>Profit Barang</th><th>Berat Barang</th><th>Density Barang</th></tr>';
    resultBruteForce.bestCombination.forEach(item => {
        bruteForceHtml += `<tr style="background-color: #e4f2ff;"><td>${item.name}</td><td>${item.profit}</td><td>${item.weight}</td><td>${item.density.toFixed(2)}</td></tr>`;
    });
    bruteForceHtml += `</table><p>Profit Maksimum: ${resultBruteForce.maxProfit}</p>`;
    bruteForceHtml += `<p>Running time: ${(endBruteForce - startBruteForce) / 1000} detik</p>`;

    // Menampilkan hasil greedy dalam tabel
    let greedyHtml = '<h2>Greedy by Density Algorithm</h2>';
    greedyHtml += '<table style="width: 100%; border-collapse: collapse;">';
    greedyHtml += '<tr style="background-color: #1E94FD; color: white;"><th>Nama Barang</th><th>Profit Barang</th><th>Berat Barang</th><th>Density Barang</th></tr>';
    resultGreedy.selectedItems.forEach(item => {
        greedyHtml += `<tr style="background-color: #e4f2ff;"><td>${item.name}</td><td>${item.profit}</td><td>${item.weight}</td><td>${item.density.toFixed(2)}</td></tr>`;
    });
    greedyHtml += `</table><p>Profit Maksimum: ${resultGreedy.totalProfit}</p>`;
    greedyHtml += `<p>Running time: ${(endGreedy - startGreedy) / 1000} detik</p>`;

    document.querySelector('.container').innerHTML = inputDataHtml + bruteForceHtml + greedyHtml;
});

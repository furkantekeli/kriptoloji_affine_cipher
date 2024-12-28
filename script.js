// Türk alfabesi
const TURKISH_ALPHABET = 'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ';
const M = TURKISH_ALPHABET.length; // 29 harf

function modInverse(a, m) {
    for (let x = 1; x < m; x++) {
        if ((a * x) % m === 1) {
            return x;
        }
    }
    return null;
}

function validateA(a) {
    return modInverse(a, M) !== null;
}

function turkishToUpper(text) {
    return text
        .replace(/i/g, 'İ')
        .replace(/ı/g, 'I')
        .toUpperCase();
}

function sifreleme(metin, a, b) {
    if (!validateA(a)) {
        return 'Hata: a değeri 29 ile aralarında asal olmalıdır.';
    }

    return turkishToUpper(metin).split('').map(harf => {
        const index = TURKISH_ALPHABET.indexOf(harf);
        if (index === -1) {
            return harf; // Türk alfabesi dışındaki karakterleri olduğu gibi bırak
        }
        const sifreliIndex = (a * index + b) % M;
        return TURKISH_ALPHABET[sifreliIndex];
    }).join('');
}

function cozme(sifreliMetin, a, b) {
    if (!validateA(a)) {
        return 'Hata: a değeri 29 ile aralarında asal olmalıdır.';
    }

    const aInverse = modInverse(a, M);
    
    return sifreliMetin.split('').map(harf => {
        const index = TURKISH_ALPHABET.indexOf(harf);
        if (index === -1) {
            return harf;
        }
        const cozulmusIndex = (aInverse * (index - b + M)) % M;
        return TURKISH_ALPHABET[cozulmusIndex];
    }).join('');
}

// Türk alfabesi için geçerli a değerlerini bulma fonksiyonu
function findValidAValues() {
    return Array.from({length: M}, (_, i) => i + 1)
        .filter(a => modInverse(a, M) !== null);
}

function generateRandomValues() {
    const validAValues = findValidAValues();
    const randomA = validAValues[Math.floor(Math.random() * validAValues.length)];
    const randomB = Math.floor(Math.random() * M);
    return { a: randomA, b: randomB };
}

// Şifreleme Form İşlemi
document.getElementById('sifreleme-formu').addEventListener('submit', function(e) {
    e.preventDefault();
    const metin = document.getElementById('sifreleme-metin').value;
    const a = parseInt(document.getElementById('a-deger').value);
    const b = parseInt(document.getElementById('b-deger').value);
    
    const sonuc = sifreleme(metin, a, b);
    document.getElementById('sifreleme-sonuc').textContent = sonuc;
    
    // Çözme alanını otomatik doldur
    document.getElementById('cozme-metin').value = sonuc;
    document.getElementById('a-deger-cozme').value = a;
    document.getElementById('b-deger-cozme').value = b;
});

// Çözme Form İşlemi
document.getElementById('cozme-formu').addEventListener('submit', function(e) {
    e.preventDefault();
    const sifreliMetin = document.getElementById('cozme-metin').value;
    const a = parseInt(document.getElementById('a-deger-cozme').value);
    const b = parseInt(document.getElementById('b-deger-cozme').value);
    
    const sonuc = cozme(sifreliMetin, a, b);
    document.getElementById('cozme-sonuc').textContent = sonuc;
});

// Şifreleme formu için rastgele değer butonu
document.getElementById('rastgele-a-b-sifreleme').addEventListener('click', function() {
    const { a, b } = generateRandomValues();
    document.getElementById('a-deger').value = a;
    document.getElementById('b-deger').value = b;
});

// Kopyalama butonları için işlemler
document.getElementById('kopyala-sifreleme').addEventListener('click', function() {
    const sonuc = document.getElementById('sifreleme-sonuc').textContent;
    navigator.clipboard.writeText(sonuc).then(() => {
        this.innerHTML = '<i class="fas fa-check"></i> Kopyalandı!';
        setTimeout(() => {
            this.innerHTML = '<i class="fas fa-copy"></i> Kopyala';
        }, 2000);
    });
});

document.getElementById('kopyala-cozme').addEventListener('click', function() {
    const sonuc = document.getElementById('cozme-sonuc').textContent;
    navigator.clipboard.writeText(sonuc).then(() => {
        this.innerHTML = '<i class="fas fa-check"></i> Kopyalandı!';
        setTimeout(() => {
            this.innerHTML = '<i class="fas fa-copy"></i> Kopyala';
        }, 2000);
    });
});

// Adım adım gösterim fonksiyonları
function generateEncryptionSteps(metin, a, b) {
    const steps = [];
    const buyukHarfMetin = turkishToUpper(metin);
    steps.push(`Başlangıç metni: ${metin}`);
    
    buyukHarfMetin.split('').forEach((harf, index) => {
        const alfabeIndex = TURKISH_ALPHABET.indexOf(harf);
        if (alfabeIndex === -1) {
            steps.push(`${index + 1}. adım: "${harf}" Türk alfabesinde değil, değiştirilmedi.`);
            return;
        }
        
        const sifreliIndex = (a * alfabeIndex + b) % M;
        steps.push(`${index + 1}. adım: "${harf}" (index: ${alfabeIndex}) → "${TURKISH_ALPHABET[sifreliIndex]}" (index: ${sifreliIndex}) | Formül: (${a} * ${alfabeIndex} + ${b}) mod ${M} = ${sifreliIndex}`);
    });

    return { 
        sifreliMetin: sifreleme(metin, a, b),
        steps 
    };
}

function showEncryptionSteps() {
    const metin = document.getElementById('sifreleme-metin').value;
    const a = parseInt(document.getElementById('a-deger').value);
    const b = parseInt(document.getElementById('b-deger').value);

    const { sifreliMetin, steps } = generateEncryptionSteps(metin, a, b);
    
    const stepsModal = document.getElementById('encryption-steps-modal');
    const stepsContent = document.getElementById('encryption-steps-content');
    
    stepsContent.innerHTML = steps.map(step => `<p>${step}</p>`).join('');
    stepsModal.style.display = 'flex';
}

document.getElementById('adim-adim-sifreleme').addEventListener('click', showEncryptionSteps);

// Modal kapatma
document.querySelector('.close-modal').addEventListener('click', function() {
    document.getElementById('encryption-steps-modal').style.display = 'none';
});

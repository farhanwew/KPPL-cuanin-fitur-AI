// Selection logic for buttons
document.querySelectorAll('.percentage-btn').forEach(btn => {
    btn.addEventListener('click', function() {
    const parent = this.parentElement;
    parent.querySelectorAll('.percentage-btn').forEach(b => {
        b.classList.remove('active');
        b.style.transform = '';
    });
    this.classList.add('active');
    this.style.transform = 'scale(0.98)';
    });
});

// Form submission
document.getElementById('submitBtn').addEventListener('click', async function() {
    const businessInterestBtn = document.querySelector('#businessInterest .active');
    const targetMarketBtn = document.querySelector('#targetMarket .active');
    const description = document.getElementById('description').value;
    const email = document.getElementById('email').value;
    
    if (!businessInterestBtn) {
    alert('Harap pilih Minat Bisnis!');
    return;
    }
    
    if (!targetMarketBtn) {
    alert('Harap pilih Target Pasar!');
    return;
    }
    
    if (!description) {
    alert('Harap isi Deskripsi Usaha!');
    return;
    }
    
    if (!email) {
    alert('Harap isi Email!');
    return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
    alert('Harap masukkan alamat email yang valid!');
    return;
    }
    
    // Show loading, hide form
    document.getElementById('formSection').style.display = 'none';
    document.getElementById('loadingSection').style.display = 'block';
    
    try {
    // Make API request to backend
    const response = await fetch('http://localhost:8000/recommendations', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        business_interest: businessInterestBtn.textContent,
        target_market: targetMarketBtn.textContent,
        description: description,
        email: email
        })
    });
    
    if (!response.ok) {
        throw new Error('Terjadi kesalahan saat memproses permintaan Anda.');
    }
    
    const data = await response.json();
    
    // Hide loading, show results
    document.getElementById('loadingSection').style.display = 'none';
    document.getElementById('resultSection').style.display = 'block';
    
    // Populate primary recommendation
    const primary = data.primary_recommendation;
    document.getElementById('primaryRecommendation').innerHTML = `
        <div class="recommendation-card">
        <div class="recommendation-header">
            <h3 style="margin: 0;">${primary.nama_usaha}</h3>
            <span class="match-badge primary-badge">Rekomendasi Utama</span>
        </div>
        <p>${primary.deskripsi}</p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="details-group">
            <span class="details-label">Modal Awal</span>
            <span class="details-value">${primary.modal_yang_dibutuhkan}</span>
            </div>
            <div class="details-group">
            <span class="details-label">Perkiraan Keuntungan</span>
            <span class="details-value">${primary.perkiraan_keuntungan}</span>
            </div>
            <div class="details-group">
            <span class="details-label">Skala Usaha</span>
            <span class="details-value">${primary.skala_usaha}</span>
            </div>
            <div class="details-group">
            <span class="details-label">Target Pasar</span>
            <span class="details-value">${primary.target_pasar}</span>
            </div>
        </div>
        </div>
    `;
    
    // Populate alternative recommendations
    document.getElementById('alternativeRecommendations').innerHTML = data.alternative_recommendations.map(alt => `
        <div class="recommendation-card">
        <h3 style="margin-top: 0;">${alt.nama_usaha}</h3>
        <p>${alt.deskripsi_singkat}</p>
        <div class="details-group">
            <span class="details-label">Modal Awal</span>
            <span class="details-value">${alt.modal_yang_dibutuhkan}</span>
        </div>
        </div>
    `).join('');
    
    // Populate success factors
    document.getElementById('successFactors').innerHTML = data.success_factors.map(factor => `
        <li>${factor}</li>
    `).join('');
    
    // Populate challenges
    document.getElementById('challenges').innerHTML = data.challenges.map(challenge => `
        <li>${challenge}</li>
    `).join('');
    
    // Populate next steps
    document.getElementById('nextSteps').innerHTML = data.next_steps.map(step => `
        <li>${step}</li>
    `).join('');
    
    } catch (error) {
    alert('Terjadi kesalahan: ' + error.message);
    document.getElementById('loadingSection').style.display = 'none';
    document.getElementById('formSection').style.display = 'block';
    }
});

// Back to form button
document.getElementById('backToFormBtn').addEventListener('click', function() {
    document.getElementById('resultSection').style.display = 'none';
    document.getElementById('formSection').style.display = 'block';
});
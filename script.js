document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
        
        // Close mobile menu when clicking a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
            });
        });
    }
    
    // Slider value updates
    const learningRateSlider = document.getElementById('learning-rate');
    const learningRateValue = document.getElementById('learning-rate-value');
    const explorationRateSlider = document.getElementById('exploration-rate');
    const explorationRateValue = document.getElementById('exploration-rate-value');
    const speedSlider = document.getElementById('speed');
    const speedValue = document.getElementById('speed-value');
    
    if (learningRateSlider && learningRateValue) {
        learningRateSlider.addEventListener('input', function() {
            learningRateValue.textContent = parseFloat(this.value).toFixed(2);
        });
    }
    
    if (explorationRateSlider && explorationRateValue) {
        explorationRateSlider.addEventListener('input', function() {
            explorationRateValue.textContent = parseFloat(this.value).toFixed(2);
        });
    }
    
    if (speedSlider && speedValue) {
        speedSlider.addEventListener('input', function() {
            const value = parseInt(this.value);
            let speedText = '';
            
            if (value <= 3) {
                speedText = '慢速';
            } else if (value <= 7) {
                speedText = '正常';
            } else {
                speedText = '快速';
            }
            
            speedValue.textContent = speedText;
        });
    }
});

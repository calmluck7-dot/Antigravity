/**
 * 合同会社joint コーポレートサイト
 * JavaScriptファイル
 */

// ===================================
// ハンバーガーメニュー
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // メニューリンクをクリックしたらメニューを閉じる
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }
});

// ===================================
// スクロールアニメーション
// ===================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// フェードイン対象の要素を監視
document.addEventListener('DOMContentLoaded', () => {
    const fadeElements = document.querySelectorAll('.service-card, .strength-item, .company-card');
    fadeElements.forEach(el => {
        el.classList.add('fade-in');
        fadeInObserver.observe(el);
    });
});

// ===================================
// ナビゲーションスクロール効果
// ===================================
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // スクロール位置に応じてナビゲーションの背景を変更
    if (currentScroll > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.12)';
    }

    lastScroll = currentScroll;
});

// ===================================
// お問い合わせフォーム
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // フォームデータを取得
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);

            // 実際の実装では、ここでAPIにデータを送信
            console.log('フォームデータ:', data);

            // 送信完了メッセージ
            alert('お問い合わせありがとうございます。\n内容を確認次第、ご連絡いたします。');

            // フォームをリセット
            contactForm.reset();
        });
    }
});

// ===================================
// スムーズスクロール
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            const headerOffset = 70;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// 数値カウントアップアニメーション
// ===================================
const animateValue = (element, start, end, duration) => {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value.toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            // 最後の値が「+」付きの場合
            if (element.dataset.suffix) {
                element.textContent = value.toLocaleString() + element.dataset.suffix;
            }
        }
    };
    window.requestAnimationFrame(step);
};

// 統計数値のアニメーション
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                const numericValue = parseInt(text.replace(/[^0-9]/g, ''));
                const suffix = text.includes('+') ? '+' : '';
                stat.dataset.suffix = suffix;
                animateValue(stat, 0, numericValue, 2000);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', () => {
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        statsObserver.observe(heroStats);
    }
});

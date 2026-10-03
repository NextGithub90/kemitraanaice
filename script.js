/* =========================================================
   KEMITRAAN AICE INDONESIA - INTERACTIVE SCRIPT
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Navigation on Scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                if (navMenu.classList.contains('open')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-xmark');
                } else {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            }
        });

        // Close menu when clicking nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                const icon = mobileToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // 3. Filter Tabs for Business Packages
    const tabBtns = document.querySelectorAll('.tab-btn');
    const packageCards = document.querySelectorAll('.package-card');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const targetCategory = btn.getAttribute('data-category');

            packageCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (targetCategory === 'all' || cardCategory === targetCategory) {
                    card.style.display = 'flex';
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.style.transition = 'opacity 0.4s ease';
                        card.style.opacity = '1';
                    }, 50);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // 4. FAQ Accordion Toggle
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                faqItems.forEach(faq => faq.classList.remove('active'));
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });

    // 5. Image Lightbox Modal (For all images including t1 - t8)
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');

    document.addEventListener('click', (e) => {
        const targetZoom = e.target.closest('[data-zoom]');
        if (targetZoom) {
            const src = targetZoom.getAttribute('data-zoom') || targetZoom.getAttribute('src');
            const caption = targetZoom.getAttribute('data-caption') || targetZoom.getAttribute('alt') || 'Detail Gambar AICE';

            if (lightboxModal && lightboxImg) {
                lightboxImg.src = src;
                if (lightboxCaption) lightboxCaption.textContent = caption;
                lightboxModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        }
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                closeLightbox();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('active')) {
            closeLightbox();
        }
    });

    function closeLightbox() {
        if (lightboxModal) {
            lightboxModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // 6. WhatsApp Direct Pre-filled Order & Consultation
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nama = document.getElementById('nama').value.trim();
            const whatsapp = document.getElementById('whatsapp').value.trim();
            const kota = document.getElementById('kota').value.trim();
            const paket = document.getElementById('paket').value;
            const metodePembayaran = document.getElementById('metodePembayaran') ? document.getElementById('metodePembayaran').value : 'Transfer Bank';
            const catatan = document.getElementById('catatan').value.trim();

            const message = `Halo Admin Kemitraan AICE Indonesia,%0A%0ASaya ingin mendaftar kemitraan resmi:%0A` +
                `👤 *Nama:* ${encodeURIComponent(nama)}%0A` +
                `📱 *No. WhatsApp:* ${encodeURIComponent(whatsapp)}%0A` +
                `📍 *Kota / Alamat:* ${encodeURIComponent(kota)}%0A` +
                `📦 *Pilihan Paket:* ${encodeURIComponent(paket)}%0A` +
                `💳 *Metode Pembayaran:* Transfer Bank ${encodeURIComponent(metodePembayaran)}%0A` +
                (catatan ? `💬 *Catatan/Tanggal:* ${encodeURIComponent(catatan)}%0A` : '') +
                `%0ASaya memahami pembayaran dilakukan via transfer ke rekening resmi perusahaan dan pengiriman langsung diproses di hari yang sama (Free Ongkir Se-Indonesia). Mohon dikirimkan nomor rekening resmi dan panduan selanjutnya. Terima kasih!`;

            const waUrl = `https://api.whatsapp.com/send?phone=6281992200365&text=${message}`;
            window.open(waUrl, '_blank');
        });
    }

    // Helper for direct package buttons
    window.orderPackageDirect = function (packageName) {
        const message = `Halo Admin Kemitraan AICE Indonesia, saya sangat tertarik untuk memesan / info lebih lanjut tentang *${encodeURIComponent(packageName)}*. Mohon info ketersediaan slot dan promo hari ini!`;
        const waUrl = `https://api.whatsapp.com/send?phone=6281992200365&text=${message}`;
        window.open(waUrl, '_blank');
    };

    // 7. Dynamic Social Proof Notifications (Live order ticker)
    const socialToast = document.getElementById('socialToast');
    const toastName = document.getElementById('toastName');
    const toastAction = document.getElementById('toastAction');
    const toastTime = document.getElementById('toastTime');

    const buyers = [
        { name: 'Bpk. Hendra S.', city: 'Surabaya', package: 'Paket Juragan Rp 3.000.000' },
        { name: 'Ibu Ratna Dewi', city: 'Bekasi', package: 'Paket Wedding Bucket 8 Ember' },
        { name: 'Bpk. Bambang P.', city: 'Bandung', package: 'Paket Hawker Sepeda Listrik' },
        { name: 'Ibu Nurhayati', city: 'Tangerang', package: 'Paket Promo Rp 1.000.000' },
        { name: 'Bpk. Dedi Kurnia', city: 'Semarang', package: 'Paket Hawker Sepeda' },
        { name: 'Ibu Maya Lestari', city: 'Jakarta Selatan', package: 'Paket Acara VIP 13 Ember' },
        { name: 'Bpk. Agus Santoso', city: 'Sidoarjo', package: 'Paket Kemasan 25 Dus' },
        { name: 'Ibu Siska Amelia', city: 'Depok', package: 'Paket Ekonomis Rp 2.000.000' }
    ];

    let buyerIndex = 0;

    function showSocialProof() {
        if (!socialToast || !toastName || !toastAction) return;

        const buyer = buyers[buyerIndex];
        toastName.textContent = `${buyer.name} (${buyer.city})`;
        toastAction.textContent = `Baru saja mendaftar ${buyer.package}`;
        if (toastTime) toastTime.textContent = 'Beberapa saat yang lalu';

        socialToast.classList.add('show');

        setTimeout(() => {
            socialToast.classList.remove('show');
        }, 4500);

        buyerIndex = (buyerIndex + 1) % buyers.length;
    }

    setTimeout(() => {
        showSocialProof();
        setInterval(showSocialProof, 12000);
    }, 3000);

    // 8. TESTIMONIAL CAROUSEL SLIDER (T1 - T8)
    const track = document.getElementById('testimonialTrack');
    const btnPrev = document.getElementById('testimonialPrev');
    const btnNext = document.getElementById('testimonialNext');
    const dotsContainer = document.getElementById('testimonialDots');
    const slides = document.querySelectorAll('.testimonial-slide-card');

    if (track && slides.length > 0) {
        let currentIndex = 0;
        let autoPlayInterval = null;

        function getVisibleCount() {
            if (window.innerWidth <= 640) return 1;
            if (window.innerWidth <= 1024) return 2;
            return 3;
        }

        function getMaxIndex() {
            return Math.max(0, slides.length - getVisibleCount());
        }

        function updateSliderPosition() {
            const visibleCount = getVisibleCount();
            const maxIdx = getMaxIndex();

            if (currentIndex > maxIdx) currentIndex = maxIdx;
            if (currentIndex < 0) currentIndex = 0;

            // Card width + gap calculation
            const slide = slides[0];
            const gap = 24; // 1.5rem gap
            const slideWidth = slide.getBoundingClientRect().width;
            const offset = (slideWidth + gap) * currentIndex;

            track.style.transform = `translateX(-${offset}px)`;

            renderDots();
        }

        function renderDots() {
            if (!dotsContainer) return;
            dotsContainer.innerHTML = '';
            const totalDots = getMaxIndex() + 1;

            for (let i = 0; i < totalDots; i++) {
                const dot = document.createElement('span');
                dot.className = 'slider-dot' + (i === currentIndex ? ' active' : '');
                dot.setAttribute('aria-label', `Slide ${i + 1}`);
                dot.addEventListener('click', () => {
                    currentIndex = i;
                    updateSliderPosition();
                    restartAutoPlay();
                });
                dotsContainer.appendChild(dot);
            }
        }

        function nextSlide() {
            if (currentIndex >= getMaxIndex()) {
                currentIndex = 0;
            } else {
                currentIndex++;
            }
            updateSliderPosition();
        }

        function prevSlide() {
            if (currentIndex <= 0) {
                currentIndex = getMaxIndex();
            } else {
                currentIndex--;
            }
            updateSliderPosition();
        }

        if (btnNext) {
            btnNext.addEventListener('click', () => {
                nextSlide();
                restartAutoPlay();
            });
        }

        if (btnPrev) {
            btnPrev.addEventListener('click', () => {
                prevSlide();
                restartAutoPlay();
            });
        }

        function startAutoPlay() {
            stopAutoPlay();
            autoPlayInterval = setInterval(nextSlide, 4000);
        }

        function stopAutoPlay() {
            if (autoPlayInterval) {
                clearInterval(autoPlayInterval);
                autoPlayInterval = null;
            }
        }

        function restartAutoPlay() {
            stopAutoPlay();
            startAutoPlay();
        }

        const carouselWrapper = document.querySelector('.testimonial-carousel-container');
        if (carouselWrapper) {
            carouselWrapper.addEventListener('mouseenter', stopAutoPlay);
            carouselWrapper.addEventListener('mouseleave', startAutoPlay);
        }

        // Touch Swipe for Mobile
        let startX = 0;
        let endX = 0;

        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            stopAutoPlay();
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            if (diff > 40) {
                nextSlide();
            } else if (diff < -40) {
                prevSlide();
            }
            startAutoPlay();
        }, { passive: true });

        // Handle Window Resize
        window.addEventListener('resize', () => {
            updateSliderPosition();
        });

        // Initialize after a slight delay to ensure layout rendering
        setTimeout(() => {
            updateSliderPosition();
            startAutoPlay();
        }, 150);
    }

    // 9. LAPORAN & SARAN MODAL HANDLER
    const reportModal = document.getElementById('reportModal');
    const reportModalClose = document.getElementById('reportModalClose');
    const reportTriggers = document.querySelectorAll('.open-report-trigger');
    const reportForm = document.getElementById('reportForm');

    reportTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            if (reportModal) {
                reportModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    if (reportModalClose) {
        reportModalClose.addEventListener('click', closeReportModal);
    }

    if (reportModal) {
        reportModal.addEventListener('click', (e) => {
            if (e.target === reportModal) {
                closeReportModal();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && reportModal && reportModal.classList.contains('active')) {
            closeReportModal();
        }
    });

    function closeReportModal() {
        if (reportModal) {
            reportModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (reportForm) {
        reportForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nama = document.getElementById('repNama').value.trim();
            const whatsapp = document.getElementById('repWa').value.trim();
            const kategori = document.getElementById('repKategori').value;
            const pesan = document.getElementById('repPesan').value.trim();

            const reportMsg = `*LAYANAN LAPORAN & SARAN - KEMITRAAN AICE*%0A%0A` +
                `👤 *Nama Pengirim:* ${encodeURIComponent(nama)}%0A` +
                `📱 *No. WhatsApp:* ${encodeURIComponent(whatsapp)}%0A` +
                `🏷️ *Kategori:* ${encodeURIComponent(kategori)}%0A%0A` +
                `📝 *Isi Pesan/Saran:*%0A${encodeURIComponent(pesan)}%0A%0A` +
                `_Pesan dikirim melalui formulir resmi Laporan & Saran Landing Page._`;

            const waReportUrl = `https://api.whatsapp.com/send?phone=6281992200365&text=${reportMsg}`;
            window.open(waReportUrl, '_blank');
            closeReportModal();
            reportForm.reset();
        });
    }

    // 10. MOBILE BOTTOM NAVIGATION HANDLER (ScrollSpy & Smooth Tap)
    const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
    if (bottomNavItems.length > 0) {
        bottomNavItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const targetId = item.getAttribute('data-target');
                const targetEl = document.getElementById(targetId);
                if (targetEl) {
                    e.preventDefault();
                    bottomNavItems.forEach(b => b.classList.remove('active'));
                    item.classList.add('active');
                    const offset = 70;
                    const elPos = targetEl.getBoundingClientRect().top + window.pageYOffset - offset;
                    window.scrollTo({
                        top: elPos,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Scrollspy for bottom nav
        const observedSections = ['beranda', 'paket-usaha', 'paket-acara', 'testimoni', 'order-form-section'];
        window.addEventListener('scroll', () => {
            const scrollPos = window.scrollY + 250;
            for (let i = observedSections.length - 1; i >= 0; i--) {
                const sec = document.getElementById(observedSections[i]);
                if (sec && sec.offsetTop <= scrollPos) {
                    bottomNavItems.forEach(b => {
                        if (b.getAttribute('data-target') === observedSections[i]) {
                            b.classList.add('active');
                        } else {
                            b.classList.remove('active');
                        }
                    });
                    break;
                }
            }
        }, { passive: true });
    }
});
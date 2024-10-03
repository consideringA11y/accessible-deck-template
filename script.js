document.addEventListener('DOMContentLoaded', async () => {
    // Container to hold slides
    const slidesContainer = document.querySelector('.slides');

    // Array of slide files to be loaded dynamically
    const slideFiles = ['slide1.html', 'slide2.html']; // Add new slide filenames to this array

    // Function to load slides from individual HTML files
    const loadSlides = async () => {
        try {
            const slides = await Promise.all(
                slideFiles.map(async (file) => {
                    console.log(`Fetching slide: ${file}`); // Log the slide being fetched
                    const response = await fetch(`./components/slides/${file}`);
                    if (!response.ok) {
                        throw new Error(`Failed to load: ${file}`);
                    }
                    return response.text();
                })
            );

            slides.forEach((slideContent, index) => {
                console.log(`Adding slide ${index + 1} to the DOM`); // Log the slide being added
                const slideElement = document.createElement('article');
                slideElement.innerHTML = slideContent;
                slideElement.classList.add('slide');
                slideElement.setAttribute('aria-hidden', index === 0 ? 'false' : 'true');
                slidesContainer.appendChild(slideElement);
            });

            return slides.length;
        } catch (error) {
            console.error('Error loading slides:', error);
        }
    };

    const totalSlides = await loadSlides();
    if (totalSlides) {
        let currentSlideIndex = 0;

        const currentSlideNum = document.getElementById('currentSlideNum');
        const totalSlidesElement = document.getElementById('totalSlides');
        totalSlidesElement.textContent = totalSlides;

        const updateSlideCounter = () => {
            currentSlideNum.textContent = currentSlideIndex + 1;
        };

        const showSlide = (index) => {
            const slides = document.querySelectorAll('.slide');
            slides.forEach((slide, i) => {
                if (i === index) {
                    console.log(`Showing slide ${i + 1}`);
                    slide.setAttribute('aria-hidden', 'false');
                    slide.style.display = 'block'; // Make the current slide visible
                    slide.style.visibility = 'visible'; // Ensure it's visible
                } else {
                    console.log(`Hiding slide ${i + 1}`);
                    slide.setAttribute('aria-hidden', 'true');
                    slide.style.display = 'none'; // Hide the other slides
                    slide.style.visibility = 'hidden'; // Ensure it's hidden
                }
            });
            updateSlideCounter();
        };

        // Show the first slide on page load
        showSlide(currentSlideIndex);

        // Handle keydown events for navigation
        window.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' && currentSlideIndex > 0) {
                currentSlideIndex--;
                showSlide(currentSlideIndex);
            } else if (e.key === 'ArrowRight' && currentSlideIndex < totalSlides - 1) {
                currentSlideIndex++;
                showSlide(currentSlideIndex);
            }
        });
    }
});

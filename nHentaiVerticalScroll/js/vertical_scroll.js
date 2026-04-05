const bigcontainer = document.querySelector("#bigcontainer");
const id = location.pathname.split("/")[2];

fetch("https://nhentai.net/api/v2/galleries/" + id)
    .then(response => {
        if (!response.ok) {
            throw new Error("Could not get page's data!");
        }
        return response.json();
    })
    .then(jsonData => {
        const pages = jsonData.pages;
        let previous = bigcontainer;
        let index = 0;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    observer.unobserve(img);
                    img.src = img.dataset.src;
                    img.onload = () => setTimeout(loadNext, 50);
                    img.onerror = () => setTimeout(loadNext, 1500);
                }
            });
        }, { rootMargin: "2000px" });

		function loadNext() {
			if (index >= pages.length) return;
			const PRELOAD = 3; // queue up to 3 ahead at once
			for (let i = 0; i < PRELOAD && index < pages.length; i++, index++) {
				const image = document.createElement('img');
				image.dataset.src = "https://i.nhentai.net/" + pages[index].path;
				image.crossOrigin = "anonymous";
				image.loading = "lazy";

				previous.insertAdjacentElement("afterend", image);
				previous = image;

				observer.observe(image);
			}
		}

        loadNext();
    })
    .catch(error => {
        console.error("nHentai Vertical Scroll: ", String(error));
    });
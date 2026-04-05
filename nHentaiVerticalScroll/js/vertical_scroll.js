function init() {
    const bigcontainer = document.querySelector("#bigcontainer");
    if (!bigcontainer) return;
    
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
}

function waitForContainer() {
  if (document.querySelector("#bigcontainer")) {
    init();
    return;
  }

  const domObserver = new MutationObserver(() => {
    if (document.querySelector("#bigcontainer")) {
      domObserver.disconnect();
      init();
    }
  });
  domObserver.observe(document.body, { childList: true, subtree: true });
}

let lastUrl = location.href;
const navObserver = new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    if (location.pathname.match(/^\/g\/\d+/)) {
      waitForContainer();
    }
  }
});
navObserver.observe(document.body, { childList: true, subtree: true });

waitForContainer();

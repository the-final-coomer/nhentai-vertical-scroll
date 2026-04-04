const bigcontainer = $("#bigcontainer");

// get data
const id = location.pathname.split("/")[2];

fetch("https://nhentai.net/api/v2/galleries/" + id + "/pages")
	.then(response => {
		if (!response.ok) {
			throw new Error("Could not get page's data!");
		}

		return response.json();
	})
	.then(jsonData => {
		const pages = jsonData.pages;

		// add images
		let previous = bigcontainer;

		for (let i = 0; i < pages.length; i++) {

			const image = document.createElement('img');
			image.src = "https://i.nhentai.net/" + pages[i].path;

			previous.after(image);

			previous = image;
		}
	})
	.catch(error => {
		console.error("nHentai Vertical Scroll: ", error);
	})

const bigcontainer = $("#bigcontainer");

function getBaseURL() {
	let start = "https://i";

	let maxI = 4;
	let randomI = Math.floor(Math.random() * (maxI + 1));

	let end = ".nhentai.net/galleries/";

	return start + randomI + end;
}

// get data
let id = location.pathname.split("/")[2];

fetch("https://nhentai.net/api/gallery/" + id)
	.then(response => {
		if (!response.ok) {
			throw new Error("Could not get page's data!");
		}

		return response.json();
	})
	.then(jsonData => {
		let mediaCode = jsonData.media_id;
		let numPages = jsonData.num_pages;

		let url = getBaseURL() + mediaCode + "/";

		// add images
		let previous = bigcontainer;

		for (let i = 1; i <= numPages; i++) {
			let image = document.createElement('img');

			image.src = url + i + ".jpg";

			previous.after(image);

			previous = image;
		}
	})
	.catch(error => {
		console.error("nHentai Vertical Scroll: ", error);
	})
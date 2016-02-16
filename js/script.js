//----------Global variables----------//
var APP_KEY = "7ebf40e71c7f9ab478ca9f1e32b91894";
var APP_SECRET = "56d47587cd95bce8";
var search_text = "";
var API_STRING = "";
var photos = "";
var result = document.getElementById("search_results");
var searchButton = document.getElementById("search_button");
var galleryButton = document.getElementById("gallery_button");
var closeButton = document.getElementById("close_view");
var clearButton = document.getElementById("clear_button");
var imageViewer = document.getElementById("image_viewer");
var imageZoom = document.getElementById("image_zoom");
var imageGallery = [];
var images = [];

//----------Event listeners-----------//
searchButton.addEventListener("click", function(){
	searchFlickr();
});
galleryButton.addEventListener("click", function(){
	showGallery();
});
closeButton.addEventListener("click", function(){
	closeImageZoom();
});
clearButton.addEventListener("click", function(){
	clearGallery();
});
document.addEventListener('keydown', checkEnterKey, false);

//----------Classes------------------//
function Image (farm, id, secret, server, title){
	this.farm = farm;
	this.id = id;
	this.secret = secret;
	this.server = server;
	this.title = "";
	this.url = "https://farm"+this.farm+".staticflickr.com/"+this.server+"/"+this.id+"_"+this.secret+".jpg";
}

//----------Functions----------------//
function searchFlickr(){
	//get search text and prepare call to API
	search_text = document.getElementById("search_box").value;
	API_STRING = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key="+APP_KEY+"&text="+search_text+"&media=photos&format=json&nojsoncallback=1";
	if(search_text.length > 0 ){
		//reset the results and show loader gif
		images = [];;
		resetResultDiv();
		document.getElementById("loader").style.display = "block";
		var xhttp = new XMLHttpRequest();
		
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				//create objects of each image and add them to the images array and create divs for each image to show
				document.getElementById("loader").style.display = "none";
				data = JSON.parse(xhttp.responseText);
				var photos = data.photos.photo;
				
				for(var i = 0; i < photos.length;i++){
					
					var image = new Image(photos[i].farm,photos[i].id,photos[i].secret,photos[i].server,photos[i].title);
					images.push(image);
					var div = createFlickrImage(image.id, image.url);
					result.innerHTML += div;
					
				}
			}
		};
		xhttp.open("GET", API_STRING, true);
		xhttp.send();
	}else{
		alert("Du måste ange text att söka efter!");
	}
	
}

//Add image to the gallery
function addImage(id){
	console.log(id);
	var added = false;
	//Check if image is already added to gallery array
	for (var i = 0; i < imageGallery.length; i++){
		if(imageGallery[i].id == id){
			added = true;
			imageGallery.splice(i,1);
		}
	}
	//Add the correct image to the gallery array
	for(var i = 0; i < images.length; i++){
		if(images[i].id == id && added == false){
			console.log(images[i]);
			var image = new Image(images[i].farm,images[i].id,images[i].secret,images[i].server,images[i].title);
			imageGallery.push(image);
		}
	}
	
	//add style to the image to show the user it has been added/removed
	var imageDiv = document.getElementById(id);
	var overlay = document.getElementById("overlay-"+id);
	if(added){
		overlay.style.display = "none";
		
	}else{
		overlay.style.display = "block";
		overlay.innerHTML = "<img class='checkbox' src='img/checkbox.png'>";
	}
}

//Create div for search result iamge
function createFlickrImage(id, url){
	var div = "<div class='image-wrapper' id='"+id+"' onclick='addImage("+id+");'><div class='overlay' id='overlay-"+id+"'></div><img class='flickr' src='"+url+"'></div>";
	return div;
}
//Create div for gallery thumbnail
function createGalleryThumbnail(id, url){
	var div = '<div class="image-wrapper-gallery" id="'+id+'" onclick="showImage(\''+url+'\')"><img class="flickr" src="'+url+'"></div>';
	return div;
}
//Show the gallery to the user
function showGallery(){
	if(imageGallery.length > 0){
		resetResultDiv();
		for(var i = 0; i < imageGallery.length; i++){
			var div = createGalleryThumbnail(imageGallery[i].id, imageGallery[i].url);
			result.innerHTML += div;
		}
	}else{
		alert("Du måste lägga till bilder i ditt galleri för att kunna visa det");
	}
}
//Show a zoomed in view of an image in the gallery
function showImage(url){
	imageViewer.style.display = "block";
	imageZoom.innerHTML = "<img src="+url+">";
}
//Close the zoomed image
function closeImageZoom(){
	imageViewer.style.display = "none";
	imageZoom.innerHTML = "";
}
//Empty the users gallery
function clearGallery(){
	imageGallery = [];
	resetResultDiv();
}
//Empty the result view so that a new search can be made or the gallery can be shown
function resetResultDiv(){
	result.innerHTML = "";
	result.innerHTML += '<div id="loader" style="display:none"></div>'
}
//Check if the user presses enter in order to search instead of clicking the search button
function checkEnterKey(e){
	var keyCode = e.keyCode
	if(keyCode === 13){
		searchFlickr();
	}
}
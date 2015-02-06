/**
 * BetterRss  : A js lib based using jQuery to parse rss smartly depending on the given rss flow.
 * Repository : https://github.com/beuted/betterRss 
 * Author     : Benoit Jehanno
 */

 //TODO: use prototype for perf
var betterRss = {
	/**
 	 * @feed_url : url of the rss feed
 	 * @media : type of media the rss feed comes from, value supported : "default", "tumblr"
 	 */
	load: function(feed_url, media) {
		var deferred = $.Deferred();

		var item_name = (media==="github") ? "entry" : "item"  

		$.get(feed_url, function (data) {

			var res = fill_feed_info(data, media);

			// Fill the items array
			$(data).find(item_name).each(function () { // or "item" or whatever suits your feed
				var item = fill_item_info($(this), media);
				res.items.push(item);
			});

			deferred.resolve(res);
		});

		return deferred;
	}
};

var fill_feed_info = function(data, media) {
	var res = {
		// Mandatory
		title: undefined,
		link: undefined,
		description: undefined,
		items: [],

		// Opt
		pubDate: undefined,
		image: undefined,
	}

	res.title = $(data).find("title").first().text();
	res.link = $(data).find("link").first().text();

	switch(media) {
		case "tumblr":
		case "reddit":
		case "youtube":
			res.description = $(data).find("description").first().text();
			res.pubDate = $(data).find("pubDate").first().text();
		case "github":
			res.description = $(data).find("content").first().text();
			res.pubDate = $(data).find("updated").first().text();

	return res;
}

var fill_item_info = function(el, media) {

	var item = {
		// Most common
		guid: el.find("guid").text(),
		title: el.find("title").text(),
		pubDate: el.find("pubDate").text(),
		link: el.find("link").text(),
		description: el.find("description").text(),

		// less used
		author: el.find("author").text(),

		// custom
		media_url: undefined,      // url to the media (img or iframe)
		media_element: undefined,  // type of media ("img" or "iframe")
		media_thumbnail: undefined // link to an image of a thumbnail
	}


	// Computation of custom item properties
	switch(media) {
		case "tumblr":
			// Hack to be sure to have proper html in `datahtml`
			var datahtml = "<p>" + el.find("description").text() + "</p>";

			var img_url = $(datahtml).find("img").first().attr("src");
			var iframe_url = $(datahtml).find("iframe").first().attr("src");
			var link_url = $(datahtml).find("a").first().attr("href");

			if (iframe_url) {
				item.media_url = iframe_url;
				item.media_element = "iframe";
			} else if (img_url) {
				item.media_url = img_url;
				item.media_element = "img";
			} else if (link_url) {
				item.media_url = link_url;
				item.media_element = "a";
			}
			break;
		case "reddit":
			var datahtml = "<p>" + el.find("description").text() + "</p>";
			var img_url = $(datahtml).find("a:contains('\[link\]')").first().attr("href");

			if (img_url) {
				item.media_url = img_url;
				if (img_url.match(/\.(jpeg|jpg|gif|gifv|png)$/) != null) {
					item.media_element = "img";
					// TODO: wont cover everything : use regex
				} else if (img_url.indexOf("youtube.com") > -1 || img_url.indexOf("youtu.be") > -1) { 
					item.media_element = "iframe";
				} else {
					item.media_element = "a"
				}

			}
			item.media_thumbnail = el.find("thumbnail").attr("url");
			break;
		case "youtube":
			console.log("ERROR: not implemented");
			break;
		case "github":
			console.log("ERROR: not implemented");
			break;
	}

	return item;
}
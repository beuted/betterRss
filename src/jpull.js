// .outerHtml patch for jQuery
$.fn.outerHTML = function(){
 
    // IE, Chrome & Safari will comply with the non-standard outerHTML, all others (FF) will have a fall-back for cloning
    return (!this.length) ? this : (this[0].outerHTML || (
      function(el){
          var div = document.createElement('div');
          div.appendChild(el.cloneNode(true));
          var contents = div.innerHTML;
          div = null;
          return contents;
    })(this[0]));
 
}

/**
 * 
 * @feed_url : url of the rss feed
 * @media : type of media the rss feed comes from, value supported : "default", "tumblr"
 */
var betterRss = {
	load: function(feed_url, media) {
		var deferred = $.Deferred();



		$.get(feed_url, function (data) {

			var res = {
				// Mandatory
				title: undefined,
				description: undefined,
				link: undefined,
				items: [],

				// Opt
				pubDate: undefined,
				lastBuildDate: undefined,
				image: undefined,
				language: undefined,
				enclosure: undefined,
				ttl: undefined
			}

			// Fill res static fields
			res.title = $(data).find("title").first().text();
			res.link = $(data).find("link").first().text();
			res.description = $(data).find("description").first().text();
			res.pubDate = $(data).find("pubDate").first().text();
			res.lastBuildDate = $(data).find("lastBuildDate").first().text();

			// Fill the items array
			$(data).find("item").each(function () { // or "item" or whatever suits your feed
				var el = $(this);

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
						var img_url = $(datahtml).find("a:eq(2)").first().attr("href");
						//TODO: le link ne peut pas etre recup comme ca il faut passer par "[link]" (marche pas pour /news par ex)

						if (img_url) {
							item.media_url = img_url;
							if (img_url.match(/\.(jpeg|jpg|gif|gifv|png)$/) != null) {
								item.media_element = "img";
							} else if (true) { //TODO
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
				}

				res.items.push(item);
			});

			deferred.resolve(res);
		});

		return deferred;
	}
};
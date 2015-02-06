## RSS vs Atom

### Atom: Source
```
<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
```
### RSS 0.90: Source
```
<rdf:RDF
xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
xmlns="http://my.netscape.com/rdf/simple/0.9/">
```
### Netscape RSS 0.91
```
<rss version="0.91">
```

## Table of matching

Attribut          |reddit            |youtube           |tumblr            |github
------------------|------------------|------------------|------------------|-------------------------
item              |item              |?                 |item              |entry
title             |title             |?                 |title             |title
link              |link              |?                 |link              |link:first
description       |description       |?                 |description       |null 
item.title        |item.title        |?                 |item.title        |entry.title
item.link         |item.link         |?                 |item.link         |entry.link.attr(href)
item.pubDate      |item.pubDate      |?                 |item.pubDate      |entry.published
item.id           |item.guid         |?                 |item.guid         |entry.id
item.description  |item.description  |?                 |item.description  |entry.content
item.author       |(in description)  |?                 |(could use title) |entry.author.name (or uri)
item.description  |item.description  |?                 |(could use title) |entry.content



## Wanted form of content

media_url  : link, image, video
media_type : a, img, iframe
title      : text
pubDate    : date
id         : unique id
link       : url linking to the content
author     : publicator of the content ideally, reposter else
score      : calculate a score for the content (media specific)



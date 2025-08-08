# http://3.130.240.169

## Out of date README, will update on completion of current overhaul.  

![Site Screenshot](https://crystal-hair.nyc3.cdn.digitaloceanspaces.com/sitedemo.gif)

## Centralized content stream for mapping ideas, and building knowledge, visualizing live scraping data coupled with research.

Typescript, Vue3, SCSS, devise

## Features

- Account authentication with Devise JWT session tokens.
- Upload files and initialize backend Tanakai spiders with url and or usernames
- Infinitely scroll lazy loaded paginated content using Intersection Observer.
- View Images, PDFs, and texts in a resizable and draggable lightbox.
- Create collections, and assign content.
- View images, texts, and PDFs, in a resizable and draggable lightbox.
- Functionality for the user to create and edit collections of content.
- Data visualizes, in a manipulatable 3D rendered force graph.

## to self/quick notes/TODO
- folders crud
  - manage mix's folder assignments
  - manage folder contents
- kernel info edit crud
- filetype filter/sort
- nav tree custom oerdering/drag reorgnizing
- add force graph back in
- admin panel to manage all users
- soft delete/soft delete

# Bugs TODO
- [X] scroll on scrape nav
- overlay on error with debug ( for when implement live update/ creation of objects)
- fix text losing format on save
- check any multiuser support issues

# Refactor TODO
- [X] Refactor file tree into atomic design
- [X] refactor overlays and tab reusablility
- [X] refactor nav tree for code reuse
- [X] combine scrape/mix vue files
- [X] standardize styling between upload/add mix/src boxes
- rename srcurl and kernals back and front end, general restructure all remaining horrifics
- larger tab buttons

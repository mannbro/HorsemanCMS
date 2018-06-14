# HorsemanCMS
CMS System focusing on performance & scalability, security and user experience.

HorsemanCMS is especially suited for creating corporate websites and wikis. It is also co-developed with Horseman eCommerce, so that it will be possible to use as an eCommerce platform.

*Key focus*
* Don't try to be everything. Focus on what 80% of all websites need and do it extremely well and user friendly!

*Key USP:s*
* User-friendly inline true WYSIWYG editing
* Versioning / revert
* Pure PHP; no database and very few dependencies needed
* Vanilla Javascript; no framework needed
* Extremely scalable and fast due to no database, vanilla JS, light-weight templates and following best practices
* Mobile-first responsive

*Roadmap*
* Implement basic functionality (reach 1.0)
  * ~~Basic page / block loading~~
  * ~~Versioning~~
  * ~~Edit pages with WYSIWYG~~
  * WYSIWYG (In progress)
    * ~~Inline editing~~
    * ~~Bold, Italics and other basic styling~~
    * ~~Copy & paste etc~~
    * ~~Saving~~
    * Linking (in progress)
    * Containers and blocks on pages
      * ~~Make containers, not page itself, editable~~
      * ~~Refactor / change terminology of hierarchy~~
      * Possibility to set container as type
        * ~~Basic containers~~
        * ~~Possibility to have more than one article per content~~
        * ~~Possibility to add new articles~~
        * ~~Possibility to add new sections~~
        * Possibility to resort articles within section
        * Possibility to resort sections within content
        * Slideshow
        * 12-column grid    
      * Set content as block (reusable content)
    * Add page when navigating to 404
    * Fetch old versions
    * Embed Images
    * Upload Images
    * Embedded YouTube (in progress)
    * Save as / load template
    * Clean up UI/UX
    * Proper dirty handling
      * Visually show that content is dirty
      * ~~Only save if content is dirty~~
  * ~~Metadata (title, description etc)~~
  * ~~Cache control~~
  * ~~Redirects (301, 302)~~
  * Setup build chain (webpack or similar) to be able to separate JS-files in a cleaner way
  * Ensure that it's possible to upgrade without overwriting content, custom styles, templates etc
  * Authentication
  * ~~Edit blocks with WYSIWYG~~
  * Edit menus
  * Edit base template
  * Edit CSS
  * Edit JS
* ~~AJAX Loading (when changing pages, only load main content and update menu status etc)~~
* Roles (Writer, Publisher)
* Auto publish changes at a certain time
* "Browse in the future"
* Themes
* Language support
* Plugins / modules / components - pages and blocks can be other things than CMS content (PHP/JS Applications)
  * Contact form
  * Blog
* Full Text Search (Elastic, Solr or something)
* E-Commerce (Horseman eCommerce co-development)
  * Product Listing
  * Product Detail
  * Checkout
  * Shopcart
  * Product Search (Elastic, Solr or something)
  * Product Variants (size/color etc)
  * Simple Price Reductions
  * Rule based Discounts

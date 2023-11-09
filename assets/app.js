import "./app.css";
import "./css/blog.css";

require("./styles/global.css");
const $ = require("jquery");

require("bootstrap");

import "./css/custom.css";

jQuery(function () {
    $('[data-toggle="popover"]').popover();
});

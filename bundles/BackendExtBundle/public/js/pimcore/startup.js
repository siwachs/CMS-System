pimcore.registerNS("pimcore.plugin.BackendExtBundle");

pimcore.plugin.BackendExtBundle = Class.create({
    initialize: function () {
        document.addEventListener(
            pimcore.events.pimcoreReady,
            this.pimcoreReady.bind(this)
        );
    },

    pimcoreReady: function (e) {
        this.loadFontAwesome();
        this.loadTailwindCSS();
    },

    loadFontAwesome: function () {
        const link = document.createElement("link");
        link.href =
            "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css";
        link.rel = "stylesheet";
        document.head.appendChild(link);
    },

    loadTailwindCSS: function () {
        const link = document.createElement("link");
        link.href =
            "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.16/dist/tailwind.min.css";
        link.rel = "stylesheet";
        document.head.appendChild(link);
    },
});

const BackendExtBundlePlugin = new pimcore.plugin.BackendExtBundle();

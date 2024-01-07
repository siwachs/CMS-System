pimcore.registerNS("pimcore.plugin.BackendExtBundle");

pimcore.plugin.BackendExtBundle = Class.create({
    initialize: function () {
        document.addEventListener(
            pimcore.events.pimcoreReady,
            this.pimcoreReady.bind(this)
        );
        document.addEventListener(
            pimcore.events.preMenuBuild,
            this.preMenuBuild.bind(this)
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
        const script = document.createElement("script");
        script.src = "https://cdn.tailwindcss.com";
        document.body.append(script);
    },

    preMenuBuild: function (e) {
        const currentMenu = e.detail.menu;

        const customItems = [];
        currentMenu.addUserForAProductDataEntry = {
            label: t("Assign user"),
            iconCls: "fas fa-user-plus",
            priority: 69,
            items: customItems,
            shadow: false,
            handler: this.addUserForAProductDataEntryHandler.bind(this),
            noSubmenus: true,
            cls: "white-icon",
        };
    },

    addUserForAProductDataEntryHandler: function (e) {
        const dialog = document.createElement("dialog");
        const iframe = document.createElement("iframe");
        iframe.setAttribute("src", "https://www.youtube.com/embed/R0OD5F-WO9A");

        dialog.appendChild(iframe);
        document.body.appendChild(dialog);
        dialog.showModal();
    },
});

const BackendExtBundlePlugin = new pimcore.plugin.BackendExtBundle();

pimcore.registerNS("pimcore.plugin.BackendExtBundle");

pimcore.plugin.BackendExtBundle = Class.create({
    initialize: function () {
        document.addEventListener(
            pimcore.events.preMenuBuild,
            this.preMenuBuild.bind(this)
        ); // Custom menu
        document.addEventListener(
            pimcore.events.pimcoreReady,
            this.pimcoreReady.bind(this)
        );
    },

    preMenuBuild: function (e) {
        let menu = e.detail.menu;
        menu.customMenuItem = {
            label: "Assign Product",
            iconCls: "pimcore_icon_application_view_tile",
            priority: 50,
            handler: this.openAlert.bind(this),
        };
    },

    openAlert: function () {
        alert("Custom Menu Item Clicked!");
    },

    pimcoreReady: function (e) {
        alert("Triiger alert");
    },
});

const BackendExtBundlePlugin = new pimcore.plugin.BackendExtBundle();

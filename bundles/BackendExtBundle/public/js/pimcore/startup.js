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
        const link = document.createElement("link");
        link.href =
            "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.16/dist/tailwind.min.css";
        link.rel = "stylesheet";
        document.head.appendChild(link);
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
        };
    },

    addUserForAProductDataEntryHandler: function (e) {
        const dialog = document.createElement("dialog");
        const card = document.createElement("div");
        const title = document.createElement("h3");
        const iframe = document.createElement("iframe");
        const closeIcon = document.createElement("i");

        card.classList.add(
            "w-full",
            "bg-white",
            "shadow-md",
            "rounded",
            "mx-auto",
            "p-4",
            "relative"
        );

        title.classList.add("font-bold", "text-xl");
        title.innerHTML = "Assign user to a product";

        closeIcon.classList.add(
            "fas",
            "fa-times",
            "text-black",
            "absolute",
            "top-4",
            "right-4",
            "cursor-pointer",
            "text-xl"
        );
        closeIcon.addEventListener("click", function () {
            dialog.remove();
            dialog.innerHTML = "";
            closeIcon.removeEventListener("click", null);
        });

        iframe.classList.add(
            "w-full",
            "h-full",
            "border",
            "border-gray-200",
            "mt-4"
        );
        iframe.name = "assign_user";
        iframe.title = "Assign user to a product";
        iframe.setAttribute("src", "http://cms.com/backend_ext");

        card.appendChild(title);
        card.appendChild(closeIcon);
        card.appendChild(iframe);
        dialog.appendChild(card);
        document.body.appendChild(dialog);
        dialog.showModal();
    },
});

const BackendExtBundlePlugin = new pimcore.plugin.BackendExtBundle();

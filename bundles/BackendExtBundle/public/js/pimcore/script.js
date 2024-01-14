pimcore.registerNS("pimcore.plugin.CustomMenuButton");

pimcore.plugin.CustomMenuButton = Class.create({
    initialize: function () {
        document.addEventListener(
            pimcore.events.preMenuBuild,
            this.preMenuBuild.bind(this)
        );
    },

    preMenuBuild: function (e) {
        const currentMenu = e.detail.menu;

        const customItems = []; // For sub menu
        currentMenu.addUserForAProductDataEntry = {
            label: t("Assign user"),
            iconCls: "fas fa-user-plus",
            priority: 690,
            items: customItems,
            shadow: false,
            handler: this.addUserForAProductDataEntryHandler.bind(this),
            noSubmenus: true,
            cls: "text-white",
        };

        currentMenu.addUserForAProductDataEntryExtJS = {
            label: t("Assign user Ext button"),
            iconCls: "fas fa-user-plus",
            priority: 790,
            items: customItems,
            shadow: false,
            handler: this.openPanel.bind(this),
            noSubmenus: true,
            cls: "text-white",
        };
    },

    openPanel: function (e) {
        if (!Ext.getCmp("custom_ext_component")) {
            const customExtComponent = new pimcore.plugin.CustomExtComponent();
            const tabPanel = Ext.getCmp("pimcore_panel_tabs");
            const customExtComponentPanel = customExtComponent.getPanel();
            tabPanel.add(customExtComponentPanel);
            tabPanel.setActiveItem("custom_ext_component");
        } else {
            Ext.getCmp("pimcore_panel_tabs").setActiveItem(
                "custom_ext_component"
            );
        }
    },

    addUserForAProductDataEntryHandler: async function (e) {
        try {
            const dialog = document.createElement("dialog");
            const card = document.createElement("div");
            const title = document.createElement("h3");
            const closeIcon = document.createElement("i");
            const customJSComponent = new pimcore.plugin.customJSComponent();
            const form = await customJSComponent.createForm();

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

            card.appendChild(title);
            card.appendChild(closeIcon);
            card.append(form);
            dialog.appendChild(card);
            document.body.appendChild(dialog);
            dialog.showModal();
        } catch (error) {}
    },
});

const CustomMenuButtonPlugin = new pimcore.plugin.CustomMenuButton();

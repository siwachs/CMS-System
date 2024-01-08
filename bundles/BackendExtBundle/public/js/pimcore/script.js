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

        const customItems = [];
        currentMenu.addUserForAProductDataEntry = {
            label: t("Assign user"),
            iconCls: "fas fa-user-plus",
            priority: 69,
            items: customItems,
            shadow: false,
            handler: this.addUserForAProductDataEntryHandler.bind(this),
            noSubmenus: true,
            cls: "text-white",
        };
    },

    createForm: function (e) {
        try {
            const form = document.createElement("form");
            form.classList.add("my-2", "space-y-4");

            const brandLabel = document.createElement("label");
            brandLabel.textContent = "Select Brand:";
            brandLabel.setAttribute("for", "brandSelect");
            form.appendChild(brandLabel);

            const brandSelect = document.createElement("select");
            brandSelect.id = "brandSelect";
            brandSelect.name = "brand";
            brandSelect.classList.add(
                "block",
                "w-full",
                "px-4",
                "py-2",
                "border",
                "rounded",
                "bg-gray-100",
                "focus:outline-none",
                "focus:border-blue-500"
            );

            const brands = ["Brand1", "Brand2", "Brand3"];
            brands.forEach((brand) => {
                const option = document.createElement("option");
                option.value = brand;
                option.textContent = brand;
                brandSelect.appendChild(option);
            });
            form.appendChild(brandSelect);

            const categorySelect = document.createElement("select");
            categorySelect.classList.add(
                "block",
                "w-full",
                "px-4",
                "py-2",
                "border",
                "rounded",
                "bg-gray-100",
                "focus:outline-none",
                "focus:border-blue-500"
            );

            const categories = ["Category 1", "Category 2", "Category 3"];
            categories.forEach((category) => {
                const option = document.createElement("option");
                option.value = category;
                option.textContent = category;
                categorySelect.appendChild(option);
            });
            form.appendChild(categorySelect);
            return form;
        } catch (error) {
            const div = document.createElement("div");
            div.textContent = error.message;
            div.classList.add(
                "bg-red-200",
                "text-red-800",
                "px-4",
                "py-2",
                "rounded",
                "border",
                "border-red-500"
            );
            return div;
        }
    },

    addUserForAProductDataEntryHandler: function (e) {
        const dialog = document.createElement("dialog");
        const card = document.createElement("div");
        const title = document.createElement("h3");
        const closeIcon = document.createElement("i");
        const form = this.createForm();

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
    },
});

const CustomMenuButtonPlugin = new pimcore.plugin.CustomMenuButton();

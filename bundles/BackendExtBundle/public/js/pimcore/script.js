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
            priority: 690,
            items: customItems,
            shadow: false,
            handler: this.addUserForAProductDataEntryHandler.bind(this),
            noSubmenus: true,
            cls: "text-white",
        };
    },

    createSelectComponent: async function createSelectComponent(
        form,
        labelTextContent,
        defaultSelectTextContent,
        id,
        name,
        apiEndpoint
    ) {
        try {
            const label = document.createElement("label");
            label.classList.add("block", "mb-2", "text-gray-700", "font-bold");
            label.textContent = labelTextContent;
            label.setAttribute("for", id);
            form.appendChild(label);

            const select = document.createElement("select");
            select.id = id;
            select.name = name;
            select.classList.add(
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
            form.appendChild(select);

            const response = await fetch(apiEndpoint);
            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }

            const parsedResponse = await response.json();
            const data =
                parsedResponse.categories ||
                parsedResponse.brands ||
                parsedResponse.users;

            data.forEach((object) => {
                const option = document.createElement("option");
                option.value = object.id || object.userId;
                option.textContent =
                    object.categoryObjName ||
                    object.brandObjName ||
                    object.userName;
                select.appendChild(option);
            });

            const selectDefaultOption = document.createElement("option");
            selectDefaultOption.value = 0;
            selectDefaultOption.textContent = defaultSelectTextContent;
            selectDefaultOption.selected = true;
            select.insertBefore(selectDefaultOption, select.firstChild);
        } catch (error) {
            throw new Error(error.message);
        }
    },

    createForm: async function (e) {
        try {
            const form = document.createElement("form");
            form.onsubmit = this.formSubmitHandler.bind(this);
            form.classList.add("my-2", "space-y-4");

            await this.createSelectComponent(
                form,
                "Select Brand:",
                "Select Brand",
                "brandSelect",
                "brand",
                "/get-brands"
            );

            await this.createSelectComponent(
                form,
                "Select Category:",
                "Select Category",
                "categorySelect",
                "category",
                "/get-categories"
            );

            await this.createSelectComponent(
                form,
                "Select User:",
                "Select user",
                "userSelect",
                "user",
                "/get-users"
            );

            const inputLabel = document.createElement("label");
            inputLabel.classList.add(
                "block",
                "mb-2",
                "text-gray-700",
                "font-bold"
            );
            inputLabel.textContent = "Object Name";
            inputLabel.setAttribute("for", "objectName");
            form.appendChild(inputLabel);

            const input = document.createElement("input");
            input.setAttribute("type", "text");
            input.setAttribute("id", "objectName");
            input.setAttribute("name", "objectName");
            input.classList.add(
                "w-full",
                "border",
                "border-gray-300",
                "py-2",
                "px-3",
                "rounded-md",
                "focus:outline-none",
                "focus:ring-2",
                "focus:ring-blue-500",
                "focus:border-transparent"
            );
            form.appendChild(input);

            const textAreaLabel = document.createElement("label");
            textAreaLabel.classList.add(
                "block",
                "mb-2",
                "text-gray-700",
                "font-bold"
            );
            textAreaLabel.textContent = "Message";
            textAreaLabel.setAttribute("for", "message");
            form.appendChild(textAreaLabel);

            const textarea = document.createElement("textarea");
            textarea.setAttribute("id", "message");
            textarea.setAttribute("name", "message");
            textarea.classList.add(
                "w-full",
                "border",
                "border-gray-300",
                "py-2",
                "px-3",
                "rounded-md",
                "focus:outline-none",
                "focus:ring-2",
                "focus:ring-blue-500",
                "focus:border-transparent",
                "resize-none"
            );
            form.appendChild(textarea);

            const submitButton = document.createElement("button");
            submitButton.textContent = "Assign user";
            submitButton.classList.add(
                "bg-blue-500",
                "hover:bg-blue-700",
                "text-white",
                "font-bold",
                "py-2",
                "px-4",
                "rounded",
                "cursor-pointer",
                "mt-4"
            );
            submitButton.addEventListener(
                "click",
                this.formSubmitHandler.bind(this)
            );

            submitButton.type = "submit";
            form.appendChild(submitButton);

            return form;
        } catch (error) {
            const div = document.createElement("div");
            div.classList.add(
                "bg-red-200",
                "text-red-800",
                "px-4",
                "py-2",
                "rounded",
                "border",
                "border-red-500"
            );
            div.textContent = error.message;
            return div;
        }
    },

    formSubmitHandler: function (e) {
        e.preventDefault();
        const apiEndpoint = "/assign-product";
        const form = e.target.closest("form");
        const submitButton = e.target;
        if (submitButton.disabled) return;
        submitButton.disabled = true;
        submitButton.classList.add(
            "bg-gray-400",
            "cursor-not-allowed",
            "opacity-50"
        );

        const formData = new FormData(form);
        const data = {};
        for (const [key, value] of formData.entries()) {
            data[key] = value.trim();
        }
        if (
            data["brand"] == 0 ||
            data["category"] == 0 ||
            data["user"] == 0 ||
            data["objectName"] === "" ||
            data["message"] === ""
        ) {
            submitButton.disabled = false;
            submitButton.classList.remove(
                "bg-gray-400",
                "cursor-not-allowed",
                "opacity-50"
            );
            return;
        }

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "brand-id": data["brand"],
                "category-id": data["category"],
                "user-id": data["user"],
                "object-name": data["objectName"],
                message: data["message"],
            }),
        };

        fetch(apiEndpoint, options)
            .then((response) => {
                if (!response.ok) throw new Error("Failed to create object.");
                return response.json();
            })
            .then((responseDate) => {
                // Handle the successful response.
            })
            .catch((error) => {
                alert(error.message);
            })
            .finally(() => {
                submitButton.classList.remove(
                    "bg-gray-400",
                    "cursor-not-allowed",
                    "opacity-50"
                );
            });
    },

    addUserForAProductDataEntryHandler: async function (e) {
        try {
            const dialog = document.createElement("dialog");
            const card = document.createElement("div");
            const title = document.createElement("h3");
            const closeIcon = document.createElement("i");
            const form = await this.createForm();

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

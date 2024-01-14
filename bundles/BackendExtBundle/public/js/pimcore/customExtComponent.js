pimcore.registerNS("pimcore.plugin.CustomExtComponent");

pimcore.plugin.CustomExtComponent = Class.create(pimcore.element.abstract, {
    getPanel: function () {
        this.tab = new Ext.Panel({
            activeTab: 0,
            title: t("Add User Form"),
            deferredRender: false,
            closable: true,
            forceLayout: true,
            plain: true,
            tabBar: false,
            id: "custom_ext_component",
            autoScroll: true,
            iconCls: "fa fa-plus",
            renderTo: Ext.getBody(),
            cls: "text-white",
        });
        this.tab.add(this.generateForm());
        return this.tab;
    },

    generateForm: function () {
        // Fetch API data via Ext Proxy
        const brandStore = Ext.create("Ext.data.Store", {
            fields: ["id", "brandObjName"],
            proxy: {
                type: "ajax",
                url: "/get-brands",
                reader: {
                    type: "json",
                    rootProperty: "brands",
                },
            },
            autoLoad: true,
        });

        const categoryStore = Ext.create("Ext.data.Store", {
            fields: ["id", "categoryObjName"],
            proxy: {
                type: "ajax",
                url: "/get-categories",
                reader: {
                    type: "json",
                    rootProperty: "categories",
                },
            },
            autoLoad: true,
        });

        const userStore = Ext.create("Ext.data.Store", {
            fields: ["userId", "userName"],
            proxy: {
                type: "ajax",
                url: "/get-users",
                reader: {
                    type: "json",
                    rootProperty: "users",
                },
            },
            autoLoad: true,
        });

        // Form Submit Handler
        const submitForm = function () {
            const { brand, category, user, productName, message } =
                form.getValues();
            const trimmedProductName = productName.trim();
            const trimmedMessage = message.trim();

            if (
                brand == 0 ||
                category == 0 ||
                user == 0 ||
                trimmedProductName === "" ||
                trimmedMessage === ""
            ) {
                Ext.Msg.alert("Validation field", "Form Data is invalid.");
                form.getForm().reset();
                return;
            }

            const requestData = {
                "brand-id": brand,
                "category-id": category,
                "product-owner": pimcore.globalmanager.get("user").id,
                "user-id": user,
                "object-name": trimmedProductName,
                message: trimmedMessage,
            };

            Ext.Ajax.request({
                url: "/assign-product",
                method: "POST",
                jsonData: requestData,
                success: function (response) {
                    try {
                        const decodedResponse = Ext.decode(
                            response.responseText
                        );
                        Ext.Msg.alert("Success", decodedResponse.message);
                    } catch (error) {
                        Ext.Msg.alert(
                            "Error",
                            "Failed to decode server response. Please try again."
                        );
                    } finally {
                        form.getForm().reset();
                    }
                },
                failure: function (response) {
                    try {
                        const decodedResponse = Ext.decode(
                            response.responseText
                        );
                        Ext.Msg.alert("Server Error!", decodedResponse.message);
                    } catch (error) {
                        console.error("Error decoding response:", error);
                        Ext.Msg.alert(
                            "Error",
                            "Failed to decode server response. Please try again."
                        );
                    } finally {
                        form.getForm().reset();
                    }
                },
            });
        };

        // Ext Form UI
        const form = Ext.create("Ext.form.Panel", {
            autoWidth: true,
            fill: true,
            autoHeight: true,
            id: "custom_ext_component_form",
            cls: "bg-gray-100 p-6 rounded-lg shadow-md",
            bodyCls: "bg-white p-6 rounded-lg shadow-md",
            layout: {
                type: "vbox",
                align: "center", // Center the form vertically
                pack: "center", // Center the form horizontally
            },
            items: [
                {
                    xtype: "fieldset",
                    layout: {
                        type: "vbox",
                        align: "stretch",
                    },
                    items: [
                        {
                            xtype: "container",
                            layout: "vbox",
                            cls: "mb-4 p-4 rounded-lg shadow-md",
                            items: [
                                {
                                    xtype: "label",
                                    text: t("Product Brand:"),
                                    cls: "block font-bold text-base mb-2",
                                    labelFor: "brand",
                                },
                                {
                                    xtype: "combobox",
                                    name: "brand",
                                    id: "brand",
                                    cls: "w-96",
                                    editable: false,
                                    allowBlank: false,
                                    required: true,
                                    queryMode: "local",
                                    displayField: "brandObjName",
                                    valueField: "id",
                                    store: brandStore,
                                },
                                {
                                    xtype: "label",
                                    text: t("Product Category:"),
                                    cls: "block font-bold text-base mb-2",
                                    labelFor: "category",
                                },
                                {
                                    xtype: "combobox",
                                    name: "category",
                                    id: "category",
                                    cls: "w-96",
                                    editable: false,
                                    allowBlank: false,
                                    required: true,
                                    queryMode: "local",
                                    displayField: "categoryObjName",
                                    valueField: "id",
                                    store: categoryStore,
                                },
                                {
                                    xtype: "label",
                                    text: t("Product User:"),
                                    cls: "block font-bold text-base mb-2",
                                    labelFor: "user",
                                },
                                {
                                    xtype: "combobox",
                                    name: "user",
                                    id: "user",
                                    cls: "w-96",
                                    editable: false,
                                    allowBlank: false,
                                    required: true,
                                    queryMode: "local",
                                    displayField: "userName",
                                    valueField: "userId",
                                    store: userStore,
                                },
                                {
                                    xtype: "label",
                                    text: t("Product Name"),
                                    cls: "block font-bold text-base mb-2",
                                    labelFor: "productName",
                                },
                                {
                                    xtype: "textfield",
                                    name: "productName",
                                    id: "productName",
                                    allowBlank: false,
                                    required: true,
                                    cls: "w-96",
                                },
                                {
                                    xtype: "label",
                                    text: t("Message"),
                                    cls: "block font-bold text-base mb-2",
                                    labelFor: "message",
                                },
                                {
                                    xtype: "textareafield",
                                    name: "message",
                                    id: "message",
                                    allowBlank: false,
                                    required: true,
                                    cls: "w-96",
                                },
                                {
                                    xtype: "button",
                                    text: "Assign Product",
                                    formBind: true,
                                    handler: submitForm,
                                    cls: "bg-blue-500 text-white p-3 rounded-md cursor-pointer hover:bg-blue-600 w-96",
                                },
                            ],
                        },
                    ],
                },
            ],
        });

        return form;
    },
});

const customExtComponentPlugin = new pimcore.plugin.CustomExtComponent();

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

        const form = Ext.create("Ext.form.Panel", {
            autoWidth: true,
            fill: true,
            autoHeight: true,
            id: "custom_ext_component_form",
            cls: "bg-gray-100 p-6 rounded-lg shadow-md",
            bodyCls: "bg-white p-6 rounded-lg shadow-md",
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
                            ],
                        },
                        {
                            xtype: "container",
                            layout: "vbox",
                            cls: "mb-4 p-4 rounded-lg shadow-md",
                            items: [
                                {
                                    xtype: "label",
                                    text: t("Product Category:"),
                                    cls: "block font-bold text-base mb-2",
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
                            ],
                        },
                        {
                            xtype: "container",
                            layout: "vbox",
                            cls: "mb-4 p-4 rounded-lg shadow-md",
                            items: [
                                {
                                    xtype: "label",
                                    text: t("Product User:"),
                                    cls: "block font-bold text-base mb-2",
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
                            ],
                        },
                        {
                            xtype: "container",
                            layout: "vbox",
                            cls: "mb-4 p-4 rounded-lg shadow-md",
                            items: [
                                {
                                    xtype: "label",
                                    text: t("Product Name"),
                                    cls: "block font-bold text-base mb-2",
                                },
                                {
                                    xtype: "textfield",
                                    name: "productName",
                                    id: "productName",
                                    allowBlank: false,
                                    required: true,
                                    cls: "w-96",
                                },
                            ],
                        },
                        {
                            xtype: "container",
                            layout: "vbox",
                            cls: "mb-4 p-4 rounded-lg shadow-md",
                            items: [
                                {
                                    xtype: "label",
                                    text: t("Message"),
                                    cls: "block font-bold text-base mb-2",
                                },
                                {
                                    xtype: "textareafield",
                                    name: "message",
                                    id: "message",
                                    allowBlank: true,
                                    cls: "w-96",
                                },
                            ],
                        },
                        {
                            xtype: "container",
                            layout: "hbox",
                            cls: "mb-4 p-4 rounded-lg shadow-md",
                            items: [
                                {
                                    xtype: "button",
                                    text: "Assign Product",
                                    handler: function () {
                                        const formData = form.getValues();
                                        console.log(
                                            "Form Data Submitted:",
                                            formData
                                        );
                                    },
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

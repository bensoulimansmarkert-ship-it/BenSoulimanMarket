/* =========================================================
   سوبر ماركت بن سليمان
   Dashboard JavaScript
   المرحلة 1 / 4
   تهيئة لوحة التحكم والوظائف الأساسية
========================================================= */

"use strict";

/* =========================================================
   1. إعدادات لوحة التحكم
========================================================= */

const Dashboard = {

    version: "1.0.0",

    state: {
        initialized: false,
        sidebarOpen: false,
        userMenuOpen: false,
        notificationsOpen: false,
        loading: false
    },

    selectors: {
        app: ".dashboard-app",
        sidebar: ".sidebar",
        mainContent: ".main-content",
        header: ".dashboard-header",
        sidebarOverlay: ".sidebar-overlay",
        mobileMenuButton: ".mobile-menu-button",
        user: ".header-user",
        userMenu: ".user-dropdown",
        notificationButton: ".notification-button",
        notificationsPanel: ".notifications-panel",
        logout: ".logout-item"
    }

};


/* =========================================================
   2. تشغيل لوحة التحكم
========================================================= */

Dashboard.init = function () {

    if (this.state.initialized) {
        return;
    }

    this.state.initialized = true;

    this.cacheElements();
    this.bindEvents();
    this.setCurrentDate();
    this.loadUserData();
    this.initializeNavigation();
    this.initializeHeader();

};


/* =========================================================
   3. حفظ عناصر الصفحة
========================================================= */

Dashboard.cacheElements = function () {

    this.elements = {

        app: document.querySelector(this.selectors.app),

        sidebar: document.querySelector(this.selectors.sidebar),

        mainContent: document.querySelector(this.selectors.mainContent),

        header: document.querySelector(this.selectors.header),

        sidebarOverlay:
            document.querySelector(this.selectors.sidebarOverlay),

        mobileMenuButton:
            document.querySelector(this.selectors.mobileMenuButton),

        user:
            document.querySelector(this.selectors.user),

        userMenu:
            document.querySelector(this.selectors.userMenu),

        notificationButton:
            document.querySelector(this.selectors.notificationButton),

        notificationsPanel:
            document.querySelector(this.selectors.notificationsPanel),

        logout:
            document.querySelector(this.selectors.logout)

    };

};


/* =========================================================
   4. ربط الأحداث
========================================================= */

Dashboard.bindEvents = function () {

    const elements = this.elements;

    /* القائمة الجانبية */

    if (elements.mobileMenuButton) {

        elements.mobileMenuButton.addEventListener(
            "click",
            () => this.toggleSidebar()
        );

    }


    /* إغلاق القائمة من الخلفية */

    if (elements.sidebarOverlay) {

        elements.sidebarOverlay.addEventListener(
            "click",
            () => this.closeSidebar()
        );

    }


    /* قائمة المستخدم */

    if (elements.user) {

        elements.user.addEventListener(
            "click",
            (event) => {

                const button =
                    event.target.closest(
                        ".user-menu-button, .header-user"
                    );

                if (!button) {
                    return;
                }

                this.toggleUserMenu();

            }
        );

    }


    /* الإشعارات */

    if (elements.notificationButton) {

        elements.notificationButton.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                this.toggleNotifications();

            }
        );

    }


    /* تسجيل الخروج */

    if (elements.logout) {

        elements.logout.addEventListener(
            "click",
            (event) => {

                event.preventDefault();

                this.logout();

            }
        );

    }


    /* إغلاق القوائم عند الضغط خارجها */

    document.addEventListener(
        "click",
        (event) => this.handleDocumentClick(event)
    );


    /* زر Escape */

    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Escape") {

                this.closeSidebar();
                this.closeUserMenu();
                this.closeNotifications();

            }

        }
    );


    /* تغيير حجم الشاشة */

    window.addEventListener(
        "resize",
        () => this.handleResize()
    );

};


/* =========================================================
   5. القائمة الجانبية
========================================================= */

Dashboard.toggleSidebar = function () {

    if (this.state.sidebarOpen) {

        this.closeSidebar();

    } else {

        this.openSidebar();

    }

};


Dashboard.openSidebar = function () {

    const elements = this.elements;

    this.state.sidebarOpen = true;

    if (elements.sidebar) {
        elements.sidebar.classList.add("open");
    }

    if (elements.sidebarOverlay) {
        elements.sidebarOverlay.classList.add("show");
    }

    if (elements.app) {
        elements.app.classList.add("sidebar-open");
    }

};


Dashboard.closeSidebar = function () {

    const elements = this.elements;

    this.state.sidebarOpen = false;

    if (elements.sidebar) {
        elements.sidebar.classList.remove("open");
    }

    if (elements.sidebarOverlay) {
        elements.sidebarOverlay.classList.remove("show");
    }

    if (elements.app) {
        elements.app.classList.remove("sidebar-open");
    }

};


/* =========================================================
   6. قائمة المستخدم
========================================================= */

Dashboard.toggleUserMenu = function () {

    if (this.state.userMenuOpen) {

        this.closeUserMenu();

    } else {

        this.openUserMenu();

    }

};


Dashboard.openUserMenu = function () {

    const elements = this.elements;

    this.state.userMenuOpen = true;

    if (elements.user) {
        elements.user.classList.add("open");
    }

    if (elements.userMenu) {
        elements.userMenu.classList.add("open");
    }

};


Dashboard.closeUserMenu = function () {

    const elements = this.elements;

    this.state.userMenuOpen = false;

    if (elements.user) {
        elements.user.classList.remove("open");
    }

    if (elements.userMenu) {
        elements.userMenu.classList.remove("open");
    }

};


/* =========================================================
   7. الإشعارات
========================================================= */

Dashboard.toggleNotifications = function () {

    if (this.state.notificationsOpen) {

        this.closeNotifications();

    } else {

        this.openNotifications();

    }

};


Dashboard.openNotifications = function () {

    const panel = this.elements.notificationsPanel;

    this.state.notificationsOpen = true;

    if (panel) {

        panel.classList.add("open");

        panel.setAttribute(
            "aria-hidden",
            "false"
        );

    }

};


Dashboard.closeNotifications = function () {

    const panel = this.elements.notificationsPanel;

    this.state.notificationsOpen = false;

    if (panel) {

        panel.classList.remove("open");

        panel.setAttribute(
            "aria-hidden",
            "true"
        );

    }

};


/* =========================================================
   8. التعامل مع الضغط خارج القوائم
========================================================= */

Dashboard.handleDocumentClick = function (event) {

    const elements = this.elements;

    /* قائمة المستخدم */

    if (
        this.state.userMenuOpen &&
        elements.user &&
        !elements.user.contains(event.target)
    ) {

        this.closeUserMenu();

    }


    /* الإشعارات */

    if (
        this.state.notificationsOpen &&
        elements.notificationsPanel &&
        elements.notificationButton &&
        !elements.notificationsPanel.contains(event.target) &&
        !elements.notificationButton.contains(event.target)
    ) {

        this.closeNotifications();

    }

};


/* =========================================================
   9. التنقل في القائمة
========================================================= */

Dashboard.initializeNavigation = function () {

    const navigation =
        document.querySelector(".sidebar-navigation");

    if (!navigation) {
        return;
    }

    const links =
        navigation.querySelectorAll(".nav-item");

    links.forEach((link) => {

        link.addEventListener(
            "click",
            (event) => {

                const href =
                    link.getAttribute("href");

                if (!href || href === "#") {
                    return;
                }

                links.forEach((item) => {

                    item.classList.remove("active");

                });

                link.classList.add("active");

                /* إغلاق القائمة في الهاتف */

                if (window.innerWidth <= 900) {
                    this.closeSidebar();
                }

            }
        );

    });

};


/* =========================================================
   10. تحديد التاريخ الحالي
========================================================= */

Dashboard.setCurrentDate = function () {

    const dateElements =
        document.querySelectorAll(".dashboard-date");

    if (!dateElements.length) {
        return;
    }

    const now = new Date();

    const formattedDate =
        new Intl.DateTimeFormat(
            "ar-EG",
            {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
            }
        ).format(now);


    dateElements.forEach((element) => {

        const target =
            element.querySelector(
                "strong, .current-date"
            );

        if (target) {

            target.textContent =
                formattedDate;

        }

    });

};


/* =========================================================
   11. بيانات المستخدم
========================================================= */

Dashboard.loadUserData = function () {

    let user = null;

    try {

        const savedUser =
            localStorage.getItem(
                "ben_suleiman_user"
            );

        if (savedUser) {

            user = JSON.parse(savedUser);

        }

    } catch (error) {

        console.warn(
            "تعذر قراءة بيانات المستخدم:",
            error
        );

    }


    /* بيانات افتراضية */

    if (!user) {

        user = {

            name: "مدير النظام",

            role: "المدير العام",

            avatar: "👤"

        };

    }


    this.setUserDisplay(user);

};


Dashboard.setUserDisplay = function (user) {

    const name =
        user.name ||
        "مدير النظام";

    const role =
        user.role ||
        "المدير العام";

    const avatar =
        user.avatar ||
        "👤";


    /* اسم المستخدم */

    document
        .querySelectorAll(
            ".user-info strong, .user-name"
        )
        .forEach((element) => {

            element.textContent = name;

        });


    /* الصلاحية */

    document
        .querySelectorAll(
            ".user-info span, .user-role"
        )
        .forEach((element) => {

            element.textContent = role;

        });


    /* الصورة / الرمز */

    document
        .querySelectorAll(
            ".user-avatar"
        )
        .forEach((element) => {

            if (
                element.tagName === "IMG"
            ) {

                if (user.avatarUrl) {

                    element.src =
                        user.avatarUrl;

                }

            } else {

                element.textContent =
                    avatar;

            }

        });


    /* بيانات قائمة المستخدم */

    const dropdownHeader =
        document.querySelector(
            ".user-dropdown-header"
        );

    if (dropdownHeader) {

        const strong =
            dropdownHeader.querySelector(
                "strong"
            );

        const span =
            dropdownHeader.querySelector(
                "span"
            );

        if (strong) {
            strong.textContent = name;
        }

        if (span) {
            span.textContent = role;
        }

    }

};


/* =========================================================
   12. إعداد الرأس
========================================================= */

Dashboard.initializeHeader = function () {

    const searchInput =
        document.querySelector(
            ".header-search input"
        );

    if (searchInput) {

        searchInput.addEventListener(
            "keydown",
            (event) => {

                if (event.key === "Enter") {

                    const value =
                        searchInput.value.trim();

                    if (value) {

                        this.performSearch(value);

                    }

                }

            }
        );

    }

};


/* =========================================================
   13. البحث
========================================================= */

Dashboard.performSearch = function (query) {

    if (!query) {
        return;
    }

    console.log(
        "البحث في لوحة التحكم:",
        query
    );

    /* سيتم ربط البحث الشامل مع المنتجات
       والمبيعات والعملاء في المراحل القادمة */

};


/* =========================================================
   14. تسجيل الخروج
========================================================= */

Dashboard.logout = function () {

    const confirmed =
        window.confirm(
            "هل تريد تسجيل الخروج من النظام؟"
        );

    if (!confirmed) {
        return;
    }


    try {

        localStorage.removeItem(
            "ben_suleiman_user"
        );

        localStorage.removeItem(
            "currentUser"
        );

    } catch (error) {

        console.warn(
            "تعذر تنظيف بيانات الجلسة:",
            error
        );

    }


    /* الانتقال إلى صفحة الدخول */

    window.location.href =
        "login.html";

};


/* =========================================================
   15. التعامل مع تغيير حجم الشاشة
========================================================= */

Dashboard.handleResize = function () {

    if (window.innerWidth > 900) {

        this.closeSidebar();

    }

};


/* =========================================================
   16. تشغيل النظام بعد تحميل الصفحة
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        Dashboard.init();

    }
);


/* =========================================================
   17. إتاحة Dashboard للملفات الأخرى
========================================================= */

window.Dashboard = Dashboard;

/* =========================================================
   سوبر ماركت بن سليمان
   Dashboard JavaScript
   المرحلة 2 / 4
   الإحصائيات وبيانات لوحة التحكم
========================================================= */


/* =========================================================
   18. تحميل بيانات لوحة التحكم
========================================================= */

Dashboard.loadDashboardData = function () {

    this.showLoading();

    try {

        const data = this.getApplicationData();

        const statistics =
            this.calculateStatistics(data);

        this.updateStatistics(statistics);

        this.updateTopProducts(data);

        this.updateInventory(data);

        this.updateOrders(data);

        this.updateRecentSales(data);

        this.updatePurchases(data);

        this.updateSuppliers(data);

        this.updateReturns(data);

        this.updateCustomers(data);

    } catch (error) {

        console.error(
            "خطأ في تحميل بيانات لوحة التحكم:",
            error
        );

        this.showToast(
            "خطأ",
            "تعذر تحميل بيانات لوحة التحكم",
            "danger"
        );

    } finally {

        this.hideLoading();

    }

};


/* =========================================================
   19. الحصول على بيانات النظام
========================================================= */

Dashboard.getApplicationData = function () {

    const data = {

        products: [],
        sales: [],
        purchases: [],
        orders: [],
        customers: [],
        suppliers: [],
        returns: [],
        inventory: [],
        employees: []

    };


    /*
     * محاولة استخدام بيانات المشروع الموجودة
     */

    if (
        typeof window.appData === "object" &&
        window.appData
    ) {

        Object.keys(data).forEach((key) => {

            if (Array.isArray(window.appData[key])) {

                data[key] =
                    window.appData[key];

            }

        });

    }


    /*
     * دعم data.js إذا كان يستخدم متغيرات عامة
     */

    const globalNames = {

        products: [
            "products",
            "productData"
        ],

        sales: [
            "sales",
            "salesData"
        ],

        purchases: [
            "purchases",
            "purchaseData"
        ],

        orders: [
            "orders",
            "orderData"
        ],

        customers: [
            "customers",
            "customerData"
        ],

        suppliers: [
            "suppliers",
            "supplierData"
        ],

        returns: [
            "returns",
            "returnData"
        ],

        inventory: [
            "inventory",
            "inventoryData"
        ],

        employees: [
            "employees",
            "employeeData"
        ]

    };


    Object.keys(globalNames).forEach((key) => {

        if (data[key].length > 0) {
            return;
        }

        for (
            const variableName of globalNames[key]
        ) {

            if (
                Array.isArray(
                    window[variableName]
                )
            ) {

                data[key] =
                    window[variableName];

                break;

            }

        }

    });


    /*
     * قراءة البيانات من LocalStorage
     */

    Object.keys(data).forEach((key) => {

        if (data[key].length > 0) {
            return;
        }

        const storageKeys = [

            key,

            `ben_${key}`,

            `ben_suleiman_${key}`

        ];


        for (
            const storageKey of storageKeys
        ) {

            try {

                const saved =
                    localStorage.getItem(
                        storageKey
                    );

                if (!saved) {
                    continue;
                }

                const parsed =
                    JSON.parse(saved);

                if (Array.isArray(parsed)) {

                    data[key] = parsed;

                    break;

                }

            } catch (error) {

                console.warn(
                    `تعذر قراءة ${storageKey}`,
                    error
                );

            }

        }

    });


    return data;

};


/* =========================================================
   20. حساب الإحصائيات
========================================================= */

Dashboard.calculateStatistics = function (data) {

    const sales =
        Array.isArray(data.sales)
            ? data.sales
            : [];

    const orders =
        Array.isArray(data.orders)
            ? data.orders
            : [];

    const products =
        Array.isArray(data.products)
            ? data.products
            : [];

    const customers =
        Array.isArray(data.customers)
            ? data.customers
            : [];


    let totalSales = 0;

    let totalProfit = 0;

    let totalInvoices = sales.length;

    let totalOrders = orders.length;


    sales.forEach((sale) => {

        const total =
            this.getNumber(
                sale.total ??
                sale.amount ??
                sale.grandTotal ??
                sale.price
            );

        totalSales += total;


        const profit =
            this.getNumber(
                sale.profit ??
                sale.netProfit ??
                0
            );

        totalProfit += profit;

    });


    /*
     * إذا لم توجد فواتير ولكن توجد طلبات
     * يمكن استخدام الطلبات كمصدر احتياطي للمبيعات
     */

    if (
        totalSales === 0 &&
        sales.length === 0 &&
        orders.length > 0
    ) {

        orders.forEach((order) => {

            totalSales +=
                this.getNumber(
                    order.total ??
                    order.amount ??
                    order.grandTotal
                );

        });

    }


    return {

        sales: totalSales,

        profit: totalProfit,

        invoices: totalInvoices,

        orders: totalOrders,

        products: products.length,

        customers: customers.length

    };

};


/* =========================================================
   21. تحويل القيمة إلى رقم
========================================================= */

Dashboard.getNumber = function (value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        return 0;

    }


    if (typeof value === "number") {

        return Number.isFinite(value)
            ? value
            : 0;

    }


    /*
     * إزالة الرموز والمسافات
     */

    const cleaned =
        String(value)
            .replace(/,/g, "")
            .replace(/[^\d.-]/g, "");


    const number =
        parseFloat(cleaned);


    return Number.isFinite(number)
        ? number
        : 0;

};


/* =========================================================
   22. تحديث بطاقات الإحصائيات
========================================================= */

Dashboard.updateStatistics = function (statistics) {

    const salesElements =
        document.querySelectorAll(
            ".stat-sales .stat-value, " +
            ".stat-sales [data-stat='sales'], " +
            "[data-stat='sales']"
        );


    const profitElements =
        document.querySelectorAll(
            ".stat-profit .stat-value, " +
            ".stat-profit [data-stat='profit'], " +
            "[data-stat='profit']"
        );


    const invoiceElements =
        document.querySelectorAll(
            ".stat-invoices .stat-value, " +
            ".stat-invoices [data-stat='invoices'], " +
            "[data-stat='invoices']"
        );


    const orderElements =
        document.querySelectorAll(
            ".stat-orders .stat-value, " +
            ".stat-orders [data-stat='orders'], " +
            "[data-stat='orders']"
        );


    salesElements.forEach((element) => {

        element.textContent =
            this.formatCurrency(
                statistics.sales
            );

    });


    profitElements.forEach((element) => {

        element.textContent =
            this.formatCurrency(
                statistics.profit
            );

    });


    invoiceElements.forEach((element) => {

        element.textContent =
            this.formatNumber(
                statistics.invoices
            );

    });


    orderElements.forEach((element) => {

        element.textContent =
            this.formatNumber(
                statistics.orders
            );

    });

};


/* =========================================================
   23. تنسيق العملة
========================================================= */

Dashboard.formatCurrency = function (value) {

    const number =
        this.getNumber(value);


    return new Intl.NumberFormat(
        "ar-EG",
        {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }
    ).format(number);

};


/* =========================================================
   24. تنسيق الأرقام
========================================================= */

Dashboard.formatNumber = function (value) {

    return new Intl.NumberFormat(
        "ar-EG"
    ).format(
        this.getNumber(value)
    );

};


/* =========================================================
   25. المنتجات الأكثر مبيعاً
========================================================= */

Dashboard.updateTopProducts = function (data) {

    const container =
        document.querySelector(
            ".products-list"
        );

    if (!container) {
        return;
    }


    const products =
        Array.isArray(data.products)
            ? data.products
            : [];


    if (!products.length) {

        return;

    }


    const sorted =
        [...products]
            .sort((a, b) => {

                const salesA =
                    this.getNumber(
                        a.sales ??
                        a.sold ??
                        a.quantitySold ??
                        0
                    );

                const salesB =
                    this.getNumber(
                        b.sales ??
                        b.sold ??
                        b.quantitySold ??
                        0
                    );

                return salesB - salesA;

            })
            .slice(0, 5);


    container.innerHTML = "";


    sorted.forEach((product, index) => {

        const item =
            document.createElement("div");

        item.className =
            "top-product";


        const name =
            product.name ??
            product.title ??
            "منتج";


        const quantity =
            this.getNumber(
                product.sales ??
                product.sold ??
                product.quantitySold ??
                0
            );


        const image =
            product.image ??
            product.imageUrl ??
            "";


        item.innerHTML = `

            <div class="product-rank">
                ${index + 1}
            </div>

            <div class="product-image">

                ${
                    image
                        ? `<img src="${this.escapeHtml(image)}"
                               alt="${this.escapeHtml(name)}">`
                        : `<span>🛒</span>`
                }

            </div>

            <div class="product-details">

                <strong>
                    ${this.escapeHtml(name)}
                </strong>

                <small>
                    ${this.formatNumber(quantity)}
                    مبيعات
                </small>

            </div>

            <div class="product-sales">
                ${this.formatNumber(quantity)}
            </div>

        `;


        container.appendChild(item);

    });

};


/* =========================================================
   26. تحديث المخزون
========================================================= */

Dashboard.updateInventory = function (data) {

    const table =
        document.querySelector(
            ".inventory-card .dashboard-table tbody"
        );


    if (!table) {
        return;
    }


    const products =
        Array.isArray(data.products)
            ? data.products
            : [];


    if (!products.length) {
        return;
    }


    const lowStock =
        products
            .filter((product) => {

                const quantity =
                    this.getNumber(
                        product.stock ??
                        product.quantity ??
                        product.inventory ??
                        0
                    );

                const minimum =
                    this.getNumber(
                        product.minStock ??
                        product.minimumStock ??
                        product.reorderLevel ??
                        5
                    );

                return quantity <= minimum;

            })
            .slice(0, 5);


    if (!lowStock.length) {
        return;
    }


    table.innerHTML = "";


    lowStock.forEach((product) => {

        const row =
            document.createElement("tr");


        const name =
            product.name ??
            product.title ??
            "منتج";


        const quantity =
            this.getNumber(
                product.stock ??
                product.quantity ??
                product.inventory ??
                0
            );


        const minimum =
            this.getNumber(
                product.minStock ??
                product.minimumStock ??
                product.reorderLevel ??
                5
            );


        let statusClass =
            "danger";


        if (quantity > minimum) {
            statusClass = "warning";
        }


        row.innerHTML = `

            <td>
                ${this.escapeHtml(name)}
            </td>

            <td>
                ${this.formatNumber(quantity)}
            </td>

            <td>
                ${this.formatNumber(minimum)}
            </td>

            <td>

                <div class="inventory-progress ${statusClass}">

                    <span style="width:${Math.min(
                        100,
                        minimum > 0
                            ? (quantity / minimum) * 100
                            : 0
                    )}%"></span>

                </div>

            </td>

            <td>

                <span class="status-badge status-${statusClass}">
                    ${
                        statusClass === "danger"
                            ? "منخفض"
                            : "تنبيه"
                    }
                </span>

            </td>

        `;


        table.appendChild(row);

    });

};


/* =========================================================
   27. تحديث الطلبات
========================================================= */

Dashboard.updateOrders = function (data) {

    const container =
        document.querySelector(
            ".orders-list"
        );


    if (!container) {
        return;
    }


    const orders =
        Array.isArray(data.orders)
            ? data.orders
            : [];


    if (!orders.length) {
        return;
    }


    const latest =
        [...orders]
            .slice(-5)
            .reverse();


    container.innerHTML = "";


    latest.forEach((order) => {

        const item =
            document.createElement("div");

        item.className =
            "order";


        const id =
            order.id ??
            order.orderNumber ??
            "#---";


        const customer =
            order.customerName ??
            order.customer ??
            "عميل";


        const status =
            order.status ??
            "pending";


        item.innerHTML = `

            <div class="order-status">

                <div class="order-status-icon">
                    🛍️
                </div>

            </div>

            <div class="order-info">

                <strong>
                    ${this.escapeHtml(String(id))}
                </strong>

                <small>
                    ${this.escapeHtml(String(customer))}
                </small>

            </div>

            <span class="status-badge status-${this.getStatusClass(status)}">
                ${this.getStatusText(status)}
            </span>

        `;


        container.appendChild(item);

    });

};

/* =========================================================
   سوبر ماركت بن سليمان
   Dashboard JavaScript
   الجزء 4 / 4
   المبيعات - المشتريات - الموردون - العملاء - التنبيهات
========================================================= */


/* =========================================================
   28. المبيعات الأخيرة
========================================================= */

Dashboard.updateRecentSales = function (data) {

    const table =
        document.querySelector(
            ".recent-sales-table tbody"
        );

    if (!table) {
        return;
    }

    const sales =
        Array.isArray(data.sales)
            ? data.sales
            : [];

    if (!sales.length) {
        return;
    }

    const latest =
        [...sales]
            .slice(-8)
            .reverse();

    table.innerHTML = "";

    latest.forEach((sale) => {

        const row =
            document.createElement("tr");

        const invoice =
            sale.id ??
            sale.invoiceNumber ??
            sale.number ??
            "#---";

        const customer =
            sale.customerName ??
            sale.customer ??
            "عميل نقدي";

        const total =
            this.getNumber(
                sale.total ??
                sale.amount ??
                sale.grandTotal ??
                0
            );

        const status =
            sale.status ??
            "paid";

        const date =
            sale.date ??
            sale.createdAt ??
            "";

        row.innerHTML = `

            <td>
                ${this.escapeHtml(String(invoice))}
            </td>

            <td>

                <div class="sale-customer">

                    <div class="sale-customer-avatar">
                        👤
                    </div>

                    <div>

                        <span class="sale-customer-name">
                            ${this.escapeHtml(String(customer))}
                        </span>

                        ${
                            sale.phone
                                ? `
                                    <small class="sale-customer-phone">
                                        ${this.escapeHtml(
                                            String(sale.phone)
                                        )}
                                    </small>
                                  `
                                : ""
                        }

                    </div>

                </div>

            </td>

            <td>
                ${this.escapeHtml(
                    this.formatDate(date)
                )}
            </td>

            <td class="sale-total">
                ${this.formatCurrency(total)}
            </td>

            <td>

                <span class="status-badge status-${this.getStatusClass(status)}">
                    ${this.getStatusText(status)}
                </span>

            </td>

        `;

        table.appendChild(row);

    });

};


/* =========================================================
   29. المشتريات
========================================================= */

Dashboard.updatePurchases = function (data) {

    const container =
        document.querySelector(
            ".purchase-list"
        );

    if (!container) {
        return;
    }

    const purchases =
        Array.isArray(data.purchases)
            ? data.purchases
            : [];

    if (!purchases.length) {
        return;
    }

    const latest =
        [...purchases]
            .slice(-5)
            .reverse();

    container.innerHTML = "";

    latest.forEach((purchase) => {

        const item =
            document.createElement("div");

        item.className =
            "purchase-item";

        const supplier =
            purchase.supplierName ??
            purchase.supplier ??
            "مورد";

        const date =
            purchase.date ??
            purchase.createdAt ??
            "";

        const total =
            this.getNumber(
                purchase.total ??
                purchase.amount ??
                purchase.grandTotal ??
                0
            );

        item.innerHTML = `

            <div class="purchase-info">

                <strong>
                    ${this.escapeHtml(String(supplier))}
                </strong>

                <small>
                    ${this.escapeHtml(
                        this.formatDate(date)
                    )}
                </small>

            </div>

            <div class="purchase-value">
                ${this.formatCurrency(total)}
            </div>

        `;

        container.appendChild(item);

    });

};


/* =========================================================
   30. الموردون
========================================================= */

Dashboard.updateSuppliers = function (data) {

    const container =
        document.querySelector(
            ".suppliers-list"
        );

    if (!container) {
        return;
    }

    const suppliers =
        Array.isArray(data.suppliers)
            ? data.suppliers
            : [];

    if (!suppliers.length) {
        return;
    }

    const latest =
        suppliers.slice(0, 5);

    container.innerHTML = "";

    latest.forEach((supplier) => {

        const item =
            document.createElement("div");

        item.className =
            "supplier-item";

        const name =
            supplier.name ??
            supplier.companyName ??
            "مورد";

        const phone =
            supplier.phone ??
            supplier.mobile ??
            "";

        const balance =
            this.getNumber(
                supplier.balance ??
                supplier.debt ??
                0
            );

        item.innerHTML = `

            <div class="supplier-avatar">
                🏢
            </div>

            <div class="supplier-info">

                <strong>
                    ${this.escapeHtml(String(name))}
                </strong>

                <small>
                    ${this.escapeHtml(String(phone))}
                </small>

            </div>

            <div class="supplier-balance">
                ${this.formatCurrency(balance)}
            </div>

        `;

        container.appendChild(item);

    });

};


/* =========================================================
   31. المرتجعات
========================================================= */

Dashboard.updateReturns = function (data) {

    const container =
        document.querySelector(
            ".returns-summary"
        );

    if (!container) {
        return;
    }

    const returns =
        Array.isArray(data.returns)
            ? data.returns
            : [];

    if (!returns.length) {
        return;
    }

    let total = 0;

    returns.forEach((item) => {

        total +=
            this.getNumber(
                item.total ??
                item.amount ??
                item.value ??
                0
            );

    });

    const totalElement =
        container.querySelector(
            ".return-total-value"
        );

    if (totalElement) {

        totalElement.textContent =
            this.formatCurrency(total);

    }

};


/* =========================================================
   32. العملاء
========================================================= */

Dashboard.updateCustomers = function (data) {

    const container =
        document.querySelector(
            ".customer-summary"
        );

    if (!container) {
        return;
    }

    const customers =
        Array.isArray(data.customers)
            ? data.customers
            : [];

    const totalElement =
        container.querySelector(
            ".customer-total-value"
        );

    if (totalElement) {

        totalElement.textContent =
            this.formatNumber(
                customers.length
            );

    }

};


/* =========================================================
   33. تحديث الرسم البياني
========================================================= */

Dashboard.updateSalesChart = function (data) {

    const chart =
        document.querySelector(
            ".chart-line"
        );

    if (!chart) {
        return;
    }

    const sales =
        Array.isArray(data.sales)
            ? data.sales
            : [];

    if (!sales.length) {
        return;
    }

    const dailyTotals = {};

    sales.forEach((sale) => {

        const date =
            sale.date ??
            sale.createdAt ??
            "";

        const key =
            this.getDateKey(date);

        if (!key) {
            return;
        }

        const amount =
            this.getNumber(
                sale.total ??
                sale.amount ??
                sale.grandTotal ??
                0
            );

        dailyTotals[key] =
            (dailyTotals[key] || 0) +
            amount;

    });

    const values =
        Object.values(dailyTotals)
            .slice(-7);

    if (!values.length) {
        return;
    }

    const max =
        Math.max(...values, 1);

    /*
     * إذا كان الرسم يحتوي SVG
     * يتم تحديث النقاط بشكل بسيط.
     */

    const svg =
        chart.querySelector("svg");

    if (!svg) {
        return;
    }

    const width = 100;
    const height = 100;

    const points =
        values.map((value, index) => {

            const x =
                values.length === 1
                    ? 50
                    : (index /
                        (values.length - 1)) *
                      width;

            const y =
                height -
                ((value / max) *
                85);

            return `${x},${y}`;

        }).join(" ");

    let polyline =
        svg.querySelector(
            ".dashboard-chart-line"
        );

    if (!polyline) {

        polyline =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "polyline"
            );

        polyline.classList.add(
            "dashboard-chart-line"
        );

        polyline.setAttribute(
            "fill",
            "none"
        );

        polyline.setAttribute(
            "stroke",
            "currentColor"
        );

        polyline.setAttribute(
            "stroke-width",
            "3"
        );

        svg.appendChild(polyline);

    }

    polyline.setAttribute(
        "points",
        points
    );

};


/* =========================================================
   34. التنبيهات
========================================================= */

Dashboard.updateAlerts = function (data) {

    const container =
        document.querySelector(
            ".alerts-list"
        );

    if (!container) {
        return;
    }

    const products =
        Array.isArray(data.products)
            ? data.products
            : [];

    const alerts = [];

    products.forEach((product) => {

        const stock =
            this.getNumber(
                product.stock ??
                product.quantity ??
                product.inventory ??
                0
            );

        const minimum =
            this.getNumber(
                product.minStock ??
                product.minimumStock ??
                product.reorderLevel ??
                5
            );

        if (stock <= 0) {

            alerts.push({

                type: "danger",

                title:
                    `نفاد ${product.name ?? "منتج"}`,

                message:
                    "المنتج غير متوفر حالياً"

            });

        } else if (stock <= minimum) {

            alerts.push({

                type: "warning",

                title:
                    `مخزون منخفض: ${product.name ?? "منتج"}`,

                message:
                    `المتبقي ${this.formatNumber(stock)} وحدة`

            });

        }

    });


    const limitedAlerts =
        alerts.slice(0, 6);

    if (!limitedAlerts.length) {
        return;
    }

    container.innerHTML = "";

    limitedAlerts.forEach((alert) => {

        const item =
            document.createElement("div");

        item.className =
            "alert-item";

        item.innerHTML = `

            <div class="alert-icon alert-${alert.type}">
                ⚠
            </div>

            <div class="alert-content">

                <strong>
                    ${this.escapeHtml(alert.title)}
                </strong>

                <small>
                    ${this.escapeHtml(alert.message)}
                </small>

            </div>

        `;

        container.appendChild(item);

    });

};


/* =========================================================
   35. تحويل حالة الطلب إلى CSS
========================================================= */

Dashboard.getStatusClass = function (status) {

    const value =
        String(status || "")
            .toLowerCase()
            .trim();

    if (
        value.includes("paid") ||
        value.includes("completed") ||
        value.includes("complete") ||
        value.includes("مكتمل") ||
        value.includes("مدفوع") ||
        value.includes("تم")
    ) {

        return "paid";

    }

    if (
        value.includes("processing") ||
        value.includes("shipping") ||
        value.includes("delivery") ||
        value.includes("جاري") ||
        value.includes("توصيل") ||
        value.includes("شحن")
    ) {

        return "processing";

    }

    if (
        value.includes("cancel") ||
        value.includes("مرفوض") ||
        value.includes("ملغي")
    ) {

        return "danger";

    }

    if (
        value.includes("warning") ||
        value.includes("pending") ||
        value.includes("انتظار") ||
        value.includes("معلق")
    ) {

        return "warning";

    }

    return "pending";

};


/* =========================================================
   36. اسم الحالة بالعربية
========================================================= */

Dashboard.getStatusText = function (status) {

    const value =
        String(status || "")
            .toLowerCase()
            .trim();

    if (
        value.includes("paid") ||
        value.includes("مدفوع")
    ) {

        return "مدفوع";

    }

    if (
        value.includes("completed") ||
        value.includes("complete") ||
        value.includes("مكتمل")
    ) {

        return "مكتمل";

    }

    if (
        value.includes("processing") ||
        value.includes("جاري")
    ) {

        return "قيد المعالجة";

    }

    if (
        value.includes("shipping") ||
        value.includes("delivery") ||
        value.includes("توصيل")
    ) {

        return "قيد التوصيل";

    }

    if (
        value.includes("cancel") ||
        value.includes("ملغي")
    ) {

        return "ملغي";

    }

    if (
        value.includes("pending") ||
        value.includes("انتظار")
    ) {

        return "قيد الانتظار";

    }

    return "قيد الانتظار";

};


/* =========================================================
   37. تنسيق التاريخ
========================================================= */

Dashboard.formatDate = function (date) {

    if (!date) {
        return "—";
    }

    const parsed =
        new Date(date);

    if (
        Number.isNaN(
            parsed.getTime()
        )
    ) {

        return String(date);

    }

    return new Intl.DateTimeFormat(
        "ar-EG",
        {
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        }
    ).format(parsed);

};


/* =========================================================
   38. مفتاح التاريخ
========================================================= */

Dashboard.getDateKey = function (date) {

    if (!date) {
        return "";
    }

    const parsed =
        new Date(date);

    if (
        Number.isNaN(
            parsed.getTime()
        )
    ) {

        return "";

    }

    return [
        parsed.getFullYear(),
        String(
            parsed.getMonth() + 1
        ).padStart(2, "0"),
        String(
            parsed.getDate()
        ).padStart(2, "0")
    ].join("-");

};


/* =========================================================
   39. حماية النصوص من HTML
========================================================= */

Dashboard.escapeHtml = function (value) {

    const div =
        document.createElement("div");

    div.textContent =
        value === null ||
        value === undefined
            ? ""
            : String(value);

    return div.innerHTML;

};


/* =========================================================
   40. شاشة التحميل
========================================================= */

Dashboard.showLoading = function () {

    this.state.loading = true;

    const overlay =
        document.querySelector(
            ".loading-overlay"
        );

    if (overlay) {

        overlay.style.display =
            "flex";

    }

};


Dashboard.hideLoading = function () {

    this.state.loading = false;

    const overlay =
        document.querySelector(
            ".loading-overlay"
        );

    if (overlay) {

        overlay.style.display =
            "none";

    }

};


/* =========================================================
   41. الإشعارات المنبثقة
========================================================= */

Dashboard.showToast = function (
    title,
    message,
    type = "info"
) {

    let container =
        document.querySelector(
            ".toast-container"
        );


    if (!container) {

        container =
            document.createElement("div");

        container.className =
            "toast-container";

        document.body.appendChild(
            container
        );

    }


    const toast =
        document.createElement("div");

    toast.className =
        "toast";


    const icon =
        type === "danger"
            ? "⚠️"
            : type === "success"
                ? "✓"
                : "ℹ";


    toast.innerHTML = `

        <div class="toast-icon">
            ${icon}
        </div>

        <div class="toast-content">

            <p class="toast-title">
                ${this.escapeHtml(title)}
            </p>

            <p class="toast-message">
                ${this.escapeHtml(message)}
            </p>

        </div>

        <button
            type="button"
            class="toast-close"
            aria-label="إغلاق"
        >
            ×
        </button>

    `;


    container.appendChild(
        toast
    );


    const closeButton =
        toast.querySelector(
            ".toast-close"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            () => toast.remove()
        );

    }


    setTimeout(() => {

        if (
            toast &&
            toast.parentNode
        ) {

            toast.remove();

        }

    }, 5000);

};


/* =========================================================
   42. تحميل جميع بيانات لوحة التحكم
========================================================= */

Dashboard.refresh = function () {

    const data =
        this.getApplicationData();


    const statistics =
        this.calculateStatistics(
            data
        );


    this.updateStatistics(
        statistics
    );


    this.updateTopProducts(
        data
    );


    this.updateInventory(
        data
    );


    this.updateOrders(
        data
    );


    this.updateRecentSales(
        data
    );


    this.updatePurchases(
        data
    );


    this.updateSuppliers(
        data
    );


    this.updateReturns(
        data
    );


    this.updateCustomers(
        data
    );


    this.updateSalesChart(
        data
    );


    this.updateAlerts(
        data
    );

};


/* =========================================================
   43. التشغيل النهائي
=====================

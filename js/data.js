/* =====================================================
   BEN SULEIMAN SUPERMARKET
   DEMO DATA SYSTEM
   Version 1.0.0

   هذا الملف مؤقت في مرحلة التطوير.
   لاحقًا سيتم نقل البيانات إلى Firebase.
===================================================== */


/* =====================================================
   1. SYSTEM INFORMATION
===================================================== */

const SYSTEM_CONFIG = {

    name: "سوبر ماركت بن سليمان",

    shortName: "بن سليمان",

    currency: "جنيه مصري",

    currencyCode: "EGP",

    currencySymbol: "ج.م",

    country: "Egypt",

    language: "ar",

    direction: "rtl",

    version: "1.0.0"

};


/* =====================================================
   2. BRANCHES
===================================================== */

const BRANCHES = [

    {
        id: "branch_001",

        name: "السوبر ماركت الأول",

        type: "supermarket",

        code: "SM-01",

        address: "مصر",

        phone: "",

        managerId: "user_002",

        status: "active",

        createdAt: "2026-09-01"

    },


    {
        id: "branch_002",

        name: "السوبر ماركت الثاني",

        type: "supermarket",

        code: "SM-02",

        address: "مصر",

        phone: "",

        managerId: "user_003",

        status: "active",

        createdAt: "2026-09-01"

    },


    {
        id: "branch_003",

        name: "كشك السجائر والشيشة",

        type: "kiosk",

        code: "KS-01",

        address: "مصر",

        phone: "",

        managerId: "user_004",

        status: "active",

        createdAt: "2026-09-01"

    }

];


/* =====================================================
   3. ROLES
===================================================== */

const ROLES = [

    {
        id: "super_admin",

        name: "المدير العام",

        description:
            "صلاحيات كاملة لجميع الفروع والنظام",

        level: 100

    },


    {
        id: "branch_manager",

        name: "مدير الفرع",

        description:
            "إدارة ومتابعة الفرع التابع له",

        level: 80

    },


    {
        id: "accountant",

        name: "المحاسب",

        description:
            "إدارة الحسابات والتقارير المالية",

        level: 70

    },


    {
        id: "inventory_manager",

        name: "موظف المخزن",

        description:
            "إدارة المخزون والمشتريات والجرد",

        level: 60

    },


    {
        id: "cashier",

        name: "الكاشير",

        description:
            "تنفيذ عمليات البيع والتحصيل",

        level: 40

    },


    {
        id: "delivery",

        name: "مندوب التوصيل",

        description:
            "استلام وتسليم طلبات العملاء",

        level: 30

    }

];


/* =====================================================
   4. PERMISSIONS
===================================================== */

const PERMISSIONS = {

    dashboard_view:
        "عرض لوحة التحكم",

    branches_view:
        "عرض الفروع",

    branches_manage:
        "إدارة الفروع",

    products_view:
        "عرض المنتجات",

    products_create:
        "إضافة المنتجات",

    products_edit:
        "تعديل المنتجات",

    products_delete:
        "حذف المنتجات",

    inventory_view:
        "عرض المخزون",

    inventory_manage:
        "إدارة المخزون",

    purchases_view:
        "عرض المشتريات",

    purchases_manage:
        "إدارة المشتريات",

    sales_view:
        "عرض المبيعات",

    sales_create:
        "إنشاء مبيعات",

    sales_cancel:
        "إلغاء المبيعات",

    returns_manage:
        "إدارة المرتجعات",

    suppliers_manage:
        "إدارة الموردين",

    customers_manage:
        "إدارة العملاء",

    employees_view:
        "عرض الموظفين",

    employees_manage:
        "إدارة الموظفين",

    delivery_view:
        "عرض التوصيل",

    delivery_manage:
        "إدارة التوصيل",

    expenses_manage:
        "إدارة المصروفات",

    accounting_view:
        "عرض الحسابات",

    reports_view:
        "عرض التقارير",

    settings_manage:
        "إدارة الإعدادات",

    audit_view:
        "عرض سجل العمليات"

};


/* =====================================================
   5. ROLE PERMISSIONS
===================================================== */

const ROLE_PERMISSIONS = {


    /* ---------------------------------------------
       SUPER ADMIN
    --------------------------------------------- */

    super_admin: [

        "*"

    ],


    /* ---------------------------------------------
       BRANCH MANAGER
    --------------------------------------------- */

    branch_manager: [

        "dashboard_view",

        "branches_view",

        "products_view",

        "products_create",

        "products_edit",

        "inventory_view",

        "inventory_manage",

        "purchases_view",

        "purchases_manage",

        "sales_view",

        "sales_create",

        "sales_cancel",

        "returns_manage",

        "suppliers_manage",

        "customers_manage",

        "employees_view",

        "delivery_view",

        "delivery_manage",

        "expenses_manage",

        "reports_view"

    ],


    /* ---------------------------------------------
       ACCOUNTANT
    --------------------------------------------- */

    accountant: [

        "dashboard_view",

        "sales_view",

        "purchases_view",

        "expenses_manage",

        "accounting_view",

        "reports_view",

        "customers_manage",

        "suppliers_manage"

    ],


    /* ---------------------------------------------
       INVENTORY MANAGER
    --------------------------------------------- */

    inventory_manager: [

        "dashboard_view",

        "products_view",

        "products_create",

        "products_edit",

        "inventory_view",

        "inventory_manage",

        "purchases_view",

        "purchases_manage",

        "suppliers_manage"

    ],


    /* ---------------------------------------------
       CASHIER
    --------------------------------------------- */

    cashier: [

        "dashboard_view",

        "products_view",

        "sales_create",

        "customers_manage"

    ],


    /* ---------------------------------------------
       DELIVERY
    --------------------------------------------- */

    delivery: [

        "delivery_view",

        "delivery_manage",

        "customers_manage"

    ]

};


/* =====================================================
   6. USERS
===================================================== */

const USERS = [

    /* ---------------------------------------------
       GENERAL MANAGER
    --------------------------------------------- */

    {
        id: "user_001",

        username: "admin",

        password: "123456",

        name: "مدير النظام",

        role: "super_admin",

        branchId: null,

        status: "active"

    },


    /* ---------------------------------------------
       BRANCH 1 MANAGER
    --------------------------------------------- */

    {
        id: "user_002",

        username: "manager01",

        password: "123456",

        name: "مدير السوبر ماركت الأول",

        role: "branch_manager",

        branchId: "branch_001",

        status: "active"

    },


    /* ---------------------------------------------
       BRANCH 2 MANAGER
    --------------------------------------------- */

    {
        id: "user_003",

        username: "manager02",

        password: "123456",

        name: "مدير السوبر ماركت الثاني",

        role: "branch_manager",

        branchId: "branch_002",

        status: "active"

    },


    /* ---------------------------------------------
       KIOSK MANAGER
    --------------------------------------------- */

    {
        id: "user_004",

        username: "kioskmanager",

        password: "123456",

        name: "مدير الكشك",

        role: "branch_manager",

        branchId: "branch_003",

        status: "active"

    },


    /* ---------------------------------------------
       CASHIER
    --------------------------------------------- */

    {
        id: "user_005",

        username: "cashier01",

        password: "123456",

        name: "كاشير 01",

        role: "cashier",

        branchId: "branch_001",

        status: "active"

    },


    /* ---------------------------------------------
       INVENTORY
    --------------------------------------------- */

    {
        id: "user_006",

        username: "stock01",

        password: "123456",

        name: "موظف المخزن",

        role: "inventory_manager",

        branchId: "branch_001",

        status: "active"

    },


    /* ---------------------------------------------
       DELIVERY
    --------------------------------------------- */

    {
        id: "user_007",

        username: "driver01",

        password: "123456",

        name: "مندوب التوصيل 01",

        role: "delivery",

        branchId: "branch_001",

        status: "active"

    }

];


/* =====================================================
   7. PRODUCT CATEGORIES
===================================================== */

const CATEGORIES = [

    {
        id: "cat_001",
        name: "مشروبات باردة",
        status: "active"
    },

    {
        id: "cat_002",
        name: "مشروبات ساخنة",
        status: "active"
    },

    {
        id: "cat_003",
        name: "أجبان وألبان",
        status: "active"
    },

    {
        id: "cat_004",
        name: "سجائر",
        status: "active"
    },

    {
        id: "cat_005",
        name: "تبغ ومعسل",
        status: "active"
    },

    {
        id: "cat_006",
        name: "مستلزمات الشيشة",
        status: "active"
    },

    {
        id: "cat_007",
        name: "حلويات وشوكولاتة",
        status: "active"
    },

    {
        id: "cat_008",
        name: "تسالي ومقرمشات",
        status: "active"
    },

    {
        id: "cat_009",
        name: "مواد غذائية",
        status: "active"
    },

    {
        id: "cat_010",
        name: "منظفات",
        status: "active"
    },

    {
        id: "cat_011",
        name: "ورقيات",
        status: "active"
    },

    {
        id: "cat_012",
        name: "مياه",
        status: "active"
    }

];


/* =====================================================
   8. UNITS
===================================================== */

const UNITS = [

    {
        id: "piece",
        name: "قطعة"
    },

    {
        id: "box",
        name: "علبة"
    },

    {
        id: "bottle",
        name: "زجاجة"
    },

    {
        id: "can",
        name: "كان"
    },

    {
        id: "kg",
        name: "كيلوجرام"
    },

    {
        id: "gram",
        name: "جرام"
    },

    {
        id: "liter",
        name: "لتر"
    },

    {
        id: "packet",
        name: "عبوة"
    }

];


/* =====================================================
   9. DEMO PRODUCTS
===================================================== */

const PRODUCTS = [

    {
        id: "prod_001",

        name: "بيبسي كان 330 مل",

        barcode: "622100000001",

        categoryId: "cat_001",

        unit: "can",

        purchasePrice: 10,

        salePrice: 15,

        taxRate: 14,

        minStock: 20,

        status: "active"

    },


    {
        id: "prod_002",

        name: "كوكاكولا كان 330 مل",

        barcode: "622100000002",

        categoryId: "cat_001",

        unit: "can",

        purchasePrice: 10,

        salePrice: 15,

        taxRate: 14,

        minStock: 20,

        status: "active"

    },


    {
        id: "prod_003",

        name: "مياه معدنية 600 مل",

        barcode: "622100000003",

        categoryId: "cat_012",

        unit: "bottle",

        purchasePrice: 5,

        salePrice: 8,

        taxRate: 14,

        minStock: 30,

        status: "active"

    },


    {
        id: "prod_004",

        name: "جبنة مثلثات",

        barcode: "622100000004",

        categoryId: "cat_003",

        unit: "box",

        purchasePrice: 35,

        salePrice: 45,

        taxRate: 14,

        minStock: 10,

        status: "active"

    },


    {
        id: "prod_005",

        name: "شيبسي",

        barcode: "622100000005",

        categoryId: "cat_008",

        unit: "packet",

        purchasePrice: 10,

        salePrice: 15,

        taxRate: 14,

        minStock: 20,

        status: "active"

    },


    {
        id: "prod_006",

        name: "شوكولاتة",

        barcode: "622100000006",

        categoryId: "cat_007",

        unit: "piece",

        purchasePrice: 20,

        salePrice: 30,

        taxRate: 14,

        minStock: 10,

        status: "active"

    },


    {
        id: "prod_007",

        name: "سجائر - منتج تجريبي",

        barcode: "622100000007",

        categoryId: "cat_004",

        unit: "box",

        purchasePrice: 60,

        salePrice: 70,

        taxRate: 0,

        minStock: 20,

        status: "active"

    },


    {
        id: "prod_008",

        name: "معسل - منتج تجريبي",

        barcode: "622100000008",

        categoryId: "cat_005",

        unit: "packet",

        purchasePrice: 100,

        salePrice: 120,

        taxRate: 0,

        minStock: 10,

        status: "active"

    }

];


/* =====================================================
   10. INVENTORY
===================================================== */

const INVENTORY = [

    {
        id: "inv_001",

        branchId: "branch_001",

        productId: "prod_001",

        quantity: 120

    },

    {
        id: "inv_002",

        branchId: "branch_001",

        productId: "prod_002",

        quantity: 100

    },

    {
        id: "inv_003",

        branchId: "branch_001",

        productId: "prod_003",

        quantity: 200

    },

    {
        id: "inv_004",

        branchId: "branch_001",

        productId: "prod_004",

        quantity: 40

    },

    {
        id: "inv_005",

        branchId: "branch_002",

        productId: "prod_001",

        quantity: 80

    },

    {
        id: "inv_006",

        branchId: "branch_002",

        productId: "prod_002",

        quantity: 90

    },

    {
        id: "inv_007",

        branchId: "branch_002",

        productId: "prod_003",

        quantity: 150

    },

    {
        id: "inv_008",

        branchId: "branch_003",

        productId: "prod_007",

        quantity: 200

    },

    {
        id: "inv_009",

        branchId: "branch_003",

        productId: "prod_008",

        quantity: 80

    }

];


/* =====================================================
   11. PAYMENT METHODS
===================================================== */

const PAYMENT_METHODS = [

    {
        id: "cash",

        name: "نقدي",

        icon: "💵"

    },

    {
        id: "card",

        name: "بطاقة",

        icon: "💳"

    },

    {
        id: "wallet",

        name: "محفظة إلكترونية",

        icon: "📱"

    },

    {
        id: "mixed",

        name: "دفع مختلط",

        icon: "💰"

    }

];


/* =====================================================
   12. ORDER STATUS
===================================================== */

const ORDER_STATUS = [

    {
        id: "new",

        name: "طلب جديد",

        color: "blue"

    },

    {
        id: "preparing",

        name: "جاري التجهيز",

        color: "orange"

    },

    {
        id: "assigned",

        name: "تم تعيين مندوب",

        color: "purple"

    },

    {
        id: "on_the_way",

        name: "في الطريق",

        color: "yellow"

    },

    {
        id: "delivered",

        name: "تم التسليم",

        color: "green"

    },

    {
        id: "cancelled",

        name: "ملغي",

        color: "red"

    }

];


/* =====================================================
   13. STORAGE KEYS
===================================================== */

const STORAGE_KEYS = {

    currentUser:
        "ben_suleiman_current_user",

    products:
        "ben_suleiman_products",

    categories:
        "ben_suleiman_categories",

    inventory:
        "ben_suleiman_inventory",

    sales:
        "ben_suleiman_sales",

    purchases:
        "ben_suleiman_purchases",

    orders:
        "ben_suleiman_orders",

    expenses:
        "ben_suleiman_expenses",

    employees:
        "ben_suleiman_employees",

    auditLogs:
        "ben_suleiman_audit_logs"

};


/* =====================================================
   14. INITIALIZE LOCAL DATABASE
===================================================== */

function initializeLocalDatabase() {

    if (!localStorage.getItem(STORAGE_KEYS.products)) {

        localStorage.setItem(
            STORAGE_KEYS.products,
            JSON.stringify(PRODUCTS)
        );

    }


    if (!localStorage.getItem(STORAGE_KEYS.categories)) {

        localStorage.setItem(
            STORAGE_KEYS.categories,
            JSON.stringify(CATEGORIES)
        );

    }


    if (!localStorage.getItem(STORAGE_KEYS.inventory)) {

        localStorage.setItem(
            STORAGE_KEYS.inventory,
            JSON.stringify(INVENTORY)
        );

    }


    if (!localStorage.getItem(STORAGE_KEYS.sales)) {

        localStorage.setItem(
            STORAGE_KEYS.sales,
            JSON.stringify([])
        );

    }


    if (!localStorage.getItem(STORAGE_KEYS.purchases)) {

        localStorage.setItem(
            STORAGE_KEYS.purchases,
            JSON.stringify([])
        );

    }


    if (!localStorage.getItem(STORAGE_KEYS.orders)) {

        localStorage.setItem(
            STORAGE_KEYS.orders,
            JSON.stringify([])
        );

    }


    if (!localStorage.getItem(STORAGE_KEYS.expenses)) {

        localStorage.setItem(
            STORAGE_KEYS.expenses,
            JSON.stringify([])
        );

    }


    if (!localStorage.getItem(STORAGE_KEYS.auditLogs)) {

        localStorage.setItem(
            STORAGE_KEYS.auditLogs,
            JSON.stringify([])
        );

    }

}


/* =====================================================
   15. HELPER FUNCTIONS
===================================================== */

function getBranches() {

    return BRANCHES;

}


function getUsers() {

    return USERS;

}


function getProducts() {

    return JSON.parse(

        localStorage.getItem(
            STORAGE_KEYS.products
        )

    ) || [];

}


function getCategories() {

    return JSON.parse(

        localStorage.getItem(
            STORAGE_KEYS.categories
        )

    ) || [];

}


function getInventory() {

    return JSON.parse(

        localStorage.getItem(
            STORAGE_KEYS.inventory
        )

    ) || [];

}


/* =====================================================
   16. FIND FUNCTIONS
===================================================== */

function getBranchById(branchId) {

    return BRANCHES.find(

        branch =>
            branch.id === branchId

    ) || null;

}


function getUserById(userId) {

    return USERS.find(

        user =>
            user.id === userId

    ) || null;

}


function getProductById(productId) {

    const products =
        getProducts();

    return products.find(

        product =>
            product.id === productId

    ) || null;

}


function getProductByBarcode(barcode) {

    const products =
        getProducts();

    return products.find(

        product =>
            product.barcode === barcode

    ) || null;

}


/* =====================================================
   17. SAVE FUNCTION
===================================================== */

function saveProducts(products) {

    localStorage.setItem(

        STORAGE_KEYS.products,

        JSON.stringify(products)

    );

}


function saveInventory(inventory) {

    localStorage.setItem(

        STORAGE_KEYS.inventory,

        JSON.stringify(inventory)

    );

}


/* =====================================================
   18. INITIALIZE
========================================

    ;()initializeLocalDatabase
    )console.log
    ,":BEN SULEIMAN SYSTEM"
Local database initialized
    ".successfully
    ;(

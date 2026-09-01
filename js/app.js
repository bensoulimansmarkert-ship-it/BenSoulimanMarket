/* =====================================================
   BEN SULEIMAN SUPERMARKET
   APPLICATION CORE
   Version 1.0.0
===================================================== */


/* =====================================================
   1. APPLICATION CONFIGURATION
===================================================== */

const APP = {

    name: "سوبر ماركت بن سليمان",

    version: "1.0.0",

    initialized: false

};


/* =====================================================
   2. DOM READY
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    initializeApplication
);


/* =====================================================
   3. INITIALIZE APPLICATION
===================================================== */

function initializeApplication() {

    console.log(
        "BEN SULEIMAN SYSTEM: Starting..."
    );


    try {

        initializeLocalDatabase();

        initializeLoadingScreen();

        checkApplicationSession();

        APP.initialized = true;


        console.log(
            "BEN SULEIMAN SYSTEM: Ready."
        );


    } catch (error) {

        console.error(
            "BEN SULEIMAN SYSTEM: Initialization error:",
            error
        );

    }

}


/* =====================================================
   4. LOADING SCREEN
===================================================== */

function initializeLoadingScreen() {

    const loadingScreen =
        document.getElementById(
            "loading-screen"
        );


    if (!loadingScreen) {

        return;

    }


    setTimeout(
        function () {

            loadingScreen.classList.add(
                "hidden"
            );

        },
        900
    );

}


/* =====================================================
   5. CURRENT USER
===================================================== */

function getCurrentUser() {

    const savedUser =
        localStorage.getItem(
            STORAGE_KEYS.currentUser
        );


    if (!savedUser) {

        return null;

    }


    try {

        return JSON.parse(
            savedUser
        );

    } catch (error) {

        console.error(
            "BEN SULEIMAN SYSTEM: Invalid user session."
        );

        localStorage.removeItem(
            STORAGE_KEYS.currentUser
        );

        return null;

    }

}


/* =====================================================
   6. SAVE CURRENT USER
===================================================== */

function saveCurrentUser(user) {

    if (!user) {

        return false;

    }


    localStorage.setItem(

        STORAGE_KEYS.currentUser,

        JSON.stringify(user)

    );


    return true;

}


/* =====================================================
   7. CLEAR SESSION
===================================================== */

function clearCurrentUser() {

    localStorage.removeItem(
        STORAGE_KEYS.currentUser
    );

}


/* =====================================================
   8. CHECK SESSION
===================================================== */

function checkApplicationSession() {

    const currentUser =
        getCurrentUser();


    console.log(
        "BEN SULEIMAN SYSTEM: Current user:",
        currentUser
    );


    /*
       هذه الصفحة هي الصفحة الرئيسية فقط.

       لاحقًا عندما نضيف login.html
       وصفحات النظام، سيتم استخدام
       نفس الدالة لحماية الصفحات.
    */

    return currentUser;

}


/* =====================================================
   9. LOGOUT
===================================================== */

function logout() {

    clearCurrentUser();


    window.location.href =
        "login.html";

}


/* =====================================================
   10. REDIRECT
===================================================== */

function redirectTo(page) {

    if (!page) {

        return;

    }


    window.location.href =
        page;

}


/* =====================================================
   11. USER ROLE
===================================================== */

function getCurrentUserRole() {

    const user =
        getCurrentUser();


    if (!user) {

        return null;

    }


    return user.role || null;

}


/* =====================================================
   12. USER BRANCH
===================================================== */

function getCurrentUserBranch() {

    const user =
        getCurrentUser();


    if (!user) {

        return null;

    }


    if (!user.branchId) {

        return null;

    }


    return getBranchById(
        user.branchId
    );

}


/* =====================================================
   13. CHECK PERMISSION
===================================================== */

function hasPermission(permission) {

    const user =
        getCurrentUser();


    if (!user) {

        return false;

    }


    /*
       المدير العام لديه جميع الصلاحيات.
    */

    if (
        user.role === "super_admin"
    ) {

        return true;

    }


    const rolePermissions =
        ROLE_PERMISSIONS[user.role];


    if (!rolePermissions) {

        return false;

    }


    return rolePermissions.includes(
        permission
    );

}


/* =====================================================
   14. REQUIRE LOGIN
===================================================== */

function requireLogin() {

    const user =
        getCurrentUser();


    if (!user) {

        window.location.href =
            "login.html";

        return false;

    }


    return true;

}


/* =====================================================
   15. REQUIRE PERMISSION
===================================================== */

function requirePermission(permission) {

    if (!requireLogin()) {

        return false;

    }


    if (
        !hasPermission(permission)
    ) {

        showAccessDenied();

        return false;

    }


    return true;

}


/* =====================================================
   16. ACCESS DENIED
===================================================== */

function showAccessDenied() {

    const message = `

        <div style="
            position:fixed;
            inset:0;
            z-index:999999;
            display:flex;
            align-items:center;
            justify-content:center;
            padding:20px;
            background:#f1f5f9;
            font-family:Arial,sans-serif;
        ">

            <div style="
                width:min(100%,450px);
                padding:40px 25px;
                text-align:center;
                background:#ffffff;
                border-radius:20px;
                box-shadow:0 20px 60px rgba(0,0,0,.12);
            ">

                <div style="
                    font-size:55px;
                    margin-bottom:20px;
                ">
                    🔒
                </div>

                <h2 style="
                    margin-bottom:12px;
                    color:#0f172a;
                ">
                    غير مصرح لك
                </h2>

                <p style="
                    color:#64748b;
                    line-height:1.8;
                    margin-bottom:25px;
                ">
                    ليس لديك صلاحية للوصول
                    إلى هذه الصفحة.
                </p>

                <button
                    onclick="history.back()"
                    style="
                        border:0;
                        padding:13px 25px;
                        border-radius:10px;
                        background:#0f172a;
                        color:white;
                        cursor:pointer;
                        font-family:inherit;
                    "
                >
                    العودة
                </button>

            </div>

        </div>

    `;


    document.body.insertAdjacentHTML(
        "beforeend",
        message
    );

}


/* =====================================================
   17. FORMAT CURRENCY
===================================================== */

function formatCurrency(
    amount
) {

    const number =
        Number(amount) || 0;


    return new Intl.NumberFormat(
        "ar-EG",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    ).format(number)
    + " "
    + SYSTEM_CONFIG.currencySymbol;

}


/* =====================================================
   18. FORMAT NUMBER
===================================================== */

function formatNumber(
    number
) {

    return new Intl.NumberFormat(
        "ar-EG"
    ).format(
        Number(number) || 0
    );

}


/* =====================================================
   19. GENERATE ID
===================================================== */

function generateId(
    prefix = "id"
) {

    return (

        prefix
        + "_"
        + Date.now()
        + "_"
        + Math.random()
            .toString(36)
            .substring(2, 8)

    );

}


/* =====================================================
   20. CURRENT DATE
===================================================== */

function getCurrentDate() {

    return new Date()
        .toISOString()
        .split("T")[0];

}


/* =====================================================
   21. CURRENT DATE & TIME
===================================================== */

function getCurrentDateTime() {

    return new Date()
        .toISOString();

}


/* =====================================================
   22. SAVE DATA
===================================================== */

function saveData(
    key,
    data
) {

    try {

        localStorage.setItem(

            key,

            JSON.stringify(data)

        );

        return true;

    } catch (error) {

        console.error(
            "BEN SULEIMAN SYSTEM: Save error:",
            error
        );

        return false;

    }

}


/* =====================================================
   23. GET DATA
===================================================== */

function getData(
    key,
    fallback = []
) {

    try {

        const data =
            localStorage.getItem(key);


        if (!data) {

            return fallback;

        }


        return JSON.parse(data);

    } catch (error) {

        console.error(
            "BEN SULEIMAN SYSTEM: Read error:",
            error
        );

        return fallback;

    }

}


/* =====================================================
   24. DELETE DATA
===================================================== */

function deleteData(
    key
) {

    localStorage.removeItem(
        key
    );

}


/* =====================================================
   25. AUDIT LOG
===================================================== */

function addAuditLog({

    action = "",

    description = "",

    userId = null,

    branchId = null

} = {}) {


    const logs =
        getData(
            STORAGE_KEYS.auditLogs,
            []
        );


    const currentUser =
        getCurrentUser();


    const log = {

        id:
            generateId("log"),

        action:
            action,

        description:
            description,

        userId:
            userId ||
            currentUser?.id ||
            null,

        userName:
            currentUser?.name ||
            "النظام",

        branchId:
            branchId ||
            currentUser?.branchId ||
            null,

        createdAt:
            getCurrentDateTime()

    };


    logs.push(log);


    saveData(

        STORAGE_KEYS.auditLogs,

        logs

    );


    return log;

}


/* =====================================================
   26. BRANCH ACCESS
===================================================== */

function canAccessBranch(
    branchId
) {

    const user =
        getCurrentUser();


    if (!user) {

        return false;

    }


    /*
       المدير العام يرى جميع الفروع.
    */

    if (
        user.role === "super_admin"
    ) {

        return true;

    }


    /*
       باقي الموظفين يرون فرعهم فقط.
    */

    return (
        user.branchId === branchId
    );

}


/* =====================================================
   27. FILTER BY BRANCH
===================================================== */

function filterByUserBranch(
    items,
    branchField = "branchId"
) {

    const user =
        getCurrentUser();


    if (!user) {

        return [];

    }


    /*
       المدير العام يرى كل شيء.
    */

    if (
        user.role === "super_admin"
    ) {

        return items;

    }


    return items.filter(

        item =>
            item[branchField]
            ===
            user.branchId

    );

}


/* =====================================================
   28. GET ROLE NAME
===================================================== */

function getRoleName(
    roleId
) {

    const role =
        ROLES.find(

            item =>
                item.id === roleId

        );


    return role
        ? role.name
        : "غير معروف";

}


/* =====================================================
   29. GET CATEGORY NAME
===================================================== */

function getCategoryName(
    categoryId
) {

    const category =
        CATEGORIES.find(

            item =>
                item.id === categoryId

        );


    return category
        ? category.name
        : "بدون تصنيف";

}


/* =====================================================
   30. GET UNIT NAME
===================================================== */

function getUnitName(
    unitId
) {

    const unit =
        UNITS.find(

            item =>
                item.id === unitId

        );


    return unit
        ? unit.name
        : unitId;

}


/* =====================================================
   31. GLOBAL ERROR HANDLER
===================================================== */

window.addEventListener(
    "error",
    function (event) {

        console.error(
            "BEN SULEIMAN SYSTEM ERROR:",
            event.error || event.message
        );

    }
);


/* =====================================================
   32. EXPORT GLOBAL APP
===================================================== */

window.BenSuleiman = {

    config:
        APP,

    getCurrentUser,

    saveCurrentUser,

    clearCurrentUser,

    logout,

    redirectTo,

    getCurrentUserRole,

    getCurrentUserBranch,

    hasPermission,

    requireLogin,

    requirePermission,

    formatCurrency,

    formatNumber,

    generateId,

    getCurrentDate,

    getCurrentDateTime,

    saveData,

    getData,

    deleteData,

    addAuditLog,

    canAccessBranch,

    filterByUserBranch,

    getRoleName,

    getCategoryName,

    getUnitName

};


console.log(
    "BEN SULEIMAN SYSTEM: app.js loaded."
);

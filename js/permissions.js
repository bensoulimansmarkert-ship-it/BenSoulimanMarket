// =========================================================
// BEN SOULIMAN MARKET
// permissions.js
// المرحلة 1/4 — نظام الصلاحيات الأساسي
// =========================================================

/* ---------- تعريف الصلاحيات ---------- */

const PERMISSIONS = {

    dashboard: true,

    pos: true,

    products: true,

    categories: true,

    inventory: true,

    purchases: true,

    suppliers: true,

    sales: true,

    returns: true,

    customers: true,

    orders: true,

    delivery: true,

    branches: false,

    employees: false,

    expenses: false,

    reports: false,

    accounting: false,

    settings: false,

    auditLog: false
};

/* ---------- الحصول على صلاحيات المستخدم ---------- */

function getUserPermissions() {

    const user = getCurrentUser();

    if (!user) {
        return {};
    }

    /* المدير يمتلك جميع الصلاحيات */

    if (user.role === "admin") {

        return Object.keys(PERMISSIONS)
            .reduce((permissions, key) => {

                permissions[key] = true;

                return permissions;

            }, {});
    }

    /* الصلاحيات الأساسية للكاشير */

    if (user.role === "cashier") {

        return {
            dashboard: true,
            pos: true,
            products: true,
            categories: true,
            inventory: true,
            purchases: false,
            suppliers: false,
            sales: true,
            returns: true,
            customers: true,
            orders: true,
            delivery: true,
            branches: false,
            employees: false,
            expenses: false,
            reports: false,
            accounting: false,
            settings: false,
            auditLog: false
        };
    }

    return {};
}

// =========================================================
// المرحلة 2/4 — التحقق من الصلاحيات
// =========================================================

/* ---------- التحقق من صلاحية محددة ---------- */

function hasPermission(permission) {

    const permissions =
        getUserPermissions();

    return permissions[permission] === true;
}

/* ---------- منع الوصول عند عدم وجود الصلاحية ---------- */

function requirePermission(permission) {

    if (!isLoggedIn()) {

        window.location.href = "index.html";

        return false;
    }

    if (!hasPermission(permission)) {

        alert(
            "ليس لديك صلاحية لتنفيذ هذه العملية."
        );

        return false;
    }

    return true;
}

/* ---------- التحقق من عدة صلاحيات ---------- */

function hasAnyPermission(permissionList) {

    if (!Array.isArray(permissionList)) {
        return false;
    }

    return permissionList.some(
        permission =>
            hasPermission(permission)
    );
}

/* ---------- التحقق من جميع الصلاحيات ---------- */

function hasAllPermissions(permissionList) {

    if (!Array.isArray(permissionList)) {
        return false;
    }

    return permissionList.every(
        permission =>
            hasPermission(permission)
    );
}

// =========================================================
// المرحلة 3/4 — التحكم في عناصر الواجهة
// =========================================================

/* ---------- إخفاء العناصر غير المسموح بها ---------- */

function applyPermissionsToUI() {

    document
        .querySelectorAll("[data-permission]")
        .forEach(element => {

            const permission =
                element.getAttribute(
                    "data-permission"
                );

            if (!hasPermission(permission)) {

                element.style.display = "none";
            }
        });
}

/* ---------- تعطيل العناصر غير المسموح بها ---------- */

function disableUnauthorizedElements() {

    document
        .querySelectorAll("[data-permission-disable]")
        .forEach(element => {

            const permission =
                element.getAttribute(
                    "data-permission-disable"
                );

            if (!hasPermission(permission)) {

                element.disabled = true;

                element.setAttribute(
                    "title",
                    "ليس لديك صلاحية لهذه العملية"
                );
            }
        });
}

/* ---------- تطبيق الصلاحيات على الصفحة ---------- */

function refreshPermissionsUI() {

    applyPermissionsToUI();

    disableUnauthorizedElements();
}

// =========================================================
// المرحلة 4/4 — تشغيل نظام الصلاحيات
// =========================================================

document.addEventListener("DOMContentLoaded", () => {

    /* ---------- تحميل المستخدم الحالي ---------- */

    loadCurrentUser();

    /* ---------- تطبيق الصلاحيات على الواجهة ---------- */

    if (isLoggedIn()) {

        refreshPermissionsUI();

    }

});

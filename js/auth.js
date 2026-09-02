// =========================================================
// BEN SOULIMAN MARKET
// auth.js
// المرحلة 1/4 — نظام تسجيل الدخول الأساسي
// =========================================================

/* ---------- حالة المستخدم ---------- */

let currentUser = null;

/* ---------- التحقق من تسجيل الدخول ---------- */

function isLoggedIn() {
    return currentUser !== null;
}

/* ---------- الحصول على المستخدم الحالي ---------- */

function getCurrentUser() {
    return currentUser;
}

/* ---------- حفظ المستخدم ---------- */

function saveCurrentUser(user) {
    currentUser = user;

    try {
        localStorage.setItem(
            "benSouliman_currentUser",
            JSON.stringify(user)
        );
    } catch (error) {
        console.error("خطأ في حفظ المستخدم:", error);
    }
}

/* ---------- استرجاع المستخدم ---------- */

function loadCurrentUser() {
    try {
        const savedUser = localStorage.getItem(
            "benSouliman_currentUser"
        );

        if (savedUser) {
            currentUser = JSON.parse(savedUser);
        }
    } catch (error) {
        console.error("خطأ في استرجاع المستخدم:", error);
        currentUser = null;
    }

    return currentUser;
}

/* ---------- تسجيل الخروج ---------- */

function logout() {
    currentUser = null;

    try {
        localStorage.removeItem(
            "benSouliman_currentUser"
        );
    } catch (error) {
        console.error("خطأ في تسجيل الخروج:", error);
    }

    window.location.href = "index.html";
}

/* ---------- تحميل المستخدم عند تشغيل النظام ---------- */

document.addEventListener("DOMContentLoaded", () => {
    loadCurrentUser();
});

// =========================================================
// المرحلة 2/4 — التحقق من بيانات الدخول
// =========================================================

/* ---------- بيانات المستخدم التجريبية ---------- */

const DEFAULT_USERS = [
    {
        id: 1,
        username: "admin",
        password: "admin123",
        name: "مدير النظام",
        role: "admin"
    },
    {
        id: 2,
        username: "cashier",
        password: "123456",
        name: "الكاشير",
        role: "cashier"
    }
];

/* ---------- الحصول على قائمة المستخدمين ---------- */

function getUsers() {
    try {
        const storedUsers = localStorage.getItem(
            "benSouliman_users"
        );

        if (storedUsers) {
            return JSON.parse(storedUsers);
        }

        localStorage.setItem(
            "benSouliman_users",
            JSON.stringify(DEFAULT_USERS)
        );

        return DEFAULT_USERS;

    } catch (error) {
        console.error("خطأ في قراءة المستخدمين:", error);
        return DEFAULT_USERS;
    }
}

/* ---------- تسجيل الدخول ---------- */

function login(username, password) {

    username = String(username || "").trim();
    password = String(password || "");

    if (!username || !password) {
        return {
            success: false,
            message: "يرجى إدخال اسم المستخدم وكلمة المرور"
        };
    }

    const users = getUsers();

    const user = users.find(
        item =>
            item.username === username &&
            item.password === password
    );

    if (!user) {
        return {
            success: false,
            message: "اسم المستخدم أو كلمة المرور غير صحيحة"
        };
    }

    const loggedUser = {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role
    };

    saveCurrentUser(loggedUser);

    return {
        success: true,
        user: loggedUser,
        message: "تم تسجيل الدخول بنجاح"
    };
}

/* ---------- التحقق من الجلسة ---------- */

function checkAuth() {
    loadCurrentUser();

    if (!isLoggedIn()) {
        return false;
    }

    return true;
    }

// =========================================================
// المرحلة 3/4 — حماية الصفحات وإدارة الصلاحيات الأساسية
// =========================================================

/* ---------- التأكد من وجود جلسة ---------- */

function requireLogin() {
    loadCurrentUser();

    if (!isLoggedIn()) {
        window.location.href = "index.html";
        return false;
    }

    return true;
}

/* ---------- التحقق من دور المستخدم ---------- */

function hasRole(role) {
    const user = getCurrentUser();

    if (!user) {
        return false;
    }

    return user.role === role;
}

/* ---------- التحقق من المدير ---------- */

function isAdmin() {
    return hasRole("admin");
}

/* ---------- التحقق من الكاشير ---------- */

function isCashier() {
    return hasRole("cashier");
}

/* ---------- حماية عناصر الصفحة ---------- */

function protectPage(requiredRole = null) {

    loadCurrentUser();

    if (!isLoggedIn()) {
        window.location.href = "index.html";
        return false;
    }

    if (
        requiredRole &&
        !hasRole(requiredRole)
    ) {
        alert("ليس لديك صلاحية للوصول إلى هذه الصفحة.");

        window.location.href = "dashboard.html";
        return false;
    }

    return true;
}

/* ---------- إخفاء عناصر المدير ---------- */

function hideAdminElements() {

    const user = getCurrentUser();

    if (!user || user.role !== "admin") {

        document
            .querySelectorAll("[data-admin-only]")
            .forEach(element => {
                element.style.display = "none";
            });
    }
}

/* ---------- عرض اسم المستخدم ---------- */

function displayCurrentUser() {

    const user = getCurrentUser();

    if (!user) {
        return;
    }

    document
        .querySelectorAll("[data-current-user]")
        .forEach(element => {
            element.textContent = user.name || user.username;
        });

    document
        .querySelectorAll("[data-user-role]")
        .forEach(element => {
            element.textContent = user.role;
        });
}

// =========================================================
// المرحلة 4/4 — ربط تسجيل الدخول والخروج بالواجهة
// =========================================================

document.addEventListener("DOMContentLoaded", () => {

    /* ---------- تحميل الجلسة ---------- */

    loadCurrentUser();

    /* ---------- نموذج تسجيل الدخول ---------- */

    const loginForm = document.querySelector("#loginForm");

    if (loginForm) {

        loginForm.addEventListener("submit", (event) => {

            event.preventDefault();

            const usernameInput =
                document.querySelector("#username");

            const passwordInput =
                document.querySelector("#password");

            if (!usernameInput || !passwordInput) {
                return;
            }

            const result = login(
                usernameInput.value,
                passwordInput.value
            );

            if (!result.success) {

                alert(result.message);

                passwordInput.value = "";
                passwordInput.focus();

                return;
            }

            /* نجاح تسجيل الدخول */

            window.location.href = "dashboard.html";
        });
    }

    /* ---------- أزرار تسجيل الخروج ---------- */

    document
        .querySelectorAll(
            "#logoutBtn, .logout-btn, [data-logout]"
        )
        .forEach(button => {

            button.addEventListener("click", (event) => {

                event.preventDefault();

                const confirmed = confirm(
                    "هل تريد تسجيل الخروج؟"
                );

                if (confirmed) {
                    logout();
                }
            });
        });

    /* ---------- تحديث بيانات المستخدم ---------- */

    displayCurrentUser();

    /* ---------- إخفاء عناصر المدير ---------- */

    hideAdminElements();
});

/* =====================================================
   BEN SULEIMAN MARKET — SYSTEM CORE
   Local-first business engine. Firebase-ready.
   Keeps the existing visual identity; adds the missing
   operational/accounting layer without changing the CSS base.
===================================================== */
(function () {
  'use strict';

  const KEY = {
    user: 'ben_suleiman_current_user', users: 'ben_suleiman_users',
    branches: 'ben_suleiman_branches', products: 'ben_suleiman_products',
    categories: 'ben_suleiman_categories', inventory: 'ben_suleiman_inventory',
    suppliers: 'ben_suleiman_suppliers', customers: 'ben_suleiman_customers',
    employees: 'ben_suleiman_employees', sales: 'ben_suleiman_sales',
    purchases: 'ben_suleiman_purchases', returns: 'ben_suleiman_returns',
    expenses: 'ben_suleiman_expenses', orders: 'ben_suleiman_orders',
    ledger: 'ben_suleiman_ledger', audit: 'ben_suleiman_audit_logs',
    settings: 'ben_suleiman_settings'
  };

  const ROLE_NAMES = {
    super_admin: 'المدير العام', branch_manager: 'مدير الفرع', accountant: 'المحاسب',
    inventory_manager: 'موظف المخزن', cashier: 'الكاشير', delivery: 'مندوب التوصيل'
  };

  const PERMS = {
    super_admin: ['*'],
    branch_manager: ['dashboard_view','branches_view','products_view','products_create','products_edit','inventory_view','inventory_manage','purchases_view','purchases_manage','sales_view','sales_create','sales_cancel','returns_manage','suppliers_manage','customers_manage','employees_view','delivery_view','delivery_manage','expenses_manage','reports_view','accounting_view'],
    accountant: ['dashboard_view','sales_view','purchases_view','expenses_manage','accounting_view','reports_view','customers_manage','suppliers_manage'],
    inventory_manager: ['dashboard_view','products_view','products_create','products_edit','inventory_view','inventory_manage','purchases_view','purchases_manage','suppliers_manage'],
    cashier: ['dashboard_view','products_view','sales_create','customers_manage'],
    delivery: ['delivery_view','delivery_manage','customers_manage']
  };

  const PAGE_PERM = {
    dashboard:'dashboard_view', pos:'sales_create', products:'products_view', categories:'products_view',
    inventory:'inventory_view', purchases:'purchases_view', suppliers:'suppliers_manage', sales:'sales_view',
    returns:'returns_manage', customers:'customers_manage', orders:'delivery_view', delivery:'delivery_view',
    branches:'branches_view', employees:'employees_view', permissions:'employees_manage', expenses:'expenses_manage',
    reports:'reports_view', accounting:'accounting_view', settings:'settings_manage', 'audit-log':'audit_view'
  };

  const read = (key, fallback = []) => {
    try { const v = localStorage.getItem(key); return v == null ? fallback : JSON.parse(v); }
    catch (e) { console.error('Storage read', key, e); return fallback; }
  };
  const write = (key, value) => { localStorage.setItem(key, JSON.stringify(value)); return value; };
  const id = p => `${p || 'id'}_${Date.now()}_${Math.random().toString(36).slice(2,7)}`;
  const num = v => Number(v) || 0;
  const esc = v => String(v ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const money = v => `${new Intl.NumberFormat('ar-EG',{minimumFractionDigits:2,maximumFractionDigits:2}).format(num(v))} ج.م`;
  const date = v => v ? new Intl.DateTimeFormat('ar-EG',{dateStyle:'medium'}).format(new Date(v)) : '—';
  const now = () => new Date().toISOString();

  function seed() {
    const seedIfEmpty = (key, value) => { if (localStorage.getItem(key) === null) write(key, value); };
    seedIfEmpty(KEY.branches, typeof BRANCHES !== 'undefined' ? BRANCHES : []);
    seedIfEmpty(KEY.products, typeof PRODUCTS !== 'undefined' ? PRODUCTS : []);
    seedIfEmpty(KEY.categories, typeof CATEGORIES !== 'undefined' ? CATEGORIES : []);
    seedIfEmpty(KEY.inventory, typeof INVENTORY !== 'undefined' ? INVENTORY : []);
    seedIfEmpty(KEY.users, typeof USERS !== 'undefined' ? USERS : []);
    seedIfEmpty(KEY.suppliers, [
      {id:'sup_001',name:'شركة النيل للتوريدات',phone:'01000000001',address:'القاهرة',balance:0,status:'active'},
      {id:'sup_002',name:'مورد المشروبات المتحدة',phone:'01000000002',address:'الجيزة',balance:0,status:'active'}
    ]);
    seedIfEmpty(KEY.customers, [
      {id:'cus_001',name:'عميل نقدي',phone:'',address:'',balance:0,status:'active'},
      {id:'cus_002',name:'محمد أحمد',phone:'01000000003',address:'الجيزة',balance:0,status:'active'}
    ]);
    seedIfEmpty(KEY.employees, (typeof USERS !== 'undefined' ? USERS : []).map(u => ({...u,employeeId:u.id,phone:'',salary:0,hireDate:'2026-09-01'})));
    seedIfEmpty(KEY.sales, []); seedIfEmpty(KEY.purchases, []); seedIfEmpty(KEY.returns, []);
    seedIfEmpty(KEY.expenses, []); seedIfEmpty(KEY.orders, []); seedIfEmpty(KEY.ledger, []); seedIfEmpty(KEY.audit, []);
    seedIfEmpty(KEY.settings, {storeName:'سوبر ماركت بن سليمان',taxRate:14,invoicePrefix:'INV',lowStock:20,rolePermissions:{}});
  }

  function currentUser() { return read(KEY.user, null); }
  function login(username,password) {
    const users = read(KEY.users, []);
    const u = users.find(x => x.username === String(username).trim() && x.password === String(password));
    if (!u || u.status === 'inactive') return {success:false,message:'بيانات الدخول غير صحيحة أو الحساب غير نشط.'};
    const safe = {...u}; delete safe.password;
    write(KEY.user, safe); audit('login','تسجيل دخول'); return {success:true,user:safe};
  }
  function logout(){ audit('logout','تسجيل خروج'); localStorage.removeItem(KEY.user); location.href='index.html'; }
  function role(){ return currentUser()?.role || null; }
  function hasPermission(p){ const r=role(); if(!r)return false; if(r==='super_admin')return true; const s=read(KEY.settings,{}), custom=s.rolePermissions?.[r]; const list=Array.isArray(custom)?custom:(PERMS[r]||[]); return list.includes('*')||list.includes(p); }
  function setRolePermissions(roleId,list){ const s=read(KEY.settings,{}); s.rolePermissions=s.rolePermissions||{}; s.rolePermissions[roleId]=Array.from(new Set(list)); write(KEY.settings,s); audit('permissions',`تحديث صلاحيات الدور ${ROLE_NAMES[roleId]||roleId}`); return s.rolePermissions[roleId]; }
  function rolePermissions(roleId){ const s=read(KEY.settings,{}); return Array.isArray(s.rolePermissions?.[roleId])?s.rolePermissions[roleId]:(PERMS[roleId]||[]); }
  function can(page){ return hasPermission(PAGE_PERM[page] || page); }
  function branchAllowed(branchId){ const u=currentUser(); return !!u && (u.role==='super_admin' || !branchId || u.branchId===branchId); }
  function visible(items, field='branchId'){ const u=currentUser(); return u?.role==='super_admin' ? items : items.filter(x => !x[field] || x[field]===u?.branchId); }

  function audit(action, description, meta={}) {
    const logs=read(KEY.audit,[]); const u=currentUser();
    logs.unshift({id:id('log'),action,description,userId:u?.id||null,userName:u?.name||'النظام',branchId:u?.branchId||null,createdAt:now(),meta});
    write(KEY.audit,logs.slice(0,2000));
  }

  function get(key){ return read(KEY[key], []); }
  function set(key,v){ return write(KEY[key],v); }
  function find(key,idv){ return get(key).find(x=>x.id===idv) || null; }
  function saveCollection(key,items){ set(key,items); return items; }
  function upsert(key,item){ const items=get(key); const i=items.findIndex(x=>x.id===item.id); if(i<0) items.unshift(item); else items[i]=item; saveCollection(key,items); return item; }
  function remove(key,idv){ const items=get(key).filter(x=>x.id!==idv); saveCollection(key,items); audit('delete',`حذف ${key}: ${idv}`); return items; }

  function product(idv){ return find('products',idv); }
  function categoryName(cid){ return find('categories',cid)?.name || 'بدون تصنيف'; }
  function branchName(bid){ return find('branches',bid)?.name || 'كل الفروع'; }
  function userName(uid){ return find('users',uid)?.name || uid || '—'; }
  function inventoryQty(productId,branchId){ return num(get('inventory').find(x=>x.productId===productId&&x.branchId===branchId)?.quantity); }
  function setInventory(productId,branchId,quantity){
    const items=get('inventory'); let row=items.find(x=>x.productId===productId&&x.branchId===branchId);
    if(!row){ row={id:id('inv'),productId,branchId,quantity:0}; items.push(row); }
    row.quantity=Math.max(0,num(quantity)); saveCollection('inventory',items); return row.quantity;
  }
  function adjustInventory(productId,branchId,delta,reason){ const q=inventoryQty(productId,branchId); const nq=setInventory(productId,branchId,q+num(delta)); audit('inventory',reason,{productId,branchId,delta,newQuantity:nq}); return nq; }

  function totals(sale){
    const subtotal=num(sale.subtotal ?? sale.total); const tax=num(sale.tax); const discount=num(sale.discount);
    const total=num(sale.total ?? subtotal+tax-discount); const cost=num(sale.costTotal ?? 0);
    return {subtotal,tax,discount,total,cost,profit:total-cost};
  }

  function createSale(payload){
    if(!hasPermission('sales_create')) throw new Error('ليس لديك صلاحية إنشاء مبيعات.');
    const u=currentUser(); const branchId=payload.branchId||u?.branchId; if(!branchId) throw new Error('اختر الفرع.');
    const items=(payload.items||[]).filter(x=>num(x.qty)>0).map(x=>{const p=product(x.productId); if(!p) throw new Error('منتج غير موجود.'); const available=inventoryQty(p.id,branchId); if(available<num(x.qty)) throw new Error(`المخزون غير كافٍ للمنتج: ${p.name}`); return {productId:p.id,name:p.name,qty:num(x.qty),price:num(x.price??p.salePrice),cost:num(p.purchasePrice),taxRate:num(p.taxRate)};});
    if(!items.length) throw new Error('أضف منتجًا واحدًا على الأقل.');
    const subtotal=items.reduce((s,x)=>s+x.qty*x.price,0), costTotal=items.reduce((s,x)=>s+x.qty*x.cost,0);
    const discount=num(payload.discount), tax=items.reduce((s,x)=>s+x.qty*x.price*(x.taxRate/100),0); const total=Math.max(0,subtotal+tax-discount);
    const sale={id:id('sale'),invoiceNo:`${read(KEY.settings,{}).invoicePrefix||'INV'}-${Date.now()}`,branchId,customerId:payload.customerId||null,customerName:find('customers',payload.customerId)?.name||'عميل نقدي',items,subtotal,discount,tax,total,costTotal,paymentMethod:payload.paymentMethod||'cash',status:'completed',createdAt:now(),createdBy:u?.id||null};
    items.forEach(x=>adjustInventory(x.productId,branchId,-x.qty,`بيع ${sale.invoiceNo}`));
    upsert('sales',sale); ledgerSale(sale); audit('sale',`فاتورة بيع ${sale.invoiceNo}`,{total}); return sale;
  }

  function ledgerEntry(type,description,debit,credit,ref={}){
    const l=get('ledger'); l.unshift({id:id('led'),date:now(),type,description,debit:num(debit),credit:num(credit),balance:0,referenceId:ref.id||null,referenceNo:ref.number||null,branchId:ref.branchId||null});
    let balance=0; [...l].reverse().forEach(x=>{balance += num(x.debit)-num(x.credit); x.balance=balance;}); set('ledger',l); return l[0];
  }
  function ledgerSale(s){ ledgerEntry('sale',`مبيعات ${s.invoiceNo}`,s.total,0,{id:s.id,number:s.invoiceNo,branchId:s.branchId}); ledgerEntry('cogs',`تكلفة مبيعات ${s.invoiceNo}`,0,s.costTotal,{id:s.id,number:s.invoiceNo,branchId:s.branchId}); }
  function ledgerPurchase(p){ ledgerEntry('purchase',`مشتريات ${p.invoiceNo}`,0,p.total,{id:p.id,number:p.invoiceNo,branchId:p.branchId}); ledgerEntry('inventory_purchase',`إضافة مخزون ${p.invoiceNo}`,p.subtotal,0,{id:p.id,number:p.invoiceNo,branchId:p.branchId}); }
  function ledgerExpense(e){ ledgerEntry('expense',`مصروف ${e.category}: ${e.description}`,0,e.amount,{id:e.id,number:e.id,branchId:e.branchId}); }
  function ledgerReturn(r){ ledgerEntry('return',`مرتجع ${r.returnNo}`,0,r.total,{id:r.id,number:r.returnNo,branchId:r.branchId}); }

  function createPurchase(payload){
    if(!hasPermission('purchases_manage')) throw new Error('ليس لديك صلاحية إنشاء مشتريات.');
    const u=currentUser(); const branchId=payload.branchId||u?.branchId; const items=(payload.items||[]).filter(x=>num(x.qty)>0).map(x=>{const p=product(x.productId); if(!p) throw new Error('منتج غير موجود.'); return {productId:p.id,name:p.name,qty:num(x.qty),price:num(x.price??p.purchasePrice)};});
    if(!items.length) throw new Error('أضف منتجات للمشتريات.');
    const subtotal=items.reduce((s,x)=>s+x.qty*x.price,0), discount=num(payload.discount), tax=num(payload.tax), total=Math.max(0,subtotal+tax-discount);
    const p={id:id('pur'),invoiceNo:`PUR-${Date.now()}`,branchId,supplierId:payload.supplierId||null,supplierName:find('suppliers',payload.supplierId)?.name||'مورد غير محدد',items,subtotal,discount,tax,total,paymentMethod:payload.paymentMethod||'cash',status:'received',createdAt:now(),createdBy:u?.id||null};
    items.forEach(x=>adjustInventory(x.productId,branchId,x.qty,`استلام مشتريات ${p.invoiceNo}`)); upsert('purchases',p); ledgerPurchase(p); audit('purchase',`فاتورة مشتريات ${p.invoiceNo}`,{total}); return p;
  }

  function createExpense(payload){
    if(!hasPermission('expenses_manage')) throw new Error('ليس لديك صلاحية إضافة مصروف.');
    const u=currentUser(); const e={id:id('exp'),branchId:payload.branchId||u?.branchId,category:payload.category||'عام',description:payload.description||'',amount:num(payload.amount),paymentMethod:payload.paymentMethod||'cash',createdAt:payload.date?new Date(payload.date).toISOString():now(),createdBy:u?.id||null};
    if(e.amount<=0) throw new Error('قيمة المصروف يجب أن تكون أكبر من صفر.'); upsert('expenses',e); ledgerExpense(e); audit('expense',`إضافة مصروف ${e.description}`,{amount:e.amount}); return e;
  }

  function createReturn(payload){
    if(!hasPermission('returns_manage')) throw new Error('ليس لديك صلاحية المرتجعات.');
    const sale=find('sales',payload.saleId); if(!sale) throw new Error('الفاتورة غير موجودة.');
    const u=currentUser(); const items=(payload.items||[]).filter(x=>num(x.qty)>0).map(x=>{const s=sale.items.find(i=>i.productId===x.productId); if(!s) throw new Error('المنتج غير موجود بالفاتورة.'); const qty=Math.min(num(x.qty),s.qty); return {...s,qty};});
    if(!items.length) throw new Error('حدد منتجًا للمرتجع.');
    const total=items.reduce((s,x)=>s+x.qty*x.price,0); const r={id:id('ret'),returnNo:`RET-${Date.now()}`,saleId:sale.id,invoiceNo:sale.invoiceNo,branchId:sale.branchId,items,total,reason:payload.reason||'',createdAt:now(),createdBy:u?.id||null};
    items.forEach(x=>adjustInventory(x.productId,sale.branchId,x.qty,`مرتجع ${r.returnNo}`)); upsert('returns',r); sale.returnedTotal=num(sale.returnedTotal)+total; if(sale.returnedTotal>=sale.total) sale.status='returned'; upsert('sales',sale); ledgerReturn(r); audit('return',`مرتجع ${r.returnNo}`,{total}); return r;
  }

  function createOrder(payload){
    const u=currentUser(); const order={id:id('ord'),orderNo:`ORD-${Date.now()}`,branchId:payload.branchId||u?.branchId,customerId:payload.customerId||null,customerName:find('customers',payload.customerId)?.name||payload.customerName||'',phone:payload.phone||'',address:payload.address||'',items:payload.items||[],total:num(payload.total),status:payload.status||'new',driverId:payload.driverId||null,notes:payload.notes||'',createdAt:now()}; upsert('orders',order); audit('order',`إنشاء طلب ${order.orderNo}`); return order;
  }

  function metrics(){
    const sales=visible(get('sales')), purchases=visible(get('purchases')), expenses=visible(get('expenses')), returns=visible(get('returns'));
    const revenue=sales.filter(x=>x.status!=='cancelled').reduce((s,x)=>s+num(x.total),0);
    const cogs=sales.filter(x=>x.status!=='cancelled').reduce((s,x)=>s+num(x.costTotal),0);
    const returnTotal=returns.reduce((s,x)=>s+num(x.total),0); const expenseTotal=expenses.reduce((s,x)=>s+num(x.amount),0); const purchaseTotal=purchases.reduce((s,x)=>s+num(x.total),0);
    return {revenue,netSales:revenue-returnTotal,cogs,returns:returnTotal,expenses:expenseTotal,purchases:purchaseTotal,grossProfit:revenue-cogs,netProfit:revenue-cogs-expenseTotal-returnTotal,invoices:sales.length,orders:visible(get('orders')).length};
  }

  function init(){ seed(); window.BS={KEY,ROLE_NAMES,PERMS,PAGE_PERM,read,write,get,set,find,upsert,remove,id,num,esc,money,date,now,currentUser,login,logout,role,hasPermission,setRolePermissions,rolePermissions,can,branchAllowed,visible,audit,product,categoryName,branchName,userName,inventoryQty,setInventory,adjustInventory,createSale,createPurchase,createExpense,createReturn,createOrder,ledgerEntry,metrics}; }
  init();
})();

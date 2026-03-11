// --- Config กำหนดค่าเริ่มต้น ---
let cart;
try {
  cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (!Array.isArray(cart)) throw new Error("Error cart");
} catch (e) {
  cart = [];
  localStorage.removeItem("cart");
}

let lang = "th";  // ภาษาเริ่มต้น (ไทย)
let selectedTable = localStorage.getItem("selectedTable") || null;  // ดึงเลขโต๊ะที่บันทึกไว้
const PROMPTPAY_ID = "0958268649";  // เบอร์ PromptPay
let tempMenuIndex = null;  // พื้นที่เก็บเมนูที่กำลังเลือกซอส (สำหรับเมนูที่มีตัวเลือกซอส)

// --- ฐานข้อมูลซอส ---
const sauceMapping = {
  "Barbecue Sauce": { th: "บาร์บีคิว", en: "Barbecue Sauce", zh: "烧烤酱" },
  "Spicy Sauce": { th: "สไปซี่", en: "Spicy Sauce", zh: "辣酱" },
  "Seafood Dipping Sauce": {
    th: "ซีฟู้ด",
    en: "Seafood Dipping Sauce",
    zh: "海鲜蘸酱",
  },
  "Tonkatsu Sauce": { th: "ทงคัตซึ", en: "Tonkatsu Sauce", zh: "猪排酱" },
  blackpepper: { th: "พริกไทยดำ", en: "Black Pepper", zh: "黑胡椒" },
  teriyaki: { th: "เทอริยากิ", en: "Teriyaki", zh: "照烧酱" },
  jaew: { th: "แจ่ว", en: "Jaew Sauce", zh: "泰式辣酱" },
  none: { th: "ไม่เอาซอส", en: "No Sauce", zh: "不要酱汁" },
};

// --- ข้อความ Interface ---
const uiText = {
  th: {
    table: "โต๊ะ",
    bottomBarLabel: "ดูตะกร้า",
    cartTitle: "ตะกร้าสินค้า",
    noteLabel: "📝 โน้ตถึงครัว",
    notePlaceholder: "เช่น ไม่ใส่ผัก, เผ็ดน้อย...",
    totalLabel: "รวมทั้งหมด",
    confirmOrder: "ยืนยันการสั่งอาหาร",
    sauceTitle: "เลือกซอส",
    sauceConfirm: "ยืนยัน",
    receiptTitle: "สั่งอาหารสำเร็จ!",
    netTotal: "รวมสุทธิ",
    scanPay: "สแกนจ่าย (PromptPay)",
    finishBtn: "กลับหน้าหลัก",
    add: "เพิ่ม",
    added: "เพิ่มลงตะกร้าแล้ว",
    selectSauceWarn: "กรุณาเลือกซอส",
    emptyCartWarn: "ตะกร้าว่างเปล่า",
    sauceBadge: "เลือกซอส",
  },
  en: {
    table: "Table",
    bottomBarLabel: "View Cart",
    cartTitle: "Shopping Cart",
    noteLabel: "📝 Note to Kitchen",
    notePlaceholder: "e.g. No spicy, No veggies...",
    totalLabel: "Total",
    confirmOrder: "Place Order",
    sauceTitle: "Select Sauce",
    sauceConfirm: "Confirm",
    receiptTitle: "Order Placed!",
    netTotal: "Net Total",
    scanPay: "Scan to Pay",
    finishBtn: "Home",
    add: "Add",
    added: "Added to cart",
    selectSauceWarn: "Please select a sauce",
    emptyCartWarn: "Cart is empty",
    sauceBadge: "Sauce",
  },
  zh: {
    table: "桌号",
    bottomBarLabel: "查看购物车",
    cartTitle: "购物车",
    noteLabel: "📝 备注",
    notePlaceholder: "例如：不辣，不要香菜...",
    totalLabel: "总计",
    confirmOrder: "确认下单",
    sauceTitle: "选择酱汁",
    sauceConfirm: "确认",
    receiptTitle: "下单成功!",
    netTotal: "实付金额",
    scanPay: "扫码支付",
    finishBtn: "返回首页",
    add: "加入",
    added: "已加入购物车",
    selectSauceWarn: "请选择酱汁",
    emptyCartWarn: "购物车为空",
    sauceBadge: "选酱汁",
  },
};

// --- ฐานข้อมูลเมนูอาหาร ---
const menuDatabase = [
  {
    name: {
      th: "สปาเก็ตตี้คาโบนาร่า",
      en: "Spaghetti Carbonara",
      zh: "卡邦尼意大利面",
    },
    price: 79,
    img: "images/1.jpg",
  },
  {
    name: {
      th: "สปาเก็ตตี้ซอสขี้เมาหมู",
      en: "Spicy Basil Pork Spaghetti",
      zh: "泰式罗勒辣酱猪肉意大利面",
    },
    price: 69,
    img: "images/2.jpg",
  },
  {
    name: {
      th: "สปาเก็ตตี้ซอสมะเขือเทศหมูสับ",
      en: "Tomato Sauce Pork Spaghetti",
      zh: "番茄酱猪肉末意大利面",
    },
    price: 69,
    img: "images/3.jpg",
  },
  {
    name: {
      th: "สปาเก็ตตี้ซอสมะเขือเทศไก่สับ",
      en: "Tomato Sauce Chicken Spaghetti",
      zh: "番茄酱鸡肉末意大利面",
    },
    price: 69,
    img: "images/3.jpg",
  },
  {
    name: {
      th: "ผักโขมอบชีส",
      en: "Baked Spinach with Cheese",
      zh: "芝士焗菠菜",
    },
    price: 59,
    img: "images/4.jpg",
  },
  {
    name: { th: "หมูแดดเดียว", en: "Sun-Dried Pork", zh: "泰式风干猪肉" },
    price: 50,
    img: "images/5.jpg",
  },
  {
    name: { th: "ซุปเห็ด", en: "Mushroom Soup", zh: "奶油蘑菇汤" },
    price: 49,
    img: "images/6.jpg",
  },
  {
    name: { th: "ซุปผักโขม", en: "Spinach Soup", zh: "奶油菠菜汤" },
    price: 49,
    img: "images/7.jpg",
  },
  {
    name: { th: "นักเก็ต", en: "Chicken Nuggets", zh: "炸鸡块" },
    price: 45,
    img: "images/8.jpg",
  },
  {
    name: { th: "เฟรนช์ฟรายส์", en: "French Fries", zh: "炸薯条" },
    price: 39,
    img: "images/9.jpg",
  },
  {
    name: { th: "ไก่ป๊อป", en: "Popcorn Chicken", zh: "爆米花鸡" },
    price: 45,
    img: "images/10.jpg",
  },
  {
    name: {
      th: "ไก่ป๊อปสไปซี่",
      en: "Spicy Popcorn Chicken",
      zh: "香辣爆米花鸡",
    },
    price: 45,
    img: "images/10.jpg",
  },
  {
    name: { th: "ฟิชแอนด์ชิปส์", en: "Fish & Chips", zh: "炸鱼薯条" },
    price: 69,
    img: "images/11.jpg",
  },
  {
    name: {
      th: "ข้าวหน้าสเต็กไก่ย่าง",
      en: "Grilled Chicken Steak Rice Bowl",
      zh: "烤鸡排盖饭",
    },
    price: 59,
    img: "images/13.jpg",
    hasSauce: true,
  },
  {
    name: {
      th: "ข้าวหน้าสเต็กหมูย่าง",
      en: "Rice with Grilled Pork Steak",
      zh: "烤猪排盖饭",
    },
    price: 99,
    img: "images/14.jpg",
    hasSauce: true,
  },
  {
    name: {
      th: "ข้าวหน้าสเต็กไก่ทอดกรอบ",
      en: "Rice with Crispy Fried Chicken Steak",
      zh: "炸鸡排盖饭",
    },
    price: 59,
    img: "images/15.jpg",
  },
  {
    name: {
      th: "ข้าวหน้าสเต็กสันคอหมู",
      en: "Rice with Grilled Pork Neck Steak",
      zh: "猪颈肉盖饭",
    },
    price: 169,
    img: "images/16.jpg",
    hasSauce: true,
  },
  {
    name: {
      th: "ข้าวหน้าสเต็กโคขุน",
      en: "Thai Premium Beef Steak Rice",
      zh: "优质牛排盖饭",
    },
    price: 119,
    img: "images/17.jpg",
    hasSauce: true,
  },
  {
    name: {
      th: "ข้าวหน้าสเต็กแซลมอน",
      en: "Rice with Grilled Salmon Steak",
      zh: "三文鱼排盖饭",
    },
    price: 189,
    img: "images/18.jpg",
  },
  {
    name: {
      th: "ข้าวหน้าปลาสเต็กทอดกรอบ",
      en: "Rice with Crispy Fried Fish Steak",
      zh: "炸鱼排盖饭",
    },
    price: 59,
    img: "images/19.jpg",
  },
  {
    name: {
      th: "ข้าวหน้าปลาซาบะญี่ปุ่นย่าง",
      en: "Japanese Grilled Saba Rice",
      zh: "日式烤鲭鱼盖饭",
    },
    price: 89,
    img: "images/20.jpg",
  },
  {
    name: {
      th: "ข้าวหน้าสเต็กหมูบด",
      en: "Rice with Pork Patty Steak",
      zh: "猪肉饼盖饭",
    },
    price: 79,
    img: "images/21.jpg",
    hasSauce: true,
  },
  {
    name: {
      th: "ข้าวหน้าสเต็กเนื้อบด",
      en: "Rice with Beef Hamburger Steak",
      zh: "牛肉饼盖饭",
    },
    price: 99,
    img: "images/22.jpg",
    hasSauce: true,
  },
  {
    name: {
      th: "ข้าวหมูคั่วกลิ้ง",
      en: "Southern Thai Spicy Pork Stir-Fry on Rice",
      zh: "泰南香辣猪肉炒饭",
    },
    price: 49,
    img: "images/23.jpg",
  },
  {
    name: {
      th: "สลัดสเต็กปลาทอด",
      en: "Salad with Crispy Fried Fish Steak",
      zh: "炸鱼排沙拉",
    },
    price: 69,
    img: "images/24.jpg",
  },
  {
    name: {
      th: "สลัดสเต็กอกไก่ย่าง",
      en: "Salad with Grilled Chicken Breast Steak",
      zh: "烤鸡胸肉排沙拉",
    },
    price: 69,
    img: "images/25.jpg",
  },
  {
    name: {
      th: "สลัดสเต็กหมูย่าง",
      en: "Salad with Grilled Pork Steak",
      zh: "烤猪排沙拉",
    },
    price: 99,
    img: "images/26.jpg",
  },
  {
    name: { th: "สลัดผัก", en: "Fresh Garden Salad", zh: "蔬菜沙拉" },
    price: 49,
    img: "images/27.jpg",
  },
  {
    name: {
      th: "สเต็กเนื้อโคขุน",
      en: "Thai Premium Beef Steak",
      zh: "优质牛排",
    },
    price: 109,
    img: "images/28.jpg",
    hasSauce: true,
  },
  {
    name: {
      th: "ริปอายสเต็กเนื้อ",
      en: "Grilled Ribeye Beef Steak",
      zh: "肉眼牛排",
    },
    price: 119,
    img: "images/29.jpg",
    hasSauce: true,
  },
  {
    name: { th: "ที-โบน สเต็กเนื้อ", en: "T-Bone Beef Steak", zh: "T骨牛排" },
    price: 199,
    img: "images/30.jpg",
    hasSauce: true,
  },
  {
    name: { th: "สเต็กปลาซาบะ", en: "Japanese Saba Steak", zh: "鲭鱼排" },
    price: 79,
    img: "images/31.jpg",
  },
  {
    name: {
      th: "สเต็กปลาทอด",
      en: "Crispy Fried Fish Steak",
      zh: "香脆炸鱼排",
    },
    price: 109,
    img: "images/32.jpg",
    hasSauce: true,
  },
  {
    name: {
      th: "สเต็กปลาย่างน้ำจิ้มซีฟู้ด",
      en: "Grilled Fish Steak & Thai Spicy Dipping Sauce",
      zh: "烤鱼排配泰式海鲜蘸酱",
    },
    price: 99,
    img: "images/33.jpg",
  },
  {
    name: { th: "สเต็กปลาแซลมอน", en: "Salmon Steak", zh: "三文鱼排" },
    price: 179,
    img: "images/34.jpg",
    hasSauce: true,
  },
  {
    name: { th: "พอร์คชอพ", en: "Pork chop", zh: "猪排" },
    price: 109,
    img: "images/35.jpg",
    hasSauce: true,
  },
  {
    name: { th: "พอร์คชอพซอสสไปซี่", en: "Spicy Pork Chop", zh: "香辣猪排" },
    price: 109,
    img: "images/36.jpg",
  },
  {
    name: { th: "พอร์คชอพซอสบาร์บีคิว", en: "BBQ Pork Chop", zh: "烧烤猪排" },
    price: 109,
    img: "images/36.jpg",
  },
  {
    name: { th: "ซี่โคครงบาร์บีคิว", en: "BBQ Ribs", zh: "烧烤排骨" },
    price: 169,
    img: "images/37.jpg",
  },
  {
    name: { th: "สเต็กหมูบด", en: "Minced Pork Steak", zh: "猪肉汉堡排" },
    price: 69,
    img: "images/38.jpg",
    hasSauce: true,
  },
  {
    name: { th: "สเต็กเนื้อบด", en: "Minced Beef Steak", zh: "牛肉汉堡排" },
    price: 89,
    img: "images/39.jpg",
    hasSauce: true,
  },
  {
    name: { th: "เบอร์เกอร์หมู", en: "Pork Burger", zh: "猪肉汉堡" },
    price: 69,
    img: "images/40.jpg",
  },
  {
    name: { th: "เบอร์เกอร์เนื้อ", en: "Beef Burger", zh: "牛肉汉堡" },
    price: 89,
    img: "images/41.jpg",
  },
  {
    name: { th: "สเต็กไก่", en: "Chicken Steak", zh: "鸡排" },
    price: 49,
    img: "images/42.jpg",
    hasSauce: true,
  },
  {
    name: { th: "สะโพกไก่สไปซี่", en: "Spicy Chicken Thigh", zh: "香辣鸡腿" },
    price: 89,
    img: "images/43.jpg",
  },
  {
    name: {
      th: "สเต็กไก่ซอสบาร์บีคิว",
      en: "BBQ Chicken Steak",
      zh: "烧烤酱鸡排",
    },
    price: 59,
    img: "images/44.jpg",
  },
  {
    name: {
      th: "สเต็กไก่ซอสสไปซี่",
      en: "Spicy Chicken Steak",
      zh: "香辣鸡排",
    },
    price: 59,
    img: "images/44.jpg",
  },
  {
    name: { th: "สเต็กหมู", en: "Pork Steak", zh: "猪排" },
    price: 89,
    img: "images/45.jpg",
    hasSauce: true,
  },
  {
    name: {
      th: "สเต็กหมูซอสบาร์บีคิว",
      en: "Pork Steak BBQ Sauce",
      zh: "烧烤酱猪排",
    },
    price: 89,
    img: "images/46.jpg",
  },
  {
    name: {
      th: "สเต็กหมูซอสสไปซี่",
      en: "Pork Steak Spicy Sauce",
      zh: "香辣猪排",
    },
    price: 89,
    img: "images/46.jpg",
  },
  {
    name: { th: "สเต็กหมูสไปซี่", en: "Spicy Pork Steak", zh: "香辣酱猪排" },
    price: 109,
    img: "images/47.jpg",
  },
  {
    name: { th: "สเต็กสันคอหมู", en: "Pork Blade Steak", zh: "猪颈肉排" },
    price: 169,
    img: "images/48.jpg",
    hasSauce: true,
  },
  {
    name: {
      th: "สเต็กสันคอหมูซอสบาร์บีคิว",
      en: "Pork Blade Steak BBQ Sauce",
      zh: "烧烤酱猪颈肉排",
    },
    price: 169,
    img: "images/49.jpg",
  },
  {
    name: {
      th: "สเต็กสันคอหมูซอสสไปซี่",
      en: "Pork Blade Steak Spicy Sauce",
      zh: "香辣猪颈肉排",
    },
    price: 169,
    img: "images/49.jpg",
  },
  {
    name: {
      th: "ไก่ + ปลา + หมู",
      en: "Chicken+Fish+Pork",
      zh: "鸡 + 鱼 + 猪肉",
    },
    price: 219,
    img: "images/50.jpg",
    hasSauce: true,
  },
  {
    name: {
      th: "ไก่ + ปลา + โคขุน",
      en: "Chicken+Fish+Premium Beef",
      zh: "鸡 + 鱼 + 优质牛肉",
    },
    price: 229,
    img: "images/51.jpg",
    hasSauce: true,
  },
  {
    name: {
      th: "ไก่ + โคขุน + พอร์คชอพ + ปลา",
      en: "Chicken + Premium Beef + Pork Chop + Fish",
      zh: "鸡 + 优质牛肉 + 猪排 + 鱼",
    },
    price: 299,
    img: "images/52.jpg",
    hasSauce: true,
  },
  {
    name: { th: "สันคอ + ปลา", en: "Pork Blade + Fish", zh: "猪颈肉 + 鱼" },
    price: 249,
    img: "images/53.jpg",
    hasSauce: true,
  },
  {
    name: {
      th: "พอร์คชอพ + โคขุน",
      en: "Pork Chop + Premium Beef",
      zh: "猪排 + 优质牛肉",
    },
    price: 189,
    img: "images/54.jpg",
    hasSauce: true,
  },
  {
    name: {
      th: "พอร์คชอพ + ทีโบน",
      en: "Pork Chop + T-Bone Steak",
      zh: "猪排 + T骨牛排",
    },
    price: 289,
    img: "images/55.jpg",
    hasSauce: true,
  },
  {
    name: {
      th: "หมู + พอร์คชอพ + สันคอ",
      en: "Pork + Pork Chop + Pork Blade",
      zh: "猪肉 + 猪排 + 猪颈肉",
    },
    price: 339,
    img: "images/56.jpg",
    hasSauce: true,
  },
  {
    name: {
      th: "แซลมอน + ทีโบน",
      en: "Salmon + T-Bone Steak",
      zh: "三文鱼 + T骨牛排",
    },
    price: 339,
    img: "images/57.jpg",
    hasSauce: true,
  },
  {
    name: {
      th: "พอร์คชอพ + ทีโบน + แซลมอน",
      en: "Pork Chop + T-Bone Steak + Salmon",
      zh: "猪排 + T骨牛排 + 三文鱼",
    },
    price: 419,
    img: "images/58.jpg",
    hasSauce: true,
  },
  {
    name: {
      th: "โคขุน + ริบอาย + ทีโบน",
      en: "Premium Beef + Ribeye + T-Bone Steak",
      zh: "优质牛肉 + 肋眼牛排 + T骨牛排",
    },
    price: 389,
    img: "images/59.jpg",
    hasSauce: true,
  },
  {
    name: {
      th: "ไก่ + หมู + โคขุน + ปลา + แซลม่อน",
      en: "Chicken + Pork + Premium Beef + Fish + Salmon",
      zh: "鸡 + 猪肉 + 优质牛肉 + 鱼 + 三文鱼",
    },
    price: 459,
    img: "images/60.jpg",
    hasSauce: true,
  },
  {
    name: {
      th: "แซลมอน + พอร์คชอพ + ริบอาย",
      en: "Salmon + Pork Chop + Ribeye Steak",
      zh: "三文鱼 + 猪排 + 肋眼牛排",
    },
    price: 349,
    img: "images/61.jpg",
    hasSauce: true,
  },
  {
    name: {
      th: "ปลา + ไก่ + พอร์คชอพ + สันคอ + ริบอาย + ทีโบน",
      en: "Fish + Chicken + Pork Chop + Pork Blade + Ribeye + T-Bone Steak",
      zh: "鱼 + 鸡肉 + 猪排 + 猪颈肉 + 肋眼牛排 + T骨牛排",
    },
    price: 599,
    img: "images/62.jpg",
    hasSauce: true,
  },
];

// *** ส่วนเริ่มต้นการทำงาน (Initialization) ***
window.onload = function () {
  const urlParams = new URLSearchParams(window.location.search);
  const tableParam = urlParams.get("table");

  if (tableParam) {
    selectedTable = tableParam;
    localStorage.setItem("selectedTable", selectedTable);
    startApp();
  } else {
    const storedTable = localStorage.getItem("selectedTable");
    if (storedTable) {
      selectedTable = storedTable;
      startApp();
    } else {
      startApp();
    }
  }
};

function startApp() {
  const displayTable = selectedTable ? selectedTable : "-";
  document.getElementById("tableNumberDisplay").innerText = displayTable;
  setLanguage("th");
  updateBottomBar();
}

// *** ส่วนการทำงานหลัก ***
// --- ฟังก์ชันเปลี่ยนภาษาและอัปเดตข้อความใน UI ตามภาษาที่เลือก ---
function setLanguage(newLang) {
  lang = newLang;
  const t = uiText[lang];

  // แปล Interface ตามภาษาที่เลือก
  document.querySelector(".cart-label").innerText = t.bottomBarLabel;
  document.getElementById("tableLabel").innerText = t.table;
  document.getElementById("cartTitle").innerText = t.cartTitle;
  document.getElementById("noteLabel").innerText = t.noteLabel;
  document.getElementById("orderNoteInput").placeholder = t.notePlaceholder;
  document.getElementById("totalLabel").innerText = t.totalLabel;
  document.getElementById("confirmOrderBtn").innerText = t.confirmOrder;
  document.getElementById("sauceModalTitle").innerText = t.sauceTitle;
  document.getElementById("sauceConfirmBtn").innerText = t.sauceConfirm;
  document.getElementById("receiptTitle").innerText = t.receiptTitle;
  document.getElementById("receiptTableLabel").innerText = t.table;
  document.getElementById("netTotalLabel").innerText = t.netTotal;
  document.getElementById("scanPayLabel").innerText = t.scanPay;
  document.getElementById("finishBtn").innerText = t.finishBtn;

  renderMenu();
  renderCartList();
}

// --- ฟังก์ชันแสดงเมนูอาหาร ---
function renderMenu() {
  const grid = document.getElementById("menuGrid");
  grid.innerHTML = "";

  menuDatabase.forEach((item, index) => {
    // แสดงชื่อเมนูตามภาษาที่เลือก ถ้าไม่มีให้ใช้ภาษาไทยเป็นค่าเริ่มต้น
    const displayName = item.name[lang] || item.name.th;

    const needsSauce = item.hasSauce === true;
    // ถ้าเมนูมีตัวเลือกซอส ให้แสดงป้าย "เลือกซอส" และคลิกที่การ์ดจะเปิด Modal เลือกซอส
    const clickAction = needsSauce
      ? `openSauceModal(${index})`
      : `addToCart(${index})`;
    // ถ้าเมนูมีตัวเลือกซอส ให้แสดงป้าย "เลือกซอส" บนการ์ด 
    const sauceBadgeHTML = needsSauce
      ? `<div class="sauce-badge">${uiText[lang].sauceBadge}</div>`
      : "";

    const card = document.createElement("div");
    card.className = "menu-card";
    card.onclick = () => eval(clickAction);

    card.innerHTML = `
            <div class="card-img-wrapper">
                <img src="${item.img || "images/placeholder.jpg"}" class="card-img" onerror="this.src='https://via.placeholder.com/150?text=No+Image'">
                ${sauceBadgeHTML} 
            </div>
            <div class="card-content">
                <div class="menu-title">${displayName}</div>
                <div class="menu-footer">
                    <span class="price-tag">${item.price} ฿</span>
                    <button class="add-btn-circle">+</button>
                </div>
            </div>
        `;
    grid.appendChild(card);

    const addBtn = card.querySelector(".add-btn-circle");
    if (addBtn) {
      addBtn.onclick = (e) => {
        e.stopPropagation();
        if (needsSauce) openSauceModal(index);
        else addToCart(index);
      };
    }
  });
}

// --- ฟังก์ชันเพิ่มสินค้าไปยังตะกร้า ถ้าเมนูมีตัวเลือกซอสจะต้องระบุซอสด้วย ---
function addToCart(index, sauce = null) {
  // ตรวจสอบว่ามีเมนูนี้ ในตะกร้าหรือยัง ถ้ามีแล้วให้เพิ่มจำนวน ถ้าไม่มีให้เพิ่มรายการใหม่
  const existing = cart.find((i) => i.itemIndex === index && i.sauce === sauce);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ itemIndex: index, qty: 1, sauce: sauce });
  }
  showToast(uiText[lang].added);
  updateBottomBar();
  renderCartList();
}

// --- ฟังก์ชันอัปเดตแถบสรุปด้านล่าง (ตะกร้าสินค้า) ---
function updateBottomBar() {
  cart = cart.filter((item) => menuDatabase[item.itemIndex]);
  const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
  let totalPrice = 0;

  cart.forEach((item) => {
    const itemInfo = menuDatabase[item.itemIndex];
    if (itemInfo) {
      totalPrice += itemInfo.price * item.qty;
    }
  });

  document.getElementById("cartCountBadge").innerText = totalQty;
  document.getElementById("barTotal").innerText = totalPrice.toLocaleString();
  document.getElementById("cartTotalDisplay").innerText =
    totalPrice.toLocaleString();

  const bar = document.getElementById("bottomBar");
  // แสดงหรือซ่อนแถบสรุปตามว่ามีสินค้าในตะกร้าหรือไม่ 
  if (totalQty > 0) {
    bar.style.display = "flex";
  } else {
    bar.style.display = "none";
    closeCart();
  }
  localStorage.setItem("cart", JSON.stringify(cart)); // บันทึกตะกร้า
}

// --- ฟังก์ชันควบคุมหน้าต่าง Popup ---
// ล็อคการเลื่อนหน้าจอหลักเมื่อเปิด Modal
function toggleBodyScroll(disable) {
  if (disable) document.body.classList.add("no-scroll");
  else document.body.classList.remove("no-scroll");
}

// --- ฟังก์ชันเปิด Modal เลือกซอส ---
function openSauceModal(index) {
  tempMenuIndex = index; // เก็บ index ของเมนูที่กำลังเลือกซอสไว้ชั่วคราว
  const container = document.getElementById("sauceOptionsContainer");
  container.innerHTML = "";

  const makeSafeId = (k) =>
    "s_" +
    String(k)
      .replace(/\s+/g, "_")
      .replace(/[^\w-]/g, "")
      .toLowerCase();

  Object.keys(sauceMapping).forEach((key) => {
    const safeId = makeSafeId(key);
    const div = document.createElement("div");
    // ชื่อซอสใน Popup ให้ใช้ตามภาษาที่ลูกค้าเลือก
    const sauceName = sauceMapping[key][lang] || sauceMapping[key].th;

    div.innerHTML = `
            <input type="radio" name="sauceSelect" id="${safeId}" value="${key}" class="sauce-radio">
            <label for="${safeId}" class="sauce-label">${sauceName}</label>
        `;
    container.appendChild(div);
  });

  document.getElementById("sauceModal").classList.add("active");
  toggleBodyScroll(true);
}

// --- ฟังก์ชันปิด Modal เลือกซอส ---
function closeSauceModal() {
  document.getElementById("sauceModal").classList.remove("active");
  tempMenuIndex = null;
  toggleBodyScroll(false);
}

// --- ฟังก์ชันยืนยันการเลือกซอสและเพิ่มสินค้าไปยังตะกร้า ---
function confirmSauce() {
  const selected = document.querySelector('input[name="sauceSelect"]:checked');
  if (!selected) {
    showToast(uiText[lang].selectSauceWarn);
    return;
  }
  addToCart(tempMenuIndex, selected.value);
  closeSauceModal();
}

// --- ฟังก์ชันเปิด Modal ตะกร้าสินค้า ---
function openCart() {
  renderCartList();
  document.getElementById("cartModal").classList.add("active");
  toggleBodyScroll(true);
}

// --- ฟังก์ชันปิด Modal ตะกร้าสินค้า ---
function closeCart() {
  document.getElementById("cartModal").classList.remove("active");
  toggleBodyScroll(false);
}

// --- ฟังก์ชันแสดงรายการสินค้าในตะกร้า พร้อมตัวเลือกเพิ่ม/ลดจำนวน ---
function renderCartList() {
  const container = document.getElementById("cartItemsList");
  container.innerHTML = "";

  cart.forEach((item, cartIdx) => {
    const itemData = menuDatabase[item.itemIndex];
    if (!itemData) return;

    // ชื่อในตะกร้า: ใช้ตามภาษาที่ลูกค้าเลือก
    const displayName = itemData.name[lang] || itemData.name.th;
    const sauceName = item.sauce
      ? sauceMapping[item.sauce][lang] || sauceMapping[item.sauce].th
      : "";

    const div = document.createElement("div");
    div.className = "cart-item-row";
    div.innerHTML = `
            <div class="cart-item-details">
                <div class="cart-item-name">${displayName}</div>
                ${sauceName ? `<span class="cart-item-sauce">+ ${sauceName}</span>` : ""}
                <div class="cart-item-price">${itemData.price} ฿</div>
            </div>
            <div class="qty-stepper">
                <button class="qty-btn" onclick="updateQty(${cartIdx}, -1)">-</button>
                <span>${item.qty}</span>
                <button class="qty-btn" onclick="updateQty(${cartIdx}, 1)">+</button>
            </div>
        `;
    container.appendChild(div);
  });
}

// --- ฟังก์ชันอัปเดตจำนวนสินค้าในตะกร้า ---
function updateQty(idx, delta) {
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);
  updateBottomBar();
  renderCartList();
}

// --- ฟังก์ชันสั่งอาหาร ---
function orderFood() {
  if (cart.length === 0) {
    showToast(uiText[lang].emptyCartWarn);
    return;
  }

  closeCart();

  const container = document.getElementById("receiptItems");
  container.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const itemData = menuDatabase[item.itemIndex];
    if (!itemData) return;

    // ใบเสร็จ (สำหรับคนครัว): บังคับใช้ภาษาไทย
    const displayName = itemData.name.th;
    const sauceName = item.sauce ? `(${sauceMapping[item.sauce].th})` : "";

    const totalItemPrice = itemData.price * item.qty;
    total += totalItemPrice;

    const div = document.createElement("div");
    div.className = "receipt-row";
    div.innerHTML = `
            <span>${displayName} ${sauceName} x${item.qty}</span>
            <span>${totalItemPrice.toLocaleString()}</span>
        `;
    container.appendChild(div);
  });

  // แสดงโน้ตที่ลูกค้าใส่ (ถ้ามี)
  const noteVal = document.getElementById("orderNoteInput").value;
  if (noteVal.trim() !== "") {
    const noteDiv = document.createElement("div");
    noteDiv.style.fontSize = "0.85rem";
    noteDiv.style.color = "red";
    noteDiv.style.marginTop = "10px";
    noteDiv.style.borderTop = "1px dashed #eee";
    noteDiv.style.paddingTop = "5px";
    noteDiv.innerText = `Note: ${noteVal}`;
    container.appendChild(noteDiv);
  }

  // แสดงหมายเลขโต๊ะและยอดรวมในใบเสร็จ
  const tableDisplay = selectedTable ? selectedTable : "-";
  document.getElementById("receiptTable").innerText = tableDisplay;
  document.getElementById("finalTotal").innerText = total.toLocaleString();

  // สร้าง QR Code สำหรับการชำระเงินผ่าน PromptPay
  const qrDiv = document.getElementById("qrcode");
  qrDiv.innerHTML = "";
  try {
    const payload = createPromptPayPayload(PROMPTPAY_ID, total);
    if (typeof QRCode !== "undefined") {
      new QRCode(qrDiv, { text: payload, width: 180, height: 180 });
    } else {
      qrDiv.innerText = "Error: QRCode Lib missing";
    }
  } catch (e) {
    console.error("QR Error", e);
    qrDiv.innerText = "QR Error";
  }

  document.getElementById("receiptModal").style.display = "flex";
  toggleBodyScroll(true);
}

// --- ฟังก์ชันยืนยันการสั่งอาหารและเคลียร์ตะกร้า ---
function finishOrder() {
  cart = [];
  localStorage.setItem("cart", JSON.stringify([]));
  document.getElementById("orderNoteInput").value = "";
  updateBottomBar();
  document.getElementById("receiptModal").style.display = "none";
  toggleBodyScroll(false);
}

// --- ฟังก์ชันแสดงแจ้งเตือน ---
function showToast(msg) {
  const toast = document.getElementById("toast");
  if (toast) {
    toast.innerText = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
  }
}

// --- ฟังก์ชันสร้าง Payload สำหรับ PromptPay QR Code ---
function createPromptPayPayload(id, amount) {
  let target = id.replace(/[^0-9]/g, "");
  if (target.startsWith("0")) target = target.substring(1);
  target = "0066" + target;

  const targetTag = "01" + String(target.length).padStart(2, "0") + target;
  const merchantInfoVal = "0016A000000677010111" + targetTag;
  const merchantInfo =
    "29" + String(merchantInfoVal.length).padStart(2, "0") + merchantInfoVal;

  let amountTag = "";
  if (amount) {
    const amtStr = parseFloat(amount).toFixed(2);
    amountTag = "54" + String(amtStr.length).padStart(2, "0") + amtStr;
  }

  const data =
    "0002010102" +
    (amount ? "12" : "11") +
    merchantInfo +
    "5802TH5303764" +
    amountTag +
    "6304";
  return data + crc16(data);
}

// --- ฟังก์ชันคำนวณ CRC16 สำหรับตรวจสอบความถูกต้องของข้อมูลใน PromptPay QR Code ---
function crc16(data) {
  let crc = 0xffff;
  for (let i = 0; i < data.length; i++) {
    let x = (crc >> 8) ^ data.charCodeAt(i);
    x ^= x >> 4;
    crc = (crc << 8) ^ (x << 12) ^ (x << 5) ^ x;
    crc &= 0xffff;
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

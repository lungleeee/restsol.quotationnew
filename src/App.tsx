/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Printer, 
  FileText, 
  Building2, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  ChevronDown,
  Download,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Constants & Types ---

const SUPPLIER = {
  name: "芮斯特有限公司",
  rep: "李福龍",
  tel: "06-2423086",
  email: "lungfree0330@gmail.com",
  id: "90151231",
  addr: "台南市永康區中華路988號10F-1",
  bank: "台新銀行",
  branch: "永康分行",
  account: "2087-01-0000670-7"
};

const CLIENTS = [
  {
    id: "triple",
    name: "三次方企業社",
    tel: "05-5850189",
    taxId: "72404190",
    addr: "雲林縣莿桐鄉大美村大美23-6號(彰輝不鏽鋼旁邊)",
    contact: "三次方企業社"
  },
  {
    id: "strong",
    name: "史狀沙斯企業社",
    tel: "05-5850189", // Assuming same as triple if not provided
    taxId: "72404190", // Assuming same if not provided
    addr: "雲林縣莿桐鄉大美村大美23-6號(彰輝不鏽鋼旁邊)", // Assuming same
    contact: "史狀沙斯企業社"
  }
];

type ProductType = '40g' | '1kg' | 'cube';

interface Product {
  id: ProductType;
  name: string;
  spec: string;
  basePrice: number;
}

const PRODUCTS: Product[] = [
  { id: '40g', name: "Restsol Protein Vegan 睿獸大豆分離蛋白 40g", spec: "單包入(250一箱)", basePrice: 29 },
  { id: '1kg', name: "Restsol Protein Vegan 睿獸大豆分離蛋白 1kg", spec: "15入一箱", basePrice: 550 },
  { id: 'cube', name: "Protein Cube 睿獸巧克高蛋白方派", spec: "20g/8入/一盒", basePrice: 180 }
];

const FLAVORS: Record<ProductType, string[]> = {
  '40g': ["焙茶", "芝麻", "奶奶茶", "無加糖豆豆漿", "靜岡抹抹茶", "紅豆豆", "醇濃可可", "紅茶豆豆漿"],
  '1kg': ["焙茶", "芝麻", "奶奶茶", "無加糖豆豆漿", "靜岡抹抹茶", "紅豆豆", "醇濃可可", "紅茶豆豆漿"],
  'cube': ["焙茶HOJI", "芝麻SEASAME", "濃可可CHOC"]
};

interface QuotationItem {
  id: string;
  productId: ProductType;
  flavor: string;
  quantity: number;
}

// --- Helper Functions ---

const calculateItemPrice = (clientId: string, productId: ProductType, flavor: string): number => {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return 0;

  let price = product.basePrice;

  if (clientId === 'triple') {
    if (productId === '40g') {
      if (flavor.includes('抹茶')) price += 3;
      if (flavor.includes('焙茶')) price += 5;
    } else if (productId === '1kg') {
      if (flavor.includes('抹茶')) price += 30;
      if (flavor.includes('焙茶')) price += 50;
    }
  } else if (clientId === 'strong') {
    if (productId === '40g') {
      if (flavor.includes('抹茶')) price += 2;
      if (flavor.includes('焙茶')) price += 5;
    } else if (productId === '1kg') {
      if (flavor.includes('抹茶')) price += 20;
      if (flavor.includes('焙茶')) price += 40;
    }
  }

  return price;
};

// --- Components ---

export default function App() {
  const [clientId, setClientId] = useState(CLIENTS[0].id);
  const [items, setItems] = useState<QuotationItem[]>([
    { id: Math.random().toString(36).substr(2, 9), productId: '40g', flavor: FLAVORS['40g'][0], quantity: 250 }
  ]);
  const [quoteNo, setQuoteNo] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0].replace(/-/g, '');
    const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    setQuoteNo(`${dateStr}-${random}`);
  }, []);

  const selectedClient = useMemo(() => CLIENTS.find(c => c.id === clientId)!, [clientId]);

  const addItem = () => {
    setItems([...items, { 
      id: Math.random().toString(36).substr(2, 9), 
      productId: '40g', 
      flavor: FLAVORS['40g'][0], 
      quantity: 250 
    }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, updates: Partial<QuotationItem>) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const newItem = { ...item, ...updates };
        // Reset flavor and set default quantity if product changes
        if (updates.productId && updates.productId !== item.productId) {
          newItem.flavor = FLAVORS[updates.productId][0];
          if (updates.productId === '40g') newItem.quantity = 250;
          if (updates.productId === '1kg') newItem.quantity = 15;
          if (updates.productId === 'cube') newItem.quantity = 40;
        }
        return newItem;
      }
      return item;
    }));
  };

  const total = useMemo(() => {
    return items.reduce((sum, item) => {
      const price = calculateItemPrice(clientId, item.productId, item.flavor);
      return sum + (price * item.quantity);
    }, 0);
  }, [items, clientId]);

  const tax = Math.round(total / 1.05 * 0.05);
  const subtotal = total - tax;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans pb-20">
      {/* --- Header & Controls (Hidden on Print) --- */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 print:hidden">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white font-bold">R</div>
            <h1 className="text-xl font-bold tracking-tight">芮斯特報價系統</h1>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              <Printer size={16} />
              列印 / 另存 PDF
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 print:hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* --- Left Column: Form --- */}
          <div className="lg:col-span-2 space-y-8">
            {/* Client Selection */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-6 text-gray-500">
                <Building2 size={18} />
                <h2 className="text-sm font-semibold uppercase tracking-wider">客戶資訊</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">選擇客戶</label>
                  <div className="relative">
                    <select 
                      value={clientId}
                      onChange={(e) => setClientId(e.target.value)}
                      className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
                    >
                      {CLIENTS.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">報價日期</label>
                  <input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
                  />
                </div>
              </div>
            </section>

            {/* Items Section */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2 text-gray-500">
                  <FileText size={18} />
                  <h2 className="text-sm font-semibold uppercase tracking-wider">報價明細</h2>
                </div>
                <button 
                  onClick={addItem}
                  className="flex items-center gap-1 text-xs font-bold text-black bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full transition-colors"
                >
                  <Plus size={14} />
                  新增品項
                </button>
              </div>

              <div className="space-y-4">
                <AnimatePresence initial={false}>
                  {items.map((item, index) => (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="group relative grid grid-cols-1 md:grid-cols-12 gap-4 p-4 bg-gray-50 rounded-xl border border-transparent hover:border-gray-200 transition-all"
                    >
                      <div className="md:col-span-4 space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">品項</label>
                        <select 
                          value={item.productId}
                          onChange={(e) => updateItem(item.id, { productId: e.target.value as ProductType })}
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                        >
                          {PRODUCTS.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="md:col-span-4 space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">口味</label>
                        <select 
                          value={item.flavor}
                          onChange={(e) => updateItem(item.id, { flavor: e.target.value })}
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                        >
                          {FLAVORS[item.productId].map(f => (
                            <option key={f} value={f}>{f}</option>
                          ))}
                        </select>
                      </div>
                      <div className="md:col-span-2 space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">數量</label>
                        <input 
                          type="number" 
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, { quantity: parseInt(e.target.value) || 0 })}
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                        />
                      </div>
                      <div className="md:col-span-2 flex flex-col justify-end items-end pb-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase mb-1">小計</span>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold">
                            ${(calculateItemPrice(clientId, item.productId, item.flavor) * item.quantity).toLocaleString()}
                          </span>
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="text-gray-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </section>
          </div>

          {/* --- Right Column: Summary --- */}
          <div className="space-y-6">
            <section className="bg-black text-white p-8 rounded-3xl shadow-xl sticky top-24">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] opacity-50 mb-8">總計摘要</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-sm">
                  <span className="opacity-60">小計 (未稅)</span>
                  <span className="font-mono">${(subtotal - tax).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="opacity-60">稅金 (5% 內含)</span>
                  <span className="font-mono">${tax.toLocaleString()}</span>
                </div>
                <div className="h-px bg-white/10 my-4" />
                <div className="flex justify-between items-end">
                  <span className="text-xs font-bold uppercase tracking-wider mb-1">總計金額</span>
                  <span className="text-4xl font-bold font-mono tracking-tighter">${total.toLocaleString()}</span>
                </div>
              </div>

              <button 
                onClick={handlePrint}
                className="w-full py-4 bg-white text-black rounded-2xl font-bold text-sm hover:bg-gray-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Printer size={18} />
                列印 / 另存 PDF
              </button>

              <button 
                onClick={() => window.open(window.location.href, '_blank')}
                className="w-full mt-3 py-3 bg-white/10 text-white border border-white/20 rounded-2xl font-bold text-xs hover:bg-white/20 transition-all flex items-center justify-center gap-2"
              >
                <Download size={14} />
                在新分頁開啟 (列印更穩定)
              </button>
              
              <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">列印說明</h4>
                <ul className="text-[10px] space-y-1 text-white/60 list-disc list-inside">
                  <li>點擊上方按鈕開啟列印視窗</li>
                  <li>在「目的地」選擇「另存為 PDF」</li>
                  <li>若按鈕無反應，請嘗試點擊右上方「在新分頁開啟」後再列印</li>
                </ul>
              </div>
            </section>

            {/* Quick Info Card */}
            <section className="bg-white p-6 rounded-2xl border border-gray-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">匯款資訊</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">銀行</span>
                  <span className="font-medium">{SUPPLIER.bank}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">分行</span>
                  <span className="font-medium">{SUPPLIER.branch}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">帳號</span>
                  <span className="font-mono font-medium">{SUPPLIER.account}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">戶名</span>
                  <span className="font-medium">{SUPPLIER.name}</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* --- Print View (Hidden on Screen, Visible on Print) --- */}
      <div className="hidden print:block bg-white min-h-screen p-12 text-[#1A1A1A] font-sans">
        {/* Header */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tighter mb-1">專案報價單</h1>
            <p className="text-xs font-bold text-gray-400 tracking-widest uppercase">QUOTE NO: {quoteNo}</p>
            <p className="text-xs font-bold text-gray-400 tracking-widest uppercase">DATE: {date}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-black tracking-[0.3em] text-gray-300 uppercase">RESTSOL PARTNER PORTAL</p>
          </div>
        </div>

        <div className="h-px bg-black mb-8" />

        {/* Client & Supplier Info */}
        <div className="grid grid-cols-2 gap-16 mb-16">
          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest border-b border-black pb-2 mb-4">客戶資訊 CLIENT</h3>
            <div className="grid grid-cols-3 gap-y-3 text-[13px]">
              <span className="text-gray-400">名稱 Name:</span>
              <span className="col-span-2 font-bold">{selectedClient.name}</span>
              
              <span className="text-gray-400">聯絡人 Attn:</span>
              <span className="col-span-2">{selectedClient.contact}</span>
              
              <span className="text-gray-400">電話 Tel:</span>
              <span className="col-span-2">{selectedClient.tel}</span>
              
              <span className="text-gray-400">統編 Tax ID:</span>
              <span className="col-span-2">{selectedClient.taxId}</span>
              
              <span className="text-gray-400">地址 Addr:</span>
              <span className="col-span-2 leading-relaxed">{selectedClient.addr}</span>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest border-b border-black pb-2 mb-4">供應商 SUPPLIER</h3>
            <div className="grid grid-cols-3 gap-y-3 text-[13px]">
              <span className="text-gray-400">公司 Co.:</span>
              <span className="col-span-2 font-bold">{SUPPLIER.name}</span>
              
              <span className="text-gray-400">聯絡人 Rep:</span>
              <span className="col-span-2">{SUPPLIER.rep}</span>
              
              <span className="text-gray-400">電話 Tel:</span>
              <span className="col-span-2">{SUPPLIER.tel}</span>
              
              <span className="text-gray-400">Email:</span>
              <span className="col-span-2">{SUPPLIER.email}</span>
              
              <span className="text-gray-400">統編 Tax ID:</span>
              <span className="col-span-2">{SUPPLIER.id}</span>
              
              <span className="text-gray-400">地址 Addr:</span>
              <span className="col-span-2 leading-relaxed">{SUPPLIER.addr}</span>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-6 bg-black" />
            <h3 className="text-sm font-black uppercase tracking-widest">報價明細 ITEMS</h3>
          </div>
          
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black text-white">
                <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">項目 DESCRIPTION</th>
                <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">規格 SPEC</th>
                <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-center whitespace-nowrap">數量 QTY</th>
                <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-right whitespace-nowrap">單價 PRICE</th>
                <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-right whitespace-nowrap">小計 AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => {
                const product = PRODUCTS.find(p => p.id === item.productId)!;
                const unitPrice = calculateItemPrice(clientId, item.productId, item.flavor);
                return (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="py-5 px-4">
                      <p className="text-sm font-bold whitespace-nowrap">{product.name}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-[9px] font-black bg-black text-white px-1 py-0.5 rounded uppercase tracking-tighter">FLAVOR</span>
                        <span className="text-[13px] font-black text-black whitespace-nowrap">{item.flavor}</span>
                      </div>
                    </td>
                    <td className="py-5 px-4 text-[11px] whitespace-nowrap">{product.spec}</td>
                    <td className="py-5 px-4 text-sm font-bold text-center whitespace-nowrap">{item.quantity}</td>
                    <td className="py-5 px-4 text-sm text-right whitespace-nowrap">NT$ {unitPrice.toLocaleString()}</td>
                    <td className="py-5 px-4 text-sm font-bold text-right whitespace-nowrap">NT$ {(unitPrice * item.quantity).toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Summary */}
        <div className="grid grid-cols-2 gap-16">
          <div className="bg-gray-50 p-8 rounded-2xl">
            <h4 className="text-[11px] font-black uppercase tracking-widest border-b border-gray-200 pb-2 mb-4">匯款資訊 PAYMENT INFO</h4>
            <div className="space-y-2 text-[12px]">
              <div className="flex justify-between">
                <span className="text-gray-400">銀行:</span>
                <span className="font-bold">{SUPPLIER.bank}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">分行:</span>
                <span className="font-bold">{SUPPLIER.branch}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">帳號:</span>
                <span className="font-bold font-mono">{SUPPLIER.account}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">戶名:</span>
                <span className="font-bold">{SUPPLIER.name}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400 font-bold uppercase tracking-widest">小計 SUBTOTAL</span>
              <span className="font-bold">NT$ {(subtotal - tax).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400 font-bold uppercase tracking-widest">稅金 TAX (5% 內含)</span>
              <span className="font-bold">NT$ {tax.toLocaleString()}</span>
            </div>
            <div className="bg-black text-white p-6 rounded-2xl flex justify-between items-center mt-6">
              <span className="text-xs font-black uppercase tracking-[0.2em]">總計 GRAND TOTAL</span>
              <span className="text-2xl font-black">NT$ {total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Signature Area */}
        <div className="mt-24 grid grid-cols-2 gap-16">
          <div className="text-center">
            <div className="h-px bg-black mb-4" />
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">CUSTOMER SIGNATURE 客戶簽章</p>
            <p className="text-[10px] text-gray-300 mt-2">Date: 20____ / ____ / ____</p>
          </div>
          <div className="text-center">
            <div className="h-px bg-black mb-4" />
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">AUTHORIZED SIGNATURE 芮斯特簽章</p>
            <p className="text-[10px] text-gray-300 mt-2">Date: 20____ / ____ / ____</p>
          </div>
        </div>
      </div>
    </div>
  );
}

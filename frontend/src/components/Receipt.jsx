import React, { forwardRef } from 'react';

const Receipt = forwardRef(({ sale, cartItems, user, shop }, ref) => {
  if (!sale) return null;

  return (
    <div ref={ref} className="receipt-container p-4 bg-white text-black" style={{ width: '80mm', margin: '0 auto' }}>
      <style>
        {`
          @media print {
            @page {
              size: 80mm auto;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
              background-color: white;
            }
            .no-print {
              display: none !important;
            }
            .receipt-container {
              width: 80mm !important;
              padding: 10mm !important;
              box-shadow: none !important;
              border: none !important;
            }
          }
          .receipt-container {
            font-family: 'Courier New', Courier, monospace;
            font-size: 13px;
            line-height: 1.4;
          }
          .dashed-line {
            border-top: 1px dashed #000;
            margin: 10px 0;
          }
          .double-line {
            border-top: 3px double #000;
            margin: 10px 0;
          }
        `}
      </style>

      {/* En-tête Boutique */}
      <div className="text-center mb-4 border-b border-dashed border-slate-300 pb-4">
        {shop?.logo && (
          <img src={shop.logo} alt="Logo" className="w-16 h-16 object-contain mx-auto mb-2" />
        )}
        <h2 className="text-lg font-bold uppercase">{shop?.name || `Boutique de ${user?.username}`}</h2>
        {shop?.address && <p className="text-xs">{shop.address}</p>}
        {shop?.phone && <p className="text-xs">Tél: {shop.phone}</p>}
      </div>

      <div className="text-center mb-4">
        <h3 className="font-bold border-y border-slate-200 py-1 my-2">REÇU DE VENTE</h3>
        <p className="text-xs text-slate-500">Ticket #:{sale.id.slice(0, 8)}</p>
        <p className="text-xs text-slate-500">Date: {new Date(sale.dateVente || sale.createdAt).toLocaleString('fr-FR')}</p>
      </div>

      <div className="mb-4 text-xs">
        <div className="flex justify-between">
          <span>Vendeur:</span>
          <span>{user?.username?.toUpperCase()}</span>
        </div>
      </div>

      <div className="dashed-line" />

      <table className="w-full mb-4 text-xs">
        <thead>
          <tr className="border-b border-black text-left">
            <th className="pb-2">ARTICLE</th>
            <th className="pb-2 text-center">QTÉ</th>
            <th className="pb-2 text-right">TOTAL</th>
          </tr>
        </thead>
        <tbody className="pt-2">
          {cartItems ? (
             cartItems.map((item, index) => (
              <tr key={index} className="align-top">
                <td className="py-1 uppercase">{item.nom}</td>
                <td className="py-1 text-center">x{item.quantite}</td>
                <td className="py-1 text-right">{(item.prix * item.quantite).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr className="align-top">
              <td className="py-1 uppercase">{sale.productName}</td>
              <td className="py-1 text-center">x{sale.quantite}</td>
              <td className="py-1 text-right">{sale.total.toLocaleString()}</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="double-line" />

      <div className="mb-6">
        <div className="flex justify-between font-black text-lg">
          <span>TOTAL NET</span>
          <span>{sale.total.toLocaleString()} FCFA</span>
        </div>
        <p className="text-[10px] text-right italic font-medium">Prix TTC inclus</p>
      </div>

      <div className="text-center text-[11px] space-y-1">
        <div className="dashed-line" />
        <p className="font-bold">MERCI DE VOTRE CONFIANCE !</p>
        <p>Les articles vendus ne sont ni repris,</p>
        <p>ni échangés après 24 heures.</p>
        <div className="dashed-line" />
        <p className="text-[9px] mt-2 opacity-70 italic">Logiciel StockPro v2.0 - Par Momo Konate</p>
      </div>
    </div>
  );
});

export default Receipt;

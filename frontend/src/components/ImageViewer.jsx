import React from 'react';
import { X, Download, ShieldCheck } from 'lucide-react';
import Modal from './Modal';

const ImageViewer = ({ isOpen, onClose, imageUrl, clientName }) => {
  if (!imageUrl) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `CNI_${clientName.replace(/\s+/g, '_')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Carte d'identité : ${clientName}`}>
      <div className="space-y-4">
        <div className="relative group bg-slate-50 rounded-2xl overflow-hidden border border-slate-200">
          <img 
            src={imageUrl} 
            alt="CNI" 
            className="w-full h-auto max-h-[70vh] object-contain mx-auto shadow-2xl transition-transform duration-500 group-hover:scale-105" 
          />
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={handleDownload}
              className="bg-white/90 backdrop-blur-md p-3 rounded-xl text-primary-600 shadow-xl hover:bg-white hover:scale-110 transition-all duration-300 flex items-center gap-2 font-bold text-sm"
              title="Télécharger la pièce d'identité"
            >
              <Download size={20} />
              Télécharger
            </button>
          </div>
        </div>
        
        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-start gap-3">
          <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600 mt-1">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h4 className="font-bold text-emerald-900">Document Vérifié</h4>
            <p className="text-sm text-emerald-700 leading-relaxed italic">
              Cette pièce d'identité est archivée pour sécuriser votre transaction. 
              Garantie anti-fraude active pour ce client.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="btn btn-secondary w-full py-4 font-bold text-lg"
        >
          Fermer l'aperçu
        </button>
      </div>
    </Modal>
  );
};

export default ImageViewer;

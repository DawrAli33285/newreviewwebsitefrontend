import React, { useState, useRef, useEffect } from 'react';
import { CreditCard, QrCode, Edit, ShoppingCart, Download, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL, FRONTEND_URL } from '../../baseurl';
const BusinessCard = () => {
  const [showDesigner, setShowDesigner] = useState(false);
  const [loading,setLoading]=useState(true)
  const [showQRGenerator, setShowQRGenerator] = useState(false);
  const [cardSide, setCardSide] = useState('front');
  const cardRef = useRef(null);
  const qrCanvasRef = useRef(null);
  const qrOnlyCanvasRef = useRef(null);

  const [businessData, setBusinessData] = useState({
    businessName: 'Mc Donald',
    tagline: 'Professional Reviews Platform',
    phoneNumber: '+1 (555) 123-4567',
    email: 'contact@mcdonald.com',
    website: 'www.mcdonald.com',
    address: 'Goethestraße 74, 80336 München',
    photo:'',
    logo: null,
    reviewLink: 'https://only-good-reviews.com/restaurant/mc-donald'
  });

  const [selectedFields, setSelectedFields] = useState({
    businessName: true,
    phoneNumber: true,
    email: true,
    website: true,
    address: true,
    logo: true
  });

  const [downloadFormat, setDownloadFormat] = useState('png');
  const [cardSize, setCardSize] = useState('standard');

 
  const generateQRCode = async (canvasRef) => {
    if (!canvasRef || !canvasRef.current) {
      console.error('Canvas ref is not available');
      return;
    }
    
    // Load QRCode library if not already loaded
    if (!window.QRCode) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }
    
    const canvas = canvasRef.current;
    const size = canvasRef === qrOnlyCanvasRef ? 300 : 150;
    
    // Initialize canvas dimensions FIRST
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    // Create a temporary div to generate QR code
    const tempDiv = document.createElement('div');
    tempDiv.style.display = 'none';
    document.body.appendChild(tempDiv);
    
    try {
      // Generate QR code
      const qr = new window.QRCode(tempDiv, {
        text: businessData.reviewLink,
        width: size,
        height: size,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: window.QRCode.CorrectLevel.H
      });
      
      // Wait for QR code to be generated
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get the generated image
      const img = tempDiv.querySelector('img');
      if (img && img.complete) {
        ctx.clearRect(0, 0, size, size);
        ctx.drawImage(img, 0, 0, size, size);
       
      } else if (img) {
        await new Promise((resolve) => {
          img.onload = () => {
            ctx.clearRect(0, 0, size, size);
            ctx.drawImage(img, 0, 0, size, size);
          
            resolve();
          };
        });
      }
      
     
    } catch (error) {
      console.error('QR Code generation error:', error);
    } finally {
      // Clean up
      document.body.removeChild(tempDiv);
    }
  };
  
  const generateCardImage = async (format, side = cardSide) => {
    if (!cardRef.current) return null;
  
    try {
      // If generating back side, ensure QR code is ready first
      if (side === 'back') {
         
        // Ensure canvas ref exists, if not create temporary one
        if (!qrCanvasRef.current) {
          console.error('QR Canvas ref is null! Creating temporary canvas...');
          const tempCanvas = document.createElement('canvas');
          qrCanvasRef.current = tempCanvas;
        }
        
        await generateQRCode(qrCanvasRef);
        await new Promise(resolve => setTimeout(resolve, 800));
       
      }
  
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      const scale = 3;
      canvas.width = 540 * scale;
      canvas.height = 310 * scale;
      
      ctx.scale(scale, scale);
      
      const gradient = ctx.createLinearGradient(0, 0, 540, 310);
      gradient.addColorStop(0, '#1a1a1a');
      gradient.addColorStop(1, '#0a0a0a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 540, 310);
  
      if (side === 'front') {
        // White background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, 540, 310);
        
        // Logo in top left
        if (selectedFields.logo && businessData.photo) {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          await new Promise((resolve, reject) => {
            img.onload = () => {
              ctx.drawImage(img, 40, 40, 80, 80);
              resolve();
            };
            img.onerror = () => resolve();
            img.src = businessData.photo;
          });
        } else if (selectedFields.logo) {
          ctx.fillStyle = '#2D3E66';
          ctx.beginPath();
          ctx.arc(80, 80, 40, 0, Math.PI * 2);
          ctx.fill();
          ctx.font = '32px Arial';
          ctx.fillText('🍔', 65, 95);
        }
        
        // QR code in top right
        if (qrCanvasRef.current && qrCanvasRef.current.width > 0) {
          ctx.drawImage(qrCanvasRef.current, 420, 40, 80, 80);
        }
        
        // Tagline under QR
        ctx.fillStyle = '#9CA3AF';
        ctx.font = '9px Arial';
        ctx.textAlign = 'right';
     
        
        // Name
        ctx.textAlign = 'left';
        if (selectedFields.businessName) {
          ctx.fillStyle = '#1F2937';
          ctx.font = 'bold 28px Arial';
          ctx.fillText(businessData.businessName.toUpperCase(), 40, 170);
        }
        
        // Subtitle/Title
        ctx.fillStyle = '#6B7280';
        ctx.font = '11px Arial';
     
        // Decorative line
        ctx.strokeStyle = '#E5E7EB';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(40, 205);
        ctx.lineTo(500, 205);
        ctx.stroke();
        
        // Company name
        ctx.fillStyle = '#1F2937';
        ctx.font = 'bold 13px Arial';
        ctx.fillText(businessData.businessName || 'Company Name', 40, 230);
        
     // Address with text wrapping
     if (selectedFields.address) {
      ctx.fillStyle = '#6B7280';
      ctx.font = '11px Arial';
      
      const maxWidth = 240;
      const words = businessData.address.split(' ');
      let line = '';
      let yPos = 245;
      const lineHeight = 14;
      
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxWidth && n > 0) {
          ctx.fillText(line.trim(), 40, yPos);
          line = words[n] + ' ';
          yPos += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line.trim(), 40, yPos);
    }
    
        
        // Contact details on the right
        let rightX = 300;
        ctx.fillStyle = '#1F2937';
        ctx.font = '11px Arial';
        
      
        if (selectedFields.phoneNumber && businessData?.phoneNumber?.length>0) {
          ctx.fillStyle = '#6B7280';
       
          ctx.fillStyle = '#1F2937';
          ctx.fillText(businessData.phoneNumber, rightX + 20, 230);
        }
        
        if (selectedFields.email && businessData?.email?.length>0) {
          ctx.fillStyle = '#6B7280';
         
          ctx.fillStyle = '#1F2937';
          ctx.fillText(businessData.email, rightX + 20, 245);
        }
        
        if (selectedFields?.website && businessData?.website?.length>0) {
          ctx.fillStyle = '#6B7280';
         
          ctx.fillStyle = '#1F2937';
          ctx.fillText(businessData.website, rightX + 20, 260);
        }
        
        // Decorative circle elements in bottom right
        ctx.fillStyle = 'rgba(226, 232, 240, 0.5)';
        ctx.beginPath();
        ctx.arc(450, 260, 30, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'rgba(226, 232, 240, 0.3)';
        ctx.beginPath();
        ctx.arc(490, 250, 40, 0, Math.PI * 2);
        ctx.fill();
  
      } else {
        // Back side - clean white design matching front
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, 540, 310);
        
        // Decorative circle elements in top left
        ctx.fillStyle = 'rgba(226, 232, 240, 0.3)';
        ctx.beginPath();
        ctx.arc(50, 50, 40, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'rgba(226, 232, 240, 0.5)';
        ctx.beginPath();
        ctx.arc(90, 60, 30, 0, Math.PI * 2);
        ctx.fill();
        
        // Center the QR code
        const qrSize = 140;
        const qrX = (540 - qrSize) / 2;
        const qrY = 60;
        
        // Light border around QR code
        ctx.strokeStyle = '#E5E7EB';
        ctx.lineWidth = 2;
        ctx.strokeRect(qrX, qrY, qrSize, qrSize);
        
        // Draw the QR code
        if (qrCanvasRef.current && qrCanvasRef.current.width > 0) {
         
          try {
            ctx.drawImage(qrCanvasRef.current, qrX + 5, qrY + 5, qrSize - 10, qrSize - 10);
          
          } catch (err) {
            console.error('Error drawing QR code:', err);
          }
        } else {
          console.error('QR Canvas not ready - width:', qrCanvasRef.current?.width, 'height:', qrCanvasRef.current?.height);
        }
        
        // "Scan to review" text
        ctx.fillStyle = '#1F2937';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Scan to leave us a review!', 270, 220);
        
        // Decorative line
        ctx.strokeStyle = '#E5E7EB';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(140, 235);
        ctx.lineTo(400, 235);
        ctx.stroke();
        
        // Address section
        if (selectedFields.address) {
          ctx.fillStyle = '#1F2937';
          ctx.font = 'bold 13px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('📍 Visit Us', 270, 255);
          
          ctx.fillStyle = '#6B7280';
          ctx.font = '11px Arial';
          
          const maxWidth = 400;
          const words = businessData.address.split(' ');
          let line = '';
          let yPos = 272;
          
          for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            
            if (metrics.width > maxWidth && n > 0) {
              ctx.fillText(line, 270, yPos);
              line = words[n] + ' ';
              yPos += 15;
            } else {
              line = testLine;
            }
          }
          ctx.fillText(line, 270, yPos);
        }
        
        // Decorative circle elements in bottom right
        ctx.fillStyle = 'rgba(226, 232, 240, 0.5)';
        ctx.beginPath();
        ctx.arc(450, 260, 30, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'rgba(226, 232, 240, 0.3)';
        ctx.beginPath();
        ctx.arc(490, 250, 40, 0, Math.PI * 2);
        ctx.fill();
      }
  
      return canvas.toDataURL(format === 'jpg' ? 'image/jpeg' : 'image/png', 0.95);
    } catch (error) {
      console.error('Card generation error:', error);
      return null;
    }
  };
  
  const downloadCardsZIP = async () => {
    try {

      if (!window.JSZip) {
      
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }
  
      const zip = new window.JSZip();
      
      // Create a temporary canvas if ref doesn't exist
      if (!qrCanvasRef.current) {
     
        const tempCanvas = document.createElement('canvas');
        document.body.appendChild(tempCanvas);
        tempCanvas.style.display = 'none';
        qrCanvasRef.current = tempCanvas;
      }
  
      // Generate QR code
     
      await generateQRCode(qrCanvasRef);
      await new Promise(resolve => setTimeout(resolve, 1000));
    
      // Generate front card
    
      const frontDataUrl = await generateCardImage('png', 'front');
      if (frontDataUrl) {
        const frontBase64 = frontDataUrl.split(',')[1];
        zip.file(`${businessData.businessName.replace(/\s+/g, '-')}-front.png`, frontBase64, { base64: true });
       
      }
      
      // Generate back card
     
      const backDataUrl = await generateCardImage('png', 'back');
      if (backDataUrl) {
        const backBase64 = backDataUrl.split(',')[1];
        zip.file(`${businessData.businessName.replace(/\s+/g, '-')}-back.png`, backBase64, { base64: true });
     
      }
  
      // Generate and download ZIP
     
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      link.download = `${businessData.businessName.replace(/\s+/g, '-')}-business-cards.zip`;
      link.click();
      URL.revokeObjectURL(link.href);
  
    
      alert('Business cards downloaded as ZIP file!');
    } catch (error) {
      console.error('ZIP download error:', error);
      alert('Failed to create ZIP file. Please try again.');
    }
  };

  const downloadCard = async (format) => {
    if (cardSide === 'back') {
      generateQRCode(qrCanvasRef);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    const dataUrl = await generateCardImage(format);
    if (!dataUrl) {
      alert('Failed to generate card. Please try again.');
      return;
    }

    const link = document.createElement('a');
    link.download = `business-card-${cardSide}.${format}`;
    link.href = dataUrl;
    link.click();
  };

 
  const downloadQROnly = async () => {
    if (!qrOnlyCanvasRef.current) return;
    
    try {
      // Generate the QR code and wait for it to complete
      await generateQRCode(qrOnlyCanvasRef);
      
      // Wait a bit longer to ensure the QR code is fully rendered
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if the canvas has content
      const canvas = qrOnlyCanvasRef.current;
      const ctx = canvas.getContext('2d');
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Check if the canvas is not empty (all pixels are not white/transparent)
      const hasContent = imageData.data.some((value, index) => {
        // Check alpha channel (every 4th value)
        if ((index + 1) % 4 === 0) return false;
        // Check if any RGB value is not 255 (not pure white)
        return value < 255;
      });
      
      if (!hasContent) {
        console.error('QR code canvas is empty, regenerating...');
        await generateQRCode(qrOnlyCanvasRef);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Create download link
      const link = document.createElement('a');
      link.download = `${businessData.businessName.replace(/\s+/g, '-')}-QR-Code.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
     
    } catch (error) {
      console.error('Error downloading QR code:', error);
      alert('Failed to download QR code. Please try again.');
    }
  };

  

  const toggleField = (field) => {
    setSelectedFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const openQRGeneratorFromDesigner = () => {
    setShowQRGenerator(true);
  };

  useEffect(() => {
    if (showDesigner && cardSide === 'back') {
      setTimeout(() => generateQRCode(qrCanvasRef), 50);
    }
  }, [showDesigner, cardSide, businessData.reviewLink]);

  useEffect(() => {
    if (showQRGenerator) {
      setTimeout(() => generateQRCode(qrOnlyCanvasRef), 100);
    }
  }, [showQRGenerator, businessData.reviewLink]);

const getBusinessInfo=async()=>{
  try{
    let token=localStorage.getItem('token')
let response=await axios.get(`${BASE_URL}/getBusiness`,{
  headers:{
    Authorization:`Bearer ${token}`
  }
})

setBusinessData({
  address:response.data.business.businessAddress,
  email:response.data.business.businessEmail,
  logo:response.data.business.photo,
businessName:response.data.business.businessName,
photo: response.data.business.photo, 
website:response.data.business.website,
phoneNumber:response.data.business.phoneNumber,
reviewLink:`${FRONTEND_URL}/restaurant/${response.data.business.businessName}`
})
setLoading(false)
  }catch(e){

  }
}

useEffect(()=>{
getBusinessInfo();
},[])



if (loading) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading reviews...</p>
      </div>
    </div>
  );
}
  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="bg-white rounded-lg shadow p-6 sm:p-8 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Business Card Manager</h1>
        <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
          Create, customize, and download professional business cards with QR codes. Order printed cards or
          download digital versions in multiple formats.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <button
          onClick={() => setShowDesigner(true)}
          className="bg-white rounded-lg shadow p-6 sm:p-8 text-center hover:shadow-lg transition-shadow"
        >
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard size={24} className="sm:w-8 sm:h-8 text-gray-700" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Business Card Designer</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            Design, customize, and download professional business cards with your QR code. Choose fields, formats, and sizes.
          </p>
        </button>

        <button
          onClick={() => setShowQRGenerator(true)}
          className="bg-white rounded-lg shadow p-6 sm:p-8 text-center hover:shadow-lg transition-shadow"
        >
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <QrCode size={24} className="sm:w-8 sm:h-8 text-gray-700" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">QR Code Generator</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            Generate and download QR codes that link to your review page. Perfect for print materials and displays.
          </p>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
        <Link to="/admin/business-info"
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
        >
          <Edit size={20} />
          <span>Edit Business Info</span>
        </Link>
        {/* <button
          onClick={() => alert('Redirect to order page')}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
        >
          <ShoppingCart size={20} />
          <span>Order Printed Cards ($70)</span>
        </button> */}
      </div>

      {showDesigner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full my-4 sm:my-8 max-h-[98vh] sm:max-h-[95vh] overflow-y-auto">
            <div className="flex items-center justify-between p-3 sm:p-4 md:p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Business Card Designer</h3>
              <button
                onClick={() => setShowDesigner(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
              >
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>

            <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Customize Card Fields</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                  {Object.keys(selectedFields).map((field) => (
                    <label key={field} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedFields[field]}
                        onChange={() => toggleField(field)}
                        className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-xs sm:text-sm text-gray-700 capitalize">
                        {field.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Format:</label>
                  <select
                    value={downloadFormat}
                    onChange={(e) => setDownloadFormat(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="png">PNG (Best Quality)</option>
                    <option value="jpg">JPG</option>
                    <option value="pdf">PDF</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Size:</label>
                  <select
                    value={cardSize}
                    onChange={(e) => setCardSize(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="standard">Standard (3.5" x 2")</option>
                    <option value="euro">Euro (3.3" x 2.1")</option>
                    <option value="mini">Mini (3" x 1.75")</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3">
                <button
                  onClick={() => setCardSide('front')}
                  className={`px-3 sm:px-4 md:px-6 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 text-xs sm:text-sm md:text-base ${
                    cardSide === 'front'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <CreditCard size={16} />
                  <span>Front Side</span>
                </button>
                <button
                  onClick={() => setCardSide('back')}
                  className={`px-3 sm:px-4 md:px-6 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 text-xs sm:text-sm md:text-base ${
                    cardSide === 'back'
                      ? 'bg-gray-700 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <QrCode size={16} />
                  <span>Back Side</span>
                </button>
              </div>
         
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-8">
  <div
    ref={cardRef}
    className="bg-white rounded-xl mx-auto shadow-2xl overflow-hidden"
    style={{ width: '100%', maxWidth: '540px', minHeight: '200px', aspectRatio: '540/310' }}
  >
    {cardSide === 'front' ? (
      <div className="p-4 sm:p-6 md:p-8 h-full flex flex-col justify-between relative">
        {/* Top Section - Logo and QR */}
        <div className="flex justify-between items-start">
          {/* Logo */}
          {selectedFields.logo && (
            <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 flex-shrink-0">
              {businessData?.photo ? (
                <img 
                  src={businessData.photo} 
                  alt="business" 
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-full bg-[#2D3E66] rounded-full flex items-center justify-center">
                  <span className="text-2xl sm:text-3xl md:text-4xl" role="img" aria-label="burger">🍔</span>
                </div>
              )}
            </div>
          )}
          
          {/* QR Code and Tagline */}
          <div className="flex flex-col items-end">
            <canvas ref={qrCanvasRef} className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20" />

          </div>
        </div>

        {/* Middle Section - Name and Title */}
        <div className="flex-1 flex flex-col justify-center">
          {selectedFields.businessName && (
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#1F2937] mb-1 uppercase tracking-wide">
              {businessData.businessName}
            </h3>
          )}
         
          {/* Decorative Line */}
          <div className="h-px bg-[#E5E7EB] mb-3 sm:mb-4"></div>
        </div>

        {/* Bottom Section - Company Info */}
        <div className="flex justify-between items-end">
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-[#1F2937] mb-1">
              {businessData.businessName || 'Company Name'}
            </h4>
            {selectedFields.address && (
              <p className="text-[9px] sm:text-[10px] text-[#6B7280] leading-tight max-w-[200px]">
                {businessData.address}
              </p>
            )}
          </div>
          
          <div className="text-right space-y-1">
            {selectedFields.phoneNumber && (
              <div className="flex items-center justify-end space-x-2 text-[9px] sm:text-[10px]">
               
                <span className="text-[#1F2937]">{businessData.phoneNumber}</span>
              </div>
            )}
            {selectedFields.email && (
              <div className="flex items-center justify-end space-x-2 text-[9px] sm:text-[10px]">
               
                <span className="text-[#1F2937]">{businessData.email}</span>
              </div>
            )}
            {selectedFields.website && (
              <div className="flex items-center justify-end space-x-2 text-[9px] sm:text-[10px]">
                
                <span className="text-[#1F2937]">{businessData.website}</span>
              </div>
            )}
          </div>
        </div>

        {/* Decorative Circles */}
       
      </div>
    ) : (
      <div className="p-4 sm:p-6 md:p-8 h-full flex flex-col items-center justify-center text-center space-y-3 sm:space-y-4 relative">
        {/* Decorative Circles Top Left */}
        <div className="absolute top-4 left-4 pointer-events-none">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20">
            <div className="absolute top-0 left-0 w-10 h-10 sm:w-12 sm:h-12 bg-[#E2E8F0] rounded-full opacity-30"></div>
            <div className="absolute top-2 left-8 w-8 h-8 sm:w-10 sm:h-10 bg-[#E2E8F0] rounded-full opacity-50"></div>
          </div>
        </div>

        {/* QR Code */}
        <div className="border-2 border-[#E5E7EB] rounded-lg p-2 bg-white">
          <canvas ref={qrCanvasRef} className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32" />
        </div>
        
        {/* Scan Text */}
        <p className="text-sm sm:text-base font-bold text-[#1F2937]">Scan to leave us a review!</p>
        
        {/* Decorative Line */}
        <div className="h-px bg-[#E5E7EB] w-48 sm:w-64"></div>
        
        {/* Address Section */}
        {selectedFields.address && (
          <div className="space-y-1">
            <div className="flex items-center justify-center space-x-1 text-[#1F2937]">
              <span>📍</span>
              <span className="font-bold text-xs sm:text-sm">Visit Us</span>
            </div>
            <p className="text-[10px] sm:text-xs text-[#6B7280] px-4 max-w-xs leading-relaxed">
              {businessData.address}
            </p>
          </div>
        )}

        {/* Decorative Circles Bottom Right */}
      
      </div>
    )}
  </div>
  <p className="text-center text-gray-500 text-xs sm:text-xs md:text-sm mt-3 sm:mt-4">
    Business Card Preview (3.5" x 2")
  </p>
</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2 md:gap-4">
                <button
                  onClick={downloadCardsZIP}
                  className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2 text-xs sm:text-sm md:text-base"
                >
                  <Download size={16} className="sm:w-5 sm:h-5" />
                  <span>Download Cards (ZIP)</span>
                </button>
                <button
                  onClick={openQRGeneratorFromDesigner}
                  className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2 text-xs sm:text-sm md:text-base"
                >
                  <Download size={16} className="sm:w-5 sm:h-5" />
                  <span>Download QR Only</span>
                </button>
              
              </div>

              <div className="text-center">
                <Link to="/admin/business-info"
                  className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm underline"
                >
                  ✏️ Edit Business Information
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {showQRGenerator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <QrCode size={20} className="sm:w-6 sm:h-6 text-gray-700" />
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">QR Code for Reviews</h3>
              </div>
              <button 
                onClick={() => setShowQRGenerator(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-4 sm:p-6 text-center">
              <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-4">{businessData.businessName}</h4>
              
              <div className="flex justify-center mb-4">
                <canvas 
                  ref={qrOnlyCanvasRef}
                  className="border-4 border-gray-200 rounded-lg"
                  style={{ maxWidth: '300px', width: '100%', height: 'auto' }}
                />
              </div>

              <p className="text-sm text-gray-600 mb-4">Scan to leave us a review!</p>
              <p className="text-xs text-gray-500 mb-6 break-all px-2">{businessData.reviewLink+`source=qrcode`}</p>

              <button 
                onClick={downloadQROnly}
                className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2 mb-4 text-sm sm:text-base"
              >
                <Download size={20} />
                <span className="font-medium">Download QR Code</span>
              </button>

              <div className="text-left bg-gray-50 rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Usage Tips:</h5>
                <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
                  <li>• Print and display at your business location</li>
                  <li>• Share on social media and email signatures</li>
                  <li>• Include in business cards and receipts</li>
                  <li>• Perfect for table tents and counter displays</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessCard;
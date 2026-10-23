import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Truck, Package, DollarSign, ArrowRight, ShieldCheck, Sparkles, Navigation } from 'lucide-react';

const BookParcel = () => {
  const [formData, setFormData] = useState({
    pickupCity: 'Patna',
    pickupAddress: '',
    dropCity: 'Patna',
    dropAddress: '',
    category: 'Bag / Belongings',
    description: '',
    deliveryType: 'local',
    estimatedWeight: '1-3 kg',
    paymentMethod: 'cod' 
  });

  const [estimatedPrice, setEstimatedPrice] = useState(120);
  const navigate = useNavigate();

  const calculateFrontendPrice = (deliveryType, weight) => {
    let basePrice = deliveryType === "intercity" ? 300 : 80;
    let weightCharge = 0;

    if (weight && weight.includes("1-3 kg")) {
      weightCharge = 40;
    } else if (weight && weight.includes("3-7 kg")) {
      weightCharge = 100;
    }

    return basePrice + weightCharge;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);

    const newPrice = calculateFrontendPrice(updatedData.deliveryType, updatedData.estimatedWeight);
    setEstimatedPrice(newPrice);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const orderId = "CN" + Math.floor(100000 + Math.random() * 900000);

    const orderData = {
      orderId: orderId,
      ...formData,
      price: estimatedPrice
    };

    const existingOrders = JSON.parse(localStorage.getItem("carrynow_orders") || "[]");
    existingOrders.push(orderData);
    localStorage.setItem("carrynow_orders", JSON.stringify(existingOrders));

    if (formData.paymentMethod === 'cod') {
      axios.post("http://localhost:5000/api/orders/create", orderData)
        .catch(err => console.log("Save Order Error:", err));

      alert(`🎉 Order Booked Successfully (Cash on Delivery)!\n\n📦 Order ID: ${orderId}\n💰 Amount to Pay on Pickup: ₹${estimatedPrice}`);
      navigate('/track');
      return;
    }

    try {
      axios.post("http://localhost:5000/api/orders/create", orderData)
        .catch(err => console.log("Save Order Error:", err));

      alert(`🎉 Online Payment Successful (Mock Mode)!\n\n📦 Order ID: ${orderId}\n💰 Amount Paid: ₹${estimatedPrice}`);
      navigate('/track');
    } catch (error) {
      console.error("Payment error:", error);
      navigate('/track');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-600 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* --- HEADER TITLE (SOLID DARK NAVY FOR HIGH CONTRAST) --- */}
        <div className="text-center max-w-xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-600 text-white text-xs font-bold mb-4 shadow-md">
            <Sparkles className="w-3.5 h-3.5" /> Doorstep Pickup & Express Delivery
          </span>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Book Your Parcel
          </h1>
          <p className="text-slate-600 text-base font-medium mt-2">
            Send chargers, bags, keys, or study materials safely across campus or cities.
          </p>
        </div>

        {/* --- MAIN FORM CARD (SOLID WHITE WITH SHADOW) --- */}
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
          
          {/* 1. Select Delivery Mode */}
          <div>
            <label className="block text-xs font-bold text-blue-900 uppercase tracking-wider mb-3">
              1. Select Delivery Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => {
                  const newType = 'local';
                  const newPrice = calculateFrontendPrice(newType, formData.estimatedWeight);
                  setFormData({ ...formData, deliveryType: newType });
                  setEstimatedPrice(newPrice);
                }}
                className={`p-4 rounded-2xl border-2 text-left transition flex items-center gap-3 cursor-pointer ${
                  formData.deliveryType === 'local' 
                    ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-sm font-semibold' 
                    : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300'
                }`}
              >
                <div className={`p-2.5 rounded-xl ${formData.deliveryType === 'local' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">Local Campus / City</div>
                  <div className="text-xs text-slate-500">Within same city or campus</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  const newType = 'intercity';
                  const newPrice = calculateFrontendPrice(newType, formData.estimatedWeight);
                  setFormData({ ...formData, deliveryType: newType });
                  setEstimatedPrice(newPrice);
                }}
                className={`p-4 rounded-2xl border-2 text-left transition flex items-center gap-3 cursor-pointer ${
                  formData.deliveryType === 'intercity' 
                    ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-sm font-semibold' 
                    : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300'
                }`}
              >
                <div className={`p-2.5 rounded-xl ${formData.deliveryType === 'intercity' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">Intercity Express</div>
                  <div className="text-xs text-slate-500">Between different cities</div>
                </div>
              </button>
            </div>
          </div>

          {/* 2. Address Details */}
          <div>
            <label className="block text-xs font-bold text-blue-900 uppercase tracking-wider mb-3">
              2. Address Details
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Pickup Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>Pickup Location</span>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                  <select 
                    name="pickupCity" 
                    value={formData.pickupCity} 
                    onChange={handleChange}
                    className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 cursor-pointer shadow-sm"
                  >
                    <option value="Patna">Patna</option>
                    <option value="Gaya">Gaya</option>
                    <option value="Muzaffarpur">Muzaffarpur</option>
                    <option value="Bhagalpur">Bhagalpur</option>
                    <option value="Darbhanga">Darbhanga</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Address / Landmark</label>
                  <textarea 
                    name="pickupAddress" 
                    value={formData.pickupAddress} 
                    onChange={handleChange}
                    rows="2" 
                    placeholder="e.g. NIT Patna Hostel Gate, Boring Road" 
                    required
                    className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 resize-none shadow-sm"
                  />
                </div>
              </div>

              {/* Drop Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
                  <Navigation className="w-4 h-4 text-indigo-600" />
                  <span>Drop Destination</span>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                  <select 
                    name="dropCity" 
                    value={formData.dropCity} 
                    onChange={handleChange}
                    className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 cursor-pointer shadow-sm"
                  >
                    <option value="Patna">Patna</option>
                    <option value="Gaya">Gaya</option>
                    <option value="Muzaffarpur">Muzaffarpur</option>
                    <option value="Bhagalpur">Bhagalpur</option>
                    <option value="Darbhanga">Darbhanga</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Address / Landmark</label>
                  <textarea 
                    name="dropAddress" 
                    value={formData.dropAddress} 
                    onChange={handleChange}
                    rows="2" 
                    placeholder="e.g. Station Road, Near Central Library" 
                    required
                    className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 resize-none shadow-sm"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* 3. Item Details */}
          <div>
            <label className="block text-xs font-bold text-blue-900 uppercase tracking-wider mb-3">
              3. Item Details
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Item Category</label>
                <select 
                  name="category" 
                  value={formData.category} 
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 cursor-pointer shadow-sm"
                >
                  <option>Bag / Belongings</option>
                  <option>Documents / Keys</option>
                  <option>Electronics / Charger / Laptop</option>
                  <option>Books / Study Material</option>
                  <option>Other Personal Parcel</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Estimated Weight</label>
                <select 
                  name="estimatedWeight" 
                  value={formData.estimatedWeight} 
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 cursor-pointer shadow-sm"
                >
                  <option>Under 1 kg (Keys, Documents)</option>
                  <option>1-3 kg (Charger, Small Bag)</option>
                  <option>3-7 kg (Laptop Bag, Heavy Books)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Item Description / Note</label>
              <input 
                type="text" 
                name="description" 
                value={formData.description} 
                onChange={handleChange}
                placeholder="e.g. Black Lenovo backpack containing important notebook & keys" 
                required
                className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 shadow-sm" 
              />
            </div>
          </div>

          {/* 4. Pricing & Payment */}
          <div className="pt-4 border-t border-slate-200 space-y-5">
            
            <div className="bg-blue-600 text-white rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-3.5">
                <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-xs text-blue-100 uppercase font-bold tracking-wider">Estimated Fare</div>
                  <div className="text-2xl font-extrabold text-white">₹{estimatedPrice} <span className="text-xs font-normal text-blue-100">(Inclusive of taxes)</span></div>
                </div>
              </div>
              <div className="text-xs font-bold text-blue-900 bg-white px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Live OTP Safety Included
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Payment Option</label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`p-4 rounded-2xl border-2 flex items-center gap-3 cursor-pointer transition ${
                  formData.paymentMethod === 'cod' 
                    ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold shadow-sm' 
                    : 'border-slate-200 bg-white text-slate-600 hover:border-blue-200'
                }`}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="cod" 
                    checked={formData.paymentMethod === 'cod'} 
                    onChange={handleChange} 
                    className="accent-blue-600 cursor-pointer"
                  />
                  <div>
                    <div className="text-sm font-bold text-slate-900">Cash on Delivery</div>
                    <div className="text-xs text-slate-500 font-normal">Pay cash at pickup</div>
                  </div>
                </label>

                <label className={`p-4 rounded-2xl border-2 flex items-center gap-3 cursor-pointer transition ${
                  formData.paymentMethod === 'online' 
                    ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold shadow-sm' 
                    : 'border-slate-200 bg-white text-slate-600 hover:border-blue-200'
                }`}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="online" 
                    checked={formData.paymentMethod === 'online'} 
                    onChange={handleChange} 
                    className="accent-blue-600 cursor-pointer"
                  />
                  <div>
                    <div className="text-sm font-bold text-slate-900">Online Payment</div>
                    <div className="text-xs text-slate-500 font-normal">Razorpay / UPI</div>
                  </div>
                </label>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 group cursor-pointer text-base"
            >
              <span>Confirm & Book Parcel</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default BookParcel;
import React, { useState } from 'react';
import axios from 'axios';
import { Search, MapPin, CheckCircle2, Truck, ShieldCheck, AlertCircle } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icon issue in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const TrackOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    const cleanId = orderId.trim();
    if (!cleanId) return;

    setLoading(true);
    setError('');
    setOrderData(null);

    try {
      const { data } = await axios.get(`http://localhost:5000/api/orders/track/${cleanId}`);
      if (data.success && data.order) {
        setOrderData(data.order);
        setLoading(false);
        return;
      }
    } catch (err) {
      console.log("Backend track failed, checking browser storage...");
    }

    const localSavedOrders = JSON.parse(localStorage.getItem("carrynow_orders") || "[]");
    const foundLocal = localSavedOrders.find(o => o.orderId && o.orderId.toLowerCase() === cleanId.toLowerCase());

    if (foundLocal) {
      setOrderData({
        ...foundLocal,
        pickupAddress: foundLocal.pickupAddress || foundLocal.senderAddress || foundLocal.pickup || "Pickup Location",
        dropAddress: foundLocal.dropAddress || foundLocal.receiverAddress || foundLocal.drop || "Delivery Destination"
      });
      setLoading(false);
      return;
    }

    setError("No order found with this ID. Please check and try again.");
    setLoading(false);
  };

  // Fixed coordinates for Patna / Campus route visualization
  const pickupCoords = [25.6116, 85.1440]; // NIT Patna / Ashok Rajpath area
  const dropCoords = [25.6093, 85.1233];   // Boring Road / Patna Hub area
  const riderCoords = [25.6105, 85.1350];  // Live simulated rider position in between

  return (
    <div className="min-h-[85vh] bg-slate-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Track Your Parcel</h1>
          <p className="text-slate-500 text-sm mt-1">Enter your Order ID to check live delivery status and route.</p>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-xl border border-slate-100 mb-8">
          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g. CN482916"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-7 py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              {loading ? "Searching..." : "Track"}
            </button>
          </form>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2 mb-6">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {orderData && (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden transition-all">
            <div className="bg-slate-900 text-white p-6 flex flex-wrap justify-between items-center gap-4">
              <div>
                <p className="text-xs text-indigo-400 uppercase font-bold tracking-wider">Order ID</p>
                <h2 className="text-xl font-bold tracking-wide">{orderData.orderId}</h2>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">Estimated Delivery</p>
                <p className="text-sm font-semibold text-emerald-400">1 - 2 Hours</p>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-start gap-3">
                  <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600 mt-1">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase">Pickup Location</p>
                    <p className="text-sm font-bold text-slate-800">{orderData.pickupAddress}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600 mt-1">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase">Delivery Destination</p>
                    <p className="text-sm font-bold text-slate-800">{orderData.dropAddress}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Live Delivery Status</h3>
                <div className="space-y-4 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  <div className="flex items-center gap-4 relative">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center z-10 shadow-md">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">Order Placed & Confirmed</p>
                      <p className="text-xs text-slate-500">Payment verified successfully</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 relative">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center z-10 shadow-md animate-pulse">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-indigo-600">Out for Delivery / Rider Assigned</p>
                      <p className="text-xs text-slate-500">Delivery partner is on the way.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 relative">
                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center z-10">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-400">Delivered Successfully</p>
                      <p className="text-xs text-slate-400">Pending final OTP verification</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Real Leaflet Map Container */}
              <div className="rounded-xl overflow-hidden h-72 border border-slate-200 shadow-inner relative z-0">
                <MapContainer center={riderCoords} zoom={13} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {/* Pickup Marker */}
                  <Marker position={pickupCoords}>
                    <Popup>
                      <b>Pickup:</b> {orderData.pickupAddress}
                    </Popup>
                  </Marker>
                  {/* Drop Marker */}
                  <Marker position={dropCoords}>
                    <Popup>
                      <b>Destination:</b> {orderData.dropAddress}
                    </Popup>
                  </Marker>
                  {/* Live Rider Position Marker */}
                  <Marker position={riderCoords}>
                    <Popup>
                      🚚 <b>CarryNow Rider is here!</b> En route to destination.
                    </Popup>
                  </Marker>
                  {/* Route Polyline connecting points */}
                  <Polyline positions={[pickupCoords, riderCoords, dropCoords]} color="#4f46e5" weight={4} dashArray="5, 5" />
                </MapContainer>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default TrackOrder;
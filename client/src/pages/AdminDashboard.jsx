import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Users, Truck, CheckSquare, CheckCircle, Utensils, Video, Plus, Trash2, Bell, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

const AdminDashboard = () => {
    const { api } = useAuth();
    const [activeTab, setActiveTab] = useState('deliveries'); // deliveries, menu, videos
    const [loading, setLoading] = useState(true);

    // Stats & Deliveries Data
    const [stats, setStats] = useState({ totalUsers: 0, activeSubscription: 0, deliveriesToday: 0, skippedToday: 0 });
    const [deliveries, setDeliveries] = useState([]);

    // Menu Data
    const [menuDate, setMenuDate] = useState(new Date().toISOString().split('T')[0]);
    const [menuItems, setMenuItems] = useState({ lunch: '', dinner: '' });
    const [menuLoading, setMenuLoading] = useState(false);

    // Video Data
    const [videos, setVideos] = useState([]);
    const [newVideo, setNewVideo] = useState({ title: '', url: '' });

    // Customer & Notification Data
    const [customers, setCustomers] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const statsRes = await api.get('/admin/stats');
                setStats(statsRes.data);
            } catch (error) {
                console.error("Failed to fetch stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, [api]);

    // Fetch tab specific data
    useEffect(() => {
        if (activeTab === 'deliveries') {
            api.get('/admin/deliveries').then(res => setDeliveries(res.data));
        } else if (activeTab === 'videos') {
            api.get('/admin/videos').then(res => setVideos(res.data));
        } else if (activeTab === 'customers') {
            api.get('/admin/users').then(res => setCustomers(res.data));
        } else if (activeTab === 'notifications') {
            api.get('/admin/notifications').then(res => setNotifications(res.data));
        }
    }, [activeTab, api]);

    // Fetch Menu when date changes
    useEffect(() => {
        if (activeTab === 'menu') {
            const fetchMenu = async () => {
                try {
                    const res = await api.get(`/admin/menu?date=${menuDate}`);
                    const { items } = res.data;
                    setMenuItems({
                        lunch: items?.lunch?.join(', ') || '',
                        dinner: items?.dinner?.join(', ') || ''
                    });
                } catch (err) {
                    setMenuItems({ lunch: '', dinner: '' });
                }
            };
            fetchMenu();
        }
    }, [menuDate, activeTab, api]);

    const handleSaveMenu = async () => {
        setMenuLoading(true);
        try {
            await api.post('/admin/menu', {
                date: menuDate,
                lunch: menuItems.lunch.split(',').map(s => s.trim()).filter(Boolean),
                dinner: menuItems.dinner.split(',').map(s => s.trim()).filter(Boolean)
            });
            alert('Menu Updated!');
        } catch (error) {
            alert('Failed to update menu');
        } finally {
            setMenuLoading(false);
        }
    };

    const handleAddVideo = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/admin/videos', newVideo);
            setVideos([res.data, ...videos]);
            setNewVideo({ title: '', url: '' });
        } catch (error) {
            alert('Failed to add video');
        }
    };

    const handleDeleteVideo = async (id) => {
        if (!confirm('Are you sure?')) return;
        try {
            await api.delete(`/admin/videos/${id}`);
            setVideos(videos.filter(v => v._id !== id));
        } catch (error) {
            alert('Failed to delete video');
        }
    };

    const handleMarkDelivered = (id) => {
        setDeliveries(prev => prev.map(item =>
            item.id === id ? { ...item, status: 'Delivered' } : item
        ));
    };

    if (loading) return <div className="p-10 text-center">Loading Admin Dashboard...</div>;

    return (
        <div className="min-h-screen pb-20 bg-gray-50">
            <Navbar />

            <div className="container py-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                        <p className="text-gray-500">Manage operations and content.</p>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="card flex items-center gap-4 border border-blue-100 shadow-sm">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-full"><Users size={24} /></div>
                        <div>
                            <div className="text-2xl font-bold">{stats.totalUsers}</div>
                            <div className="text-sm text-gray-500">Total Users</div>
                        </div>
                    </div>
                    <div className="card flex items-center gap-4 border border-green-100 shadow-sm">
                        <div className="p-3 bg-green-100 text-green-600 rounded-full"><CheckSquare size={24} /></div>
                        <div>
                            <div className="text-2xl font-bold">{stats.activeSubscription}</div>
                            <div className="text-sm text-gray-500">Active Subs</div>
                        </div>
                    </div>
                    <div className="card flex items-center gap-4 border border-orange-100 shadow-sm">
                        <div className="p-3 bg-orange-100 text-orange-600 rounded-full"><Truck size={24} /></div>
                        <div>
                            <div className="text-2xl font-bold">{stats.deliveriesToday}</div>
                            <div className="text-sm text-gray-500">Today's Deliveries</div>
                        </div>
                    </div>
                    <div className="card flex items-center gap-4 border border-red-100 shadow-sm">
                        <div className="p-3 bg-red-100 text-red-600 rounded-full"><Utensils size={24} /></div>
                        <div>
                            <div className="text-2xl font-bold">{stats.skippedToday}</div>
                            <div className="text-sm text-gray-500">Skipped Today</div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 border-b border-gray-200 mb-6 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('deliveries')}
                        className={`pb-3 px-2 font-medium transition whitespace-nowrap ${activeTab === 'deliveries' ? 'text-[var(--primary)] border-b-2 border-[var(--primary)]' : 'text-gray-500'}`}
                    >
                        <div className="flex items-center gap-2"><Truck size={18} /> Dispatch</div>
                    </button>
                    <button
                        onClick={() => setActiveTab('customers')}
                        className={`pb-3 px-2 font-medium transition whitespace-nowrap ${activeTab === 'customers' ? 'text-[var(--primary)] border-b-2 border-[var(--primary)]' : 'text-gray-500'}`}
                    >
                        <div className="flex items-center gap-2"><Users size={18} /> Customers</div>
                    </button>
                    <button
                        onClick={() => setActiveTab('notifications')}
                        className={`pb-3 px-2 font-medium transition whitespace-nowrap ${activeTab === 'notifications' ? 'text-[var(--primary)] border-b-2 border-[var(--primary)]' : 'text-gray-500'}`}
                    >
                        <div className="flex items-center gap-2"><Bell size={18} /> Updates</div>
                    </button>
                    <button
                        onClick={() => setActiveTab('menu')}
                        className={`pb-3 px-2 font-medium transition whitespace-nowrap ${activeTab === 'menu' ? 'text-[var(--primary)] border-b-2 border-[var(--primary)]' : 'text-gray-500'}`}
                    >
                        <div className="flex items-center gap-2"><Utensils size={18} /> Menu</div>
                    </button>
                    <button
                        onClick={() => setActiveTab('videos')}
                        className={`pb-3 px-2 font-medium transition whitespace-nowrap ${activeTab === 'videos' ? 'text-[var(--primary)] border-b-2 border-[var(--primary)]' : 'text-gray-500'}`}
                    >
                        <div className="flex items-center gap-2"><Video size={18} /> Gallery</div>
                    </button>
                </div>

                {/* CONTENT AREA */}
                {activeTab === 'deliveries' && (
                    <div className="card p-0 overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-gray-100 bg-white">
                            <h3 className="mb-0">Today's Dispatch List</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                                    <tr>
                                        <th className="p-4">Customer</th>
                                        <th className="p-4">Address</th>
                                        <th className="p-4">Plan</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {deliveries.length === 0 ? (
                                        <tr><td colSpan="5" className="p-8 text-center text-gray-500">No deliveries scheduled.</td></tr>
                                    ) : (
                                        deliveries.map((item) => (
                                            <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50">
                                                <td className="p-4 font-medium">{item.name}<div className="text-xs text-gray-400">{item.phone}</div></td>
                                                <td className="p-4 text-sm text-gray-600 max-w-xs">{item.address}</td>
                                                <td className="p-4"><span className="tag tag-success">{item.plan}</span></td>
                                                <td className="p-4">
                                                    <span className={`font-semibold  px-2 py-1 rounded text-xs 
                                                        ${item.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                                            item.status.includes('Skipped') ? 'bg-red-100 text-red-700' :
                                                                item.status === 'Paused' ? 'bg-gray-100 text-gray-500' :
                                                                    'bg-orange-100 text-orange-700'}`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    {item.status === 'Pending' && (
                                                        <button onClick={() => handleMarkDelivered(item.id)} className="btn btn-primary text-sm py-1 px-3">Delivered</button>
                                                    )}
                                                    {item.status === 'Delivered' && <span className="text-green-600 flex justify-end gap-1"><CheckCircle size={16} /> Done</span>}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'menu' && (
                    <div className="card max-w-2xl mx-auto shadow-sm">
                        <h3 className="mb-6">Update Daily Menu</h3>

                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Select Date</label>
                            <input
                                type="date"
                                value={menuDate}
                                onChange={(e) => setMenuDate(e.target.value)}
                                className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-[var(--primary)]"
                            />
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Lunch Items (comma separated)</label>
                                <textarea
                                    value={menuItems.lunch}
                                    onChange={(e) => setMenuItems({ ...menuItems, lunch: e.target.value })}
                                    placeholder="e.g. Rajma Masala, Jeera Rice, Curd, Salad"
                                    className="w-full p-3 border rounded-lg h-24 outline-none focus:ring-2 focus:ring-[var(--primary)]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Dinner Items (comma separated)</label>
                                <textarea
                                    value={menuItems.dinner}
                                    onChange={(e) => setMenuItems({ ...menuItems, dinner: e.target.value })}
                                    placeholder="e.g. Mixed Veg, Dal Tadka, 4 Roti"
                                    className="w-full p-3 border rounded-lg h-24 outline-none focus:ring-2 focus:ring-[var(--primary)]"
                                />
                            </div>
                            <button
                                onClick={handleSaveMenu}
                                disabled={menuLoading}
                                className="btn btn-primary w-full"
                            >
                                {menuLoading ? 'Saving...' : 'Save Menu'}
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'videos' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Add Video Form */}
                        <div className="card h-fit shadow-sm">
                            <h3 className="mb-4">Add New Video</h3>
                            <form onSubmit={handleAddVideo} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Video Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={newVideo.title}
                                        onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                                        className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-[var(--primary)]"
                                        placeholder="e.g. How we ensure hygiene"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Video URL (Embed/Link)</label>
                                    <input
                                        type="url"
                                        required
                                        value={newVideo.url}
                                        onChange={(e) => setNewVideo({ ...newVideo, url: e.target.value })}
                                        className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-[var(--primary)]"
                                        placeholder="https://www.youtube.com/embed/..."
                                    />
                                </div>
                                <button className="btn btn-primary w-full flex items-center justify-center gap-2">
                                    <Plus size={18} /> Add Video
                                </button>
                            </form>
                        </div>

                        {/* Video List */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-gray-700">Gallery ({videos.length})</h3>
                            {videos.map(video => (
                                <div key={video._id} className="card p-4 flex gap-4 items-start shadow-sm border border-gray-100">
                                    <div className="w-32 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 overflow-hidden relative">
                                        <div className="absolute inset-0 bg-black/10"></div>
                                        <Video size={24} className="relative z-10" />
                                        {/* If it's a Youtube embed, we could try to show thumb, but for now simple placeholder */}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-800">{video.title}</h4>
                                        <a href={video.url} target="_blank" rel="noreferrer" className="text-xs text-[var(--primary)] truncate block max-w-[200px]">{video.url}</a>
                                        <div className="text-xs text-gray-400 mt-1">{format(new Date(video.createdAt), 'dd MMM yyyy')}</div>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteVideo(video._id)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                            {videos.length === 0 && <p className="text-gray-500 italic">No videos in gallery.</p>}
                        </div>
                    </div>
                )}

                {activeTab === 'customers' && (
                    <div className="card p-0 overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-gray-100 bg-white flex justify-between items-center">
                            <h3 className="mb-0">All Registered Customers</h3>
                            <div className="relative">
                                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name/phone..."
                                    className="pl-10 pr-4 py-2 border rounded-full text-sm outline-none focus:border-[var(--primary)]"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                                    <tr>
                                        <th className="p-4">Name</th>
                                        <th className="p-4">Phone</th>
                                        <th className="p-4">Current Plan</th>
                                        <th className="p-4">Address</th>
                                        <th className="p-4">Joined</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {customers
                                        .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.phone.includes(searchTerm))
                                        .map((customer) => (
                                            <tr key={customer._id} className="border-b border-gray-50 hover:bg-gray-50">
                                                <td className="p-4 font-bold text-gray-700">{customer.name}</td>
                                                <td className="p-4 text-sm font-mono text-gray-600">{customer.phone}</td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${customer.currentPlan === 'No Active Plan' ? 'bg-gray-100 text-gray-400' : 'bg-green-100 text-green-700'}`}>
                                                        {customer.currentPlan}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-sm text-gray-500 max-w-xs">{customer.address || <span className="text-gray-300 italic">No Address</span>}</td>
                                                <td className="p-4 text-xs text-gray-400">{format(new Date(customer.createdAt), 'dd MMM yyyy')}</td>
                                            </tr>
                                        ))}
                                    {customers.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-gray-500">No customers found.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'notifications' && (
                    <div className="card max-w-3xl mx-auto shadow-sm">
                        <h3 className="mb-6 flex items-center gap-2"><Bell size={20} className="text-red-500" /> Recent Updates</h3>
                        <div className="space-y-4">
                            {notifications.length > 0 ? notifications.map((notif) => (
                                <div key={notif._id} className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex gap-4 items-start animate-fade-in">
                                    <div className={`p-2 rounded-full ${notif.type === 'address' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                                        {notif.type === 'address' ? <Truck size={18} /> : <CheckCircle size={18} />}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-gray-800 font-medium leading-tight">{notif.message}</p>
                                        <span className="text-xs text-gray-400 mt-1 block">{format(new Date(notif.createdAt), 'dd MMM, hh:mm a')}</span>
                                    </div>
                                </div>
                            )) : <div className="text-center text-gray-400 py-10">No new notifications.</div>}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;

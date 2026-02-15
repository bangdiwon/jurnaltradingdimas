import { useState, useEffect, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import "./App.css";

// === DATA REKOMENDASI BROKER ===
const brokerList = [
  {
    id: 1,
    name: "Exness",
    title: "Exness: Spread Rendah & Penarikan Instan (Ideal Scalper)",
    desc: "Exness adalah pilihan utama untuk scalping. Nikmati spread mulai dari 0.0 pip dan sistem penarikan dana (WD) otomatis dalam hitungan detik tanpa campur tangan manual. Tersedia akun Pro dan Zero.",
    image:
      "https://i.pinimg.com/1200x/b5/f1/b5/b5f1b5f7a132d2e3d3fc534df9c4fe6d.jpg",
    link: "https://www.exness.com/",
  },
  {
    id: 2,
    name: "HFM",
    title: "HFM (HotForex): Promo Bonus Deposit 100% & Edukasi",
    desc: "Broker serba bisa yang cocok untuk pemula hingga pro. HFM menawarkan bonus margin hingga 100% untuk menahan *drawdown*, materi edukasi eksklusif, dan perlindungan saldo negatif.",
    image:
      "https://tse1.mm.bing.net/th/id/OIP.Ouu6MW74UHKQe6xZ2gmLZAHaD4?pid=Api&P=0&h=180",
    link: "https://www.hfm.com/",
  },
  {
    id: 3,
    name: "XM",
    title: "XM Global: Eksekusi Tanpa Re-quote & Bebas Swap",
    desc: "Sangat direkomendasikan untuk Swing Trader. XM menyediakan akun Islami (Bebas Swap/Biaya Inap) otomatis. Nikmati eksekusi order secepat kilat tanpa re-quote di platform MT4 & MT5.",
    image:
      "https://larnakaonline.com.cy/wp-content/uploads/2025/07/XM-15-YEARS-EVENTS-CREATE-LOGO.jpg",
    link: "https://www.xm.com/",
  },
];

// === KOMPONEN WIDGET TRADINGVIEW ===
const TradingViewWidget = () => {
  const container = useRef();

  useEffect(() => {
    if (container.current && !container.current.querySelector("script")) {
      const script = document.createElement("script");
      script.src =
        "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = JSON.stringify({
        autosize: true,
        symbol: "OANDA:XAUUSD",
        interval: "D",
        timezone: "Asia/Jakarta",
        theme: "dark",
        style: "1",
        locale: "id",
        enable_publishing: false,
        allow_symbol_change: true,
        support_host: "https://www.tradingview.com",
      });
      container.current.appendChild(script);
    }
  }, []);

  return (
    <div className="tv-widget-wrapper">
      <div
        className="tradingview-widget-container"
        ref={container}
        style={{ height: "100%", width: "100%" }}
      >
        <div
          className="tradingview-widget-container__widget"
          style={{ height: "calc(100% - 32px)", width: "100%" }}
        ></div>
      </div>
    </div>
  );
};

// === KOMPONEN UTAMA ===
function App() {
  const [jurnalData, setJurnalData] = useState(() => {
    const dataTersimpan = localStorage.getItem("jurnalDimas");
    return dataTersimpan ? JSON.parse(dataTersimpan) : [];
  });

  const [activeTab, setActiveTab] = useState("view");
  const [filterBulan, setFilterBulan] = useState("Semua");

  const [tanggal, setTanggal] = useState("");
  const [pair, setPair] = useState("XAU/USD");
  const [hasil, setHasil] = useState("Win");
  const [nominal, setNominal] = useState("");
  const [catatan, setCatatan] = useState("");
  const [editId, setEditId] = useState(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  useEffect(() => {
    localStorage.setItem("jurnalDimas", JSON.stringify(jurnalData));
  }, [jurnalData]);

  const resetForm = () => {
    setTanggal("");
    setPair("XAU/USD");
    setHasil("Win");
    setNominal("");
    setCatatan("");
    setEditId(null);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === "dimas123") {
      setIsLoggedIn(true);
      setPasswordInput("");
    } else {
      alert("Password salah! Silakan coba lagi.");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveTab("view");
    resetForm();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isLoggedIn) return;

    if (editId !== null) {
      const updatedData = jurnalData.map((item) => {
        if (item.id === editId)
          return { ...item, tanggal, pair, hasil, nominal, catatan };
        return item;
      });
      setJurnalData(updatedData);
      alert("Data berhasil diperbarui!");
    } else {
      const entriBaru = {
        id: new Date().getTime(),
        tanggal,
        pair,
        hasil,
        nominal,
        catatan,
      };
      setJurnalData([...jurnalData, entriBaru]);
      alert("Jurnal baru berhasil disimpan!");
    }
    resetForm();
    setActiveTab("view");
  };

  const handleEdit = (data) => {
    setTanggal(data.tanggal);
    setPair(data.pair);
    setHasil(data.hasil);
    setNominal(data.nominal || "");
    setCatatan(data.catatan);
    setEditId(data.id);
    setActiveTab("admin");
  };

  const handleDelete = (id) => {
    if (window.confirm("Yakin ingin menghapus jurnal ini?")) {
      setJurnalData(jurnalData.filter((item) => item.id !== id));
    }
  };

  // --- LOGIKA FILTER & STATISTIK ---
  const uniqueMonths = [
    ...new Set(jurnalData.map((item) => item.tanggal.substring(0, 7))),
  ]
    .sort()
    .reverse();
  const formatNamaBulan = (yyyymm) => {
    const [year, month] = yyyymm.split("-");
    const namaBulan = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    return `${namaBulan[parseInt(month, 10) - 1]} ${year}`;
  };

  const dataTampil =
    filterBulan === "Semua"
      ? jurnalData
      : jurnalData.filter((item) => item.tanggal.startsWith(filterBulan));

  const totalTrades = dataTampil.length;
  const totalWin = dataTampil.filter((d) => d.hasil === "Win").length;
  const totalLoss = dataTampil.filter((d) => d.hasil === "Loss").length;
  const winRate =
    totalTrades > 0 ? ((totalWin / totalTrades) * 100).toFixed(1) : 0;

  const totalProfit = dataTampil.reduce((acc, curr) => {
    const nom = parseFloat(curr.nominal) || 0;
    return curr.hasil === "Win"
      ? acc + nom
      : curr.hasil === "Loss"
        ? acc - nom
        : acc;
  }, 0);

  const chartData = dataTampil.map((d, index) => ({
    name: `Trd ${index + 1}`,
    profit:
      d.hasil === "Win"
        ? Math.abs(parseFloat(d.nominal) || 0)
        : d.hasil === "Loss"
          ? -Math.abs(parseFloat(d.nominal) || 0)
          : 0,
    pair: d.pair,
  }));

  return (
    <div className="app-wrapper">
      <header className="header-title">
        <h1>JURNAL TRADING DIMAS</h1>
        {isLoggedIn && (
          <button className="btn-logout" onClick={handleLogout}>
            Logout Admin
          </button>
        )}
      </header>

      {/* === KOTAK 1: TABEL DAN STATISTIK === */}
      <div className="container">
        <nav className="navbar">
          <button
            className={activeTab === "view" ? "active" : ""}
            onClick={() => {
              setActiveTab("view");
              resetForm();
            }}
          >
            Lihat Jurnal
          </button>
          <button
            className={activeTab === "admin" ? "active" : ""}
            onClick={() => setActiveTab("admin")}
          >
            Admin Panel
          </button>
        </nav>

        <main className="content">
          {activeTab === "view" && (
            <div className="view-panel">
              {jurnalData.length > 0 && (
                <div className="filter-container">
                  <label>Filter Bulan: </label>
                  <select
                    value={filterBulan}
                    onChange={(e) => setFilterBulan(e.target.value)}
                  >
                    <option value="Semua">Semua Waktu</option>
                    {uniqueMonths.map((bulan) => (
                      <option key={bulan} value={bulan}>
                        {formatNamaBulan(bulan)}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="dashboard-stats">
                <div className="stat-card">
                  <h3>Total Trade</h3>
                  <p>{totalTrades}</p>
                </div>
                <div className="stat-card">
                  <h3>Win Rate</h3>
                  <p className={winRate >= 50 ? "text-win" : "text-loss"}>
                    {winRate}%
                  </p>
                </div>
                <div className="stat-card">
                  <h3>Total Win / Loss</h3>
                  <p>
                    <span className="text-win">{totalWin} W</span> /{" "}
                    <span className="text-loss">{totalLoss} L</span>
                  </p>
                </div>
                <div className="stat-card">
                  <h3>Net Profit ($)</h3>
                  <p className={totalProfit >= 0 ? "text-win" : "text-loss"}>
                    {totalProfit >= 0 ? "+" : "-"}$
                    {Math.abs(totalProfit).toFixed(2)}
                  </p>
                </div>
              </div>

              {dataTampil.length === 0 ? (
                <div className="no-data-container">
                  <p className="no-data">
                    Belum ada data jurnal di periode ini.
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table>
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Tanggal</th>
                        <th>Pair</th>
                        <th>Status</th>
                        <th>Nominal ($)</th>
                        <th>Catatan / Analisa</th>
                        {isLoggedIn && (
                          <th className="text-center">Aksi Admin</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {dataTampil.map((data, index) => (
                        <tr key={data.id}>
                          <td>{index + 1}</td>
                          <td>{data.tanggal}</td>
                          <td>
                            <strong>{data.pair}</strong>
                          </td>
                          <td
                            className={
                              data.hasil === "Win"
                                ? "text-win"
                                : data.hasil === "Loss"
                                  ? "text-loss"
                                  : "text-be"
                            }
                          >
                            {data.hasil}
                          </td>
                          <td
                            className={
                              data.hasil === "Win"
                                ? "text-win"
                                : data.hasil === "Loss"
                                  ? "text-loss"
                                  : "text-be"
                            }
                          >
                            {data.hasil === "Win"
                              ? "+"
                              : data.hasil === "Loss"
                                ? "-"
                                : ""}
                            ${Math.abs(data.nominal || 0)}
                          </td>
                          <td className="td-catatan">{data.catatan}</td>
                          {isLoggedIn && (
                            <td className="action-cell">
                              <button
                                className="btn-edit"
                                onClick={() => handleEdit(data)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn-delete"
                                onClick={() => handleDelete(data.id)}
                              >
                                Hapus
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "admin" && (
            <div className="admin-panel">
              {!isLoggedIn ? (
                <div className="login-container">
                  <h2>Login Admin</h2>
                  <p>Masukkan password untuk menambah atau mengedit jurnal.</p>
                  <form
                    onSubmit={handleLogin}
                    className="form-group"
                    style={{ marginTop: "20px" }}
                  >
                    <input
                      type="password"
                      placeholder="Masukkan Password..."
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      required
                    />
                    <button
                      type="submit"
                      className="btn-submit"
                      style={{ marginTop: "20px", width: "100%" }}
                    >
                      Masuk
                    </button>
                  </form>
                </div>
              ) : (
                <>
                  <h2
                    style={{
                      textAlign: "center",
                      marginBottom: "30px",
                      color: "#1e293b",
                    }}
                  >
                    {editId ? "Edit Jurnal Trading" : "Input Jurnal Baru"}
                  </h2>
                  <form onSubmit={handleSubmit} className="form-container">
                    <div className="form-group">
                      <label>Tanggal:</label>
                      <input
                        type="date"
                        value={tanggal}
                        onChange={(e) => setTanggal(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Pair:</label>
                      <select
                        value={pair}
                        onChange={(e) => setPair(e.target.value)}
                      >
                        <option value="XAU/USD">XAU/USD</option>
                        <option value="BTC/USD">BTC/USD</option>
                        <option value="EUR/USD">EUR/USD</option>
                        <option value="GBP/JPY">GBP/JPY</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Win / Loss:</label>
                      <select
                        value={hasil}
                        onChange={(e) => setHasil(e.target.value)}
                      >
                        <option value="Win">Win</option>
                        <option value="Loss">Loss</option>
                        <option value="Break Even">Break Even</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Profit / Loss ($):</label>
                      <input
                        type="number"
                        step="any"
                        value={nominal}
                        onChange={(e) => setNominal(e.target.value)}
                        placeholder="Misal: 50.5"
                        required
                      />
                    </div>
                    <div className="form-group catatan-full">
                      <label>Catatan / Analisa:</label>
                      <textarea
                        rows="3"
                        value={catatan}
                        onChange={(e) => setCatatan(e.target.value)}
                        placeholder="Misal: Entry sell XAU/USD karena rejection..."
                        required
                      />
                    </div>
                    <div className="form-actions">
                      <button type="submit" className="btn-submit">
                        {editId ? "Update Jurnal" : "Simpan Jurnal"}
                      </button>
                      {editId && (
                        <button
                          type="button"
                          className="btn-cancel"
                          onClick={resetForm}
                        >
                          Batal Edit
                        </button>
                      )}
                    </div>
                  </form>
                </>
              )}
            </div>
          )}
        </main>
      </div>
      {/* === AKHIR KOTAK 1 === */}

      {/* === KOTAK BAWAH: GRAFIK, TV, TEKNIKAL, BROKER === */}
      {activeTab === "view" && (
        <>
          {/* KOTAK 2: GRAFIK RECHARTS */}
          {dataTampil.length > 0 && (
            <div className="external-box">
              <h3 className="section-title">Grafik Profit / Loss per Trade</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      formatter={(value) => [`$${value}`, "Profit/Loss"]}
                      labelStyle={{ color: "#1e293b", fontWeight: "bold" }}
                    />
                    <Bar dataKey="profit" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.profit >= 0 ? "#10b981" : "#ef4444"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* KOTAK 3: TRADINGVIEW */}
          <div className="external-box">
            <h3 className="section-title">Live Market Chart (TradingView)</h3>
            <TradingViewWidget />
          </div>

          {/* KOTAK 4: EDUKASI TEKNIKAL TRADING */}
          <div className="technical-box">
            <div className="tv-header-simulated">
              <h2>
                Edukasi Teknikal <span>&gt;</span>
              </h2>
              <div className="tv-tabs">
                <button className="active">Pola Candlestick</button>
              </div>
            </div>
            <div className="technical-content">
              {/* GAMBAR SUDAH DIPERBARUI SESUAI REQUEST */}
              <img
                src="https://i.pinimg.com/1200x/da/bc/20/dabc20923094ec087782ea3cd7bb88c3.jpg"
                alt="Cheat Sheet Candlestick"
                className="technical-img"
              />
            </div>
          </div>

          {/* KOTAK 5: REKOMENDASI BROKER (PALING BAWAH) */}
          <div className="broker-box">
            <div className="tv-header-simulated">
              <h2>
                Rekomendasi Broker <span>&gt;</span>
              </h2>
              <div className="tv-tabs">
                <button className="active">Broker</button>
              </div>
            </div>

            <div className="broker-grid">
              {brokerList.map((broker) => (
                <div className="broker-card" key={broker.id}>
                  <div className="broker-img-wrapper">
                    <img
                      src={broker.image}
                      alt={broker.name}
                      className="broker-img"
                    />
                    <div className="broker-logo-badge">{broker.name[0]}</div>
                  </div>
                  <div className="broker-content">
                    <h4 className="broker-title">{broker.title}</h4>
                    <p className="broker-desc">{broker.desc}</p>
                    <div className="broker-footer">
                      <div className="broker-author">
                        <br />
                        {broker.date}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;

import { useState, useEffect, useCallback } from "react";
import "./App.css";

const menuItems = [
  { id: "kelas", label: "Daftar Kelas", icon: "▦" },
  { id: "anggota", label: "Daftar Anggota", icon: "♙" },
  { id: "pengeluaran", label: "Pengeluaran Kas", icon: "↗" },
];

const protectedPages = ["kelas", "anggota", "tambah", "pengeluaran"];

const classBanners = [
  {
    id: "banner-1",
    tag: "KELAS DAN KEGIATAN",
    title: "Kelola Kelas Lebih Teratur",
    description: "Pantau data anggota dan pencatatan kas dengan mudah.",
    theme: "banner-blue",
  },
  {
    id: "banner-2",
    tag: "OPENKAS COMMUNITY",
    title: "Music For Everyone",
    description: "Informasi kegiatan dan pengelolaan dana bersama.",
    theme: "banner-orange",
  },
];

const initialMembers = [
  { id: 1, name: "Adit Pratama", email: "adit@openkas.id", number: "AGT001", className: "Kelas A", phone: "081234567801", status: "Aktif" },
  { id: 2, name: "Bintang Putri", email: "bintang@openkas.id", number: "AGT002", className: "Kelas A", phone: "081234567802", status: "Aktif" },
  { id: 3, name: "Cahya Ramadhan", email: "cahya@openkas.id", number: "AGT003", className: "Kelas B", phone: "081234567803", status: "Aktif" },
  { id: 4, name: "Dinda Maharani", email: "dinda@openkas.id", number: "AGT004", className: "Kelas B", phone: "081234567804", status: "Tidak Aktif" },
  { id: 5, name: "Eka Saputra", email: "eka@openkas.id", number: "AGT005", className: "Kelas C", phone: "081234567805", status: "Aktif" },
];

const initialTransactions = [
  { id: 101, title: "Kas masuk anggota", type: "pemasukan", amount: 2675000, date: "2026-10-20" },
  { id: 102, title: "Keperluan kegiatan", type: "pengeluaran", amount: 150000, date: "2026-10-22" },
  { id: 103, title: "Pembelian perlengkapan", type: "pengeluaran", amount: 75000, date: "2026-10-24" },
];

const STORAGE_KEYS = {
  MEMBERS: "openkas_members_v1",
  TRANSACTIONS: "openkas_transactions_v1",
  AUTH: "openkas_auth_v1",
};

function formatRupiah(number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
}

function App() {
  // Cek status login tersimpan di localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.AUTH) === "true";
  });
  const [userEmail, setUserEmail] = useState(() => {
    return localStorage.getItem("openkas_user_email") || "Bendahara";
  });
  // Jika belum login, buka halaman "login" terlebih dahulu
  const [page, setPage] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.AUTH) === "true" ? "anggota" : "login";
  });
  const [targetPage, setTargetPage] = useState("anggota");
  const [members, setMembers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  // Search & Filter States
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("Semua");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [txFilter, setTxFilter] = useState("Semua");
  // UX States: Loading Skeleton, Error, Submitting, Modal & Toast
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [toast, setToast] = useState(null);
  // Form States & Validation Errors
  const [form, setForm] = useState({
    name: "",
    email: "",
    className: "",
    phone: "",
    status: "Aktif",
  });
  const [errors, setErrors] = useState({});
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginErrors, setLoginErrors] = useState({});

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  }, []);
  // Memuat data anggota dan transaksi dari API atau localStorage

  const loadData = useCallback(async (simulateFailure = false) => {
    try {
      // Beri kesempatan UI menampilkan indikator loading sebelum data diperbarui.
      await new Promise((resolve) => setTimeout(resolve, 300));
      if (simulateFailure) {
        throw new Error("Koneksi ke server data terputus.");
      }
      const apiUrl = import.meta.env.VITE_API_URL;
      const savedTx = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      const parsedTransactions = savedTx
        ? JSON.parse(savedTx)
        : initialTransactions;
      if (!Array.isArray(parsedTransactions)) {
        throw new Error("Format data transaksi di penyimpanan tidak valid.");
      }
      setTransactions(parsedTransactions);
      if (!savedTx) {
        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(initialTransactions));
      }
      if (apiUrl) {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Gagal mengambil data dari API.");
        }
        const apiData = await response.json();
        if (!Array.isArray(apiData)) {
          throw new Error("Format data anggota dari API tidak valid.");
        }
        setMembers(apiData);
      }
      else {
        const savedMembers = localStorage.getItem(STORAGE_KEYS.MEMBERS);
        const parsedMembers = savedMembers
          ? JSON.parse(savedMembers)
          : initialMembers;
        if (!Array.isArray(parsedMembers)) {
          throw new Error("Format data anggota di penyimpanan tidak valid.");
        }
        setMembers(parsedMembers);
        if (!savedMembers) {
          localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(initialMembers));
        }
      }
      setFetchError(null);
    }
    catch (err) {
      const message = err instanceof Error ? err.message : "Gagal memuat data. Coba lagi.";
      setFetchError(message);
      showToast("Gagal memuat data dari penyimpanan.", "error");
    }
    finally {
      setIsLoading(false);
    }
  }, [showToast]);

  // Muat ulang data melalui interaksi pengguna
  function refreshData(simulateFailure = false) {
    setIsLoading(true);
    setFetchError(null);
    void loadData(simulateFailure);
  }
  useEffect(() => {
    // Jalankan pemuatan data setelah effect selesai agar tidak memicu
    // pembaruan state secara sinkron di dalam body useEffect.
    const timerId = window.setTimeout(() => {
      void loadData();
    }, 0);

    return () => window.clearTimeout(timerId);
  }, [loadData]);

  // Filter Dinamis Anggota (Kata Kunci + Kelas + Status)
  const filteredMembers = members.filter((member) => {
    const matchKeyword = `${member.name} ${member.number} ${member.className} ${member.phone} ${member.email || ""}`
      .toLowerCase()
      .includes(search.trim().toLowerCase());
    const matchClass = classFilter === "Semua" || member.className === classFilter;
    const matchStatus = statusFilter === "Semua" || member.status === statusFilter;
    return matchKeyword && matchClass && matchStatus;
  });

  // Filter Dinamis Transaksi Kas
  const filteredTransactions = transactions.filter((tx) => {
    if (txFilter === "Semua")
      return true;
    return tx.type === txFilter;
  });
  const totalBalance = transactions.reduce((acc, item) => (item.type === "pemasukan" ? acc + item.amount : acc - item.amount), 0);

  // Navigasi dengan Proteksi Login (Auth Guard)
  function navigate(nextPage) {
    setMobileMenu(false);
    setShowSuccess(false);
    setErrors({});
    setLoginErrors({});
    if (!isLoggedIn && protectedPages.includes(nextPage)) {
      setTargetPage(nextPage);
      setPage("login");
      showToast("Silakan login terlebih dahulu untuk mengakses dashboard.", "info");
      return;
    }
    setPage(nextPage);
  }
  function handleLogout() {
    setIsLoggedIn(false);
    setUserEmail("");
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    localStorage.removeItem("openkas_user_email");
    setLoginForm({ email: "", password: "" });
    setMobileMenu(false);
    setPage("login");
    showToast("Anda telah keluar dari sesi dashboard.", "info");
  }
  function resetFilters() {
    setSearch("");
    setClassFilter("Semua");
    setStatusFilter("Semua");
    showToast("Filter pencarian berhasil direset.", "info");
  }

  // Validasi & Sanitasi Form Tambah Anggota
  function validateMemberForm(values) {
    const newErrors = {};
    const cleanName = values.name.trim();
    const cleanEmail = values.email.trim();
    const cleanPhone = values.phone.trim();
    if (!cleanName) {
      newErrors.name = "Nama anggota wajib diisi.";
    }
    else if (cleanName.length < 3) {
      newErrors.name = "Nama anggota minimal 3 karakter.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail) {
      newErrors.email = "Email anggota wajib diisi.";
    }
    else if (!emailRegex.test(cleanEmail)) {
      newErrors.email = "Format email tidak valid (contoh: nama@domain.com).";
    }
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!cleanPhone) {
      newErrors.phone = "Nomor telepon wajib diisi.";
    }
    else if (!phoneRegex.test(cleanPhone)) {
      newErrors.phone = "Nomor telepon harus berupa angka (10-15 digit).";
    }
    if (!values.className) {
      newErrors.className = "Silakan pilih kelas atau kelompok.";
    }
    return newErrors;
  }

  async function addMember(event) {
    event.preventDefault();
    const validationErrors = validateMemberForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      showToast("Mohon periksa kembali kolom yang belum sesuai.", "error");
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      const newMember = {
        id: Date.now(),
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        number: `AGT${String(members.length + 1).padStart(3, "0")}`,
        className: form.className,
        phone: form.phone.trim(),
        status: form.status,
      };
      const updatedMembers = [...members, newMember];
      setMembers(updatedMembers);
      localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(updatedMembers));
      setForm({ name: "", email: "", className: "", phone: "", status: "Aktif" });
      setPage("anggota");
      setShowSuccess(true);
      showToast(`Anggota "${newMember.name}" berhasil ditambahkan!`);
    }
    catch {
      showToast("Terjadi kesalahan saat menyimpan data.", "error");
    }
    finally {
      setIsSubmitting(false);
    }
  }

  function handleDeleteMember(id, name) {
    const updated = members.filter((m) => m.id !== id);
    setMembers(updated);
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(updated));
    showToast(`Data ${name} telah dihapus.`, "info");
  }

  function handleLogin(event) {
    event.preventDefault();
    const newErrors = {};
    const cleanEmail = loginForm.email.trim();
    const cleanPassword = loginForm.password.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail) {
      newErrors.email = "Email wajib diisi.";
    }
    else if (!emailRegex.test(cleanEmail)) {
      newErrors.email = "Format email tidak valid (contoh: admin@openkas.id).";
    }
    if (!cleanPassword) {
      newErrors.password = "Kata sandi wajib diisi.";
    }
    else if (cleanPassword.length < 6) {
      newErrors.password = "Kata sandi minimal 6 karakter.";
    }
    if (Object.keys(newErrors).length > 0) {
      setLoginErrors(newErrors);
      showToast("Gagal masuk, periksa kembali email dan kata sandi.", "error");
      return;
    }
    setLoginErrors({});
    setIsLoggedIn(true);
    setUserEmail(cleanEmail);
    localStorage.setItem(STORAGE_KEYS.AUTH, "true");
    localStorage.setItem("openkas_user_email", cleanEmail);
    showToast(`Selamat datang, ${cleanEmail}!`);
    setPage(targetPage || "anggota");
  }

  return (<div className="app">
      {/* Toast Notification Pop-up Halus */}
      {toast && (<div className={`toast-notification toast-${toast.type}`} role="status">
          <span>{toast.type === "error" ? "⚠️" : toast.type === "info" ? "ℹ️" : "✅"}</span>
          <p>{toast.message}</p>
          <button onClick={() => setToast(null)} aria-label="Tutup notifikasi">×</button>
    </div>)}
      <header className="topbar">
    {isLoggedIn && page !== "home" && (<button className="mobile-toggle" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Buka menu">
      ☰
          </button>)}
    <button className="brand" onClick={() => navigate("home")}>
          OpenKas<span>.</span>
    </button>
    {page === "home" ? (<>
      <nav className="top-links">
              <button onClick={() => navigate("kelas")}>Beranda</button>
              <button onClick={() => navigate("anggota")}>Fitur</button>
              <button onClick={() => navigate("kelas")}>Cara Kerja</button>
              <button onClick={() => navigate("pengeluaran")}>
        Transparansi Kas
              </button>
      </nav>
      <div className="top-actions">
              {isLoggedIn ? (<>
                  <button className="btn-primary" onClick={() => navigate("anggota")}>
          Dashboard
                  </button>
                  <button className="btn-outline" onClick={handleLogout}>
          Keluar
                  </button>
        </>) : (<>
                  <button className="btn-outline" onClick={() => navigate("login")}>
          Masuk
                  </button>
                  <button className="btn-primary" onClick={() => navigate("anggota")}>
          Daftar
                  </button>
        </>)}
      </div>
          </>) : (<span className="top-caption">
      {isLoggedIn ? `Login sebagai: ${userEmail}` : "Sistem Pengelolaan Kas"}
          </span>)}
      </header>
      {page === "home" ? (<main>
          <section className="hero">
      <div className="hero-copy">
              <span className="eyebrow">PENGELOLAAN KAS DIGITAL</span>
              <h1>Kelola Kas Lebih Mudah dan Transparan</h1>
              <p>
        Operasikan pencatatan keuangan, pembayaran, pengeluaran, dan
        transparansi kas dalam satu platform.
              </p>
              <div className="hero-actions">
        <button className="btn-primary" onClick={() => navigate("anggota")}>
                  Mulai Kelola Kas
        </button>
        <button className="btn-outline" onClick={() => navigate("pengeluaran")}>
                  Lihat Transparansi
        </button>
              </div>
      </div>
      <div className="hero-art">
              <div className="art-card">
        <span>RINGKASAN KEUANGAN</span>
        <div className="art-amount">{formatRupiah(totalBalance || 2450000)}</div>
        <div className="art-line">
                  <span>Kas terkumpul</span><b>85%</b>
        </div>
        <div className="progress"><span /></div>
        <div className="coin coin-one">Rp</div>
        <div className="coin coin-two">+</div>
              </div>
      </div>
          </section>
          <section className="home-footer">
      <strong>OpenKas</strong>
      <span>Pengelolaan kas yang lebih tertata dan transparan.</span>
          </section>
    </main>) : page === "login" || !isLoggedIn ? (<main className="workspace">
          <section className="login-wrap">
      <form className="login-card" onSubmit={handleLogin} noValidate>
              <div className="login-logo">OpenKas</div>
              <h2>Masuk</h2>
              <p>Silakan login terlebih dahulu untuk mengakses Dashboard Kas</p>
              <div className="login-field">
        <label>Email</label>
        <input type="email" value={loginForm.email} onChange={(e) => {
        setLoginForm({ ...loginForm, email: e.target.value });
        if (loginErrors.email)
          setLoginErrors({ ...loginErrors, email: "" });
      }} placeholder="Contoh: admin@openkas.id" className={loginErrors.email ? "input-error" : ""}/>
        {loginErrors.email && <small className="error-text">{loginErrors.email}</small>}
              </div>
              <div className="login-field">
        <label>Kata Sandi</label>
        <input type="password" value={loginForm.password} onChange={(e) => {
        setLoginForm({ ...loginForm, password: e.target.value });
        if (loginErrors.password)
          setLoginErrors({ ...loginErrors, password: "" });
      }} placeholder="Minimal 6 karakter (contoh: 123456)" className={loginErrors.password ? "input-error" : ""}/>
        {loginErrors.password && <small className="error-text">{loginErrors.password}</small>}
              </div>
              <button type="submit" className="btn-primary full-width">
        Log In ke Dashboard
              </button>
              <button type="button" className="text-button" onClick={() => navigate("home")}>
        Lihat Halaman Depan (Landing Page)
              </button>
      </form>
          </section>
    </main>) : (<div className="dashboard">
          <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
      <div className="profile">
              <div className="avatar">O</div>
              <div><strong>OpenKas</strong><small>{userEmail}</small></div>
      </div>
      <p className="side-label">MENU UTAMA</p>
      <button className={`side-link ${page === "kelas" ? "active" : ""}`} onClick={() => navigate("kelas")}>
              <span>▦</span> Beranda
      </button>
      {menuItems.map((item) => (<button key={item.id} className={`side-link ${page === item.id || (page === "tambah" && item.id === "anggota") ? "active" : ""}`} onClick={() => navigate(item.id)}>
        <span>{item.icon}</span>{item.label}
              </button>))}
      <button className="side-link" onClick={handleLogout}>
              <span>↩</span> Keluar
      </button>
          </aside>
          <main className="workspace">
      {page === "kelas" ? (<section>
        <div className="page-heading">
                  <div><h1>Daftar Kelas</h1><p>Pilih kelas untuk melihat informasi kas.</p></div>
        </div>
        {classBanners.map((banner) => (<div key={banner.id} className={`class-banner ${banner.theme}`}>
          <span>{banner.tag}</span>
          <h2>{banner.title}</h2>
          <p>{banner.description}</p>
                  </div>))}
        <button className="btn-primary" onClick={() => navigate("anggota")}>
                  Lihat Daftar Anggota
        </button>
              </section>) : page === "tambah" ? (<section>
        <div className="page-heading">
                  <div><h1>Tambah Anggota</h1><p>Lengkapi informasi anggota baru.</p></div>
        </div>
        <form className="form-card" onSubmit={addMember} noValidate>
                  <div className="form-section-title">User Details</div>
                  <div className="form-grid">
          <div className="field">
                      <label>Nama Anggota</label>
                      <input value={form.name} onChange={(e) => {
          setForm({ ...form, name: e.target.value });
          if (errors.name)
            setErrors({ ...errors, name: "" });
        }} placeholder="Masukkan nama lengkap anggota" className={errors.name ? "input-error" : ""}/>
                      {errors.name && <small className="error-text">{errors.name}</small>}
          </div>
          <div className="field">
                      <label>Email Anggota</label>
                      <input type="email" value={form.email} onChange={(e) => {
          setForm({ ...form, email: e.target.value });
          if (errors.email)
            setErrors({ ...errors, email: "" });
        }} placeholder="contoh: anggota@openkas.id" className={errors.email ? "input-error" : ""}/>
                      {errors.email && <small className="error-text">{errors.email}</small>}
          </div>
          <div className="field">
                      <label>Nomor Telepon (WhatsApp)</label>
                      <input type="tel" value={form.phone} onChange={(e) => {
          setForm({ ...form, phone: e.target.value });
          if (errors.phone)
            setErrors({ ...errors, phone: "" });
        }} placeholder="Contoh: 081234567890" className={errors.phone ? "input-error" : ""}/>
                      {errors.phone && <small className="error-text">{errors.phone}</small>}
          </div>
          <div className="field">
                      <label>Kelas / Kelompok</label>
                      <select value={form.className} onChange={(e) => {
          setForm({ ...form, className: e.target.value });
          if (errors.className)
            setErrors({ ...errors, className: "" });
        }} className={errors.className ? "input-error" : ""}>
            <option value="">Pilih kelas</option>
            <option value="Kelas A">Kelas A</option>
            <option value="Kelas B">Kelas B</option>
            <option value="Kelas C">Kelas C</option>
                      </select>
                      {errors.className && <small className="error-text">{errors.className}</small>}
          </div>
          <div className="field full-field">
                      <label>Status Keanggotaan</label>
                      <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="Aktif">Aktif</option>
            <option value="Tidak Aktif">Tidak Aktif</option>
                      </select>
          </div>
                  </div>
                  <div className="form-actions">
          <button type="button" className="btn-outline" onClick={() => navigate("anggota")} disabled={isSubmitting}>
                      Kembali
          </button>
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
                      {isSubmitting ? "Mengirim..." : "Simpan"}
          </button>
                  </div>
        </form>
              </section>) : page === "anggota" ? (<section>
        <div className="page-heading">
                  <div><h1>Daftar Anggota</h1><p>Kelola informasi anggota dan status keanggotaan.</p></div>
                  <div className="heading-actions">
          <button type="button" className="btn-outline" onClick={() => refreshData(false)} disabled={isLoading}>
                      ↻ Muat Ulang
          </button>
          <button className="btn-primary" onClick={() => navigate("tambah")}>
                      + Tambah Anggota
          </button>
                  </div>
        </div>
        <div className="stats-row">
                  <div className="stat-card"><span>Total Anggota</span><strong>{members.length}</strong></div>
                  <div className="stat-card"><span>Anggota Aktif</span><strong>{members.filter(m => m.status === "Aktif").length}</strong></div>
        </div>
        <div className="table-card">
                  <div className="table-toolbar">
          <h3>Semua Anggota</h3>
          <input className="search-input" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama, nomor, atau telepon..."/>
                  </div>
                  {/* Tombol Filter Kategori Kelas & Status */}
                  <div className="filter-bar">
          <div className="filter-group">
                      <span className="filter-label">Kelas:</span>
                      {["Semua", "Kelas A", "Kelas B", "Kelas C"].map((cls) => (<button key={cls} type="button" className={`filter-chip ${classFilter === cls ? "active" : ""}`} onClick={() => setClassFilter(cls)}>
                          {cls}
            </button>))}
          </div>
          <div className="filter-group">
                      <span className="filter-label">Status:</span>
                      {["Semua", "Aktif", "Tidak Aktif"].map((st) => (<button key={st} type="button" className={`filter-chip ${statusFilter === st ? "active" : ""}`} onClick={() => setStatusFilter(st)}>
                          {st}
            </button>))}
          </div>
                  </div>
                  {/* UX State 1: Loading Skeleton */}
                  {isLoading ? (<div className="skeleton-wrapper" aria-busy="true">
                      {[1, 2, 3, 4].map((item) => (<div key={item} className="skeleton-row">
                          <div className="skeleton-avatar"/>
                          <div className="skeleton-line skeleton-w40"/>
                          <div className="skeleton-line skeleton-w20"/>
                          <div className="skeleton-line skeleton-w20"/>
            </div>))}
          </div>) : fetchError ? (
        /* UX State 3: Error State */
        <div className="error-state">
                      <p>⚠️ {fetchError}</p>
                      <button className="btn-primary" onClick={() => refreshData(false)}>
            Coba Lagi
                      </button>
          </div>) : (<div className="table-scroll">
                      <table>
            <thead>
                          <tr>
              <th>Nama Anggota</th>
              <th>Nomor Anggota</th>
              <th>Kelas</th>
              <th>Telepon</th>
              <th>Status</th>
              <th>Aksi</th>
                          </tr>
            </thead>
            <tbody>
                          {filteredMembers.map((member) => (<tr key={member.id}>
                              <td>
                <span className="member-avatar">{member.name.charAt(0)}</span>
                {member.name}
                              </td>
                              <td>{member.number}</td>
                              <td>{member.className}</td>
                              <td>{member.phone}</td>
                              <td>
                <span className={`status ${member.status === "Aktif" ? "status-active" : "status-inactive"}`}>
                                  {member.status}
                </span>
                              </td>
                              <td>
                <button type="button" className="text-button delete-btn" onClick={() => handleDeleteMember(member.id, member.name)}>
                                  Hapus
                </button>
                              </td>
              </tr>))}
                          {/* UX State 2: Empty State dengan Tombol Reset */}
                          {filteredMembers.length === 0 && (<tr>
                              <td colSpan="6" className="empty-state">
                <p>Yah, data anggota tidak ditemukan untuk kata kunci atau filter tersebut.</p>
                <button type="button" className="btn-outline" onClick={resetFilters}>
                                  Reset Pencarian & Filter
                </button>
                              </td>
              </tr>)}
            </tbody>
                      </table>
          </div>)}
                  <div className="table-footer">
          <span>Menampilkan {filteredMembers.length} dari {members.length} anggota</span>
          <button type="button" className="text-button sim-error-btn" onClick={() => refreshData(true)}>
                      Uji Simulasi Error API
          </button>
                  </div>
        </div>
              </section>) : (<section>
        <div className="page-heading">
                  <div><h1>Pengeluaran Kas</h1><p>Ringkasan pencatatan kas bersama secara real-time.</p></div>
        </div>
        <div className="stat-card balance-card">
                  <span>Total Saldo Kas Saat Ini</span>
                  <strong>{formatRupiah(totalBalance)}</strong>
                  <p>Dihitung otomatis dari riwayat pemasukan dan pengeluaran kas.</p>
        </div>
        <div className="table-card">
                  <div className="table-toolbar">
          <div>
                      <h3>Transparansi Kas</h3>
                      <p className="muted">Filter riwayat transaksi berdasarkan kategori di bawah ini.</p>
          </div>
          <div className="filter-group">
                      {["Semua", "pemasukan", "pengeluaran"].map((type) => (<button key={type} type="button" className={`filter-chip ${txFilter === type ? "active" : ""}`} onClick={() => setTxFilter(type)}>
                          {type === "Semua" ? "Semua" : type === "pemasukan" ? "Kas Masuk" : "Pengeluaran"}
            </button>))}
          </div>
                  </div>
                  {filteredTransactions.map((tx) => (<div key={tx.id} className="transaction">
                      <div>
            <span>{tx.title}</span>
            <small className="tx-date">{tx.date}</small>
                      </div>
                      <strong className={tx.type === "pengeluaran" ? "expense" : ""}>
            {tx.type === "pengeluaran" ? `− ${formatRupiah(tx.amount)}` : `+ ${formatRupiah(tx.amount)}`}
                      </strong>
          </div>))}
        </div>
              </section>)}
          </main>
    </div>)}

      {showSuccess && (<div className="modal-backdrop" onClick={() => setShowSuccess(false)}>
          <div className="success-modal" onClick={(e) => e.stopPropagation()}>
      <button className="modal-close" onClick={() => setShowSuccess(false)}>×</button>
      <div className="success-icon">✓</div>
      <h2>Anggota Berhasil Ditambahkan</h2>
      <p>Data anggota baru berhasil disimpan secara permanen ke dalam daftar anggota.</p>
      <button className="btn-primary" onClick={() => setShowSuccess(false)}>
              Lanjutkan
      </button>
          </div>
    </div>)}
  </div>);
}

export default App;

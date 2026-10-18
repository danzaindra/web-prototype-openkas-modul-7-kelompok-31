import { useState } from "react";
import "./App.css";

const menuItems = [
  { id: "kelas", label: "Daftar Kelas", icon: "▦" },
  { id: "anggota", label: "Daftar Anggota", icon: "♙" },
  { id: "pengeluaran", label: "Pengeluaran Kas", icon: "↗" },
];

const initialMembers = [
  { id: 1, name: "Adit Pratama", number: "AGT001", className: "Kelas A", phone: "081234567801", status: "Aktif" },
  { id: 2, name: "Bintang Putri", number: "AGT002", className: "Kelas A", phone: "081234567802", status: "Aktif" },
  { id: 3, name: "Cahya Ramadhan", number: "AGT003", className: "Kelas B", phone: "081234567803", status: "Aktif" },
  { id: 4, name: "Dinda Maharani", number: "AGT004", className: "Kelas B", phone: "081234567804", status: "Tidak Aktif" },
  { id: 5, name: "Eka Saputra", number: "AGT005", className: "Kelas C", phone: "081234567805", status: "Aktif" },
];

function App() {
  const [page, setPage] = useState("home");
  const [members, setMembers] = useState(initialMembers);
  const [search, setSearch] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [form, setForm] = useState({
    name: "",
    className: "",
    phone: "",
    status: "Aktif",
  });

  const filteredMembers = members.filter((member) =>
    `${member.name} ${member.number} ${member.className}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  function navigate(nextPage) {
    setPage(nextPage);
    setMobileMenu(false);
    setShowSuccess(false);
  }

  function addMember(event) {
    event.preventDefault();

    const newMember = {
      id: Date.now(),
      name: form.name.trim(),
      number: `AGT${String(members.length + 1).padStart(3, "0")}`,
      className: form.className,
      phone: form.phone,
      status: form.status,
    };

    setMembers((previous) => [...previous, newMember]);
    setForm({ name: "", className: "", phone: "", status: "Aktif" });
    setPage("anggota");
    setShowSuccess(true);
  }

  return (
    <div className="app">
      <header className="topbar">
        <button
          className="mobile-toggle"
          onClick={() => setMobileMenu(!mobileMenu)}
          aria-label="Buka menu"
        >
          ☰
        </button>
        <button className="brand" onClick={() => navigate("home")}>
          OpenKas<span>.</span>
        </button>

        {page === "home" ? (
          <>
            <nav className="top-links">
              <button onClick={() => navigate("kelas")}>Beranda</button>
              <button onClick={() => navigate("anggota")}>Fitur</button>
              <button onClick={() => navigate("kelas")}>Cara Kerja</button>
              <button onClick={() => navigate("pengeluaran")}>
                Transparansi Kas
              </button>
            </nav>
            <div className="top-actions">
              <button className="btn-outline" onClick={() => navigate("login")}>
                Masuk
              </button>
              <button className="btn-primary" onClick={() => navigate("anggota")}>
                Daftar
              </button>
            </div>
          </>
        ) : (
          <span className="top-caption">Sistem Pengelolaan Kas</span>
        )}
      </header>

      {page === "home" ? (
        <main>
          <section className="hero">
            <div className="hero-copy">
              <span className="eyebrow">PENGELOLAAN KAS DIGITAL</span>
              <h1>Kelola Kas Lebih Mudah dan Transparan</h1>
              <p>
                Operasikan pencatatan keuangan, pembayaran, pengeluaran, dan
                transparansi kas dalam satu platform.
              </p>
              <div className="hero-actions">
                <button
                  className="btn-primary"
                  onClick={() => navigate("anggota")}
                >
                  Mulai Kelola Kas
                </button>
                <button
                  className="btn-outline"
                  onClick={() => navigate("pengeluaran")}
                >
                  Lihat Transparansi
                </button>
              </div>
            </div>
            <div className="hero-art">
              <div className="art-card">
                <span>RINGKASAN KEUANGAN</span>
                <div className="art-amount">Rp 2.450.000</div>
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
        </main>
      ) : (
        <div className="dashboard">
          <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
            <div className="profile">
              <div className="avatar">O</div>
              <div><strong>OpenKas</strong><small>Pengelolaan Kas</small></div>
            </div>
            <p className="side-label">MENU UTAMA</p>
            <button
              className={`side-link ${page === "kelas" ? "active" : ""}`}
              onClick={() => navigate("kelas")}
            >
              <span>▦</span> Beranda
            </button>
            {menuItems.map((item) => (
              <button
                key={item.id}
                className={`side-link ${page === item.id || (page === "tambah" && item.id === "anggota") ? "active" : ""}`}
                onClick={() => navigate(item.id)}
              >
                <span>{item.icon}</span>{item.label}
              </button>
            ))}
            <button className="side-link" onClick={() => navigate("home")}>
              <span>↩</span> Keluar
            </button>
          </aside>

          <main className="workspace">
            {page === "login" ? (
              <section className="login-wrap">
                <form className="login-card" onSubmit={(event) => {
                  event.preventDefault();
                  navigate("anggota");
                }}>
                  <div className="login-logo">OpenKas</div>
                  <h2>Masuk</h2>
                  <p>Selamat Datang Kembali</p>
                  <label>Email</label>
                  <input type="email" placeholder="Masukkan email" required />
                  <label>Kata Sandi</label>
                  <input type="password" placeholder="Masukkan kata sandi" required />
                  <button className="btn-primary full-width">Log In</button>
                  <button type="button" className="text-button" onClick={() => navigate("home")}>
                    Kembali ke Beranda
                  </button>
                </form>
              </section>
            ) : page === "kelas" ? (
              <section>
                <div className="page-heading">
                  <div><h1>Daftar Kelas</h1><p>Pilih kelas untuk melihat informasi kas.</p></div>
                </div>
                <div className="class-banner banner-blue">
                  <span>KELAS DAN KEGIATAN</span>
                  <h2>Kelola Kelas Lebih Teratur</h2>
                  <p>Pantau data anggota dan pencatatan kas dengan mudah.</p>
                </div>
                <div className="class-banner banner-orange">
                  <span>OPENKAS COMMUNITY</span>
                  <h2>Music For Everyone</h2>
                  <p>Informasi kegiatan dan pengelolaan dana bersama.</p>
                </div>
                <button className="btn-primary" onClick={() => navigate("anggota")}>
                  Lihat Daftar Anggota
                </button>
              </section>
            ) : page === "tambah" ? (
              <section>
                <div className="page-heading">
                  <div><h1>Tambah Anggota</h1><p>Lengkapi informasi anggota baru.</p></div>
                </div>
                <form className="form-card" onSubmit={addMember}>
                  <div className="form-section-title">User Details</div>
                  <div className="form-grid">
                    <div className="field">
                      <label>Nama Anggota</label>
                      <input
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Masukkan nama anggota"
                        required
                      />
                    </div>
                    <div className="field">
                      <label>Nomor Telepon</label>
                      <input
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="Masukkan nomor telepon"
                        required
                      />
                    </div>
                    <div className="field full-field">
                      <label>Kelas / Kelompok</label>
                      <select
                        value={form.className}
                        onChange={(e) => setForm({ ...form, className: e.target.value })}
                        required
                      >
                        <option value="">Pilih kelas</option>
                        <option>Kelas A</option>
                        <option>Kelas B</option>
                        <option>Kelas C</option>
                      </select>
                    </div>
                    <div className="field full-field">
                      <label>Status Keanggotaan</label>
                      <select
                        value={form.status}
                        onChange={(e) => setForm({ ...form, status: e.target.value })}
                      >
                        <option>Aktif</option>
                        <option>Tidak Aktif</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-actions">
                    <button type="button" className="btn-outline" onClick={() => navigate("anggota")}>
                      Kembali
                    </button>
                    <button className="btn-primary">Simpan</button>
                  </div>
                </form>
              </section>
            ) : page === "anggota" ? (
              <section>
                <div className="page-heading">
                  <div><h1>Daftar Anggota</h1><p>Kelola informasi anggota dan status keanggotaan.</p></div>
                  <button className="btn-primary" onClick={() => navigate("tambah")}>
                    + Tambah Anggota
                  </button>
                </div>
                <div className="stats-row">
                  <div className="stat-card"><span>Total Anggota</span><strong>{members.length}</strong></div>
                  <div className="stat-card"><span>Anggota Aktif</span><strong>{members.filter(m => m.status === "Aktif").length}</strong></div>
                </div>
                <div className="table-card">
                  <div className="table-toolbar">
                    <h3>Semua Anggota</h3>
                    <input
                      className="search-input"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Cari nama atau nomor anggota..."
                    />
                  </div>
                  <div className="table-scroll">
                    <table>
                      <thead>
                        <tr><th>Nama Anggota</th><th>Nomor Anggota</th><th>Kelas</th><th>Telepon</th><th>Status</th></tr>
                      </thead>
                      <tbody>
                        {filteredMembers.map((member) => (
                          <tr key={member.id}>
                            <td><span className="member-avatar">{member.name.charAt(0)}</span>{member.name}</td>
                            <td>{member.number}</td><td>{member.className}</td><td>{member.phone}</td>
                            <td><span className={`status ${member.status === "Aktif" ? "status-active" : "status-inactive"}`}>{member.status}</span></td>
                          </tr>
                        ))}
                        {filteredMembers.length === 0 && (
                          <tr><td colSpan="5" className="empty-state">Anggota tidak ditemukan.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="table-footer">Menampilkan {filteredMembers.length} dari {members.length} anggota</div>
                </div>
              </section>
            ) : (
              <section>
                <div className="page-heading">
                  <div><h1>Pengeluaran Kas</h1><p>Ringkasan pencatatan kas bersama.</p></div>
                </div>
                <div className="stat-card balance-card">
                  <span>Saldo Simulasi</span>
                  <strong>Rp 2.450.000</strong>
                  <p>Contoh tampilan ringkasan keuangan OpenKas.</p>
                </div>
                <div className="table-card">
                  <h3>Transparansi Kas</h3>
                  <p className="muted">Data transaksi ini masih berupa contoh untuk prototipe.</p>
                  <div className="transaction"><span>Kas masuk anggota</span><strong>+ Rp 500.000</strong></div>
                  <div className="transaction"><span>Keperluan kegiatan</span><strong className="expense">− Rp 150.000</strong></div>
                  <div className="transaction"><span>Pembelian perlengkapan</span><strong className="expense">− Rp 75.000</strong></div>
                </div>
              </section>
            )}
          </main>
        </div>
      )}

      {showSuccess && (
        <div className="modal-backdrop" onClick={() => setShowSuccess(false)}>
          <div className="success-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowSuccess(false)}>×</button>
            <div className="success-icon">✓</div>
            <h2>Anggota Berhasil Ditambahkan</h2>
            <p>Data anggota baru berhasil disimpan ke dalam daftar anggota.</p>
            <button className="btn-primary" onClick={() => setShowSuccess(false)}>
              Lanjutkan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
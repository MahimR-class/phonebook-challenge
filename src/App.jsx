import { useEffect, useMemo, useState } from "react";
import "./App.css";
import Pagination from "./components/Pagination";
import loaderGif from "./assets/loader.gif";
import errorGif from "./assets/error.gif";


const avatars = import.meta.glob("./assets/avatars/*", { eager: true, as: "url" });
const singleAvatarFolder = import.meta.glob("./assets/avatar/*", { eager: true, as: "url" });

const DEFAULT_AVATAR =
  avatars["./assets/avatars/avatar.jpg"] ||
  singleAvatarFolder["./assets/avatar/avatar.jpg"] ||
  Object.values(avatars)[0] ||
  Object.values(singleAvatarFolder)[0] ||
  "";

const avatarUrl = (photo) => {
  if (!photo) return DEFAULT_AVATAR;
  const filename = photo.startsWith("/") ? photo.split("/").pop() : photo;
  return (
    avatars[`./assets/avatars/${filename}`] ||
    singleAvatarFolder[`./assets/avatar/${filename}`] ||
    DEFAULT_AVATAR
  );
};


const FALLBACK_CONTACTS = [
    {
     id: 101,
     name: "Ada Lovelace",
     phone: "(555) 010-0101",
     email: "ada@example.com",
     photo: "ada.jpg"
   },
   {
     id: 102,
     name: "Alan Turing",
     phone: "(555) 010-0102",
     email: "alan@example.com",
     photo: "alan.jpg"
   },
   {
     id: 103,
     name: "Grace Hopper",
     phone: "(555) 010-0103",
     email: "grace@example.com",
     photo: "grace.jpg"
   },
   {
     id: 104,
     name: "Katherine Johnson",
     phone: "(555) 535-0104",
     email: "katherine@example.com",
     photo: "katherine.jpg"
   },
   {
     id: 105,
     name: "Donald the Duck",
     phone: "(555) 111-0105",
     email: "donald@example.com",
     photo: "donald.jpg"
   },
   {
     id: 7,
     name: "Clark Kent",
     phone: "(555) 888-0103",
     email: "clark@example.com",
     photo: "clark.jpg"
   },
   {
     id: 8,
     name: "Peter Griffin",
     phone: "(555) 555-0103",
     email: "griffin@example.com",
     photo: "peter.jpg"
   },
   {
     id: 9,
     name: "Brennan Lee Mulligan",
     phone: "(555) 666-0103",
     email: "lee@example.com",
     photo: "brennan.jpg"
   },
   {
     id: 10,
     name: "Fabian Seacaster",
     phone: "(555) 999-0103",
     email: "fabian@example.com",
     photo: "fabian.jpg"
   },
   {
      id: 110,
      name: "Chungledown Bim",
      phone: "(555) 789-0103",
      email: "bim@example.com",
      photo: "bim.jpg"
    },
];

function validate(values) {
  const errors = {};
  const name = (values.name || "").trim();
  const phone = (values.phone || "").trim();
  const email = (values.email || "").trim();

  if (name.length < 2) errors.name = "Name must be at least 2 characters.";
  if (!phone) errors.phone = "Phone is required.";
  if (email && !email.includes("@")) errors.email = "Email must include '@'.";

  return errors;
}

const App = () => {
  const [contacts, setContacts] = useState(FALLBACK_CONTACTS);

  const [query, setQuery] = useState("");
  const [delayedQuery, setDelayedQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const willChange = query !== delayedQuery;
    if (willChange) setLoading(true);
    const t = setTimeout(() => {
      setDelayedQuery(query);
      if (willChange) setLoading(false);
    }, 2000);
    return () => clearTimeout(t);
  }, [query, delayedQuery]);

  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [touched, setTouched] = useState({ name: false, phone: false, email: false });
  const errors = useMemo(() => validate(form), [form]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(1);

  const filtered = useMemo(() => {
    const q = delayedQuery.trim().toLowerCase();
    if (!q) return contacts;
    const qDigits = q.replace(/\D/g, "");
    return contacts.filter((c) => {
      const name = (c.name || "").toLowerCase();
      const email = (c.email || "").toLowerCase();
      const phone = (c.phone || "").toLowerCase();
      const phoneDigits = phone.replace(/\D/g, "");
      const nameMatch  = name.includes(q);
      const emailMatch = email.includes(q);
      const phoneMatch = phone.includes(q) || (qDigits && phoneDigits.includes(qDigits));
      return nameMatch || emailMatch || phoneMatch;
    });
  }, [contacts, delayedQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [delayedQuery, pageSize]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  function handleBlur(field) {
    setTouched((t) => ({ ...t, [field]: true }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setTouched({ name: true, phone: true, email: true });
    const errs = validate(form);
    if (Object.keys(errs).length) return;

    const newContact = {
      id: Date.now(),
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      photo: "avatar.jpg", 
    };

    setContacts((prev) => [newContact, ...prev]);
    setForm({ name: "", phone: "", email: "" });
    setTouched({ name: false, phone: false, email: false });
    setCurrentPage(1);
  }

  const hasQuery = delayedQuery.trim().length > 0;
  const showErrorGif = !loading && hasQuery && filtered.length === 0;

  let content;
  if (loading) {
    content = (
      <div className="loader-wrap">
        <img src={loaderGif} alt="Searching..." />
      </div>
    );
  } else if (showErrorGif) {
    content = (
      <div className="error-wrap" role="status" aria-live="polite">
        <img src={errorGif} alt="No matches found" />
        <p className="msg">No contacts match “{delayedQuery}”.</p>
      </div>
    );
  } else {
    content = (
      <>
        <ul className="contacts__list">
          {paginated.map((contact) => (
            <li key={contact.id} className="contacts__item">
              <div className="contact-card">
                <img
                  className="contact-card__avatar"
                  src={avatarUrl(contact.photo)}
                  alt={contact.name}
                />
                <div className="contact-card__body">
                  <h3 className="contact-card__name">{contact.name}</h3>
                  <p className="contact-card__phone">{contact.phone}</p>
                  <p className="contact-card__email">{contact.email}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          hidePageSize={true}
          onPageChange={(p) => setCurrentPage(p)}
          onPageSizeChange={(s) => { setPageSize(s); setCurrentPage(1); }}
        />
      </>
    );
  }

  return (
    <main className="page" data-testid="page-root">
      <header className="page__header">
        <h1 className="page__title">Phonebook Library</h1>
        <p className="page__subtitle">I have no idea about what I am doing</p>
      </header>

      <section className="search" aria-labelledby="search-heading">
        <h2 id="search-heading">Search Contacts</h2>
        <div className="search__controls">
          <label htmlFor="search-input">Search</label>
          <input
            id="search-input"
            type="search"
            placeholder="Search by name, phone, or email"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            data-testid="search-input"
          />
        </div>

        <p className="search__results" data-testid="results-count" aria-live="polite">
          {loading
            ? "Searching..."
            : <>
                Showing {filtered.length}
                {hasQuery ? ` of ${contacts.length}` : ""}{" "}
                {filtered.length === 1 ? "result" : "results"}
              </>}
        </p>
      </section>

      <section className="contacts" aria-labelledby="contacts-heading">
        <h2 id="contacts-heading">All The Weird Contacts</h2>

        {content}

        
        <form className="form__body" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              onBlur={() => handleBlur("name")}
              required
              minLength={2}
              placeholder="e.g., Ada Lovelace"
              aria-invalid={touched.name && !!errors.name}
              aria-describedby="name-error"
              className={touched.name && errors.name ? "input--invalid" : ""}
            />
            {touched.name && errors.name && (
              <p id="name-error" className="error-text">{errors.name}</p>
            )}
          </div>

          <div className="field">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              name="phone"
              inputMode="tel"
              placeholder="(555) 555-5555"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              onBlur={() => handleBlur("phone")}
              required
              aria-invalid={touched.phone && !!errors.phone}
              aria-describedby="phone-error"
              className={touched.phone && errors.phone ? "input--invalid" : ""}
            />
            {touched.phone && errors.phone && (
              <p id="phone-error" className="error-text">{errors.phone}</p>
            )}
          </div>

          <div className="field">
            <label htmlFor="email">Email (optional)</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="e.g., ada@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              onBlur={() => handleBlur("email")}
              aria-invalid={touched.email && !!errors.email}
              aria-describedby="email-error"
              className={touched.email && errors.email ? "input--invalid" : ""}
            />
            {touched.email && errors.email && (
              <p id="email-error" className="error-text">{errors.email}</p>
            )}
          </div>

          <div className="form__actions">
            <button className="btn" type="submit" data-testid="btn-add">
              Add Contact
            </button>
          </div>
        </form>
      </section>

      <footer className="page__footer">
        <small>I am just trying to figure this out.</small>
      </footer>
    </main>
  );
};

export default App;
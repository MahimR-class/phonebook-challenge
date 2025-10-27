import { useEffect, useMemo, useState } from "react";
import "./App.css";

const avatars = import.meta.glob("./assets/avatars/*", { eager: true, as: "url" });
const avatarUrl = (photo) => {
  if (!photo) return "";
  // allow "ada.jpg" or "/avatars/ada.jpg"
  const filename = photo.startsWith("/") ? photo.split("/").pop() : photo;
  const key = `./assets/avatars/${filename}`;
  return avatars[key] || "";
}



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

const App = () => {
  const [contacts] = useState(FALLBACK_CONTACTS);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", email: "" });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return contacts;
    return contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q)
    );
  }, [contacts, query]);

  function handleSubmit(e) {
    e.preventDefault(); 
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
            placeholder="Search by name or phone"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            data-testid="search-input"
          />
        </div>

        <p
          className="search__results"
          data-testid="results-count"
          aria-live="polite"
        >
          Showing {filtered.length}
          {query.trim() ? ` of ${contacts.length}` : ""}{" "}
          {filtered.length === 1 ? "result" : "results"}
        </p>
      </section>

      <section className="contacts" aria-labelledby="contacts-heading">
        <h2 id="contacts-heading">All The Weird Contacts</h2>
        <ul className="contacts__list">
          {filtered.map((c) => (
            <li key={c.id} className="contacts__item">
              <article className="contact-card">
                <img
                  className="contact-card__avatar"
                  src={avatarUrl(c.photo)}
                  alt={`Portrait of ${c.name}`}
                  width="100"
                  height="100"
                  loading="lazy"
                />




                <div className="contact-card__body">
                  <h3 className="contact-card__name">{c.name}</h3>
                  <p className="contact-card__phone">
                    <a href={`tel:${c.phone.replace(/[^\d+]/g, "")}`}>{c.phone}</a>
                  </p>
                  <p className="contact-card__email">
                    <a href={`mailto:${c.email}`}>{c.email}</a>
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </section>

      <section className="form" aria-labelledby="form-heading">
        <h2 id="form-heading">Add a Contact</h2>
        <form className="form__body" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              minLength={2}
              placeholder="e.g., Ada Lovelace"
            />
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
              required
            />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="e.g., ada@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="form__actions">
            <button className="btn" type="submit" data-testid="btn-add">
              Add Contact
            </button>
          </div>
        </form>
      </section>

      <footer className="page__footer">
        <small>
          I am just trying to figure this out.
        </small>
      </footer>
    </main>
  );
};

export default App;





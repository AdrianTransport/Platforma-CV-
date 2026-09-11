"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft, ArrowRight, BriefcaseBusiness, Check, CheckCircle2,
  Copy, FileCheck2, FileText, Languages, LockKeyhole, Mail,
  MapPin, PencilLine, Printer, ShieldCheck, Sparkles, WandSparkles,
} from "lucide-react";

type Language = "ro" | "de";
type IntroLanguage = "ro" | "de" | "pl" | "bg" | "uk" | "en" | "tr" | "ar" | "hr" | "sr" | "hu" | "it" | "es" | "ru" | "fr";
type DocumentType = "letter" | "cv" | "email";
type FormData = {
  job: string; company: string; location: string; ad: string;
  name: string; email: string; phone: string; experience: string;
  skills: string; german: string; license: boolean;
};

const initialData: FormData = {
  job: "", company: "", location: "", ad: "", name: "", email: "",
  phone: "", experience: "", skills: "", german: "A2", license: false,
};

const introMessages: Record<IntroLanguage, { label: string; text: string; dir?: "rtl" }> = {
  ro: { label: "Română", text: "Tu ne povestești în română. Noi îți pregătim Bewerbung-ul în germană." },
  de: { label: "Deutsch", text: "Du erzählst uns auf Deutsch. Wir erstellen deine Bewerbung professionell auf Deutsch." },
  pl: { label: "Polski", text: "Opowiadasz nam po polsku. My przygotowujemy Twoją Bewerbung po niemiecku." },
  bg: { label: "Български", text: "Разказваш ни на български. Ние подготвяме твоята Bewerbung на немски." },
  uk: { label: "Українська", text: "Ти розповідаєш нам українською. Ми готуємо твою Bewerbung німецькою." },
  en: { label: "English", text: "You tell us in English. We prepare your Bewerbung professionally in German." },
  tr: { label: "Türkçe", text: "Bize Türkçe anlat. Bewerbung’unu Almanca ve profesyonelce hazırlayalım." },
  ar: { label: "العربية", text: "أخبرنا بالعربية. ونحن نُعِدّ طلب التوظيف الخاص بك بالألمانية.", dir: "rtl" },
  hr: { label: "Hrvatski", text: "Ispričaj nam na hrvatskom. Mi ćemo pripremiti tvoju Bewerbung na njemačkom." },
  sr: { label: "Srpski", text: "Ispričaj nam na srpskom. Mi ćemo pripremiti tvoju Bewerbung na nemačkom." },
  hu: { label: "Magyar", text: "Meséld el nekünk magyarul. Mi elkészítjük a német nyelvű Bewerbungodat." },
  it: { label: "Italiano", text: "Raccontaci tutto in italiano. Noi prepariamo la tua Bewerbung in tedesco." },
  es: { label: "Español", text: "Cuéntanoslo en español. Nosotros preparamos tu Bewerbung en alemán." },
  ru: { label: "Русский", text: "Расскажите нам по-русски. Мы подготовим вашу Bewerbung на немецком." },
  fr: { label: "Français", text: "Parlez-nous en français. Nous préparons votre Bewerbung en allemand." },
};

const words = {
  ro: {
    how: "Cum funcționează", prices: "Prețuri", account: "Contul meu",
    eyebrow: "Asistent pentru angajare în Germania",
    title: "Răspunzi în română. Aplici profesionist în germană.",
    subtitle: "Îți transformăm experiența într-un CV și o scrisoare de intenție adaptate exact locului de muncă dorit.",
    trust: "Fără texte inventate. Tu confirmi fiecare informație.",
    step: "Pasul", of: "din", steps: ["Locul de muncă", "Despre tine", "Experiență"],
    headings: ["Pentru ce post aplici?", "Cum te poate contacta angajatorul?", "Ce experiență vrei să evidențiem?"],
    hints: ["Copiază anunțul, iar noi identificăm cerințele importante.", "Aceste informații vor apărea în documentele tale.", "Scrie natural, în română. Noi formulăm profesional în germană."],
    job: "Postul dorit", jobPh: "Exemplu: Îngrijitor persoane vârstnice",
    company: "Angajatorul", companyPh: "Exemplu: PflegeHaus GmbH",
    location: "Localitatea", locationPh: "Exemplu: München",
    ad: "Anunțul de angajare", adPh: "Copiază aici textul anunțului în germană...",
    name: "Nume și prenume", namePh: "Exemplu: Cristian Droc",
    experience: "Experiență profesională", experiencePh: "Exemplu: Am lucrat 4 ani în îngrijire la domiciliu. Am ajutat persoane cu mobilitate redusă...",
    skills: "Calificări și puncte forte", skillsPh: "Exemplu: răbdare, experiență cu demență, gătit, prim ajutor",
    german: "Nivelul limbii germane", license: "Am permis de conducere categoria B",
    back: "Înapoi", next: "Continuă", generate: "Creează candidatura",
    preview: "Previzualizare document", live: "Se completează automat",
    emptyTitle: "Candidatura ta va apărea aici",
    emptyText: "Completează întrebările din stânga. Vei putea verifica totul înainte de descărcare.",
    ready: "Candidatura este pregătită", readyText: "Verifică informațiile înainte de descărcare.",
    edit: "Modifică", copy: "Copiază", print: "Descarcă / tipărește",
    full: "Dosar complet", once: "o singură plată",
    benefits: ["CV german", "Anschreiben personalizat", "E-mail pentru angajator", "3 corecturi incluse"],
    download: "Descarcă dosarul complet", safe: "Plată securizată · fără abonament",
  },
  de: {
    how: "So funktioniert's", prices: "Preise", account: "Mein Konto",
    eyebrow: "Bewerbungsassistent für Deutschland",
    title: "Auf Rumänisch antworten. Professionell auf Deutsch bewerben.",
    subtitle: "Wir verwandeln deine Erfahrung in einen Lebenslauf und ein Anschreiben, passend zu deiner Wunschstelle.",
    trust: "Keine erfundenen Angaben. Du bestätigst jede Information.",
    step: "Schritt", of: "von", steps: ["Wunschstelle", "Über dich", "Erfahrung"],
    headings: ["Für welche Stelle bewirbst du dich?", "Wie kann dich der Arbeitgeber erreichen?", "Welche Erfahrung sollen wir hervorheben?"],
    hints: ["Füge die Stellenanzeige ein. Wir erkennen die wichtigsten Anforderungen.", "Diese Angaben erscheinen in deinen Dokumenten.", "Schreibe einfach. Wir formulieren professionell auf Deutsch."],
    job: "Gewünschte Stelle", jobPh: "Beispiel: Betreuungskraft",
    company: "Arbeitgeber", companyPh: "Beispiel: PflegeHaus GmbH",
    location: "Ort", locationPh: "Beispiel: München",
    ad: "Stellenanzeige", adPh: "Füge hier den Text der Stellenanzeige ein...",
    name: "Vor- und Nachname", namePh: "Beispiel: Cristian Droc",
    experience: "Berufserfahrung", experiencePh: "Beispiel: Vier Jahre Erfahrung in der häuslichen Betreuung...",
    skills: "Qualifikationen und Stärken", skillsPh: "Beispiel: Geduld, Demenzerfahrung, Kochen, Erste Hilfe",
    german: "Deutschkenntnisse", license: "Ich habe einen Führerschein der Klasse B",
    back: "Zurück", next: "Weiter", generate: "Bewerbung erstellen",
    preview: "Dokumentvorschau", live: "Wird automatisch ergänzt",
    emptyTitle: "Deine Bewerbung erscheint hier",
    emptyText: "Beantworte die Fragen links. Vor dem Download kannst du alles prüfen.",
    ready: "Deine Bewerbung ist fertig", readyText: "Prüfe alle Angaben vor dem Download.",
    edit: "Bearbeiten", copy: "Kopieren", print: "Download / Drucken",
    full: "Komplettpaket", once: "einmalige Zahlung",
    benefits: ["Deutscher Lebenslauf", "Persönliches Anschreiben", "E-Mail an den Arbeitgeber", "3 Korrekturen inklusive"],
    download: "Komplettpaket herunterladen", safe: "Sichere Zahlung · kein Abonnement",
  },
};

function Logo() {
  return <div className="logo"><span><FileCheck2 size={20}/></span><b>Bewerbung<i>RO</i></b></div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="field"><b>{label}</b>{children}</label>;
}

export default function Home() {
  const [lang, setLang] = useState<Language>("ro");
  const [introLang, setIntroLang] = useState<IntroLanguage>("ro");
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>(initialData);
  const [generated, setGenerated] = useState(false);
  const [doc, setDoc] = useState<DocumentType>("letter");
  const [copied, setCopied] = useState(false);
  const t = words[lang];
  const update = (key: keyof FormData, value: string | boolean) =>
    setData((old) => ({ ...old, [key]: value }));
  const completion = useMemo(() => {
    const values = [data.job, data.company, data.location, data.name, data.email, data.phone, data.experience, data.skills];
    return Math.round((values.filter(Boolean).length / values.length) * 100);
  }, [data]);

  const person = data.name || "Numele tău";
  const job = data.job || "postul dorit";
  const company = data.company || "compania dumneavoastră";
  const city = data.location || "Germania";
  const experience = data.experience || "experiența profesională menționată";
  const skills = data.skills || "seriozitate, responsabilitate și dorință de muncă";
  const letterText = `Sehr geehrte Damen und Herren,

mit großem Interesse bewerbe ich mich bei ${company} um die Stelle als ${job}. Meine bisherige Berufserfahrung und meine zuverlässige Arbeitsweise möchte ich gerne in Ihr Team einbringen.

In meiner bisherigen Tätigkeit konnte ich folgende praktische Erfahrung sammeln: ${experience} Zu meinen persönlichen Stärken zählen ${skills}. Meine Deutschkenntnisse entsprechen dem Niveau ${data.german}${data.license ? "; außerdem besitze ich einen Führerschein der Klasse B" : ""}.

Ich freue mich darauf, Sie in einem persönlichen Gespräch von meiner Motivation zu überzeugen.

Mit freundlichen Grüßen
${person}`;
  const emailText = `Betreff: Bewerbung als ${job}

Sehr geehrte Damen und Herren,

anbei übersende ich Ihnen meine Bewerbungsunterlagen für die Stelle als ${job}. Über eine Einladung zu einem persönlichen Gespräch freue ich mich sehr.

Mit freundlichen Grüßen
${person}`;

  function createApplication() {
    setGenerated(true);
    setDoc("letter");
    setTimeout(() => window.document.getElementById("preview")?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  }
  async function copyText() {
    await navigator.clipboard.writeText(doc === "email" ? emailText : letterText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <main>
      <header className="header print-hide">
        <div className="container header-inner">
          <Logo/>
          <nav><a href="#flow">{t.how}</a><a href="#price">{t.prices}</a></nav>
          <div className="header-actions">
            <button className="language" onClick={() => {
              const nextLanguage = lang === "ro" ? "de" : "ro";
              setLang(nextLanguage);
              setIntroLang(nextLanguage);
            }}><Languages size={16}/>{lang.toUpperCase()}</button>
            <button className="account">{t.account}</button>
          </div>
        </div>
      </header>

      <section className="hero print-hide">
        <div className="container hero-grid">
          <div>
            <div className="eyebrow"><BriefcaseBusiness size={15}/>{t.eyebrow}</div>
            <h1 dir={introMessages[introLang].dir}>{introMessages[introLang].text}</h1>
            <p>{t.subtitle}</p>
            <label className="intro-language">
              <Languages size={16}/>
              <span>{lang === "ro" ? "Mesaj în" : "Botschaft auf"}</span>
              <select value={introLang} onChange={(event) => setIntroLang(event.target.value as IntroLanguage)} aria-label={lang === "ro" ? "Alege limba mesajului" : "Sprache der Botschaft wählen"}>
                {Object.entries(introMessages).map(([code, message]) => <option key={code} value={code}>{message.label}</option>)}
              </select>
            </label>
            <small><ShieldCheck size={17}/>{t.trust}</small>
          </div>
          <div className="hero-document">
            <div className="mini-paper">
              <div className="mini-head"><span>DE</span><div><b>Lebenslauf</b><small>Professionelles Profil</small></div></div>
              <i/><i/><i/><i/>
            </div>
            <div className="verified"><CheckCircle2 size={17}/>Pentru piața germană</div>
          </div>
        </div>
      </section>

      <section id="flow" className="container workspace print-hide">
        <div className="form-card">
          <div className="stepper">
            {t.steps.map((label, index) => {
              const number = index + 1;
              return <div key={label} className={`step ${number === step ? "active" : ""} ${number < step || generated ? "done" : ""}`}>
                <span>{number < step || generated ? <Check size={14}/> : number}</span><small>{label}</small>
              </div>;
            })}
          </div>
          <div className="form-title"><span>{t.step} {step} {t.of} 3</span><h2>{t.headings[step - 1]}</h2><p>{t.hints[step - 1]}</p></div>

          {step === 1 && <div className="fields">
            <Field label={t.job}><div className="icon-input"><BriefcaseBusiness size={17}/><input value={data.job} onChange={(e) => update("job", e.target.value)} placeholder={t.jobPh}/></div></Field>
            <div className="two"><Field label={t.company}><input value={data.company} onChange={(e) => update("company", e.target.value)} placeholder={t.companyPh}/></Field>
            <Field label={t.location}><div className="icon-input"><MapPin size={17}/><input value={data.location} onChange={(e) => update("location", e.target.value)} placeholder={t.locationPh}/></div></Field></div>
            <Field label={t.ad}><textarea rows={6} value={data.ad} onChange={(e) => update("ad", e.target.value)} placeholder={t.adPh}/></Field>
          </div>}

          {step === 2 && <div className="fields">
            <Field label={t.name}><input value={data.name} onChange={(e) => update("name", e.target.value)} placeholder={t.namePh}/></Field>
            <div className="two"><Field label="E-mail"><div className="icon-input"><Mail size={17}/><input type="email" value={data.email} onChange={(e) => update("email", e.target.value)} placeholder="nume@email.de"/></div></Field>
            <Field label="Telefon"><input value={data.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+49 170 1234567"/></Field></div>
            <div className="privacy"><LockKeyhole size={18}/><div><b>Datele tale sunt private</b><span>În versiunea de test, informațiile nu sunt salvate pe server.</span></div></div>
          </div>}

          {step === 3 && <div className="fields">
            <Field label={t.experience}><textarea rows={5} value={data.experience} onChange={(e) => update("experience", e.target.value)} placeholder={t.experiencePh}/></Field>
            <Field label={t.skills}><textarea rows={3} value={data.skills} onChange={(e) => update("skills", e.target.value)} placeholder={t.skillsPh}/></Field>
            <Field label={t.german}><select value={data.german} onChange={(e) => update("german", e.target.value)}><option>A1</option><option>A2</option><option>B1</option><option>B2</option><option>C1</option><option>Nu cunosc limba germană</option></select></Field>
            <label className="checkbox"><input type="checkbox" checked={data.license} onChange={(e) => update("license", e.target.checked)}/><span><Check size={14}/></span>{t.license}</label>
          </div>}

          <div className="form-actions">
            <button className="back" disabled={step === 1} onClick={() => setStep(Math.max(1, step - 1))}><ArrowLeft size={17}/>{t.back}</button>
            {step < 3
              ? <button className="primary" onClick={() => setStep(step + 1)}>{t.next}<ArrowRight size={17}/></button>
              : <button className="primary dark" onClick={createApplication}><WandSparkles size={17}/>{t.generate}</button>}
          </div>
        </div>

        <aside id="preview" className="preview">
          <div className="preview-head"><div><b>{t.preview}</b><small>{generated ? "Creat din răspunsurile tale" : `${completion}% completat`}</small></div><span><i/>{t.live}</span></div>
          {!generated ? <div className="empty">
            <div className="empty-icon"><FileText size={30}/><Sparkles size={15}/></div>
            <h3>{t.emptyTitle}</h3><p>{t.emptyText}</p>
            <div className="skeleton"><i/><i/><i/><i/><i/></div>
          </div> : <div className="result">
            <div className="success"><CheckCircle2 size={20}/><div><b>{t.ready}</b><span>{t.readyText}</span></div></div>
            <div className="tabs">
              <button className={doc === "letter" ? "active" : ""} onClick={() => setDoc("letter")}><PencilLine size={15}/>Anschreiben</button>
              <button className={doc === "cv" ? "active" : ""} onClick={() => setDoc("cv")}><FileText size={15}/>Lebenslauf</button>
              <button className={doc === "email" ? "active" : ""} onClick={() => setDoc("email")}><Mail size={15}/>E-mail</button>
            </div>
            <article className="paper">
              {doc === "cv" ? <>
                <div className="cv-head"><div><h3>{person}</h3><p>{job}</p></div><span>{person.slice(0,1)}</span></div>
                <div className="cv-contact">{data.email || "nume@email.de"} · {data.phone || "+49 ..."} · {city}</div>
                <h4>Berufserfahrung</h4><p>{experience}</p>
                <h4>Kenntnisse & Stärken</h4><p>{skills}</p>
                <h4>Sprachen</h4><p>Rumänisch – Muttersprache<br/>Deutsch – {data.german}</p>
              </> : <div className="letter">
                <div className="sender">{person} · {data.email || "nume@email.de"} · {data.phone || "+49 ..."}</div>
                <p><b>{company}</b><br/>{city}</p>
                <p className="subject">Bewerbung als {job}</p>
                {(doc === "email" ? emailText : letterText).split("\n\n").slice(doc === "email" ? 1 : 0).map((p, i) => <p key={i}>{p}</p>)}
              </div>}
            </article>
            <div className="result-actions">
              <button onClick={() => {setGenerated(false); setStep(1);}}><PencilLine size={15}/>{t.edit}</button>
              <button onClick={copyText}>{copied ? <Check size={15}/> : <Copy size={15}/>} {copied ? "Copiat" : t.copy}</button>
              <button className="download" onClick={() => window.print()}><Printer size={15}/>{t.print}</button>
            </div>
          </div>}
        </aside>
      </section>

      <section id="price" className="container pricing print-hide">
        <div><span>SIMPLU ȘI TRANSPARENT</span><h2>Plătești doar când documentele sunt gata.</h2><p>Completezi și verifici gratuit. Nu există abonament și nu te taxăm pentru fiecare corectură.</p></div>
        <div className="price-card">
          <header><b>{t.full}</b><div><strong>7,99 €</strong><small>{t.once}</small></div></header>
          <ul>{t.benefits.map((item) => <li key={item}><CheckCircle2 size={17}/>{item}</li>)}</ul>
          <button>{t.download}<ArrowRight size={17}/></button>
          <small className="safe"><LockKeyhole size={13}/>{t.safe}</small>
        </div>
      </section>

      <footer className="print-hide"><div className="container"><Logo/><p>Creat pentru românii care vor să lucreze în Germania.</p><span>© 2026 BewerbungRO</span></div></footer>
    </main>
  );
}

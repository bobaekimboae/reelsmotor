import { useEffect, useMemo, useRef, useState } from "react";
import { BufferTarget, CanvasSource, Mp4OutputFormat, Output, Quality } from "mediabunny";

const MAX_PHOTOS = 10;
const MIN_PHOTOS = 3;
const FPS = 24;
const SCENE_SECONDS = 4;
const WIDTH = 720;
const HEIGHT = 1280;
const brandOrange = "#ff8a00";

const copy = {
  title: "영상 만들기",
  subtitle: "사진을 올리고, 정보를 입력하면 바로 게시할 수 있는 릴스가 완성됩니다.",
  steps: ["사진", "정보", "스타일 및 이메일"],
  categories: [
    { id: "car", icon: "🚗", label: "자동차" },
    { id: "property", icon: "🏠", label: "부동산" },
    { id: "product", icon: "📦", label: "상품" },
  ],
};

const moneyOptions = ["GBP", "EUR", "USD", "TRY"];
const currencySymbols = { GBP: "£", EUR: "€", USD: "$", TRY: "₺" };

function LogoMark({ small = false }) {
  return (
    <span className={`logo-mark ${small ? "logo-mark-small" : ""}`} aria-hidden="true">
      <svg viewBox="0 0 24 24" className="logo-triangle">
        <path d="M8 5.5v13l11-6.5z" />
      </svg>
    </span>
  );
}

function Brand({ onClick }) {
  return (
    <a className="brand" href="#/create" onClick={onClick} aria-label="ReelsMotor 홈">
      <LogoMark />
      <span>ReelsMotor</span>
    </a>
  );
}

function WhatsAppButton() {
  return (
    <a
      className="whatsapp-float"
      href="https://wa.me/447520615644?text=Hi!%20I%27d%20like%20to%20know%20more%20about%20ReelsMotor."
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp으로 문의"
    >
      <svg viewBox="0 0 32 32" fill="#fff" aria-hidden="true">
        <path d="M16.04 4C9.93 4 4.98 8.95 4.98 15.06c0 2.13.6 4.12 1.64 5.81L4.5 28l7.3-2.06a11 11 0 0 0 4.24.85h.01c6.11 0 11.06-4.95 11.06-11.06C27.11 8.95 22.15 4 16.04 4Zm6.49 15.77c-.27.77-1.58 1.47-2.18 1.52-.58.05-1.12.26-3.76-.79-3.18-1.25-5.2-4.5-5.36-4.71-.16-.21-1.28-1.7-1.28-3.24s.81-2.3 1.1-2.62c.27-.3.59-.37.79-.37.2 0 .39 0 .56.01.18.01.42-.07.66.5.27.65.92 2.25 1 2.41.08.16.13.35.03.56-.1.21-.16.35-.31.53-.16.18-.33.41-.47.55-.16.16-.32.33-.14.65.18.32.79 1.3 1.69 2.11 1.16 1.03 2.13 1.35 2.46 1.51.32.16.51.13.7-.08.2-.21.81-.94 1.03-1.27.21-.32.43-.27.72-.16.29.11 1.85.87 2.17 1.03.32.16.53.24.61.37.08.13.08.77-.19 1.55Z" />
      </svg>
    </a>
  );
}

function Header({ page, navigate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => setMenuOpen(false), [page]);
  const go = (next) => {
    setMenuOpen(false);
    navigate(next);
  };
  return (
    <header className="site-header">
      <div className="header-inner">
        <Brand onClick={(e) => { e.preventDefault(); go("create"); }} />
        <nav className="desktop-nav" aria-label="주 메뉴">
          <a href="#/pricing" onClick={(e) => { e.preventDefault(); go("pricing"); }}>요금제</a>
          <a href="#/signin" onClick={(e) => { e.preventDefault(); go("signin"); }}>대시보드</a>
          <a className="signin-link" href="#/signin" onClick={(e) => { e.preventDefault(); go("signin"); }}>로그인</a>
          <a className="header-cta" href="#/create" onClick={(e) => { e.preventDefault(); go("create"); }}>무료 영상 만들기</a>
        </nav>
        <a className="mobile-cta" href="#/create" onClick={(e) => { e.preventDefault(); go("create"); }}>무료 영상 만들기</a>
        <button className="menu-toggle" type="button" aria-label={menuOpen ? "메뉴 닫기" : "메뉴"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <span className="close-mark">×</span> : <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>}
        </button>
      </div>
      {menuOpen && <div className="mobile-menu"><a href="#/pricing" onClick={(e) => { e.preventDefault(); go("pricing"); }}>요금제</a><a href="#/signin" onClick={(e) => { e.preventDefault(); go("signin"); }}>대시보드</a><a href="#/signin" onClick={(e) => { e.preventDefault(); go("signin"); }}>로그인</a></div>}
    </header>
  );
}

function Stepper({ step }) {
  return <ol className="stepper" aria-label="제작 단계">{copy.steps.map((name, i) => {
    const number = i + 1;
    return <li className={`step-item ${number <= step ? "step-done" : ""} ${number === step ? "step-current" : ""}`} key={name}>
      <span className="step-circle">{number < step ? "✓" : number}</span>
      {number < 3 && <span className="step-line" />}
      <span className="step-label">{name}</span>
    </li>;
  })}</ol>;
}

function CreatePage({ navigate }) {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState("car");
  const [photos, setPhotos] = useState([]);
  const [details, setDetails] = useState({ make: "", model: "", year: "", mileage: "", mileageUnit: "mi", gearbox: "", fuel: "", price: "", currency: "GBP", dealer: "" });
  const [style, setStyle] = useState("Bold");
  const [phone, setPhone] = useState("");
  const [brandColor, setBrandColor] = useState("#6366f1");
  const [logo, setLogo] = useState(null);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoBlob, setVideoBlob] = useState(null);
  const [complete, setComplete] = useState(false);
  const photoInput = useRef(null);
  const logoInput = useRef(null);

  useEffect(() => () => {
    photos.forEach((photo) => URL.revokeObjectURL(photo.url));
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    if (logo?.url) URL.revokeObjectURL(logo.url);
  }, []);

  const priceText = useMemo(() => details.price ? `${currencySymbols[details.currency]}${Number(details.price).toLocaleString("en-GB")}` : "문의", [details.price, details.currency]);

  function addPhotos(fileList) {
    const selected = [...fileList];
    const images = selected.filter((file) => file.type.startsWith("image/"));
    if (images.length !== selected.length) setError("이미지 파일만 추가할 수 있습니다.");
    const next = images.slice(0, MAX_PHOTOS - photos.length).map((file) => ({ file, url: URL.createObjectURL(file), name: file.name }));
    setPhotos((current) => [...current, ...next]);
    if (images.length > next.length) setError(`사진은 최대 ${MAX_PHOTOS}장까지 추가할 수 있습니다.`);
    else if (images.length) setError("");
    if (photoInput.current) photoInput.current.value = "";
  }

  function removePhoto(index) {
    setPhotos((current) => {
      URL.revokeObjectURL(current[index]?.url);
      return current.filter((_, i) => i !== index);
    });
  }

  function updateDetail(key, value) {
    setDetails((current) => ({ ...current, [key]: value }));
    if (error) setError("");
  }

  async function startGeneration(event) {
    event.preventDefault();
    if (photos.length < MIN_PHOTOS) { setError(`사진을 최소 ${MIN_PHOTOS}장 추가해 주세요.`); setStep(1); return; }
    if (!details.make.trim() || !details.model.trim() || !details.year.trim()) { setError("필수 차량 정보를 입력해 주세요."); setStep(2); return; }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("올바른 이메일 주소를 입력해 주세요."); return; }
    setError(""); setBusy(true); setProgress(0);
    try {
      const video = await renderListingVideo({ photos, details, category, style, phone, brandColor, logo, onProgress: setProgress });
      const url = URL.createObjectURL(video);
      setVideoBlob(video); setVideoUrl(url); setComplete(true);
    } catch (err) {
      setError(err?.message || "이 기기에서 MP4 영상을 만들지 못했습니다. Chrome 또는 Edge 최신 버전에서 다시 시도해 주세요.");
    } finally { setBusy(false); }
  }

  function reset() {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    photos.forEach((photo) => URL.revokeObjectURL(photo.url));
    if (logo?.url) URL.revokeObjectURL(logo.url);
    setStep(1); setCategory("car"); setPhotos([]); setDetails({ make: "", model: "", year: "", mileage: "", mileageUnit: "mi", gearbox: "", fuel: "", price: "", currency: "GBP", dealer: "" }); setStyle("Bold"); setPhone(""); setBrandColor("#6366f1"); setLogo(null); setEmail(""); setError(""); setProgress(0); setComplete(false); setVideoBlob(null); setVideoUrl("");
  }

  const title = details.make && details.model ? `${details.make} ${details.model}` : category === "car" ? "Premium car" : category === "property" ? "Featured listing" : "Featured product";
  const currentFileName = `${(details.make || "reelsmotor").toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${(details.model || "reel").toLowerCase().replace(/[^a-z0-9]+/g, "-")}.mp4`;

  if (complete && videoUrl) return <main className="result-page">
    <h1>내 영상</h1>
    <p className="success-text">영상이 준비되었습니다!</p>
    <div className="video-preview"><video src={videoUrl} controls playsInline preload="metadata" aria-label="완성된 세로 영상 미리보기" /></div>
    <a className="button-primary download-button" href={videoUrl} download={currentFileName}>MP4 다운로드</a>
    <button type="button" className="button-secondary another-button" onClick={reset}>새 영상 만들기</button>
    <section className="publish-card"><h2>영상 게시</h2><p>Instagram, TikTok, YouTube, Facebook 계정을 연결해 게시할 수 있습니다.</p><button type="button" className="button-primary compact" onClick={() => navigate("signin")}>계정 연결</button></section>
    <section className="watermark-card"><h2>ReelsMotor 워터마크</h2><p>이 브라우저 버전은 영상에 ReelsMotor 워터마크를 표시합니다. 로고와 전화번호를 포함한 브랜드 키트는 영상에 반영됩니다.</p><ul><li>세 가지 영상 스타일</li><li>로고, 전화번호 및 브랜드 색상</li><li>영상 파일은 이 브라우저에서 생성됩니다</li></ul><a href="#/pricing" onClick={(e) => { e.preventDefault(); navigate("pricing"); }}>요금제 보기 →</a></section>
  </main>;

  return <main className="create-page">
    <div className="page-intro"><h1>{copy.title}</h1><p>{copy.subtitle}</p></div>
    <Stepper step={step} />

    {step === 1 && <section className="wizard-panel">
      <div className="category-grid">{copy.categories.map((item) => <button key={item.id} type="button" className={`category-card ${category === item.id ? "selected" : ""}`} onClick={() => setCategory(item.id)}><span>{item.icon}</span><strong>{item.label}</strong></button>)}</div>
      <div className="photo-heading"><strong>사진</strong><span>({photos.length}/{MAX_PHOTOS})</span></div>
      <p className="field-help">사진을 3–10장 추가하세요. 첫 사진이 영상의 시작 장면이 됩니다.</p>
      <div className="photo-grid">
        {photos.map((photo, index) => <div className="photo-tile" key={`${photo.name}-${index}-${photo.url}`}><img src={photo.url} alt={`차량 사진 ${index + 1}`} /><span className="photo-index">{index + 1}</span><button className="remove-photo" type="button" onClick={() => removePhoto(index)} aria-label={`사진 ${index + 1} 삭제`}>삭제</button></div>)}
        {photos.length < MAX_PHOTOS && <button className="upload-tile" type="button" onClick={() => photoInput.current?.click()}><span className="upload-plus">+</span><span>사진 추가</span><input ref={photoInput} type="file" accept="image/*" multiple hidden onChange={(event) => addPhotos(event.target.files || [])} /></button>}
      </div>
      <div className="step-actions"><span className="step-action-spacer" /><button className="button-primary" type="button" onClick={() => { if (photos.length < MIN_PHOTOS) setError(`사진을 최소 ${MIN_PHOTOS}장 추가해 주세요.`); else { setError(""); setStep(2); } }}>계속 <span aria-hidden="true">→</span></button></div>
    </section>}

    {step === 2 && <form className="wizard-panel details-form" onSubmit={(e) => { e.preventDefault(); if (!details.make.trim() || !details.model.trim() || !details.year.trim()) { setError("필수 차량 정보를 입력해 주세요."); return; } setError(""); setStep(3); }}>
      <label className="field"><span>제조사 <b>*</b></span><input autoComplete="off" value={details.make} onChange={(e) => updateDetail("make", e.target.value)} /></label>
      <label className="field"><span>모델명 <b>*</b></span><input autoComplete="off" value={details.model} onChange={(e) => updateDetail("model", e.target.value)} /></label>
      <label className="field"><span>연식 <b>*</b></span><input inputMode="numeric" value={details.year} onChange={(e) => updateDetail("year", e.target.value)} /></label>
      <label className="field"><span>주행거리</span><div className="inline-field"><input inputMode="numeric" value={details.mileage} onChange={(e) => updateDetail("mileage", e.target.value)} /><select value={details.mileageUnit} onChange={(e) => updateDetail("mileageUnit", e.target.value)}><option value="mi">mi</option><option value="km">km</option></select></div></label>
      <label className="field"><span>변속기</span><select value={details.gearbox} onChange={(e) => updateDetail("gearbox", e.target.value)}><option value="">선택</option><option>자동</option><option>수동</option></select></label>
      <label className="field"><span>연료</span><select value={details.fuel} onChange={(e) => updateDetail("fuel", e.target.value)}><option value="">선택</option><option>휘발유</option><option>경유</option><option>하이브리드</option><option>전기</option></select></label>
      <label className="field"><span>가격</span><div className="inline-field price-field"><input inputMode="decimal" value={details.price} onChange={(e) => updateDetail("price", e.target.value.replace(/[^\d.]/g, ""))} /><select value={details.currency} onChange={(e) => updateDetail("currency", e.target.value)}>{moneyOptions.map((currency) => <option key={currency}>{currency}</option>)}</select></div></label>
      <label className="field dealer-field"><span>상호명 (영상에 표시)</span><input value={details.dealer} onChange={(e) => updateDetail("dealer", e.target.value)} /></label>
      <div className="step-actions"><button className="button-secondary" type="button" onClick={() => { setError(""); setStep(1); }}>← 뒤로</button><button className="button-primary" type="submit">계속 <span aria-hidden="true">→</span></button></div>
    </form>}

    {step === 3 && <form className="wizard-panel style-form" onSubmit={startGeneration}>
      <div className="style-label">영상 스타일</div>
      <div className="style-grid">{["Bold", "Clean", "Dynamic"].map((option) => <button key={option} type="button" className={`style-card ${style === option ? "selected" : ""}`} onClick={() => setStyle(option)}><span className={`style-preview style-${option.toLowerCase()}`}><span>{option === "Bold" ? "새로 입고된 차량" : option === "Clean" ? "달릴 준비가 된 차" : "다음 드라이브"}</span></span><strong>{option === "Bold" ? "볼드" : option === "Clean" ? "클린" : "다이내믹"}</strong></button>)}</div>
      <section className="brand-kit"><h2>브랜드 키트</h2><p>선택 사항 — 로고, 전화번호, 브랜드 색상을 추가하면 영상에 표시됩니다.</p><label className="field logo-field"><span>로고</span><button className="button-secondary upload-logo" type="button" onClick={() => logoInput.current?.click()}>{logo ? "로고 변경" : "로고 업로드"}</button><input ref={logoInput} type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" hidden onChange={(e) => { const file = e.target.files?.[0]; if (file) setLogo({ file, url: URL.createObjectURL(file) }); }} />{logo && <span className="logo-name">{logo.file.name}</span>}</label>
        <div className="brand-fields"><label className="field"><span>전화번호</span><input type="tel" placeholder="010-0000-0000" value={phone} onChange={(e) => setPhone(e.target.value)} /></label><label className="field color-field"><span>브랜드 색상</span><input type="color" value={brandColor} onChange={(e) => setBrandColor(e.target.value)} /></label></div>
      </section>
      <label className="field email-field"><span>이메일 <b>*</b></span><input type="email" autoComplete="email" required value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} /><small>이 버전은 이메일을 저장하거나 전송하지 않습니다. 완성된 MP4를 이 화면에서 확인하고 다운로드할 수 있습니다.</small></label>
      {busy && <div className="progress-wrap"><div className="progress-line"><span style={{ width: `${progress}%` }} /></div><span>세로 영상을 만드는 중입니다… {progress}%</span></div>}
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="step-actions"><button className="button-secondary" type="button" disabled={busy} onClick={() => { setError(""); setStep(2); }}>← 뒤로</button><button className="button-primary" type="submit" disabled={busy}>{busy ? "영상 생성 중…" : "내 영상 만들기"}</button></div>
      <p className="generation-note">영상은 9:16 세로형 MP4로 이 브라우저에서 생성됩니다.</p>
    </form>}

    {error && step < 3 && <p className="form-error form-error-outside" role="alert">{error}</p>}
  </main>;
}

function drawCover(ctx, image, t, slideProgress, style, index, total, details, phone, color, logoBitmap) {
  const w = WIDTH, h = HEIGHT;
  const zoom = 1.04 + 0.09 * slideProgress;
  const iw = image.width, ih = image.height;
  const scale = Math.max(w / iw, h / ih) * zoom;
  const dw = iw * scale, dh = ih * scale;
  const shift = Math.sin(slideProgress * Math.PI) * 20;
  ctx.fillStyle = "#090b10"; ctx.fillRect(0, 0, w, h);
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, w, h); ctx.clip(); ctx.drawImage(image, (w - dw) / 2 + shift, (h - dh) / 2, dw, dh); ctx.restore();
  const shade = ctx.createLinearGradient(0, 350, 0, h); shade.addColorStop(0, "rgba(5,6,9,0.02)"); shade.addColorStop(0.43, "rgba(5,6,9,0.16)"); shade.addColorStop(1, "rgba(5,6,9,0.96)"); ctx.fillStyle = shade; ctx.fillRect(0, 0, w, h);
  const accent = style === "Clean" ? "#f4f4f5" : color;
  ctx.fillStyle = accent; ctx.globalAlpha = 0.94; roundRect(ctx, 42, 52, 48, 48, 14); ctx.globalAlpha = 1;
  ctx.fillStyle = "#14100a"; ctx.beginPath(); ctx.moveTo(61, 64); ctx.lineTo(61, 89); ctx.lineTo(79, 76.5); ctx.closePath(); ctx.fill();
  ctx.fillStyle = "#fff"; ctx.font = "700 27px 'Bricolage Grotesque', sans-serif"; ctx.fillText(details.dealer || "ReelsMotor", 106, 85);
  ctx.fillStyle = accent; ctx.font = "600 18px 'Instrument Sans', sans-serif"; ctx.fillText(`${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`, w - 112, 82);
  if (logoBitmap) ctx.drawImage(logoBitmap, w - 116, 112, 74, 74);
  const title = `${details.make} ${details.model}`.trim() || "Premium listing";
  const yearText = [details.year, details.mileage ? `${Number(details.mileage).toLocaleString("en-GB")} ${details.mileageUnit}` : "", details.gearbox, details.fuel].filter(Boolean).join("  ·  ");
  const titleSize = style === "Bold" ? 64 : style === "Dynamic" ? 58 : 54;
  ctx.fillStyle = style === "Dynamic" ? accent : "#fff"; ctx.font = `800 ${titleSize}px 'Bricolage Grotesque', sans-serif`;
  wrapText(ctx, title.toUpperCase(), 48, 870, w - 96, 76, 2);
  ctx.fillStyle = "rgba(255,255,255,.77)"; ctx.font = "500 26px 'Instrument Sans', sans-serif"; wrapText(ctx, yearText || "준비된 차량을 만나보세요", 50, 1042, w - 100, 38, 2);
  ctx.fillStyle = "#fff"; ctx.font = "700 50px 'Bricolage Grotesque', sans-serif"; ctx.fillText(details.price ? `${currencySymbols[details.currency]}${Number(details.price).toLocaleString("en-GB")}` : "문의하기", 50, 1168);
  if (phone) { ctx.fillStyle = "rgba(255,255,255,.76)"; ctx.font = "500 22px 'Instrument Sans', sans-serif"; ctx.fillText(phone, 52, 1214); }
  if (style !== "Clean") { ctx.save(); ctx.translate(w * 0.55, h * 0.53); ctx.rotate(-0.55); ctx.fillStyle = "rgba(255,255,255,.14)"; ctx.font = "700 19px 'Instrument Sans', sans-serif"; for (let x = -900; x < 900; x += 270) for (let y = -1500; y < 1500; y += 180) ctx.fillText("ReelsMotor에서 제작", x, y); ctx.restore(); }
  if (style === "Dynamic") { ctx.fillStyle = accent; ctx.beginPath(); ctx.moveTo(w - 118, 852); ctx.lineTo(w, 765); ctx.lineTo(w, 942); ctx.closePath(); ctx.fill(); }
  ctx.fillStyle = "rgba(255,255,255,.85)"; ctx.font = "600 17px 'Instrument Sans', sans-serif"; ctx.fillText("REELSMOTOR.COM", 50, 1250);
  return t;
}

function roundRect(ctx, x, y, width, height, radius) { ctx.beginPath(); ctx.roundRect(x, y, width, height, radius); ctx.fill(); }
function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines) { const words = text.split(" "); let line = "", count = 0; for (const word of words) { const test = line ? `${line} ${word}` : word; if (ctx.measureText(test).width > maxWidth && line) { ctx.fillText(line, x, y + count * lineHeight); line = word; count += 1; if (count >= maxLines) break; } else line = test; } if (line && count < maxLines) ctx.fillText(line, x, y + count * lineHeight); }

async function renderListingVideo({ photos, details, category, style, phone, brandColor, logo, onProgress }) {
  if (typeof VideoEncoder === "undefined") throw new Error("이 브라우저는 MP4 영상 인코딩을 지원하지 않습니다. 최신 Chrome 또는 Edge에서 이용해 주세요.");
  const bitmaps = await Promise.all(photos.map(({ file }) => createImageBitmap(file)));
  let logoBitmap = null;
  if (logo?.file) { try { logoBitmap = await createImageBitmap(logo.file); } catch { logoBitmap = null; } }
  const canvas = document.createElement("canvas"); canvas.width = WIDTH; canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
  const target = new BufferTarget();
  const output = new Output({ format: new Mp4OutputFormat(), target });
  const source = new CanvasSource(canvas, { codec: "avc", quality: new Quality("high"), latencyMode: "quality" });
  output.addVideoTrack(source, { frameRate: FPS });
  await output.start();
  const framesPerScene = SCENE_SECONDS * FPS;
  const totalFrames = photos.length * framesPerScene;
  try {
    for (let frame = 0; frame < totalFrames; frame += 1) {
      const sceneIndex = Math.min(photos.length - 1, Math.floor(frame / framesPerScene));
      const sceneFrame = frame % framesPerScene;
      drawCover(ctx, bitmaps[sceneIndex], frame / FPS, sceneFrame / framesPerScene, style, sceneIndex, photos.length, details, phone, brandColor, logoBitmap);
      await source.add(frame / FPS, 1 / FPS);
      if (frame % 12 === 0 || frame === totalFrames - 1) {
        onProgress(Math.round(((frame + 1) / totalFrames) * 96));
        await new Promise((resolve) => requestAnimationFrame(() => resolve()));
      }
    }
    source.close();
    await output.finalize();
  } catch (err) {
    source.close();
    throw err;
  } finally {
    bitmaps.forEach((bitmap) => bitmap.close());
    logoBitmap?.close();
  }
  if (!target.buffer) throw new Error("MP4 파일을 만들지 못했습니다. 다른 브라우저에서 다시 시도해 주세요.");
  onProgress(100);
  return new Blob([target.buffer], { type: "video/mp4" });
}

function PricingPage({ navigate }) {
  const plans = [
    { name: "스타터", price: "£29", note: "주마다 차량 몇 대를 게시하는 개인 판매자에게 적합합니다.", count: "월 30개 영상" },
    { name: "프로", price: "£79", note: "매일 게시하는 바쁜 딜러와 에이전시를 위한 플랜입니다.", count: "월 150개 영상", popular: true },
    { name: "무제한", price: "£199", note: "그룹과 대량 운영에 적합합니다.", count: "영상 무제한" },
  ];
  const features = (count) => [count, "Instagram·TikTok·YouTube·Facebook 자동 게시", "워터마크 없음", "세 가지 영상 스타일", "로고·전화번호·브랜드 색상", "번호판 흐림 처리", "이메일 지원"];
  return <><main className="pricing-page"><div className="pricing-intro"><h1>간편한 요금제</h1><p>첫 영상은 무료입니다. 언제든 해지할 수 있습니다.</p></div><div className="plan-grid">{plans.map((plan) => <article className={`plan-card ${plan.popular ? "popular" : ""}`} key={plan.name}>{plan.popular && <span className="popular-badge">가장 인기</span>}<h2>{plan.name}</h2><div className="plan-price">{plan.price}<span>/월</span></div><p className="plan-note">{plan.note}</p><ul>{features(plan.count).map((feature) => <li key={feature}><span>✓</span>{feature}</li>)}</ul><button className={`plan-button ${plan.popular ? "button-primary" : "button-secondary"}`} type="button" onClick={() => navigate("signin")}>시작하기</button></article>)}</div></main><Footer navigate={navigate} /></>;
}

function SignInPage() {
  const [email, setEmail] = useState(""); const [message, setMessage] = useState("");
  return <main className="signin-page"><h1>로그인</h1><p>이메일로 일회용 로그인 링크를 보내드립니다.</p><form onSubmit={(e) => { e.preventDefault(); setMessage("로그인 이메일 발송은 계정 서버 연결 후 사용할 수 있습니다."); }}><label className="field"><span>이메일 주소</span><input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label><button className="button-primary" type="submit">로그인 링크 보내기</button>{message && <p className="form-error" role="status">{message}</p>}<p className="generation-note">영상 제작은 로그인 없이 이용할 수 있습니다.</p></form></main>;
}

function Footer({ navigate }) {
  return <footer className="site-footer"><div className="footer-main"><div className="footer-brand"><Brand onClick={(e) => { e.preventDefault(); navigate("create"); }} /><p>딜러와 판매자를 위한 AI 매물 영상.<br />몇 분 안에 만들고, 브랜드를 입혀 게시하세요.</p></div><div><h3>제품</h3><a href="#/create" onClick={(e) => { e.preventDefault(); navigate("create"); }}>무료 영상 만들기</a><a href="#/pricing" onClick={(e) => { e.preventDefault(); navigate("pricing"); }}>요금제</a><a href="#/signin" onClick={(e) => { e.preventDefault(); navigate("signin"); }}>대시보드</a></div><div><h3>문의</h3><a href="https://wa.me/447520615644" target="_blank" rel="noreferrer">WhatsApp</a><a href="mailto:info@reelsmotor.com">info@reelsmotor.com</a><a href="https://instagram.com/reelsmotorai" target="_blank" rel="noreferrer">Instagram</a></div></div><div className="footer-bottom">🇬🇧 영국 등록 회사 · © 2026 ReelsMotor. 모든 권리 보유.</div></footer>;
}

export function App() {
  const [page, setPage] = useState(() => window.location.hash.replace(/^#\/?/, "") || "create");
  const navigate = (next) => { setPage(next); window.location.hash = `/${next}`; window.scrollTo({ top: 0, behavior: "instant" }); };
  useEffect(() => { const onHash = () => setPage(window.location.hash.replace(/^#\/?/, "") || "create"); window.addEventListener("hashchange", onHash); return () => window.removeEventListener("hashchange", onHash); }, []);
  useEffect(() => { document.title = `${page === "pricing" ? "요금제" : page === "signin" ? "로그인" : "중고차 영상 만들기"} | ReelsMotor`; }, [page]);
  return <div className="app-shell"><Header page={page} navigate={navigate} />{page === "pricing" ? <PricingPage navigate={navigate} /> : page === "signin" || page === "dashboard" ? <SignInPage /> : <CreatePage navigate={navigate} />}<WhatsAppButton /></div>;
}

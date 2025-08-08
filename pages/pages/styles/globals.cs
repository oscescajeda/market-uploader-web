:root { --bg:#ffffff; --text:#111; --muted:#666; --card:#f7f7f7; --border:#e5e5e5; }
*{box-sizing:border-box}
html,body{padding:0;margin:0;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif;background:var(--bg);color:var(--text)}
a{color:inherit;text-decoration:none}
.container{max-width:1100px;margin:0 auto;padding:24px}
.header{display:flex;gap:16px;align-items:center;justify-content:space-between;margin-bottom:20px}
h1{font-size:28px;margin:0}
.small{color:var(--muted);font-size:13px}
.row{display:flex;flex-wrap:wrap;gap:16px}
.card{background:#fff;border:1px solid var(--border);border-radius:14px;box-shadow:0 2px 8px rgba(0,0,0,.04)}
.card.padded{padding:16px}
.grid{display:grid;grid-template-columns:1fr;gap:16px}
@media(min-width:900px){ .grid{grid-template-columns:1fr 1fr} }
.input, .textarea, .select, .button{width:100%;padding:10px 12px;border:1px solid var(--border);border-radius:10px;font-size:14px}
.textarea{min-height:80px;resize:vertical}
.button{background:#111;color:#fff;border-color:#111;cursor:pointer}
.button.secondary{background:#fff;color:#111;border:1px solid #111}
.button.danger{background:#b00020;border-color:#b00020;color:#fff}
.button:disabled{opacity:.6;cursor:not-allowed}
.actions{display:flex;gap:8px;flex-wrap:wrap}
.gallery{display:grid;grid-template-columns:1fr;gap:16px}
@media(min-width:750px){ .gallery{grid-template-columns:1fr 1fr} }
@media(min-width:1100px){ .gallery{grid-template-columns:1fr 1fr 1fr} }
.aspect-video{position:relative;width:100%;padding-top:56%}
.aspect-video>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-top-left-radius:14px;border-top-right-radius:14px}
.meta{padding:12px 16px 16px}
.meta h3{margin:6px 0 2px 0}
.kv{display:grid;grid-template-columns:140px 1fr;gap:4px 8px;font-size:14px}
.taglist{display:flex;flex-wrap:wrap;gap:6px;margin-top:4px}
.tag{background:var(--card);border:1px solid var(--border);padding:4px 8px;border-radius:999px;font-size:12px}
.toolbar{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0}
.search{position:relative;flex:1}
.search input{padding-left:36px}
.search .icon{position:absolute;left:10px;top:50%;transform:translateY(-50%);opacity:.5}
hr{border:none;border-top:1px solid var(--border);margin:12px 0}
.footer{margin-top:28px;color:var(--muted);font-size:12px;text-align:center}

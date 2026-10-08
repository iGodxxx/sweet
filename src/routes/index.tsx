import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PurchaseToast } from "@/components/PurchaseToast";
import "../styles/landing.css";

const BASICO_BTN = "https://brandwise.mycartpanda.com/checkout/205918622:1";
const COMBO_BTN = "https://brandwise.mycartpanda.com/checkout/205925252:1?cid=46409324103&utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=";
const FINAL_BTN = "https://brandwise.mycartpanda.com/checkout/205925252:1?cid=54584637199&utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=";
const MODAL_ACEITAR = "https://brandwise.mycartpanda.com/checkout/205925252:1?cid=91867791475&utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=";
const MODAL_RECUSAR = "https://brandwise.mycartpanda.com/checkout/205918622:1?cid=61479004404&utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=";
const trackingKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "gclid", "src", "sck"];

const materials = [
  ["https://iili.io/CiIrzmX.md.png", "Projeto — Luzes de cordão de queijo suíço"],
  ["https://iili.io/CiIrxet.md.png", "Projeto — Lanterna de papel"],
  ["https://iili.io/CiIro7I.md.png", "Lista de materiais — Carrinho Nitro"],
  ["https://iili.io/CiIrc22.md.png", "Passo a passo — Lixeira Jacaré"],
  ["https://iili.io/CiIr0k7.md.png", "Experimento — Pote do céu e pôr do sol"],
  ["https://iili.io/CiIr1p9.md.png", "Projeto — Barco solar"],
  ["https://iili.io/CiIrGIe.md.png", "Experimento — Foguete efervescente"],
  ["https://iili.io/CiIrN2V.md.png", "Passo a passo — Tabuleiro de jogo"],
  ["https://iili.io/CiIr4Ev.md.png", "Passo a passo — Mão mecânica"],
  ["https://iili.io/CiIrsYN.md.png", "Projeto — Montanha-russa de canudo"],
  ["https://iili.io/CiIrtTX.md.png", "Por dentro do kit"],
];
const projects = [
  ["proj-robo-aranha.jpg", "Robô-aranha com palitos e motor"],
  ["proj-carrinho-robotico.jpg", "Carrinho robótico movido a pilha"],
  ["proj-barco-solar.jpg", "Barco a energia solar"],
  ["proj-maquina-desenhar.jpg", "Máquina giratória de desenhar"],
  ["proj-binoculo.jpg", "Binóculo reciclado de papelão"],
  ["proj-slime.jpg", "Experimento científico: slime arco-íris"],
  ["proj-leaozinho.jpg", "Leãozinho de prato reciclado"],
  ["proj-densidade-cores.jpg", "Experimento de densidade e cores"],
  ["proj-pistola-agua.jpg", "Pistola d'água de garrafa PET"],
];
const testimonials = [["wpp-aline.jpg", "Aline"], ["wpp-patricia.jpg", "Patrícia"], ["wpp-camila.jpg", "Camila"], ["wpp-juliana.jpg", "Juliana"], ["wpp-mariana.jpg", "Mariana"], ["wpp-renata.jpg", "Renata"]];
const questions = [
  ["É um produto físico ou digital?", "100% digital. Você recebe por e-mail logo após a confirmação do pagamento — sem espera de entrega, sem frete."],
  ["Preciso comprar materiais especiais?", "A maior parte é material simples que você já tem em casa: papelão, palitos, fita, potes. Os projetos de robótica usam também alguns componentes eletrônicos básicos (motor, pilha, fios) — fáceis de achar em loja de eletrônica ou online, com custo baixo."],
  ["Para qual idade é indicado?", "De 4 a 12 anos. As atividades são adaptadas por faixa etária, então dá pra usar com mais de um filho."],
  ["Como recebo o acesso depois de comprar?", "Imediatamente por e-mail, com acesso vitalício. Você pode imprimir quantas vezes quiser, quando quiser."],
  ["E se meu filho não gostar?", "Você tem 7 dias de garantia incondicional. Não gostou por qualquer motivo, devolvemos 100% do valor, sem perguntas."],
  ["Funciona em qual dispositivo?", "Você acessa e imprime de computador, tablet ou celular — o que for mais prático no seu dia a dia."],
];

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Inventores Mirins — Kit Completo de Criatividade Infantil" },
    { name: "description", content: "Troque as horas de tela por horas criando. Robótica, ciência, reciclagem e artesanato para crianças de 4 a 12 anos." },
    { property: "og:title", content: "Inventores Mirins — Kit de Robótica e Criatividade Infantil" },
    { property: "og:description", content: "Troque as horas de tela por horas criando. Robótica, ciência, reciclagem e artesanato para crianças de 4 a 12 anos." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

function Marquee({ items, kind }: { items: string[][]; kind: "material" | "project" | "testimonial" }) {
  const cardClass = kind === "material" ? "material-card" : kind === "project" ? "proj-card" : "wpp-card";
  const trackClass = kind === "material" ? "material-track" : kind === "project" ? "project-track" : "testimonial-track";
  return <div className="marquee-wrap"><div className={`marquee-track ${trackClass}`}>
    {[...items, ...items].map(([file, caption], i) => <div className={cardClass} key={`${file}-${i}`} aria-hidden={i >= items.length ? true : undefined}>
      <img src={file?.startsWith("http") ? file : `/images/${file ?? ""}`} alt={kind === "testimonial" ? `Depoimento ${caption}` : caption} />
      <div className={kind === "testimonial" ? "wpp-name" : "cap"}>{caption}</div>
    </div>)}
  </div></div>;
}

function Index() {
  const [modalOpen, setModalOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [tracking, setTracking] = useState("");
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tracked = new URLSearchParams();
    trackingKeys.forEach(key => { const value = params.get(key); if (value !== null) tracked.append(key, value); });
    setTracking(tracked.toString());
  }, []);
  const checkout = (url: string) => tracking ? `${url}${url.includes("?") ? "&" : "?"}${tracking}` : url;
  const closeToBasic = () => { setModalOpen(false); window.location.assign(checkout(BASICO_BTN)); };
  useEffect(() => {
    if (!modalOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [modalOpen]);
  return <main className="landing">
    <PurchaseToast />
    <nav className="topnav"><div className="topnav-inner"><div className="brand"><img src="/images/mascote.jpg" alt="Inventores Mirins" /><span>Inventores Mirins</span></div><a href="#oferta" className="nav-cta">Quero o Kit →</a></div></nav>
    <header className="hero"><div className="blob-a"/><div className="blob-b"/><div className="hero-inner">
      <img className="mascote" src="/images/mascote.jpg" alt="Mascote Inventores Mirins" />
      <span className="eyebrow gold">🔩 Kit Completo de Criatividade Infantil</span>
      <h1>Seu filho <span className="hl">larga o celular sozinho</span> — quando tem algo mais incrível para criar</h1>
      <p className="sub">Robótica, ciência, reciclagem e artesanato para crianças de 4 a 12 anos. Com materiais que você já tem em casa. Sem tela, sem complicação.</p>
      <div className="price-chip">A partir de <strong>R$ 17,90</strong> · pagamento único</div>
      <div><a href="#materiais" className="btn">Quero conhecer os materiais da Inventores Mirins →</a></div>
      <p className="trust">🔒 Acesso imediato · Garantia de 7 dias · Pagamento seguro</p>
      <div className="hero-stats"><div><span className="n">140K+</span><span className="l">Seguidores</span></div><div><span className="n">4 em 1</span><span className="l">Kits no combo</span></div><div><span className="n">4–12</span><span className="l">Anos de idade</span></div><div><span className="n">100%</span><span className="l">Digital</span></div></div>
    </div></header>
    <section id="materiais"><div className="inner center"><span className="eyebrow good">📖 Por dentro do kit</span><h2>Veja os materiais e o passo a passo por dentro do kit</h2><p className="lede center">Cada projeto vem em páginas como estas — lista de materiais, passo a passo com fotos reais e nível de dificuldade. Simples de seguir, bonito de olhar.</p></div><Marquee items={materials} kind="material" /></section>
    <section className="gallery"><div className="inner center"><span className="eyebrow good">✨ Projetos reais de quem já está criando</span><h2>Isso é o que seu filho vai criar</h2><p className="lede center">Fotos reais de crianças com os projetos do kit — sem estúdio, sem produção. É exatamente isso que chega até você.</p></div><Marquee items={projects} kind="project" /><p className="proj-note">Cada kit vem com dezenas de projetos como esses — bastam materiais que você já tem em casa.</p></section>
    <section className="why"><div className="inner"><span className="eyebrow warn">⚠️ Por que isso importa</span><h2>Não é falta de paciência sua — é falta de alternativa</h2><p className="lede">Se algum desses momentos parece familiar, saiba: faltava uma alternativa boa o suficiente para competir com a tela.</p><div className="pain-list">
      <div className="pain"><span className="ic">😤</span><span className="t">Sua criança <strong>chora ou faz birra</strong> toda vez que você tenta tirar o tablet ou celular das mãos dela</span></div>
      <div className="pain"><span className="ic">🙈</span><span className="t">Você já se sentiu <strong>culpada</strong> por dar o celular "só pra ter cinco minutos de paz"</span></div>
      <div className="pain"><span className="ic">🎮</span><span className="t">Seu filho <strong>não consegue se entreter sozinho</strong> por 10 minutos sem uma tela</span></div>
    </div><div className="stat-callout">💡 Crianças brasileiras passam em média <strong>4h+ por dia em telas</strong> — o quádruplo do recomendado pela OMS. A boa notícia? <strong>Isso muda quando existe uma alternativa mais interessante.</strong></div></div></section>
    <section className="offer" id="oferta"><div className="inner"><span className="eyebrow orange">🎟️ Oferta especial de lançamento</span><h2>Escolha o kit ideal para o seu filho</h2><p className="lede">Pagamento único, acesso vitalício, sem mensalidade. No combo, você vê exatamente quanto está economizando.</p>
      <div className="offer-grid">
        <div className="offer-card basic-card"><div className="offer-body"><span className="plan-badge">Básico</span><div className="offer-name">Kit Robótica Mirim</div><div className="offer-tag">Só uma amostra: 20 projetos de robótica</div><div className="offer-price-wrap first-price"><div className="offer-por">R$ 17,90</div><div className="offer-desc">pagamento único · acesso vitalício</div></div><ul className="offer-items"><li><span className="ic">○</span>20 Projetos Robóticos (Guia Digital)</li><li><span className="ic">○</span>Acesso vitalício</li></ul><div className="warn-box">⚠️ Só o kit de Robótica. Sem reciclagem, sem ciência, sem artesanato. Sem os 3 bônus.</div><div className="offer-price-wrap"><Button type="button" variant="ghost" className="btn block gray" data-href={checkout(BASICO_BTN)} onClick={() => setModalOpen(true)}>Quero o Básico</Button><div className="offer-desc after-button">acesso imediato</div></div></div></div>
        <div className="offer-card premium-card"><div className="offer-body"><span className="ribbon">🔥 Mais vendido + bônus</span><div className="offer-name">Kit Mega Inventor</div><div className="offer-tag">Tudo do Básico + 3 kits extras + 3 bônus</div><div className="value-stack"><div className="value-label">Valor se fosse cobrado separado:</div>
          <div className="value-row"><span>Kit Robótica Mirim (20 projetos)</span><span className="v">R$ 47,00</span></div><div className="value-row"><span>Projetos com Materiais Recicláveis</span><span className="v">R$ 34,90</span></div><div className="value-row"><span>Experimentos Científicos</span><span className="v">R$ 34,90</span></div><div className="value-row"><span>Atividades com Papel e Fita</span><span className="v">R$ 34,90</span></div><div className="value-row star"><span>🎁 Manual Secreto do Agente de Espionagem</span><span className="v">R$ 19,90</span></div><div className="value-row star"><span>🎁 Mágica ou Ciência?</span><span className="v">R$ 19,90</span></div><div className="value-row star"><span>🎁 Desafio "Eu Faço Sozinho"</span><span className="v">R$ 19,90</span></div><div className="value-total"><span>Valor total:</span><span className="v">R$ 211,40</span></div></div>
          <div className="offer-price-wrap"><div className="offer-desc before-price">Tudo isso, hoje, por:</div><div className="offer-por">R$ 34,90</div><div className="offer-desc">pagamento único · acesso vitalício</div><a href={checkout(COMBO_BTN)} className="btn block green pulse">Quero o Kit Mega Inventor por R$ 34,90</a><div className="offer-desc after-button">+ os 3 bônus que já estavam separados pra hoje</div></div>
        </div></div>
      </div><div className="trust-icons"><div>🔒 Compra 100% segura</div><div>🎖️ 7 dias de garantia</div><div>💳 Pix ou cartão</div><div>⚡ Acesso imediato</div></div><div className="guarantee-strip"><span className="ic">🛡️</span><div><div className="t">Garantia incondicional de 7 dias</div><div className="d">Não gostou por qualquer motivo? Devolvemos 100% do seu dinheiro. Sem perguntas, sem burocracia.</div></div></div></div></section>
    <section className="testi"><div className="inner center"><span className="eyebrow orange">❤️ Relatos reais de quem já recebeu o kit</span><h2>O que as mães estão dizendo no WhatsApp</h2><p className="lede center">Prints reais de conversas com clientes — sem filtro, sem roteiro.</p></div><Marquee items={testimonials} kind="testimonial" /></section>
    <section className="faq"><div className="inner-narrow"><div className="center faq-heading"><span className="eyebrow good">❓ Perguntas frequentes</span><h2>Ainda com dúvidas?</h2></div><div className="faq-list">{questions.map(([question, answer], i) => <div className={`faq-item${openFaq === i ? " open" : ""}`} key={question}><Button variant="ghost" type="button" className="faq-q" aria-expanded={openFaq === i} onClick={() => setOpenFaq(openFaq === i ? null : i)}><span>{question}</span><span className="chev">+</span></Button><div className="faq-a"><p>{answer}</p></div></div>)}</div></div></section>
    <section className="final"><div className="inner-narrow"><img src="/images/mascote.jpg" alt="mascote" /><h2>Seu filho merece descobrir o que consegue criar</h2><p className="lede center">Dê a ele a chance de construir, inventar, experimentar e se orgulhar do que fez com as próprias mãos. Comece hoje — o acesso é imediato.</p><a href={checkout(FINAL_BTN)} className="btn">🚀 Quero Criar com Meu Filho Agora</a><p className="trust">🔒 Compra segura · Garantia de 7 dias · Acesso imediato</p></div></section>
    <footer><div>© 2026 Inventores Mirins · BrandWise · <a href="#">Política de Privacidade</a> · <a href="#">Termos de Uso</a></div><div>Pagamento processado com segurança pela Cartpanda</div></footer>
    <div className={`modal-overlay${modalOpen ? " open" : ""}`} onClick={closeToBasic} aria-hidden="true" />
    <div className={`modal-box${modalOpen ? " open" : ""}`} role="dialog" aria-modal="true" aria-label="Antes de continuar: uma opção pode valer mais a pena" aria-hidden={!modalOpen}><div className="modal-card"><Button variant="ghost" type="button" className="modal-close" aria-label="Fechar" onClick={closeToBasic}>✕</Button><div className="modal-icon">⚠️</div><h3>Antes de continuar: uma opção pode valer mais a pena</h3><p className="lead">Você escolheu o <strong>Kit Robótica Mirim por R$ 17,90</strong>.</p><div className="modal-offer"><p>Por apenas <strong>+R$ 17,00</strong>, leve o <strong>Kit Mega Inventor por R$ 34,90</strong>, com <strong>4 kits completos + 3 bônus</strong>:</p><ul><li>🤖 Kit Robótica Mirim</li><li>♻️ Projetos com Materiais Recicláveis</li><li>🔬 Experimentos Científicos</li><li>✂️ Atividades com Papel e Fita</li><li>🎁 + 3 Bônus Exclusivos</li></ul></div><p className="modal-diff">São muito mais atividades por uma diferença de apenas R$ 17.</p><a href={checkout(MODAL_ACEITAR)} className="btn block">🚀 QUERO APROVEITAR O KIT COMPLETO</a><a href={checkout(MODAL_RECUSAR)} className="modal-reject" onClick={() => setModalOpen(false)}>Não, obrigado. Quero continuar apenas com o Kit Robótica Mirim.</a></div></div>
  </main>;
}

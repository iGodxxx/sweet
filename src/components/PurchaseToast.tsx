import { useEffect, useState } from "react";

const NAMES = [
  "Maria de São Paulo",
  "Juliana de Belo Horizonte",
  "Carla do Rio de Janeiro",
  "Fernanda de Curitiba",
  "Amanda de Brasília",
  "Renata de Salvador",
];

const AVATAR = "data:image/jpeg;base64,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";

export function PurchaseToast() {
  const [visible, setVisible] = useState(() =>
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("previewToast") === "1"
  );
  const [name, setName] = useState(NAMES[0]);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("previewToast") === "1") {
      setVisible(false);
      requestAnimationFrame(() => setVisible(true));
    }
    let index = 0;
    let hideTimer: ReturnType<typeof setTimeout> | undefined;
    let intervalTimer: ReturnType<typeof setInterval> | undefined;

    const fire = () => {
      setName(NAMES[index % NAMES.length]);
      index += 1;
      setVisible(true);
      if (hideTimer) clearTimeout(hideTimer);
      hideTimer = setTimeout(() => setVisible(false), 4500);
    };

    const startTimer = setTimeout(() => {
      fire();
      intervalTimer = setInterval(fire, Math.floor(Math.random() * 8000) + 9000);
    }, 3000);

    return () => {
      clearTimeout(startTimer);
      if (hideTimer) clearTimeout(hideTimer);
      if (intervalTimer) clearInterval(intervalTimer);
    };
  }, []);

  return (
    <>
      <style>{`
        .purchase-toast {
          position: fixed;
          bottom: 20px;
          left: 18px;
          z-index: 300;
          max-width: 290px;
          display: flex;
          align-items: center;
          gap: 12px;
          background: #fff;
          border-left: 4px solid #f28b30;
          border-radius: 16px;
          padding: 12px 16px;
          box-shadow: 0 6px 28px rgba(0,0,0,.16);
          transform: translateX(-140%);
          opacity: 0;
          transition: all .4s ease;
          pointer-events: none;
        }
        .purchase-toast.show {
          transform: translateX(0);
          opacity: 1;
        }
        .purchase-toast img {
          width: 38px;
          height: 38px;
          border-radius: 999px;
          border: 2px solid #f4c542;
          object-fit: cover;
          flex-shrink: 0;
        }
        .purchase-toast strong {
          display: block;
          font-size: .8rem;
          line-height: 1.25;
          color: #1a2e4a;
        }
        .purchase-toast span {
          display: block;
          margin-top: 2px;
          font-size: .72rem;
          color: #9aa1a6;
        }
        @media (max-width: 600px) {
          .purchase-toast {
            left: 10px;
            max-width: calc(100vw - 20px);
          }
        }
      `}</style>
      <div className={`purchase-toast${visible ? " show" : ""}`} aria-live="polite">
        <img src={AVATAR} alt="" />
        <div>
          <strong>{name} comprou o Kit Mega Inventor</strong>
          <span>agora mesmo</span>
        </div>
      </div>
    </>
  );
}

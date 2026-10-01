import { useEffect, useState } from "react";

const NAMES = [
  "Maria de São Paulo",
  "Juliana de Belo Horizonte",
  "Carla do Rio de Janeiro",
  "Fernanda de Curitiba",
  "Amanda de Brasília",
  "Renata de Salvador",
];

const AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' rx='40' fill='%23eef2f4'/%3E%3Ccircle cx='40' cy='31' r='15' fill='%23f0c6a8'/%3E%3Cpath d='M19 69c2-15 11-23 21-23s19 8 21 23' fill='%23d98b6c'/%3E%3Cpath d='M24 30c1-13 8-20 17-20 10 0 16 7 16 19-6-5-11-7-18-7-5 0-10 3-15 8z' fill='%235b4636'/%3E%3C/svg%3E";

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

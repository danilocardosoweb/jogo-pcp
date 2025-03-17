
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { PixelButton } from "@/components/ui/PixelButton";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "Erro 404: Usuário tentou acessar uma rota inexistente:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-game-bg">
      <div className="text-center pixel-shadow bg-game-bg p-8 border-2 border-game-secondary rounded-md animate-fade-in">
        <h1 className="text-4xl font-bold mb-4 pixel-font text-game-primary">404</h1>
        <p className="text-xl text-game-text mb-6 pixel-text">Ops! Página não encontrada</p>
        <PixelButton variant="primary" onClick={() => window.location.href = "/"}>
          Voltar ao Jogo
        </PixelButton>
      </div>
    </div>
  );
};

export default NotFound;

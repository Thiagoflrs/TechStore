import { useEffect } from "react";

// Definindo o custom hook 'useScrollToTop' para controlar o comportamento do botão de rolar para o topo
const useScrollToTop = () => {
  // useEffect é usado para lidar com a lógica de rolagem e eventos de scroll ao carregar o componente
  useEffect(() => {
    // Pegando a referência do botão de "rolar para o topo"
    const myButton = document.getElementById("scrollToTopBtn");

    // Função para verificar a posição do scroll e exibir ou ocultar o botão
    const handleScroll = () => {
      // Se a posição de rolagem for maior que 200px, mostrar o botão
      if (
        document.body.scrollTop > 200 ||
        document.documentElement.scrollTop > 200
      ) {
        myButton.style.display = "block";
      } else {
        // Se não, esconder o botão
        myButton.style.display = "none";
      }
    };

    // Função para rolar a página até o topo de forma suave
    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Adicionando o event listener para rolagem da janela
    window.onscroll = handleScroll;

    // Adicionando o event listener para o clique no botão
    myButton.onclick = scrollToTop;

    // Função de cleanup: remove os event listeners quando o componente for desmontado
    return () => {
      window.onscroll = null;
      myButton.onclick = null;
    };
  }, []); // A dependência vazia [] significa que o efeito roda uma vez após o primeiro render
};

export default useScrollToTop;

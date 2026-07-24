// PERSONALIZAR: cambiar los textos y las contraseñas antes del despliegue real.
// Las contraseñas son visibles en JavaScript. Esto es suficiente para un juego personal,
// pero no debe utilizarse para proteger información sensible.
const GAME_CONFIG = {
  storageKey: "birthdayNfcAdventureProgress",

  adventure: {
    title: "Cumple de Albis",
    subtitle:
      "Encuentra las pistas, descubre las contraseñas y desbloquea cada parte del plan"
  },

  chapters: [
    {
      id: "chapter-1",
      order: 1,
      title: "Capítulo 1 - Fecha",
      description: "Lo primero que debes saber, es cuando  será el día. ",
      passwords: ["asd"],
      successMessage: "Has desbloqueado la fecha",
      rewardLabel: "Fecha desbloqueada",
      rewardHtml: `
        <figure class="reward-image-frame">
          <img
            class="reward-image"
            src="./assets/images/fecha-plan-agosto-1.png"
            alt="Calendario que desvela la fecha del plan: 1 de agosto"
          >
          <figcaption>
            El plan es el 1 de agosto.
          </figcaption>
        </figure>
        <div class="reward-placeholder reward-note">
          <p>
            Primera parte desbloqueada: ya tienes la fecha.
          </p>
        </div>
      `,
      nextHint: "Ahora busca otra pegatina NFC. La siguiente respuesta abrirá el Capítulo 2."
    },
    {
      id: "chapter-2",
      order: 2,
      title: "Capítulo 2 - Donde comeremos",
      description: "Una palabra que aparece cuando miras con calma lo que parecía pequeño.",
      passwords: ["prosciutto"],
      successMessage: "Has desbloqueado dónde comeremos.",
      rewardLabel: "Restaurante desbloqueado",
      rewardHtml: `
        <figure class="reward-image-frame">
          <img
            class="reward-image"
            src="./assets/images/restaurante-casa-narciandi.png"
            alt="Fachada del restaurante Casa Narciandi"
          >
          <figcaption>
            Comeremos en Casa Narciandi.
          </figcaption>
        </figure>
        <div class="reward-placeholder reward-note">
          <p>
            Segunda parte desbloqueada: ya sabes dónde será la comida.
          </p>
        </div>
      `,
      nextHint: "La aventura sigue. Hay otra pista esperando a ser encontrada."
    },
    {
      id: "chapter-3",
      order: 3,
      title: "Capítulo 3 - El plan",
      description: "La respuesta está escondida en una pista que habla de caminos, planes y ganas de descubrir.",
      passwords: ["aventura"],
      successMessage: "Has desbloqueado el plan.",
      rewardLabel: "Plan desbloqueado",
      rewardHtml: `
        <div class="reward-plan-copy">
          <p>
            El plan será un circuito de spa en <strong>Hotel Oca Palacio de La Llorea</strong>
            y después una visita a la <strong>playa de la Ñora</strong>.
          </p>
        </div>
        <div class="reward-gallery" aria-label="Fotos del plan desbloqueado">
          <figure class="reward-image-frame">
            <img
              class="reward-image"
              src="./assets/images/spa-hotel-oca-palacio-llorea.png"
              alt="Circuito de spa en Hotel Oca Palacio de La Llorea"
            >
            <figcaption>
              Circuito de spa en Hotel Oca Palacio de La Llorea.
            </figcaption>
          </figure>
          <figure class="reward-image-frame">
            <img
              class="reward-image"
              src="./assets/images/playa-la-nora.png"
              alt="Vista de la playa de la Ñora"
            >
            <figcaption>
              Playa de la Ñora.
            </figcaption>
          </figure>
        </div>
      `,
      nextHint: "Queda el último capítulo. Busca la pegatina final."
    },
    {
      id: "chapter-4",
      order: 4,
      title: "Capítulo 4",
      description: "La última palabra no es una prueba de memoria, sino una forma de decirlo todo.",
      passwords: ["siempre"],
      successMessage: "Has desbloqueado el destino del viaje.",
      rewardLabel: "Destino desbloqueado",
      rewardHtml: `
        <div class="reward-plan-copy">
          <p>
            El destino seleccionado para el viaje es <strong>Bruselas</strong>.
            Luces, plazas bonitas y una escapada para recordar.
          </p>
        </div>
        <div class="reward-gallery" aria-label="Fotos del destino desbloqueado">
          <figure class="reward-image-frame">
            <img
              class="reward-image"
              src="./assets/images/bruselas-grand-place.png"
              alt="Grand Place de Bruselas iluminada con un árbol de Navidad"
            >
            <figcaption>
              Bruselas: Grand Place iluminada.
            </figcaption>
          </figure>
          <figure class="reward-image-frame">
            <img
              class="reward-image"
              src="./assets/images/bruselas-mercado-navidad.png"
              alt="Mercado navideño de Bruselas con luces cálidas"
            >
            <figcaption>
              Mercados, luces y paseo por Bruselas.
            </figcaption>
          </figure>
        </div>
      `,
      nextHint: "Fin de la aventura. Gracias por jugarla hasta el final."
    },
        {
      id: "chapter-final",
      order: 5,
      title: "Capítulo final",
      description: "La última palabra no es una prueba de memoria, sino una forma de decirlo todo.",
      passwords: ["siempre"],
      successMessage: "Has completado la aventura.",
      rewardLabel: "Revelación final",
      rewardHtml: `
        <p>
          PERSONALIZAR: aquí aparecerá la revelación final del regalo, una
          instrucción para encontrarlo o el cierre emocional de la experiencia.
        </p>
      `,
      nextHint: "Fin de la aventura. Gracias por jugarla hasta el final."
    }
  ]
};

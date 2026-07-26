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
      title: "Nivel 1 - Fecha",
      description: "Lo primero que debes saber, es cuando será el día. ",
      passwords: ["02012026-prosciutto"],
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
            1 de agosto.
          </figcaption>
        </figure>
        <div class="reward-placeholder reward-note">
          <p>
            Primera parte desbloqueada: ya tienes la fecha.
          </p>
        </div>
      `,
      nextHint: "Ahora debes encontrar la siguiente pista para descubrir dónde comeremos. Para ello, debes de mirar en el fondo, debajo de todos los colores, junto a las estrellas."
    },
    {
      id: "chapter-2",
      order: 2,
      title: "Nivel 2 - Comida",
      description: "Ahora debes de conocer donde comeremos. Te adelanto que habrá baile de tripita contenta asegurado :)",
      passwords: ["calendoscopio"],
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
      `,
      nextHint: "Ahora que ya sabes dónde comeremos, debes encontrar la siguiente pista para descubrir qué haremos después. Para ello, debes de buscar en el techo del sol de la sede de los juegos olímpicos de 2016."
    },
    {
      id: "chapter-3",
      order: 3,
      title: "Nivel 3 - El plan",
      description: "¿Qué haremos después de comer? ",
      passwords: ["2649"],
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
              Prepara bañador, chanclas toalla y gorro!
            </figcaption>
          </figure>
          <figure class="reward-image-frame">
            <img
              class="reward-image"
              src="./assets/images/playa-la-nora.png"
              alt="Vista de la playa de la Ñora"
            >
            <figcaption>
              En Alicante quedó pendiente un picninc en la playa, ¿No?
            </figcaption>
          </figure>
        </div>
      `,
      nextHint: "Ya sabes qué haremos y cuándo, pero aún queda saber dónde viajaremos la próxima vez :). Lo descubrirás cuando te repases el lipcombo fuera de casa."
    },
    {
      id: "chapter-4",
      order: 4,
      title: "Nivel 4 - El destino",
      description: "¿A dónde viajaremos? ",
      passwords: ["peonias27-7"],
      successMessage: "Has desbloqueado el destino del viaje.",
      rewardLabel: "Destino desbloqueado",
      rewardHtml: `
        <div class="reward-plan-copy">
          <p>
            El destino es <strong>Bruselas</strong>.
            Donde el invierno se ve justo como quieres :)
          </p>
        </div>
        <div class="reward-gallery" aria-label="Fotos del destino desbloqueado">
          <figure class="reward-image-frame">
            <img
              class="reward-image"
              src="./assets/images/bruselas-grand-place.png"
              alt="Grand Place de Bruselas iluminada con un árbol de Navidad"
            >
          </figure>
          <figure class="reward-image-frame">
            <img
              class="reward-image"
              src="./assets/images/bruselas-mercado-navidad.png"
              alt="Mercado navideño de Bruselas con luces cálidas"
            >
          </figure>
        </div>
      `,
      nextHint: "Fin del juego, ¿O no?"
    },
        {
      id: "chapter-final",
      order: 5,
      isSecret: true,
      title: "Nivel secreto",
      description: "???",
      passwords: ["te amo con el alma"],
      successMessage: "Has completado la aventura.",
      rewardLabel: "Nivel secreto desbloqueado",
      rewardHtml: `
        <div class="reward-audio">

          <audio controls preload="metadata">
            <source src="./assets/audio/baxatav0.1.wav" type="audio/wav">
            Tu navegador no puede reproducir este audio.
            <a href="./assets/audio/baxatav0.1.wav">Descargar audio</a>
          </audio>
        </div>
      `,
      nextHint: ""
    }
  ]
};

const form = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const results = document.getElementById("results");
const errorMessage = document.getElementById("error-message");

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const word = searchInput.value.trim();

  results.innerHTML = "";
  errorMessage.textContent = "";

  if (word === "") {
    errorMessage.textContent = "Please enter a word.";
    return;
  }

  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
    );

    if (!response.ok) {
      throw new Error("Word not found.");
    }

    const data = await response.json();

    displayWord(data[0]);
  } catch (error) {
    errorMessage.textContent = error.message;
  }
});

function displayWord(wordData) {
  const meaning = wordData.meanings[0];

  const definition = meaning.definitions[0];

  const synonyms = meaning.synonyms || [];

  let audio = "";

  if (wordData.phonetics.length > 0) {
    const audioObject = wordData.phonetics.find((p) => p.audio);

    if (audioObject) {
      audio = audioObject.audio;
    }
  }

  results.innerHTML = `

    <div class="card">

        <h2>${wordData.word}</h2>

        <p>
        <strong>Pronunciation:</strong>
        ${wordData.phonetic || "Not Available"}
        </p>

        <p>
        <strong>Part of Speech:</strong>
        ${meaning.partOfSpeech}
        </p>

        <p>
        <strong>Definition:</strong>
        ${definition.definition}
        </p>

        <p>
        <strong>Example:</strong>
        ${definition.example || "No example available."}
        </p>

        <p>
        <strong>Synonyms:</strong>
        ${synonyms.length ? synonyms.slice(0, 10).join(", ") : "None"}
        </p>

        ${
          audio
            ? `<audio controls>
                <source src="${audio}" type="audio/mpeg">
            </audio>`
            : ""
        }

    </div>

    `;
}

const searchInput = document.getElementsByClassName('search-input');
const searchButton = document.getElementsByClassName('search-button');
const resultsDiv = document.getElementById('results');

searchButton[0].addEventListener('click', () => {
    const term = document.querySelector('input').value;
    
    if (term !== ''){
        searchDictionary(term);
    }
});

async function searchDictionary(word) {
    try{
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const data = await response.json();
        
        if (data && data.length > 0) {
            displayResults(data[0]);
        } else {
            resultsDiv.innerHTML = '<p>No results found.</p>';
        }
    } catch(err){
        console.log(err);
        resultsDiv.innerHTML = '<p>An error occurred. Please try again later.</p>';
    }
}

function displayResults(wordData) {
    // Clear previous results
    resultsDiv.innerHTML = '';

    // Display word, pronunciation, and meanings
    const wordElement = document.createElement('div');
    wordElement.innerHTML = `<h2>${wordData.word}</h2>`;
    if (wordData.phonetics[0].text){
        wordElement.innerHTML += `<span>${wordData.phonetics[0].text}</span>`;
    }
    
    if (wordData.phonetics[0].audio){
    const audioElement = document.createElement('AUDIO');
    const a = wordData.phonetics[0].audio
    audioElement.setAttribute("src", a);
    audioElement.setAttribute("controls", "controls");
    
    wordElement.appendChild(audioElement);
    }
    wordElement.classList.add('container-box');
    resultsDiv.appendChild(wordElement);
   

    // Display definitions and examples
    const meaningsElement = document.createElement('div');
    wordData.meanings.forEach((meaning) => {
        const meaningElement = document.createElement('div');
        meaningElement.innerHTML = `<p><strong>${meaning.partOfSpeech}:</strong></p>`;
               
        
        const defsElement = document.createElement('ol');
        meaning.definitions.forEach((def) => {
            const defElement = document.createElement('li');
            defElement.innerHTML = ` ${def.definition} `;
            if (def.example){
                const expElement = document.createElement('div');
                expElement.innerHTML = ` ${def.example} `;
                expElement.classList.add('example');
                defElement.appendChild(expElement);
            }
            defsElement.appendChild(defElement);
       })
       meaningElement.classList.add('container-box');
       meaningElement.appendChild(defsElement);
       meaningsElement.appendChild(meaningElement);

       meaningsElement.classList.add('results');
    });
    // // Highlight the searched word in the results

    const searchText = document.querySelector('input').value;
    const regex = new RegExp(searchText, 'gi');
    meaningsElement.innerHTML = meaningsElement.innerHTML.replace(regex, `<span class="highlighted">${searchText}</span>`);
    
    resultsDiv.appendChild(meaningsElement);

    
    
}

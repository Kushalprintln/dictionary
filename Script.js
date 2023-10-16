// JS FOR SEARCH PAGE 
// SELECTION ALL THE ELEMEMTS FROM THE DOCUMENT
const inputword = document.getElementById('srch');
const searchbtn = document.getElementById('searchbtn');
const display = document.getElementById('display');
const footer = document.getElementsByTagName('footer')[0];
const url = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

// PUTTING EVENTLISTNER ON SEARCH BUTTON
// if(searchbtn){
    searchbtn.addEventListener('click',()=>{
        if(inputword.value == ''){
            alert('please enter something')
        }else{
            meaning(inputword.value);
            footer.style.position = 'static';
        }
    })
// }

// GETTING DATA USING ASYNC FUNCTION
// USING AWAIT AND FETCH IN THIS FUCNTION
async function meaning(word){
    try{
        // FETCHING DATA;
        let data = await fetch(url+word);
        let actualdata = await data.json();

        // EXTRACTING SEARCH WORD Sword AND MEANING ARRAY
        let Sword = actualdata[0].word;
        let meaningArray = actualdata[0].meanings;
        let audioURL = `https://api.dictionaryapi.dev/media/pronunciations/en/${Sword}-us.mp3`;
        let audioA = `https://api.dictionaryapi.dev/media/pronunciations/en/${Sword}-uk.mp3`
        let audioB = `https://api.dictionaryapi.dev/media/pronunciations/en/${Sword}-au.mp3`

        let wordAudio = new Audio(audioURL);

        // EXTRA INFORMATION FLAG;
        let extraInfo = false;
        
        // CHECKING IF THE MEANINGARRAY IS GREATER THEN THREE 
        // IF GREATER THEN 3 THEN DIRECLTY TRUE 
        if(meaningArray.length > 3){
            extraInfo = true;
        } 
        else{
            // IF NOT THEN WE'LL CHECK ALL THE DEFINITIONS LENGHTS 
            // IF ANY DEFINATIONS ARE GREATER THEN 2;
            for(let objs of meaningArray){
                let defleng = objs.definitions.length;
                if(defleng > 2){
                    extraInfo = true;
                }
            }
        }
        
        // // INFO ON CONSOLE
        // console.log("Complete fetch data")
        // console.table(actualdata);
        // console.log(actualdata[0].phonetics)
        // console.log("Extracting meaning form fetch data")
        // console.table(meaningArray);
        // console.log("LENGTH OF ARRAY IS "+ meaningArray.length);
        // console.log(extraInfo?"Contains extra Info":"No extra Info");
        
        creatdisplay(Sword,extraInfo,meaningArray,wordAudio);
    }
    catch(err){
        console.log(err);
        console.log('Error found in searching word');
        errorWord(inputword.value);
    }
}

function creatdisplay(Sword,extraInfo,meaningArray,audio){
    // BELOW LINE IS CREATING A LAYOUT FOR DISPLAYING DATA
    display.innerHTML = `<div class="heading">
                            <h1>Word : <span id="search-word">${Sword}</span></h1>
                            <button id="speak"><img src="./images/volume-full-solid-24.png" alt=""></button> 
                        </div>
                        <hr>
                        <div class="meaning"></div>`;

    let speak = document.getElementById('speak');
    speak.addEventListener('click',()=>{
        audio.play();
    })

    // CREATING VARIABLE FOR MEANING HERE ITSELF
    // WE ARE SENDING THIS VARIABLE IN BOTH DISPLAY FUNCTION SO IT GET ACCESS THERE WITHOUT CREATING NEW;
    let meaning = document.getElementsByClassName('meaning')[0];

    // IF CREATEDISPLAY IS CALLED DISPLAY DATA IS NESSECERRY 
    displayMinData(meaningArray,meaning);

    // IF IT CARRIES EXTRA INFORMATION THEN CREATING NEW BUTTON WITH EVENTLISTNER 
    if(extraInfo){
        let extraInfoBtn = document.createElement('button');
        extraInfoBtn.innerText = 'Read More';
        meaning.appendChild(extraInfoBtn);
        extraInfoBtn.addEventListener('click',()=>{
            displayingFullData(meaningArray,meaning);
        });
    }
    
}
// ERROR FUNCTION FOR SEARCHING WRONG WORD
function errorWord(errorword){
    display.innerHTML = `<h3>No Result Found for ${errorword}</h3>`;
}

// THIS FUNCTION WILL DISPLAY THE NESSERRAY DATA;
function displayMinData(meaningArray,meaning){

    // THIS FOR LOOP WILL RUN FOR 3 TIME FOR EXTRATING DATA
    for(let i=0;i<3;i++){
        let ele = meaningArray[i];
        if(meaningArray[i]){

            // CREATING A PERTICULAR DIV SECTION FOR A 'PartOfSpeach';
            let meaningListDiv = document.createElement('div');
            meaningListDiv.className = 'meaning-list';

            // APPENDING POS IN A P TAG 
            let pos = document.createElement('p');
            pos.innerText = ele.partOfSpeech;

            // CREATING ORDEREDLIST 
            let odrlist = document.createElement('ol');

            // console.log(ele.partOfSpeech);
            // BELOW LOOP WILL RUN FOR THE DEFINITIONS SECTION 2 TIMES
            for(let j=0;j<2;j++){
                let mea = ele.definitions[j]
                if(ele.definitions[j]){
                    odrlist.innerHTML += `<li>${mea.definition}</li>`;
                    // console.log(mea.definition);
                    if(mea.example){
                        odrlist.innerHTML += `<p>Example : ${mea.example}</p>`
                        // console.log("Example : "+ mea.example);
                    }
                }
            }
            // APPENDING ELEMENTS 
            meaningListDiv.appendChild(pos);
            meaningListDiv.appendChild(odrlist);
            meaning.append(meaningListDiv);
        }
    }
    
}

// THIS DISPLAYFULLDATA FUNCTION WILL DISPLAY FULL DATA OF THE WORD;
function displayingFullData(meaningArray,meaning){
    
    //CLEARING PREVIOUS DATA;
    meaning.innerHTML = '';

    // THIS FOR LOOP WILL RUN FOR TOTOAL LENGTH OF EXTRATING DATA
    for(let ele of meaningArray){

        // CREATING A PERTICULAR DIV SECTION FOR A 'PartOfSpeach';
        let meaningListDiv = document.createElement('div');
        meaningListDiv.className = 'meaning-list';

        // APPENDING POS IN A P TAG
        let pos = document.createElement('p');
        pos.innerText = ele.partOfSpeech;

        // CREATING ORDEREDLIST
        let odrlist = document.createElement('ol');
        
        // console.log(ele.partOfSpeech)

        // BELOW LOOP WILL RUN FOR THE DEFINITIONS SECTION COMPLETE
        for(let meDf of ele.definitions){
            odrlist.innerHTML += `<li>${meDf.definition}</li>`;
            // console.log(meDf.definition);
            if(meDf.example){
                odrlist.innerHTML += `<p>Example : ${meDf.example}</p>`
                // console.log("Example : "+ meDf.example); 
            } 
        }
        // APPENDING ELEMETS;
        meaningListDiv.appendChild(pos);
        meaningListDiv.appendChild(odrlist);
        meaning.append(meaningListDiv);
    }
}
